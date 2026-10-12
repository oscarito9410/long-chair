"""Agent behavior through fictional catalog ports, without keys or network."""

import asyncio
from dataclasses import replace

import pytest
from app.adapters.enrichment import FakeEnrichment
from app.adapters.fake_llm import FakeLlm, scripted_call
from app.adapters.fake_qloo import FakeQlooAdapter
from app.application.agent.build_agent_kit import BuildAgentKit
from app.application.agent.models import AgentLimits
from app.application.checker import rejects
from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES
from app.domain.kinds import CONTENT_KINDS
from app.ports.llm import LlmError, LlmTurn


def script() -> list[LlmTurn]:
    return [
        scripted_call("qloo_search", {"seed_ids": list(DEMO_DRAFT.seed_ids)}),
        scripted_call("qloo_insights", {"kinds": list(CONTENT_KINDS)}),
        scripted_call("verify_themes", {}),
        scripted_call("enrich", {}),
        scripted_call("durations", {}),
        scripted_call("places", {}),
        LlmTurn(content="Ready."),
    ]


async def run(llm: FakeLlm | None):
    return await BuildAgentKit(FakeQlooAdapter(), llm, FakeEnrichment()).execute(
        DEMO_DRAFT, TASTES, THEMES, locality="Westbridge", weekday="sunday"
    )


async def test_happy_path_and_every_tool() -> None:
    result = await run(FakeLlm(script()))
    assert result.kit.packed.filled_minutes == 240
    assert len(result.kit.items) == 5
    assert len(result.kit.places) == 3
    assert result.kit.topics
    assert [entry.tool for entry in result.trace] == [
        "qloo_search",
        "qloo_insights",
        "verify_themes",
        "enrich",
        "durations",
        "places",
    ]
    assert all(entry.status == "ok" and entry.latency_ms >= 0 for entry in result.trace)
    assert result.termination == "completed"


async def test_no_key_fallback_is_same_kit_without_trace() -> None:
    from app.application.build_session_kit import BuildSessionKit

    baseline = await BuildSessionKit(FakeQlooAdapter(), enrichment=FakeEnrichment()).execute(
        DEMO_DRAFT, TASTES, THEMES, locality="Westbridge", weekday="sunday"
    )
    result = await run(None)
    assert result.kit == baseline
    assert result.trace == ()
    assert result.termination == "no_key"


async def test_injected_theme_cannot_bypass_server_verification() -> None:
    class DirtyCatalog(FakeQlooAdapter):
        async def insights(self, kind, interests, exclude_tag_ids, exclude_entity_ids=()):
            items = await super().insights(kind, interests, exclude_tag_ids, exclude_entity_ids)
            if kind == "movie":
                return tuple(replace(item, avoided_theme_ids=("illness",)) for item in items)
            return items

    llm = FakeLlm([script()[0], script()[1], LlmTurn(content='{"avoidIds":[],"items":[]}')])
    result = await BuildAgentKit(DirtyCatalog(), llm, FakeEnrichment()).execute(
        DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None
    )
    held = [theme for theme in THEMES if theme.id in DEMO_DRAFT.avoid_ids]
    assert result.kit.items
    assert all(not rejects(item, held) for item in result.kit.items)
    assert all(item.kind != "movie" for item in result.kit.items)
    assert "north-window" not in llm.requests[-1][0][-1].content


async def test_step_limit_finalizes_observed_items() -> None:
    llm = FakeLlm(script())
    result = await BuildAgentKit(
        FakeQlooAdapter(), llm, FakeEnrichment(), limits=AgentLimits(max_steps=2)
    ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
    assert len(result.trace) == 2
    assert result.model_turns == 2
    assert result.termination == "step_limit"
    assert result.kit.items
    assert result.kit.packed.filled_minutes <= DEMO_DRAFT.duration_minutes


async def test_provider_error_falls_back_without_leaking_error() -> None:
    result = await run(FakeLlm([LlmError("private provider body")]))
    assert result.kit.items
    assert result.termination == "provider_error"
    assert result.trace == ()


async def test_invalid_tool_args_are_recoverable_and_redacted() -> None:
    from app.ports.llm import ToolCall

    llm = FakeLlm(
        [
            LlmTurn(tool_calls=(ToolCall("invalid", "qloo_search", '{"seed_ids":["private"]}'),)),
            LlmTurn(tool_calls=(ToolCall("json", "qloo_search", "not json private"),)),
            *script()[:2],
        ]
    )
    result = await run(llm)
    assert result.kit.items
    assert [entry.status for entry in result.trace[:2]] == ["error", "error"]
    assert "private" not in str(result.trace)


async def test_timeout_cancels_inflight_model_and_falls_back() -> None:
    class SlowLlm(FakeLlm):
        cancelled = False

        async def complete(self, messages, tools):
            try:
                await asyncio.sleep(10)
            finally:
                self.cancelled = True
            return LlmTurn()

    llm = SlowLlm([])
    result = await BuildAgentKit(
        FakeQlooAdapter(), llm, FakeEnrichment(), limits=AgentLimits(timeout_seconds=0.01)
    ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
    assert llm.cancelled
    assert result.termination == "time_limit"
    assert result.kit.items


async def test_tool_failure_is_recoverable_and_records_fixed_error() -> None:
    from app.ports.errors import QlooTransportError

    class FailsOnce(FakeQlooAdapter):
        failed = False

        async def exclusion_tags(self, themes):
            if not self.failed:
                self.failed = True
                raise QlooTransportError("private upstream data")
            return await super().exclusion_tags(themes)

    llm = FakeLlm([script()[0], script()[1], script()[1], LlmTurn()])
    result = await BuildAgentKit(FailsOnce(), llm, FakeEnrichment()).execute(
        DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None
    )
    assert result.kit.items
    assert [entry.status for entry in result.trace] == ["ok", "error", "ok"]
    assert llm.requests[2][0][-1].content == '{"error": "tool_unavailable"}'
    assert "private" not in str(result.trace)


async def test_multiple_calls_share_total_budget() -> None:
    from app.ports.llm import ToolCall

    llm = FakeLlm(
        [LlmTurn(tool_calls=tuple(ToolCall(str(i), "durations", "{}") for i in range(4)))]
    )
    result = await BuildAgentKit(
        FakeQlooAdapter(), llm, FakeEnrichment(), limits=AgentLimits(max_steps=2)
    ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
    assert len(result.trace) == 2
    assert result.model_turns == 1
    assert result.termination == "step_limit"
    assert result.kit.items


async def test_turn_budget_stops_before_tool_budget() -> None:
    result = await BuildAgentKit(
        FakeQlooAdapter(),
        FakeLlm(script()),
        FakeEnrichment(),
        limits=AgentLimits(max_steps=8, max_turns=1),
    ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
    assert len(result.trace) == 1
    assert result.model_turns == 1
    assert result.termination == "step_limit"


async def test_timeout_during_tool_retains_verified_partial_candidates() -> None:
    class SlowPlaces(FakeQlooAdapter):
        cancelled = False

        async def places(self, locality, weekday, interests, tag_ids):
            try:
                await asyncio.sleep(10)
            finally:
                self.cancelled = True
            return ()

    qloo = SlowPlaces()
    result = await BuildAgentKit(
        qloo,
        FakeLlm([*script()[:2], script()[5]]),
        FakeEnrichment(),
        limits=AgentLimits(timeout_seconds=0.01),
    ).execute(DEMO_DRAFT, TASTES, THEMES, locality="Westbridge", weekday="sunday")
    assert qloo.cancelled
    assert result.termination == "time_limit"
    assert result.trace[-1].tool == "places"
    assert result.trace[-1].status == "timeout"
    assert result.trace[-1].latency_ms >= 0
    assert result.kit.items and not result.kit.places


async def test_finalization_fallback_has_its_own_deadline() -> None:
    from app.ports.errors import QlooTransportError

    class SlowSearch(FakeQlooAdapter):
        cancelled = False

        async def search(self, query, kind):
            try:
                await asyncio.sleep(10)
            finally:
                self.cancelled = True
            return ()

    qloo = SlowSearch()
    with pytest.raises(QlooTransportError, match="time budget"):
        await BuildAgentKit(qloo, limits=AgentLimits(finalize_seconds=0.01)).execute(
            DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None
        )
    assert qloo.cancelled


async def test_external_cancellation_propagates() -> None:
    started = asyncio.Event()

    class WaitingLlm(FakeLlm):
        async def complete(self, messages, tools):
            started.set()
            await asyncio.Event().wait()
            return LlmTurn()

    task = asyncio.create_task(run(WaitingLlm([])))
    await started.wait()
    task.cancel()
    with pytest.raises(asyncio.CancelledError):
        await task


async def test_no_candidate_and_unknown_tool_fall_back() -> None:
    from app.ports.llm import ToolCall

    result = await run(
        FakeLlm([LlmTurn(tool_calls=(ToolCall("unknown", "private tool name", "{}"),))])
    )
    assert result.kit.items
    assert result.trace[0].tool == "unknown"
    assert result.trace[0].status == "error"
    assert result.trace[0].args_summary == "invalid arguments"


async def test_metrics_hook_describes_returned_kit() -> None:
    seen = []
    result = await BuildAgentKit(
        FakeQlooAdapter(), FakeLlm(script()), FakeEnrichment(), on_metrics=seen.append
    ).execute(DEMO_DRAFT, TASTES, THEMES, locality="", weekday=None)
    assert len(seen) == 1
    assert seen[0].verifier_pass_rate == 1.0
    assert seen[0].duration_fit == 1.0
    assert seen[0].type_diversity == len({item.kind for item in result.kit.items})
    assert seen[0].steps == len(result.trace)
    assert seen[0].latency_ms >= 0


@pytest.mark.parametrize(
    "settings",
    [
        {"max_steps": 0},
        {"max_turns": 33},
        {"timeout_seconds": 0},
        {"timeout_seconds": float("nan")},
        {"finalize_seconds": 61},
    ],
)
def test_invalid_limits_are_refused(settings) -> None:
    with pytest.raises(ValueError):
        AgentLimits(**settings)
