"""Fit catalog pieces to a chair. `companion_id` is not read."""

from collections.abc import Sequence
from dataclasses import dataclass

from app.domain.entities import CatalogItem, PackedSession, PackedSlot, SessionDraft
from app.domain.kinds import ContentKind
from app.domain.limits import (
    ARTIST_SLOT_MINUTES,
    BOOK_SLOT_MINUTES,
    BRIEF_CHAIR_MINUTES,
    LONG_CHAIR_MINUTES,
    MAX_EXTRAS,
    MEDIUM_CHAIR_MINUTES,
    MIN_EXTRA_MINUTES,
    MOVIE_SLOT_LONG_MINUTES,
    MOVIE_SLOT_MEDIUM_MINUTES,
    PODCAST_SLOT_LONG_MINUTES,
    PODCAST_SLOT_SHORT_MINUTES,
    SHORT_CHAIR_MINUTES,
    TV_SLOT_MINUTES,
)


@dataclass(frozen=True, slots=True)
class SlotRequest:
    """One opening in a chair shape. `max_minutes` is a cap, not a target."""

    kind: ContentKind
    max_minutes: int


@dataclass(frozen=True, slots=True)
class SessionShape:
    """The shape used when the chair is at least `minimum_minutes` long."""

    minimum_minutes: int
    slots: tuple[SlotRequest, ...]


SESSION_SHAPES: tuple[SessionShape, ...] = (
    SessionShape(
        LONG_CHAIR_MINUTES,
        (
            SlotRequest("movie", MOVIE_SLOT_LONG_MINUTES),
            SlotRequest("tv_show", TV_SLOT_MINUTES),
            SlotRequest("podcast", PODCAST_SLOT_LONG_MINUTES),
            SlotRequest("artist", ARTIST_SLOT_MINUTES),
            SlotRequest("book", BOOK_SLOT_MINUTES),
        ),
    ),
    SessionShape(
        MEDIUM_CHAIR_MINUTES,
        (
            SlotRequest("movie", MOVIE_SLOT_MEDIUM_MINUTES),
            SlotRequest("tv_show", TV_SLOT_MINUTES),
            SlotRequest("podcast", PODCAST_SLOT_LONG_MINUTES),
        ),
    ),
    SessionShape(
        SHORT_CHAIR_MINUTES,
        (
            SlotRequest("tv_show", TV_SLOT_MINUTES),
            SlotRequest("podcast", PODCAST_SLOT_SHORT_MINUTES),
            SlotRequest("book", BOOK_SLOT_MINUTES),
        ),
    ),
    SessionShape(
        BRIEF_CHAIR_MINUTES,
        (
            SlotRequest("podcast", PODCAST_SLOT_SHORT_MINUTES),
            SlotRequest("book", BOOK_SLOT_MINUTES),
        ),
    ),
)


def taste_score(item: CatalogItem, selected: frozenset[str]) -> int:
    """How many selected tastes justify this piece. Zero means it stays off the chair."""

    return sum(1 for seed_id in item.because_of if seed_id in selected)


def _shape_for(minutes: int) -> tuple[SlotRequest, ...]:
    for shape in SESSION_SHAPES:
        if minutes >= shape.minimum_minutes:
            return shape.slots
    return ()


def _pick_for_slot(
    slot: SlotRequest,
    remaining: int,
    used: set[str],
    selected: frozenset[str],
    catalog: Sequence[CatalogItem],
) -> CatalogItem | None:
    cap = min(slot.max_minutes, remaining)
    candidates = [
        item
        for item in catalog
        if item.kind == slot.kind
        and item.id not in used
        and item.minutes <= cap
        and taste_score(item, selected) > 0
    ]
    candidates.sort(key=lambda item: (item.rank, -item.minutes))
    if not candidates:
        return None
    return candidates[0]


def pack_session(catalog: Sequence[CatalogItem], draft: SessionDraft) -> PackedSession:
    """Pack `catalog` into `draft.duration_minutes`. Companion is ignored.

    The result's open minutes are never negative. Pieces that match no selected
    taste are skipped.
    """

    selected = frozenset(draft.seed_ids)
    used: set[str] = set()
    chosen: list[CatalogItem] = []
    remaining = draft.duration_minutes

    for slot in _shape_for(draft.duration_minutes):
        item = _pick_for_slot(slot, remaining, used, selected, catalog)
        if item is None:
            continue
        chosen.append(item)
        used.add(item.id)
        remaining -= item.minutes

    extras = [item for item in catalog if item.id not in used and taste_score(item, selected) > 0]
    extras.sort(key=lambda item: (-taste_score(item, selected), -item.minutes))
    extra_count = 0
    for item in extras:
        if extra_count >= MAX_EXTRAS:
            break
        if item.minutes > remaining or item.minutes < MIN_EXTRA_MINUTES:
            continue
        chosen.append(item)
        used.add(item.id)
        remaining -= item.minutes
        extra_count += 1

    cursor = 0
    slots: list[PackedSlot] = []
    for item in chosen:
        start_minute = cursor
        cursor += item.minutes
        slots.append(PackedSlot(item.id, start_minute, cursor))

    filled = cursor
    open_minutes = max(0, draft.duration_minutes - filled)
    return PackedSession(tuple(slots), filled, draft.duration_minutes, open_minutes)
