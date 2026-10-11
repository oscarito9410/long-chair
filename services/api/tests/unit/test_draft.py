"""Draft rules refuse an off-dial chair and unknown shelf ids."""

import pytest
from app.domain.demo_profile import TASTES, THEMES
from app.domain.draft import resolve_tastes, resolve_themes, validate_draft
from app.domain.entities import SessionDraft
from app.domain.errors import DraftError


def _draft(
    seed_ids: tuple[str, ...] = ("paper-kite",),
    avoid_ids: tuple[str, ...] = (),
    duration_minutes: int = 120,
    companion_id: str = "pebble",
) -> SessionDraft:
    return SessionDraft(seed_ids, avoid_ids, duration_minutes, companion_id)


def test_off_dial_length_is_refused() -> None:
    with pytest.raises(DraftError) as caught:
        validate_draft(_draft(duration_minutes=45))
    assert caught.value.code == "invalid_duration"


def test_empty_tastes_are_refused() -> None:
    with pytest.raises(DraftError) as caught:
        validate_draft(_draft(seed_ids=()))
    assert caught.value.code == "empty_tastes"


def test_unknown_taste_is_refused() -> None:
    draft = _draft(seed_ids=("not-a-film",))
    validate_draft(draft)
    with pytest.raises(DraftError) as caught:
        resolve_tastes(draft, TASTES)
    assert caught.value.code == "unknown_taste"


def test_unknown_theme_is_refused() -> None:
    draft = _draft(avoid_ids=("chart",))
    with pytest.raises(DraftError) as caught:
        resolve_themes(draft, THEMES)
    assert caught.value.code == "unknown_theme"


def test_duplicate_taste_is_refused() -> None:
    with pytest.raises(DraftError) as caught:
        validate_draft(_draft(seed_ids=("paper-kite", "paper-kite")))
    assert caught.value.code == "duplicate_taste"
