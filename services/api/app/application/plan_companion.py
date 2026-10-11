"""Companion lines for the pieces that were actually scheduled."""

from collections.abc import Sequence

from app.domain.companion import topics_for
from app.domain.entities import CatalogItem, CompanionTopic, PackedSession


def scheduled_items(
    packed: PackedSession,
    catalog: Sequence[CatalogItem],
) -> tuple[CatalogItem, ...]:
    """Catalog rows in schedule order. Unknown slot ids are skipped."""

    by_id = {item.id: item for item in catalog}
    return tuple(item for slot in packed.slots if (item := by_id.get(slot.item_id)) is not None)


def plan_companion(items: Sequence[CatalogItem]) -> tuple[CompanionTopic, ...]:
    """Topics for the tastes that justified `items`."""

    return topics_for(items)
