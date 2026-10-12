"""Apply an enrichment record onto a catalog item before packing."""

from dataclasses import replace

from app.domain.entities import CatalogItem
from app.ports.enrichment import Enrichment


class EmptyEnrichment:
    """Leaves mapped lengths in place. Used when no enricher is injected."""

    async def for_item(self, item: CatalogItem) -> Enrichment:
        del item
        return Enrichment()


def apply_enrichment(item: CatalogItem, extra: Enrichment) -> CatalogItem:
    """Prefer a measured length. Keep the mapped length when the source is silent."""

    minutes = extra.minutes if extra.minutes is not None and extra.minutes > 0 else item.minutes
    source = extra.duration_source or item.duration_source
    note = extra.duration_note or item.duration_note
    title = extra.title or item.title
    links = extra.links or item.links
    providers = extra.watch_providers or item.watch_providers
    return replace(
        item,
        minutes=minutes,
        duration_source=source,
        duration_note=note,
        title=title,
        links=links,
        watch_providers=providers,
    )
