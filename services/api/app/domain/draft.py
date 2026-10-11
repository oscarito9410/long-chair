"""Validate a draft and resolve its ids against the taste and theme catalogs."""

from collections.abc import Sequence

from app.domain.entities import AvoidTheme, SessionDraft, TasteSeed
from app.domain.errors import DraftError
from app.domain.limits import CHAIR_MAX_MINUTES, CHAIR_MIN_MINUTES, CHAIR_STEP_MINUTES


def allowed_durations() -> tuple[int, ...]:
    """Dial lengths in minutes, inclusive, stepping by `CHAIR_STEP_MINUTES`."""

    return tuple(range(CHAIR_MIN_MINUTES, CHAIR_MAX_MINUTES + 1, CHAIR_STEP_MINUTES))


def validate_draft(draft: SessionDraft) -> None:
    """Refuse an empty taste list, an off-dial length, or a blank companion id.

    Raises:
        DraftError: The draft cannot be stored or planned.
    """

    if not draft.seed_ids:
        raise DraftError("empty_tastes", "Choose at least one taste.")
    if draft.duration_minutes not in allowed_durations():
        raise DraftError("invalid_duration", "Chair length must be on the dial, from 1 to 4 hours.")
    if not draft.companion_id.strip():
        raise DraftError("invalid_companion", "Choose a companion.")
    if len(set(draft.seed_ids)) != len(draft.seed_ids):
        raise DraftError("duplicate_taste", "Each taste can be chosen once.")


def resolve_tastes(draft: SessionDraft, catalog: Sequence[TasteSeed]) -> tuple[TasteSeed, ...]:
    """Return the chosen tastes in draft order.

    Raises:
        DraftError: A seed id is not in `catalog`.
    """

    by_id = {taste.id: taste for taste in catalog}
    chosen: list[TasteSeed] = []
    for seed_id in draft.seed_ids:
        taste = by_id.get(seed_id)
        if taste is None:
            raise DraftError("unknown_taste", "That taste is not on the shelf.")
        chosen.append(taste)
    return tuple(chosen)


def resolve_themes(draft: SessionDraft, catalog: Sequence[AvoidTheme]) -> tuple[AvoidTheme, ...]:
    """Return the held-out themes in draft order.

    Raises:
        DraftError: A theme id is not in `catalog`.
    """

    by_id = {theme.id: theme for theme in catalog}
    chosen: list[AvoidTheme] = []
    for theme_id in draft.avoid_ids:
        theme = by_id.get(theme_id)
        if theme is None:
            raise DraftError("unknown_theme", "That theme is not one we can hold out.")
        chosen.append(theme)
    return tuple(chosen)
