"""Build a session kit: resolve, insights, one checker pass, pack, explain."""

import asyncio
from collections.abc import Sequence
from dataclasses import replace

from app.application.checker import rejects
from app.application.enrich import EmptyEnrichment, apply_enrichment
from app.application.plan_companion import plan_companion, scheduled_items
from app.domain.draft import resolve_tastes, resolve_themes, validate_draft
from app.domain.entities import (
    AvoidTheme,
    CatalogItem,
    NearbyPlace,
    SessionDraft,
    SessionKit,
    TasteSeed,
)
from app.domain.errors import DraftError
from app.domain.kinds import CONTENT_KINDS, Weekday
from app.domain.packer import pack_session
from app.ports.enrichment import EnrichmentPort
from app.ports.llm import LlmPort
from app.ports.models import InterestLink
from app.ports.qloo import QlooPort


class BuildSessionKit:
    """One plan. The catalog port is injected. A missing prose port keeps the template line."""

    def __init__(
        self,
        qloo: QlooPort,
        llm: LlmPort | None = None,
        enrichment: EnrichmentPort | None = None,
    ) -> None:
        self._qloo = qloo
        self._llm = llm
        self._enrichment = enrichment or EmptyEnrichment()

    async def execute(
        self,
        draft: SessionDraft,
        tastes: Sequence[TasteSeed],
        avoid_themes: Sequence[AvoidTheme],
        *,
        locality: str,
        weekday: Weekday | None,
    ) -> SessionKit:
        """Plan `draft`. Raises DraftError when a taste or the dial is invalid."""

        validate_draft(draft)
        chosen = resolve_tastes(draft, tastes)
        held = resolve_themes(draft, avoid_themes)
        links = await self._resolve(chosen)
        tags = await self._qloo.exclusion_tags(held)
        exclude_tag_ids = tuple(tag.qloo_tag_id for tag in tags)
        items = await self._enrich(await self._clean_items(links, exclude_tag_ids, held))
        packed = pack_session(items, draft)
        chosen_items = scheduled_items(packed, items)
        explained = await self._explain(chosen_items)
        places = await self._places(locality, weekday, links)
        return SessionKit(packed, explained, plan_companion(explained), places)

    async def _resolve(self, tastes: Sequence[TasteSeed]) -> tuple[InterestLink, ...]:
        hits = await asyncio.gather(
            *(self._qloo.search(taste.name, taste.kind) for taste in tastes)
        )
        links: list[InterestLink] = []
        for taste, found in zip(tastes, hits, strict=True):
            match = next(
                (hit for hit in found if hit.name.casefold() == taste.name.casefold()),
                None,
            )
            if match is None:
                raise DraftError("unresolved_taste", "That title is not on the shelf.")
            links.append(InterestLink(taste.id, taste.name, match.qloo_entity_id))
        return tuple(links)

    async def _clean_items(
        self,
        links: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        held: Sequence[AvoidTheme],
    ) -> tuple[CatalogItem, ...]:
        first = await self._insights(links, exclude_tag_ids, ())
        rejected = [item for item in first if rejects(item, held)]
        if not rejected:
            return first
        rejected_kinds = {item.kind for item in rejected}
        kept = tuple(item for item in first if item.kind not in rejected_kinds)
        banned = tuple(dict.fromkeys(item.qloo_entity_id for item in rejected))
        batches = await asyncio.gather(
            *(
                self._qloo.insights(kind, links, exclude_tag_ids, banned)
                for kind in CONTENT_KINDS
                if kind in rejected_kinds
            )
        )
        second = tuple(item for batch in batches for item in batch if not rejects(item, held))
        return kept + second

    async def _insights(
        self,
        links: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str],
    ) -> tuple[CatalogItem, ...]:
        batches = await asyncio.gather(
            *(
                self._qloo.insights(kind, links, exclude_tag_ids, exclude_entity_ids)
                for kind in CONTENT_KINDS
            )
        )
        items: list[CatalogItem] = []
        for batch in batches:
            items.extend(batch)
        return tuple(items)

    async def _enrich(self, items: Sequence[CatalogItem]) -> tuple[CatalogItem, ...]:
        extras = await asyncio.gather(*(self._enrichment.for_item(item) for item in items))
        return tuple(
            apply_enrichment(item, extra) for item, extra in zip(items, extras, strict=True)
        )

    async def _explain(self, items: Sequence[CatalogItem]) -> tuple[CatalogItem, ...]:
        llm = self._llm
        if llm is None:
            return tuple(items)
        rewritten = await asyncio.gather(*(self._rewrite(item, llm) for item in items))
        return tuple(rewritten)

    async def _rewrite(self, item: CatalogItem, llm: LlmPort) -> CatalogItem:
        text = await llm.rewrite(item.why)
        return replace(item, why=text)

    async def _places(
        self,
        locality: str,
        weekday: Weekday | None,
        links: Sequence[InterestLink],
    ) -> tuple[NearbyPlace, ...]:
        if not locality.strip() or weekday is None:
            return ()
        found = await self._qloo.places(locality, weekday, links, ())
        return tuple(found)
