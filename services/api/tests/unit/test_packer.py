"""Packer rules copied from the prototype. Companion is not an input that changes the kit."""

from app.domain.entities import CatalogItem, SessionDraft
from app.domain.kinds import ContentKind
from app.domain.limits import LONG_CHAIR_MINUTES, MIN_EXTRA_MINUTES
from app.domain.packer import pack_session

COMPANION = "pebble"
OTHER_COMPANION = "lumen"


def _item(
    item_id: str,
    kind: ContentKind,
    minutes: int,
    rank: int,
    seed: str,
) -> CatalogItem:
    return CatalogItem(
        id=item_id,
        qloo_entity_id=item_id,
        kind=kind,
        title=item_id,
        maker="",
        minutes=minutes,
        rank=rank,
        synopsis="",
        why="",
        because_of=(seed,),
        avoided_theme_ids=(),
        duration_source="assumed",
    )


def _demo_catalog() -> tuple[CatalogItem, ...]:
    return (
        _item("north-window", "movie", 108, 1, "paper-kite"),
        _item("blue-buoy", "tv_show", 44, 1, "harbor-lights"),
        _item("bread-tuesday", "podcast", 36, 1, "slow-kitchen"),
        _item("cedar-hall", "artist", 28, 1, "mira-solano"),
        _item("market-morning", "book", 24, 1, "salt-windowlight"),
    )


def _draft(companion: str) -> SessionDraft:
    return SessionDraft(
        seed_ids=("paper-kite", "harbor-lights", "slow-kitchen", "mira-solano", "salt-windowlight"),
        avoid_ids=("illness",),
        duration_minutes=LONG_CHAIR_MINUTES,
        companion_id=companion,
    )


def test_four_hour_demo_fills_exactly() -> None:
    packed = pack_session(_demo_catalog(), _draft(COMPANION))
    assert [slot.item_id for slot in packed.slots] == [
        "north-window",
        "blue-buoy",
        "bread-tuesday",
        "cedar-hall",
        "market-morning",
    ]
    assert packed.filled_minutes == LONG_CHAIR_MINUTES
    assert packed.open_minutes == 0
    assert packed.slots[0].start_minute == 0
    assert packed.slots[-1].end_minute == LONG_CHAIR_MINUTES


def test_companion_does_not_change_the_schedule() -> None:
    catalog = _demo_catalog()
    first = pack_session(catalog, _draft(COMPANION))
    second = pack_session(catalog, _draft(OTHER_COMPANION))
    assert first.slots == second.slots


def test_short_piece_is_not_used_as_an_extra() -> None:
    short = _item("crumb", "podcast", MIN_EXTRA_MINUTES - 1, 2, "slow-kitchen")
    too_long = _item("feast", "book", 50, 2, "salt-windowlight")
    draft = SessionDraft(
        seed_ids=("slow-kitchen",),
        avoid_ids=(),
        duration_minutes=60,
        companion_id=COMPANION,
    )
    primary = _item("bread-tuesday", "podcast", 36, 1, "slow-kitchen")
    packed = pack_session((primary, short, too_long), draft)
    assert [slot.item_id for slot in packed.slots] == ["bread-tuesday"]
    assert packed.open_minutes == 24


def test_unmatched_taste_leaves_the_chair_open() -> None:
    draft = SessionDraft(
        seed_ids=("sunday-engines",),
        avoid_ids=(),
        duration_minutes=LONG_CHAIR_MINUTES,
        companion_id=COMPANION,
    )
    packed = pack_session(_demo_catalog(), draft)
    assert packed.slots == ()
    assert packed.open_minutes == LONG_CHAIR_MINUTES
