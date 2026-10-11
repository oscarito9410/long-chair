"""Query strings for the live catalog. Values are comma-separated, never JSON arrays."""

from collections.abc import Sequence

from app.adapters.validation import (
    ENTITY_URN_PREFIX,
    EXCLUDE_OPERATOR,
    EXPLAINABILITY_VALUE,
    subtype_for,
)
from app.domain.kinds import ContentKind
from app.domain.limits import INSIGHTS_TAKE, PLACES_TAKE
from app.ports.models import InterestLink

PLACE_SUBTYPE = f"{ENTITY_URN_PREFIX}place"
TAGS_QUERY_KEY = "query"


def insights_params(
    kind: ContentKind,
    interests: Sequence[InterestLink],
    exclude_tag_ids: Sequence[str],
    exclude_entity_ids: Sequence[str],
) -> list[tuple[str, str]]:
    """Insights query. Optional filters are omitted when empty so a blank value is not sent."""

    params = [
        ("filter.type", subtype_for(kind)),
        ("signal.interests.entities", _ids(interests)),
        ("feature.explainability", EXPLAINABILITY_VALUE),
        ("take", str(INSIGHTS_TAKE)),
    ]
    if exclude_tag_ids:
        params.append(("filter.exclude.tags", ",".join(exclude_tag_ids)))
        params.append(("operator.exclude.tags", EXCLUDE_OPERATOR))
    if exclude_entity_ids:
        params.append(("filter.exclude.entities", ",".join(exclude_entity_ids)))
    return params


def place_params(
    locality: str,
    weekday: str,
    interests: Sequence[InterestLink],
    tag_ids: Sequence[str],
) -> list[tuple[str, str]]:
    """Places query. `locality` is a neighborhood name."""

    params = [
        ("filter.type", PLACE_SUBTYPE),
        ("filter.location.query", locality.strip()),
        ("filter.hours", weekday),
        ("signal.interests.entities", _ids(interests)),
        ("feature.explainability", EXPLAINABILITY_VALUE),
        ("take", str(PLACES_TAKE)),
    ]
    if tag_ids:
        params.append(("filter.tags", ",".join(tag_ids)))
    return params


def search_params(query: str, kind: ContentKind) -> list[tuple[str, str]]:
    """Search query. The text is the cultural title only."""

    return [("query", query.strip()), ("type", subtype_for(kind))]


def tag_params(label: str) -> list[tuple[str, str]]:
    """Tag lookup. The parameter name is unconfirmed and recorded in CONFIDENCE.md."""

    return [(TAGS_QUERY_KEY, label)]


def _ids(interests: Sequence[InterestLink]) -> str:
    return ",".join(link.qloo_entity_id for link in interests)
