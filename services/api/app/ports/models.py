"""Values that cross the catalog port. Qloo JSON does not."""

from dataclasses import dataclass

from app.domain.kinds import ContentKind


@dataclass(frozen=True, slots=True)
class TasteHit:
    """A search hit. `detail` is a short line for our UI, not a raw document."""

    name: str
    kind: ContentKind
    detail: str
    qloo_entity_id: str


@dataclass(frozen=True, slots=True)
class TagHit:
    """Our theme id joined to a content-tag id. The tag id is what the catalog receives."""

    theme_id: str
    qloo_tag_id: str
    name: str


@dataclass(frozen=True, slots=True)
class InterestLink:
    """A taste we will send as an interest entity. `name` stays on our side of the mapper."""

    seed_id: str
    name: str
    qloo_entity_id: str
