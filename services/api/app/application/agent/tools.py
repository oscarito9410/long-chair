"""Six agent tools over ports and existing domain/application rules."""

import asyncio
from collections.abc import Sequence
from dataclasses import dataclass

from app.application.agent.arguments import ToolArgumentError, ToolArguments
from app.application.agent.models import AgentState
from app.application.checker import rejects
from app.application.enrich import apply_enrichment
from app.domain.entities import CatalogItem
from app.domain.kinds import CONTENT_KINDS
from app.domain.packer import pack_session
from app.ports.enrichment import EnrichmentPort
from app.ports.models import InterestLink
from app.ports.qloo import QlooPort


@dataclass(frozen=True, slots=True)
class ToolResult:
    """Mapped, verified model reply plus a result count for the public trace."""

    payload: dict[str, object]
    count: int


class AgentTools:
    """Request-scoped tools. Policy inputs always come from state, not the model."""

    def __init__(self, state: AgentState, qloo: QlooPort, enrichment: EnrichmentPort) -> None:
        self.state = state
        self._qloo = qloo
        self._enrichment = enrichment

    def verified_items(self) -> tuple[CatalogItem, ...]:
        """The existing checker is the only content rule, including model-visible titles."""

        return tuple(
            item for item in self.state.candidates.values() if not rejects(item, self.state.held)
        )

    async def execute(self, arguments: ToolArguments) -> ToolResult:
        """Run a previously validated action; errors propagate to the bounded caller."""

        match arguments.name:
            case "qloo_search":
                return await self._search(arguments.values)
            case "qloo_insights":
                return await self._insights(arguments.values)
            case "verify_themes":
                return self._verify()
            case "durations":
                return self._durations()
            case "places":
                return await self._places()
            case "enrich":
                return await self.enrich()
        raise ToolArgumentError("unknown_tool")

    async def _search(self, seed_ids: Sequence[str]) -> ToolResult:
        chosen = [taste for taste in self.state.tastes if taste.id in seed_ids]
        batches = await asyncio.gather(
            *(self._qloo.search(taste.name, taste.kind) for taste in chosen)
        )
        links: dict[str, InterestLink] = {}
        for taste, hits in zip(chosen, batches, strict=True):
            match = next(
                (hit for hit in hits if hit.name.casefold() == taste.name.casefold()), None
            )
            if match is not None:
                links[taste.id] = InterestLink(taste.id, taste.name, match.qloo_entity_id)
        self.state.links.update(links)
        return ToolResult({"resolved_seed_ids": list(links)}, len(links))

    async def _insights(self, kinds: Sequence[str]) -> ToolResult:
        if not self.state.links:
            raise ToolArgumentError("search_required")
        tags = await self._qloo.exclusion_tags(self.state.held)
        excluded_tags = tuple(tag.qloo_tag_id for tag in tags)
        batches = await asyncio.gather(
            *(
                self._qloo.insights(
                    kind,
                    tuple(self.state.links.values()),
                    excluded_tags,
                    tuple(sorted(self.state.rejected_entity_ids)),
                )
                for kind in CONTENT_KINDS
                if kind in kinds
            )
        )
        found = tuple(item for batch in batches for item in batch)
        for item in found:
            if rejects(item, self.state.held):
                self.state.rejected_entity_ids.add(item.qloo_entity_id)
            if self.state.candidates.get(item.id) != item:
                self.state.enriched_ids.discard(item.id)
            self.state.candidates[item.id] = item
        return _items_reply(tuple(item for item in found if not rejects(item, self.state.held)))

    def _verify(self) -> ToolResult:
        items = self.verified_items()
        self.state.candidates = {item.id: item for item in items}
        return _items_reply(items)

    def _durations(self) -> ToolResult:
        packed = pack_session(self.verified_items(), self.state.draft)
        return ToolResult(
            {
                "filled_minutes": packed.filled_minutes,
                "open_minutes": packed.open_minutes,
                "item_ids": [slot.item_id for slot in packed.slots],
            },
            len(packed.slots),
        )

    async def _places(self) -> ToolResult:
        if not self.state.locality or self.state.weekday is None:
            return ToolResult({"places": []}, 0)
        if not self.state.links:
            raise ToolArgumentError("search_required")
        places = await self._qloo.places(
            self.state.locality, self.state.weekday, tuple(self.state.links.values()), ()
        )
        self.state.places = tuple(places)
        return ToolResult(
            {"places": [{"id": place.id, "name": place.name} for place in places]}, len(places)
        )

    async def enrich(self) -> ToolResult:
        """Batch eligible records once; finalization also uses this method if omitted."""

        items = tuple(
            item for item in self.verified_items() if item.id not in self.state.enriched_ids
        )
        extras = await asyncio.gather(*(self._enrichment.for_item(item) for item in items))
        for item, extra in zip(items, extras, strict=True):
            self.state.candidates[item.id] = apply_enrichment(item, extra)
            self.state.enriched_ids.add(item.id)
        return _items_reply(self.verified_items())


def _items_reply(items: Sequence[CatalogItem]) -> ToolResult:
    return ToolResult(
        {
            "items": [
                {
                    "id": item.id,
                    "title": item.title,
                    "kind": item.kind,
                    "minutes": item.minutes,
                }
                for item in items
            ]
        },
        len(items),
    )
