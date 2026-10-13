"""Map a catalog document onto domain records. One mapper for every adapter."""

import logging
from collections.abc import Sequence

from app.adapters.documents import EntityRecord, TagRecord
from app.adapters.query_documents import Explainability
from app.adapters.theme_tags import theme_for_tag
from app.domain.entities import CatalogItem, NearbyPlace
from app.domain.kinds import ContentKind, DurationSource, PlaceKind
from app.domain.limits import (
    ASSUMED_ARTIST_MINUTES,
    ASSUMED_BOOK_MINUTES,
    ASSUMED_MOVIE_MINUTES,
    ASSUMED_PODCAST_MINUTES,
    ASSUMED_TV_MINUTES,
    EXPLAIN_MIN_SCORE,
)
from app.domain.walk import SAMPLE_ORIGIN_LAT, SAMPLE_ORIGIN_LON, walk_minutes
from app.ports.models import InterestLink, TagHit, TasteHit

logger = logging.getLogger(__name__)

DETAIL_MAX_CHARS = 80
PRICE_LABEL = "Light meal, low price"
MINUTES_PER_PAGE = 1
ESTIMATED_PAGE_NOTE = "Estimated from page count."
ESTIMATED_FALLBACK_NOTE = "Estimated. The catalog did not give a length."
MAPS_SEARCH = "https://maps.apple.com/?q="

SUBTYPE_KIND: dict[str, ContentKind] = {
    "urn:entity:movie": "movie",
    "urn:entity:tv_show": "tv_show",
    "urn:entity:podcast": "podcast",
    "urn:entity:book": "book",
    "urn:entity:artist": "artist",
}

PLACE_BY_NAME: dict[str, PlaceKind] = {
    "bakery": "bakery",
    "kitchen": "kitchen",
    "coffee": "coffee",
}

PRICE_BY_LEVEL = {
    1: PRICE_LABEL,
    2: "A modest meal",
    3: "A longer meal",
    4: "A special meal",
}

ASSUMED_MINUTES: dict[ContentKind, int] = {
    "movie": ASSUMED_MOVIE_MINUTES,
    "tv_show": ASSUMED_TV_MINUTES,
    "podcast": ASSUMED_PODCAST_MINUTES,
    "book": ASSUMED_BOOK_MINUTES,
    "artist": ASSUMED_ARTIST_MINUTES,
}

CONFIRMED_DURATION_KINDS = frozenset({"movie", "tv_show"})


def map_search(entities: Sequence[EntityRecord], kind: ContentKind) -> tuple[TasteHit, ...]:
    """Search hits of `kind`. Other subtypes are dropped."""

    hits: list[TasteHit] = []
    for entity in entities:
        if SUBTYPE_KIND.get(entity.subtype) != kind:
            continue
        hits.append(
            TasteHit(
                name=entity.name,
                kind=kind,
                detail=_detail(entity),
                qloo_entity_id=entity.entity_id,
                slug=entity.slug or "",
                taste_kind=entity.properties.taste_kind.strip(),
                aliases=tuple(alias for alias in entity.properties.aliases if alias.strip()),
            )
        )
    return tuple(hits)


def map_tags(tags: Sequence[TagRecord]) -> tuple[TagHit, ...]:
    """Tags that carry our theme id annotation or a recognized tag id or family."""

    hits: list[TagHit] = []
    for tag in tags:
        theme_id = tag.theme_id or theme_for_tag(tag.id)
        if theme_id is None or not tag.id:
            continue
        hits.append(TagHit(theme_id=theme_id, qloo_tag_id=tag.id, name=tag.name))
    return tuple(hits)


def map_insights(
    entities: Sequence[EntityRecord],
    kind: ContentKind,
    links: Sequence[InterestLink],
) -> tuple[CatalogItem, ...]:
    """Catalog pieces of `kind`, ranked by surviving list order starting at 1."""

    items: list[CatalogItem] = []
    rank = 1
    for entity in entities:
        if SUBTYPE_KIND.get(entity.subtype) != kind:
            continue
        if not entity.name.strip() or not entity.entity_id.strip():
            continue
        items.append(_catalog_item(entity, kind, links, rank))
        rank += 1
    return tuple(items)


def map_places(
    entities: Sequence[EntityRecord],
    *,
    origin_lat: float = SAMPLE_ORIGIN_LAT,
    origin_lon: float = SAMPLE_ORIGIN_LON,
) -> tuple[NearbyPlace, ...]:
    """Place rows. Walk minutes come from coordinates. Closing time is left blank."""

    places: list[NearbyPlace] = []
    for entity in entities:
        if entity.subtype != "urn:entity:place":
            continue
        kind = _place_kind(entity)
        if kind is None:
            continue
        places.append(_place(entity, kind, origin_lat, origin_lon))
    return tuple(places)


def _catalog_item(
    entity: EntityRecord,
    kind: ContentKind,
    links: Sequence[InterestLink],
    rank: int,
) -> CatalogItem:
    minutes, source, note = _minutes(kind, entity)
    if source == "estimated":
        logger.info("duration estimated kind=%s", kind)
    because = _because_of(entity, links)
    name = _because_name(because, links)
    return CatalogItem(
        id=entity.slug or entity.entity_id,
        qloo_entity_id=entity.entity_id,
        kind=kind,
        title=entity.name,
        maker=_maker(kind, entity),
        minutes=minutes,
        rank=rank,
        synopsis=entity.properties.description,
        why=f"Because you love {name}" if name else "Because it fits the chair.",
        because_of=because,
        avoided_theme_ids=_themes(entity.tags),
        duration_source=source,
        duration_note=note,
    )


def _minutes(kind: ContentKind, entity: EntityRecord) -> tuple[int, DurationSource, str]:
    duration = entity.properties.duration
    if kind in CONFIRMED_DURATION_KINDS and duration is not None and duration > 0:
        return duration, "confirmed", "Runtime."
    pages = entity.properties.page_count
    if kind == "book" and pages is not None and pages > 0:
        return pages * MINUTES_PER_PAGE, "estimated", ESTIMATED_PAGE_NOTE
    return ASSUMED_MINUTES[kind], "estimated", ESTIMATED_FALLBACK_NOTE


def _maker(kind: ContentKind, entity: EntityRecord) -> str:
    if kind in {"movie", "tv_show"}:
        for company in entity.properties.production_companies:
            if company.strip():
                return company
    if kind == "podcast" and entity.properties.channel.strip():
        return entity.properties.channel.strip()
    if kind == "book" and entity.properties.publisher.strip():
        return entity.properties.publisher.strip()
    return entity.disambiguation.strip()


def _themes(tags: Sequence[TagRecord]) -> tuple[str, ...]:
    found: list[str] = []
    for tag in tags:
        theme_id = tag.theme_id or theme_for_tag(tag.id)
        if theme_id is not None and theme_id not in found:
            found.append(theme_id)
    return tuple(found)


def _explain_blocks(entity: EntityRecord) -> list[Explainability]:
    blocks: list[Explainability] = []
    if entity.query is not None and entity.query.explainability is not None:
        blocks.append(entity.query.explainability)
    return blocks


def _because_of(entity: EntityRecord, links: Sequence[InterestLink]) -> tuple[str, ...]:
    by_entity = {link.qloo_entity_id: link for link in links}
    chosen: list[str] = []
    for block in _explain_blocks(entity):
        for score in block.entities:
            if score.score < EXPLAIN_MIN_SCORE:
                continue
            link = by_entity.get(score.entity_id)
            if link is not None and link.seed_id not in chosen:
                chosen.append(link.seed_id)
    if any("entities" in block.model_fields_set for block in _explain_blocks(entity)):
        return tuple(chosen)
    return tuple(link.seed_id for link in links)


def _because_name(seed_ids: Sequence[str], links: Sequence[InterestLink]) -> str:
    by_seed = {link.seed_id: link.name for link in links}
    for seed_id in seed_ids:
        name = by_seed.get(seed_id)
        if name:
            return name
    return ""


def _detail(entity: EntityRecord) -> str:
    for short in entity.properties.short_descriptions:
        if short.value.strip():
            return short.value.strip()
    if entity.properties.short_description.strip():
        return entity.properties.short_description.strip()
    text = entity.properties.description.strip()
    if len(text) <= DETAIL_MAX_CHARS:
        return text
    return text[:DETAIL_MAX_CHARS].rstrip()


def _place_kind(entity: EntityRecord) -> PlaceKind | None:
    for tag in entity.tags:
        name = tag.name.casefold()
        if name in PLACE_BY_NAME:
            return PLACE_BY_NAME[name]
        suffix = tag.id.rsplit(":", maxsplit=1)[-1]
        if suffix in PLACE_BY_NAME:
            return PLACE_BY_NAME[suffix]
    raw = entity.properties.place_kind
    if raw is None:
        return None
    return PLACE_BY_NAME.get(raw)


def _place(
    entity: EntityRecord,
    kind: PlaceKind,
    origin_lat: float,
    origin_lon: float,
) -> NearbyPlace:
    coordinates = next(
        (
            point
            for point in (entity.location, entity.properties.geocode)
            if point is not None and point.latitude is not None and point.longitude is not None
        ),
        None,
    )
    lat = coordinates.latitude if coordinates else entity.properties.lat
    lon = coordinates.longitude if coordinates else entity.properties.lon
    minutes = 1 if lat is None or lon is None else walk_minutes(lat, lon, origin_lat, origin_lon)
    level = entity.properties.price_level
    price = PRICE_BY_LEVEL.get(level, PRICE_LABEL) if level is not None else PRICE_LABEL
    return NearbyPlace(
        id=entity.slug or entity.entity_id,
        kind=kind,
        name=entity.name,
        offer=entity.properties.description,
        walk_minutes=minutes,
        open_until="",
        price_label=price,
        address=entity.properties.address,
        hours=tuple(
            (day, tuple(period.label() for period in periods))
            for day, periods in (entity.properties.hours or {}).items()
        ),
        rating=entity.properties.business_rating,
        map_url=f"{MAPS_SEARCH}{entity.name.replace(' ', '+')}",
    )
