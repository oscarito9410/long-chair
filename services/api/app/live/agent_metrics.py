"""Keyless fictional comparison; live runs require explicit spending opt-in and both keys."""

import argparse
import asyncio
import json
import os
import time
from collections.abc import Sequence
from contextlib import AsyncExitStack

import httpx

from app.adapters.enrichment import FakeEnrichment
from app.adapters.fake_llm import FakeLlm, scripted_call
from app.adapters.fake_qloo import FakeQlooAdapter
from app.adapters.http_qloo import QLOO_HOST, REQUEST_TIMEOUT_SECONDS, HttpQlooAdapter
from app.api.composition import build_agent_limits, build_llm
from app.application.agent.build_agent_kit import BuildAgentKit
from app.application.agent.metrics import KitMetrics, measure_kit
from app.application.build_session_kit import BuildSessionKit
from app.application.enrich import apply_enrichment
from app.application.plan_companion import scheduled_items
from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES
from app.domain.entities import CatalogItem, SessionKit
from app.domain.kinds import CONTENT_KINDS
from app.domain.packer import pack_session
from app.ports.llm import LlmError, LlmMessage, LlmPort, LlmTurn
from app.ports.models import InterestLink
from app.ports.qloo import QlooPort

BASELINE_TIMEOUT_SECONDS = 60.0
STRATEGY_COLUMN_WIDTH = 14

SCRIPTED_BASELINE_IDS = (
    "ward-clock",
    "blue-buoy",
    "bread-tuesday",
    "cedar-hall",
    "market-morning",
)


def live_enabled() -> bool:
    """Opt-in is separate from credentials so tests never spend merely because keys exist."""

    return bool(
        os.environ.get("RUN_LIVE_AGENT") == "1"
        and os.environ.get("QLOO_API_KEY")
        and os.environ.get("LLM_API_KEY")
        and os.environ.get("LLM_MODEL")
    )


def fixture_agent() -> FakeLlm:
    """Fixed catalog exploration for this comparison, independent of API credentials."""

    return FakeLlm(
        [
            scripted_call("qloo_search", {"seed_ids": list(DEMO_DRAFT.seed_ids)}),
            scripted_call("qloo_insights", {"kinds": list(CONTENT_KINDS)}),
            scripted_call("verify_themes", {}),
            scripted_call("enrich", {}),
            scripted_call("durations", {}),
            scripted_call("places", {}),
            LlmTurn(),
        ]
    )


async def _fictional_pool() -> tuple[CatalogItem, ...]:
    qloo = FakeQlooAdapter()
    tastes = tuple(taste for taste in TASTES if taste.id in DEMO_DRAFT.seed_ids)
    batches = await asyncio.gather(*(qloo.search(taste.name, taste.kind) for taste in tastes))
    links = tuple(
        InterestLink(taste.id, taste.name, hits[0].qloo_entity_id)
        for taste, hits in zip(tastes, batches, strict=True)
    )
    neighbors = await asyncio.gather(*(qloo.insights(kind, links, ()) for kind in CONTENT_KINDS))
    items = tuple(item for batch in neighbors for item in batch)
    enrichment = FakeEnrichment()
    extras = await asyncio.gather(*(enrichment.for_item(item) for item in items))
    return tuple(apply_enrichment(item, extra) for item, extra in zip(items, extras, strict=True))


async def _model_only(llm: LlmPort, pool: Sequence[CatalogItem]) -> SessionKit:
    context = {
        "titles": [{"id": item.id, "title": item.title, "minutes": item.minutes} for item in pool],
        "taste_titles": [taste.name for taste in TASTES if taste.id in DEMO_DRAFT.seed_ids],
        "avoid_theme_ids": list(DEMO_DRAFT.avoid_ids),
        "duration_minutes": DEMO_DRAFT.duration_minutes,
    }
    turn = await llm.complete(
        [
            LlmMessage(
                "system",
                "Select from provided cultural titles without tools. "
                'Return JSON only: {"item_ids":["known-id"]}.',
            ),
            LlmMessage("user", json.dumps(context)),
        ],
        (),
    )
    try:
        raw: object = json.loads(turn.content)
    except ValueError as exc:
        raise LlmError("The baseline returned invalid selection JSON.") from exc
    if turn.tool_calls or not isinstance(raw, dict) or set(raw) != {"item_ids"}:
        raise LlmError("The baseline returned an invalid selection.")
    ids = raw["item_ids"]
    known = {item.id: item for item in pool}
    if not isinstance(ids, list) or any(not isinstance(i, str) or i not in known for i in ids):
        raise LlmError("The baseline selected an unknown title.")
    selected = tuple(known[item_id] for item_id in dict.fromkeys(ids))
    # Evaluation scores the unverified selection. It is never returned by an API endpoint.
    packed = pack_session(selected, DEMO_DRAFT)
    return SessionKit(packed, scheduled_items(packed, selected), (), ())


async def run_comparison(*, live: bool = False) -> list[tuple[str, KitMetrics]]:
    """Three strategies. Default is fictional; live baseline sees only verified mapped titles."""

    if live and not live_enabled():
        raise RuntimeError("Live comparison requires opt-in, both keys, and LLM_MODEL.")
    async with AsyncExitStack() as stack:
        qloo: QlooPort = FakeQlooAdapter()
        if live:
            client = await stack.enter_async_context(
                httpx.AsyncClient(base_url=QLOO_HOST, timeout=REQUEST_TIMEOUT_SECONDS)
            )
            qloo = HttpQlooAdapter(api_key=os.environ["QLOO_API_KEY"], client=client)
        llm = build_llm() if live else fixture_agent()
        assert llm is not None
        baseline_llm = (
            llm
            if live
            else FakeLlm([LlmTurn(json.dumps({"item_ids": list(SCRIPTED_BASELINE_IDS)}))])
        )
        enrichment = FakeEnrichment()
        held = tuple(theme for theme in THEMES if theme.id in DEMO_DRAFT.avoid_ids)
        rows: list[tuple[str, KitMetrics]] = []
        started = time.monotonic()
        result = await BuildAgentKit(qloo, llm, enrichment, limits=build_agent_limits()).execute(
            DEMO_DRAFT, TASTES, THEMES, locality="Westbridge", weekday="sunday"
        )
        rows.append(
            (
                "agent",
                measure_kit(
                    result.kit,
                    held,
                    steps=len(result.trace),
                    latency_ms=(time.monotonic() - started) * 1000,
                ),
            )
        )
        async with asyncio.timeout(BASELINE_TIMEOUT_SECONDS):
            started = time.monotonic()
            deterministic = await BuildSessionKit(qloo, enrichment=enrichment).execute(
                DEMO_DRAFT, TASTES, THEMES, locality="Westbridge", weekday="sunday"
            )
            rows.append(
                (
                    "deterministic",
                    measure_kit(
                        deterministic, held, steps=0, latency_ms=(time.monotonic() - started) * 1000
                    ),
                )
            )
            pool = deterministic.items if live else await _fictional_pool()
            started = time.monotonic()
            baseline = await _model_only(baseline_llm, pool)
            rows.append(
                (
                    "llm_only",
                    measure_kit(
                        baseline, held, steps=0, latency_ms=(time.monotonic() - started) * 1000
                    ),
                )
            )
        return rows


def comparison_table(rows: Sequence[tuple[str, KitMetrics]]) -> str:
    """Print aggregate measures only, never catalog records or provider bodies."""

    lines = ["strategy       verifier_pass duration_fit type_diversity steps latency_ms"]
    for name, metrics in rows:
        lines.append(
            f"{name:<{STRATEGY_COLUMN_WIDTH}} {metrics.verifier_pass_rate:>13.3f} "
            f"{metrics.duration_fit:>12.3f} "
            f"{metrics.type_diversity:>{STRATEGY_COLUMN_WIDTH}} {metrics.steps:>5} "
            f"{metrics.latency_ms:>10.3f}"
        )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--live", action="store_true", help="Approved paid calls; both keys required."
    )
    options = parser.parse_args()
    print(
        "Live catalog-fed baseline (verified titles only)."
        if options.live
        else "Fictional scripted comparison; not a live score or an improvement claim."
    )
    print(comparison_table(asyncio.run(run_comparison(live=options.live))))


if __name__ == "__main__":
    main()
