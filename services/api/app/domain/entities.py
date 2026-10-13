"""Session kit records. Pure data. No I/O."""

from dataclasses import dataclass

from app.domain.kinds import ContentKind, DurationSource, PlaceKind


@dataclass(frozen=True, slots=True)
class TasteSeed:
    """A work the visitor already loves. `name` is the only field safe to search."""

    id: str
    kind: ContentKind
    name: str
    detail: str


@dataclass(frozen=True, slots=True)
class AvoidTheme:
    """A story theme to hold out. This is a catalog rule, not a fact about a person."""

    id: str
    label: str
    detail: str


@dataclass(frozen=True, slots=True)
class SessionDraft:
    """Choices for one chair. `companion_id` is stored and is not a packing input."""

    seed_ids: tuple[str, ...]
    avoid_ids: tuple[str, ...]
    duration_minutes: int
    companion_id: str


@dataclass(frozen=True, slots=True)
class CatalogItem:
    """One recommended work after mapping. `minutes` is an integer length, never a clock time."""

    id: str
    qloo_entity_id: str
    kind: ContentKind
    title: str
    maker: str
    minutes: int
    rank: int
    synopsis: str
    why: str
    because_of: tuple[str, ...]
    avoided_theme_ids: tuple[str, ...]
    duration_source: DurationSource
    duration_note: str = ""
    links: tuple[tuple[str, str], ...] = ()
    watch_providers: tuple[str, ...] = ()


@dataclass(frozen=True, slots=True)
class PackedSlot:
    """A half-open minute range on the chair: start inclusive, end exclusive."""

    item_id: str
    start_minute: int
    end_minute: int


@dataclass(frozen=True, slots=True)
class PackedSession:
    """The schedule. `open_minutes` is the chair time with nothing in it."""

    slots: tuple[PackedSlot, ...]
    filled_minutes: int
    duration_minutes: int
    open_minutes: int


@dataclass(frozen=True, slots=True)
class CompanionTopic:
    """A short prompt for the person sitting alongside, tied to one taste."""

    id: str
    seed_id: str
    title: str
    prompt: str


@dataclass(frozen=True, slots=True)
class NearbyPlace:
    """A fictional nearby stop. `walk_minutes` is our estimate, not a catalog field."""

    id: str
    kind: PlaceKind
    name: str
    offer: str
    walk_minutes: int
    open_until: str
    price_label: str
    map_url: str = ""
    address: str = ""
    hours: tuple[tuple[str, tuple[str, ...]], ...] = ()
    rating: float | None = None


@dataclass(frozen=True, slots=True)
class SessionKit:
    """A packed chair plus the lines and places that go with the scheduled pieces."""

    packed: PackedSession
    items: tuple[CatalogItem, ...]
    topics: tuple[CompanionTopic, ...]
    places: tuple[NearbyPlace, ...]
