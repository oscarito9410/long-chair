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
from app.ports.errors import QlooValidationError
from app.ports.models import InterestLink

PLACE_SUBTYPE = f"{ENTITY_URN_PREFIX}place"
TAGS_QUERY_KEY = "filter.query"

INSIGHTS_PARAM_ALLOWLIST = frozenset(
    {
        "filter.type",
        "signal.interests.entities",
        "feature.explainability",
        "take",
        "page",
        "filter.exclude.tags",
        "operator.exclude.tags",
        "operator.filter.exclude.tags",
        "filter.exclude.entities",
        "filter.tags",
        "filter.exists",
        "filter.location",
        "filter.location.query",
        "filter.location.radius",
        "filter.hours",
        "sort_by",
        "filter.content_rating",
        "filter.popularity.min",
    }
)
SEARCH_PARAM_ALLOWLIST = frozenset(
    {
        "query",
        "types",
        "filter.location",
        "filter.radius",
        "filter.exists",
        "filter.tags",
        "filter.rating",
        "filter.popularity",
        "page",
        "take",
        "sort_by",
    }
)
TAGS_PARAM_ALLOWLIST = frozenset(
    {
        "filter.query",
        "feature.typo_tolerance",
        "feature.semantic_search",
        "filter.tag.types",
        "filter.parents.types",
        "take",
        "page",
    }
)
PARAM_ALLOWLISTS = {
    "insights": INSIGHTS_PARAM_ALLOWLIST,
    "search": SEARCH_PARAM_ALLOWLIST,
    "tags": TAGS_PARAM_ALLOWLIST,
}


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
    require_allowed("insights", params)
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
    require_allowed("insights", params)
    return params


def search_params(query: str, kind: ContentKind) -> list[tuple[str, str]]:
    """Search query. The text is the cultural title only."""

    params = [("query", query.strip()), ("types", subtype_for(kind))]
    require_allowed("search", params)
    return params


def tag_params(label: str) -> list[tuple[str, str]]:
    """Tag lookup. The text parameter is `filter.query`."""

    params = [
        (TAGS_QUERY_KEY, label),
        ("feature.semantic_search", "true"),
        ("filter.tag.types", "urn:tag:keyword:media"),
    ]
    require_allowed("tags", params)
    return params


def require_allowed(endpoint: str, params: Sequence[tuple[str, str]]) -> None:
    """Refuse a parameter the catalog would ignore and answer with an empty 200."""

    allowed = PARAM_ALLOWLISTS.get(endpoint)
    if allowed is None:
        raise QlooValidationError("That catalog endpoint is not one we call.")
    for key, _value in params:
        if key not in allowed:
            raise QlooValidationError(f"The catalog would ignore {key}.")


def _ids(interests: Sequence[InterestLink]) -> str:
    return ",".join(link.qloo_entity_id for link in interests)
