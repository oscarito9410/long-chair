"""Per-tool outcomes and strict argument boundaries against fictional ports."""

import pytest
from app.adapters.enrichment import FakeEnrichment
from app.adapters.fake_qloo import FakeQlooAdapter
from app.application.agent.arguments import ToolArgumentError, parse_arguments
from app.application.agent.models import AgentState
from app.application.agent.tools import AgentTools
from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES
from app.domain.draft import resolve_tastes, resolve_themes
from app.ports.llm import ToolCall


def tools(locality: str = "Westbridge", weekday="sunday") -> AgentTools:
    state = AgentState(
        DEMO_DRAFT,
        resolve_tastes(DEMO_DRAFT, TASTES),
        resolve_themes(DEMO_DRAFT, THEMES),
        locality,
        weekday,
    )
    return AgentTools(state, FakeQlooAdapter(), FakeEnrichment())


async def call(toolkit: AgentTools, name: str, arguments: str = "{}"):
    return await toolkit.execute(
        parse_arguments(ToolCall("call", name, arguments), DEMO_DRAFT.seed_ids)
    )


async def test_search_resolves_only_selected_cultural_tastes() -> None:
    toolkit = tools()
    result = await call(toolkit, "qloo_search", '{"seed_ids":["paper-kite"]}')
    assert result.payload == {"resolved_seed_ids": ["paper-kite"]}
    assert toolkit.state.links["paper-kite"].name == "The Paper Kite"


async def test_insights_use_server_exclusions_and_require_search() -> None:
    toolkit = tools()
    with pytest.raises(ToolArgumentError, match="search_required"):
        await call(toolkit, "qloo_insights", '{"kinds":["movie"]}')
    await call(toolkit, "qloo_search", '{"seed_ids":["paper-kite"]}')
    result = await call(toolkit, "qloo_insights", '{"kinds":["movie"]}')
    assert result.count == 1
    assert set(toolkit.state.candidates) == {"north-window"}
    assert "Ward Clock" not in str(result.payload)


async def test_verify_removes_dirty_mapped_records() -> None:
    from dataclasses import replace

    toolkit = tools()
    await call(toolkit, "qloo_search", '{"seed_ids":["paper-kite"]}')
    await call(toolkit, "qloo_insights", '{"kinds":["movie"]}')
    item = toolkit.state.candidates["north-window"]
    toolkit.state.candidates["dirty"] = replace(item, id="dirty", synopsis="Illness is the plot.")
    result = await call(toolkit, "verify_themes")
    assert result.count == 1
    assert set(toolkit.state.candidates) == {"north-window"}


async def test_duration_preview_uses_chair_and_actual_lengths() -> None:
    toolkit = tools()
    await call(toolkit, "qloo_search", '{"seed_ids":["paper-kite"]}')
    await call(toolkit, "qloo_insights", '{"kinds":["movie"]}')
    result = await call(toolkit, "durations")
    assert result.payload == {
        "filled_minutes": 108,
        "open_minutes": 132,
        "item_ids": ["north-window"],
    }


async def test_enrich_updates_lengths_and_open_links_once() -> None:
    toolkit = tools()
    await call(toolkit, "qloo_search", '{"seed_ids":["slow-kitchen"]}')
    await call(toolkit, "qloo_insights", '{"kinds":["podcast"]}')
    result = await call(toolkit, "enrich")
    assert result.count == 1
    item = toolkit.state.candidates["bread-tuesday"]
    assert item.minutes == 36
    assert item.duration_source == "confirmed"
    assert item.links[0][0] == "Open in Apple Podcasts"
    assert await call(toolkit, "enrich") == result


async def test_places_use_owned_context_and_skip_missing_context() -> None:
    toolkit = tools()
    with pytest.raises(ToolArgumentError, match="search_required"):
        await call(toolkit, "places")
    await call(toolkit, "qloo_search", '{"seed_ids":["paper-kite"]}')
    result = await call(toolkit, "places")
    assert result.count == 3
    assert len(toolkit.state.places) == 3
    assert (await call(tools(locality="", weekday=None), "places")).count == 0


@pytest.mark.parametrize(
    "name,args",
    [
        ("unknown private", "{}"),
        ("qloo_search", "[]"),
        ("qloo_search", '{"seed_ids":[]}'),
        ("qloo_search", '{"seed_ids":[true]}'),
        ("qloo_search", '{"seed_ids":["sunday-engines"]}'),
        ("qloo_search", '{"seed_ids":["paper-kite","paper-kite"]}'),
        ("qloo_search", '{"seed_ids":["paper-kite"],"exclude_tags":[]}'),
        ("qloo_insights", '{"kinds":["place"]}'),
        ("durations", '{"minutes":999}'),
        ("verify_themes", '{"avoid_ids":[]}'),
        ("places", '{"locality":"private"}'),
        ("enrich", '{"items":[]}'),
        ("enrich", " " * 8193),
    ],
)
def test_invalid_arguments_cannot_replace_server_state(name: str, args: str) -> None:
    with pytest.raises(ToolArgumentError):
        parse_arguments(ToolCall("call", name, args), DEMO_DRAFT.seed_ids)
