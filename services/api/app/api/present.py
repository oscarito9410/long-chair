"""Turn a domain kit into the HTTP model."""

from app.api.schemas import ItemOut, PackedOut, PlaceOut, SessionKitOut, SlotOut, TopicOut
from app.domain.entities import SessionKit
from app.domain.kinds import CatalogMode


def present_kit(kit: SessionKit, source: CatalogMode) -> SessionKitOut:
    """Map a kit onto the camel-case response. Scheduled items stay in slot order."""

    packed = PackedOut(
        slots=[
            SlotOut(
                item_id=slot.item_id,
                start_minute=slot.start_minute,
                end_minute=slot.end_minute,
            )
            for slot in kit.packed.slots
        ],
        filled_minutes=kit.packed.filled_minutes,
        duration_minutes=kit.packed.duration_minutes,
        open_minutes=kit.packed.open_minutes,
    )
    items = [
        ItemOut(
            id=item.id,
            qloo_entity_id=item.qloo_entity_id,
            kind=item.kind,
            title=item.title,
            maker=item.maker,
            minutes=item.minutes,
            rank=item.rank,
            synopsis=item.synopsis,
            why=item.why,
            because_of=list(item.because_of),
            avoided_theme_ids=list(item.avoided_theme_ids),
            duration_source=item.duration_source,
        )
        for item in kit.items
    ]
    topics = [
        TopicOut(id=topic.id, seed_id=topic.seed_id, title=topic.title, prompt=topic.prompt)
        for topic in kit.topics
    ]
    places = [
        PlaceOut(
            id=place.id,
            kind=place.kind,
            name=place.name,
            offer=place.offer,
            walk_minutes=place.walk_minutes,
            open_until=place.open_until,
            price_label=place.price_label,
        )
        for place in kit.places
    ]
    return SessionKitOut(packed=packed, items=items, topics=topics, places=places, source=source)
