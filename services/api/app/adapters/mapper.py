"""Map a catalog document onto domain records. One mapper for every adapter."""

import logging
from collections.abc import Sequence

from app.adapters.documents import EntityRecord, Explainability, InsightsDocument
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
from app.ports.models import InterestLink, TagHit, TasteHit

logger = logging.getLogger(__name__)

DETAIL_MAX_CHARS = 80
OPEN_NOW_LABEL = "Open now"
PRICE_LABEL = "Light meal, low price"
WALK_FALLBACK_MINUTES = 10
FIRST_RANK = 1

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

ASSUMED_MINUTES: dict[ContentKind, int] = {
    "movie": ASSUMED_MOVIE_MINUTES,
    "tv_show": ASSUMED_TV_MINUTES,
    "podcast": ASSUMED_PODCAST_MINUTES,
    "book": ASSUMED_BOOK_MINUTES,
    "artist": ASSUMED_ARTIST_MINUTES,
}

TAG_TO_THEME: dict[str, str] = {
    "urn:tag:keyword:media:fictional_illness": "illness",
    "urn:tag:keyword:media:fictional_hospitals": "hospitals",
    "urn:tag:keyword:media:fictional_cancer": "cancer",
    "urn:tag:keyword:media:fictional_parent_death": "parent-death",
    "urn:tag:keyword:media:fictional_grief": "grief",
}


def map_search(document: InsightsDocument, kind: ContentKind) -> tuple[TasteHit, ...]:
    """Search hits of `kind`. Other subtypes are dropped."""

    hits: list[TasteHit] = []
    for entity in document.results.entities:
        if SUBTYPE_KIND.get(entity.subtype) != kind:
            continue
        hits.append(
            TasteHit(
                name=entity.name,
                kind=kind,
                detail=_detail(entity),
                qloo_entity_id=entity.entity_id,
            )
        )
    return tuple(hits)


def map_tags(document: InsightsDocument) -> tuple[TagHit, ...]:
    """Tags that carry our theme id annotation or a known fictional tag id."""

    hits: list[TagHit] = []
    for tag in document.results.tags:
        theme_id = tag.theme_id or TAG_TO_THEME.get(tag.id)
        if theme_id is None:
            continue
        hits.append(TagHit(theme_id=theme_id, qloo_tag_id=tag.id, name=tag.name))
    return tuple(hits)


def map_insights(
    document: InsightsDocument,
    kind: ContentKind,
    links: Sequence[InterestLink],
) -> tuple[CatalogItem, ...]:
    """Catalog pieces of `kind`, ranked by surviving list order starting at 1."""

    items: list[CatalogItem] = []
    rank = FIRST_RANK
    for entity in document.results.entities:
        if SUBTYPE_KIND.get(entity.subtype) != kind:
            continue
        if not entity.name.strip() or not entity.entity_id.strip():
            continue
        items.append(_catalog_item(entity, kind, links, rank))
        rank += 1
    return tuple(items)


def map_places(document: InsightsDocument) -> tuple[NearbyPlace, ...]:
    """Place rows. Coordinates are unconfirmed, so walk minutes come from our annotation."""

    places: list[NearbyPlace] = []
    for entity in document.results.entities:
        if entity.subtype != "urn:entity:place":
            continue
        kind = _place_kind(entity.properties.place_kind)
        if kind is None:
            continue
        walk = entity.properties.walk_minutes
        places.append(
            NearbyPlace(
                id=entity.slug or entity.entity_id,
                kind=kind,
                name=entity.name,
                offer=entity.properties.description,
                walk_minutes=walk if walk is not None and walk > 0 else WALK_FALLBACK_MINUTES,
                open_until=entity.properties.open_until or OPEN_NOW_LABEL,
                price_label=entity.properties.price_label or PRICE_LABEL,
            )
        )
    return tuple(places)


def _catalog_item(
    entity: EntityRecord,
    kind: ContentKind,
    links: Sequence[InterestLink],
    rank: int,
) -> CatalogItem:
    minutes, source = _minutes(kind, entity.properties.duration)
    if source == "assumed":
        logger.info("duration assumed kind=%s", kind)
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
        avoided_theme_ids=_themes(entity),
        duration_source=source,
    )


def _minutes(kind: ContentKind, duration: int | None) -> tuple[int, DurationSource]:
    if kind == "movie" and duration is not None and duration > 0:
        return duration, "confirmed"
    if duration is not None and duration > 0:
        return duration, "assumed"
    return ASSUMED_MINUTES[kind], "assumed"


def _maker(kind: ContentKind, entity: EntityRecord) -> str:
    if kind == "movie":
        for company in entity.properties.production_companies:
            if company.strip():
                return company
        return ""
    return (entity.properties.creator or "").strip()


def _themes(entity: EntityRecord) -> tuple[str, ...]:
    found: list[str] = []
    for tag in entity.properties.tags:
        theme_id = tag.theme_id or TAG_TO_THEME.get(tag.id)
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
    if chosen:
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
    text = entity.properties.description.strip()
    if len(text) <= DETAIL_MAX_CHARS:
        return text
    return text[:DETAIL_MAX_CHARS].rstrip()


def _place_kind(raw: str | None) -> PlaceKind | None:
    if raw is None:
        return None
    return PLACE_BY_NAME.get(raw)
