"""Agent can replay private cached requests; this cache contains fictional fixtures only."""

import json
from uuid import uuid4

import httpx
from app.adapters.fake_llm import FakeLlm, scripted_call
from app.adapters.fake_qloo import FIXTURE_DIR
from app.adapters.memory_cache import MemoryCache
from app.adapters.recording import RecordingQlooAdapter
from app.application.agent.build_agent_kit import BuildAgentKit
from app.domain.demo_profile import TASTES, THEMES
from app.domain.entities import SessionDraft


async def test_agent_replays_fictional_recording_without_network() -> None:
    def scripted_transport(request: httpx.Request) -> httpx.Response:
        name = {
            "/search": "search.json",
            "/v2/tags": "tags.json",
            "/v2/insights": "insights-movie.json",
        }[request.url.path]
        return httpx.Response(200, json=json.loads((FIXTURE_DIR / name).read_text()))

    def forbidden_transport(request: httpx.Request) -> httpx.Response:
        raise AssertionError("Replay cannot call the network.")

    def llm() -> FakeLlm:
        return FakeLlm(
            [
                scripted_call("qloo_search", {"seed_ids": ["paper-kite"]}),
                scripted_call("qloo_insights", {"kinds": ["movie"]}),
            ]
        )

    cache = MemoryCache()
    draft = SessionDraft(("paper-kite",), ("illness",), 120, "pebble")
    recorded = RecordingQlooAdapter(
        mode="live", cache=cache, api_key=uuid4().hex, inner=httpx.MockTransport(scripted_transport)
    )
    first = await BuildAgentKit(recorded, llm()).execute(
        draft, TASTES, THEMES, locality="", weekday=None
    )
    replay = RecordingQlooAdapter(
        mode="replay",
        cache=cache,
        api_key=uuid4().hex,
        inner=httpx.MockTransport(forbidden_transport),
    )
    second = await BuildAgentKit(replay, llm()).execute(
        draft, TASTES, THEMES, locality="", weekday=None
    )
    assert first.kit == second.kit
    assert [item.id for item in second.kit.items] == ["north-window"]
    assert second.termination == "completed"
