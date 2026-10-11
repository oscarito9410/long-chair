"""Refuse catalog queries that would come back as a silent empty success."""

import re
from collections.abc import Sequence

from app.domain.kinds import CONTENT_KINDS, WEEKDAYS, ContentKind
from app.domain.limits import LOCALITY_MAX_CHARS, SEARCH_QUERY_MAX_CHARS
from app.ports.errors import QlooValidationError
from app.ports.models import InterestLink

ENTITY_ID_PATTERN = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)
TAG_ID_PREFIX = "urn:tag:"
ENTITY_URN_PREFIX = "urn:entity:"
EXCLUDE_OPERATOR = "union"
EXPLAINABILITY_VALUE = "true"


def validate_search(query: str, kind: str) -> None:
    """Search text is a cultural title. `kind` is one of the five content types."""

    text = query.strip()
    if not text or len(text) > SEARCH_QUERY_MAX_CHARS:
        raise QlooValidationError("Search text must be a cultural title.")
    if kind not in CONTENT_KINDS:
        raise QlooValidationError("That content type is not one we ask for.")


def validate_tag_id(tag_id: str) -> None:
    """Tag ids always use the urn:tag: prefix."""

    if not tag_id.startswith(TAG_ID_PREFIX):
        raise QlooValidationError("Tag ids must start with urn:tag:.")


def validate_entity_id(entity_id: str) -> None:
    """Interest and exclusion ids are ids we received, written as UUIDs."""

    if ENTITY_ID_PATTERN.fullmatch(entity_id) is None:
        raise QlooValidationError("Entity ids must be ids we already received.")


def validate_interests(interests: Sequence[InterestLink]) -> None:
    """Every interest id is checked. An empty list is not sent."""

    if not interests:
        raise QlooValidationError("Insights need at least one interest id.")
    for link in interests:
        validate_entity_id(link.qloo_entity_id)


def validate_insights(
    kind: str,
    interests: Sequence[InterestLink],
    exclude_tag_ids: Sequence[str],
    exclude_entity_ids: Sequence[str],
) -> None:
    """Check the insights query before a fixture read or an HTTP call."""

    if kind not in CONTENT_KINDS:
        raise QlooValidationError("That content type is not one we ask for.")
    validate_interests(interests)
    for tag_id in exclude_tag_ids:
        validate_tag_id(tag_id)
    for entity_id in exclude_entity_ids:
        validate_entity_id(entity_id)


def validate_places(
    locality: str,
    weekday: str,
    interests: Sequence[InterestLink],
    tag_ids: Sequence[str],
) -> None:
    """Check a places query. `weekday` is a day name, not a date."""

    text = locality.strip()
    if not text or len(text) > LOCALITY_MAX_CHARS:
        raise QlooValidationError("Locality must be a neighborhood name.")
    if weekday not in WEEKDAYS:
        raise QlooValidationError("Hours must be a weekday name.")
    validate_interests(interests)
    for tag_id in tag_ids:
        validate_tag_id(tag_id)


def subtype_for(kind: ContentKind) -> str:
    """urn for a content kind, used as filter.type."""

    return f"{ENTITY_URN_PREFIX}{kind}"
