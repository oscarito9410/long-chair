"""Failing or interrupted batches never leave port work alive across agent recovery."""

import asyncio
from dataclasses import dataclass, field

import pytest
from app.adapters.enrichment import FakeEnrichment
from app.adapters.fake_llm import FakeLlm, scripted_call
from app.adapters.fake_qloo import FakeQlooAdapter
from app.application.agent.build_agent_kit import BuildAgentKit
from app.application.agent.models import AgentLimits
from app.application.checker import rejects
from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES
from app.domain.kinds import CONTENT_KINDS
from app.ports.errors import QlooTransportError
from app.ports.llm import LlmTurn


@dataclass
class BatchGuard:
    stall_cleanup: bool = False
    calls: int = 0
    sibling_started: asyncio.Event = field(default_factory=asyncio.Event)
    cleanup_started: asyncio.Event = field(default_factory=asyncio.Event)
    cleanup_release: asyncio.Event = field(default_factory=asyncio.Event)
    cancelled: bool = False
    drained: bool = False
    tasks: list[asyncio.Task] = field(default_factory=list)

    async def wait(self) -> None:
        self.calls += 1
        index = self.calls
        if index > 2:
            return
        task = asyncio.current_task()
        assert task is not None
        self.tasks.append(task)
        if index == 1:
            await self.sibling_started.wait()
            raise QlooTransportError("The fictional batch failed.")
        self.sibling_started.set()
        try:
            await asyncio.Event().wait()
        finally:
            self.cancelled = True
            self.cleanup_started.set()
            try:
                if self.stall_cleanup:
                    await self.cleanup_release.wait()
                else:
                    await asyncio.sleep(0)
            finally:
                self.drained = True

    async def cleanup(self) -> None:
        self.cleanup_release.set()
        for task in self.tasks:
            if not task.done():
                task.cancel()
        await asyncio.gather(*self.tasks, return_exceptions=True)


class GuardedCatalog(FakeQlooAdapter):
    def __init__(self, phase: str, guard: BatchGuard) -> None:
        super().__init__()
        self.phase = phase
        self.guard = guard

    async def search(self, query, kind):
        if self.phase == "qloo_search":
            await self.guard.wait()
        return await super().search(query, kind)

    async def insights(self, kind, interests, exclude_tag_ids, exclude_entity_ids=()):
        if self.phase == "qloo_insights":
            await self.guard.wait()
        return await super().insights(kind, interests, exclude_tag_ids, exclude_entity_ids)


class GuardedEnrichment(FakeEnrichment):
    def __init__(self, phase: str, guard: BatchGuard) -> None:
        super().__init__()
        self.phase = phase
        self.guard = guard

    async def for_item(self, item):
        if self.phase == "enrich":
            await self.guard.wait()
        return await super().for_item(item)


def turns(phase: str) -> list[LlmTurn]:
    actions = [
        scripted_call("qloo_search", {"seed_ids": list(DEMO_DRAFT.seed_ids)}),
        scripted_call("qloo_insights", {"kinds": list(CONTENT_KINDS)}),
        scripted_call("enrich", {}),
    ]
    index = ["qloo_search", "qloo_insights", "enrich"].index(phase)
    return actions[:index] + [actions[index], actions[index]] + actions[index + 1 :] + [LlmTurn()]


@pytest.mark.parametrize("phase", ["qloo_search", "qloo_insights", "enrich"])
async def test_failed_batch_is_drained_before_recovery(phase: str) -> None:
    guard = BatchGuard()
    observed: list[bool] = []

    class ObserveRecovery(FakeLlm):
        async def complete(self, messages, tools):
            if messages[-1].role == "tool" and "tool_unavailable" in messages[-1].content:
                observed.append(guard.drained and all(task.done() for task in guard.tasks))
            return await super().complete(messages, tools)

    try:
        result = await BuildAgentKit(
            GuardedCatalog(phase, guard),
            ObserveRecovery(turns(phase)),
            GuardedEnrichment(phase, guard),
        ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
        assert result.termination == "completed"
        assert any(entry.tool == phase and entry.status == "error" for entry in result.trace)
        assert observed == [True]
        assert guard.cancelled and guard.drained
        assert all(task.done() for task in guard.tasks)
        assert result.kit.items
        held = [theme for theme in THEMES if theme.id in DEMO_DRAFT.avoid_ids]
        assert all(not rejects(item, held) for item in result.kit.items)
    finally:
        await guard.cleanup()


@pytest.mark.parametrize("phase", ["qloo_search", "qloo_insights", "enrich"])
async def test_deadline_interrupts_failed_batch_cleanup_and_drains_it(phase: str) -> None:
    guard = BatchGuard(stall_cleanup=True)
    try:
        result = await BuildAgentKit(
            GuardedCatalog(phase, guard),
            FakeLlm(turns(phase)),
            GuardedEnrichment(phase, guard),
            limits=AgentLimits(timeout_seconds=0.05),
        ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
        assert result.termination == "time_limit"
        assert result.trace[-1].tool == phase
        assert result.trace[-1].status == "timeout"
        assert guard.cancelled and guard.drained
        assert all(task.done() for task in guard.tasks)
        assert result.kit.items
    finally:
        await guard.cleanup()


@pytest.mark.parametrize("phase", ["qloo_search", "qloo_insights", "enrich"])
async def test_request_cancellation_during_failed_batch_cleanup_is_drained(phase: str) -> None:
    guard = BatchGuard(stall_cleanup=True)
    request = asyncio.create_task(
        BuildAgentKit(
            GuardedCatalog(phase, guard),
            FakeLlm(turns(phase)),
            GuardedEnrichment(phase, guard),
        ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
    )
    try:
        async with asyncio.timeout(1):
            await guard.cleanup_started.wait()
        request.cancel()
        with pytest.raises(asyncio.CancelledError):
            await request
        assert guard.cancelled and guard.drained
        assert all(task.done() for task in guard.tasks)
    finally:
        guard.cleanup_release.set()
        request.cancel()
        await asyncio.gather(request, return_exceptions=True)
        await guard.cleanup()


@pytest.mark.parametrize("phase", ["qloo_search", "qloo_insights", "enrich"])
async def test_deterministic_fallback_failure_also_drains_siblings(phase: str) -> None:
    from app.application.build_session_kit import BuildSessionKit

    guard = BatchGuard()
    try:
        with pytest.raises(QlooTransportError):
            await BuildSessionKit(
                GuardedCatalog(phase, guard),
                enrichment=GuardedEnrichment(phase, guard),
            ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
        assert guard.cancelled and guard.drained
        assert all(task.done() for task in guard.tasks)
    finally:
        await guard.cleanup()
