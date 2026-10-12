"""Secondary sources for length and a place to open the piece. No playback."""

from dataclasses import dataclass
from typing import Protocol

from app.domain.entities import CatalogItem
from app.domain.kinds import DurationSource


@dataclass(frozen=True, slots=True)
class Enrichment:
    """Length and links for one catalog piece. Empty fields leave the item as mapped."""

    minutes: int | None = None
    duration_source: DurationSource | None = None
    duration_note: str = ""
    title: str | None = None
    links: tuple[tuple[str, str], ...] = ()
    watch_providers: tuple[str, ...] = ()


class EnrichmentPort(Protocol):
    """Looks up episodes, albums, pages, and watch notes. Implementations may use the network."""

    async def for_item(self, item: CatalogItem) -> Enrichment:
        """Return sample or live enrichment. An unknown item returns an empty enrichment."""
