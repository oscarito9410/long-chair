"""BuildSessionKit against the fake catalog and a stub that forces the checker."""

from collections.abc import Sequence

import pytest
from app.adapters.enrichment import FakeEnrichment
from app.adapters.fake_qloo import FakeQlooAdapter
from app.application.build_session_kit import BuildSessionKit
from app.application.checker import rejects
from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES, demo_locality, demo_weekday
from app.domain.entities import AvoidTheme, CatalogItem, NearbyPlace, SessionDraft
from app.domain.errors import DraftError
from app.domain.kinds import ContentKind
from app.domain.limits import LONG_CHAIR_MINUTES
from app.ports.models import InterestLink, TagHit, TasteHit

PAPER = "00000000-0000-4000-8000-000000000010"
DIRTY = "00000000-0000-4000-8000-000000000099"
CLEAN = "00000000-0000-4000-8000-000000000001"


def _item(
    entity_id: str,
    *,
    themes: tuple[str, ...] = (),
    synopsis: str = "A quiet hour.",
) -> CatalogItem:
    return CatalogItem(
        id=entity_id,
        qloo_entity_id=entity_id,
        kind="movie",
        title=entity_id,
        maker="",
        minutes=90,
        rank=1,
        synopsis=synopsis,
        why="Because you love The Paper Kite",
        because_of=("paper-kite",),
        avoided_theme_ids=themes,
        duration_source="confirmed",
    )


class StubCatalog:
    """Returns a held-out movie once, then a clean one if that id is excluded."""

    def __init__(self, second_still_dirty: bool = False) -> None:
        self.calls: list[tuple[str, tuple[str, ...]]] = []
        self._second_still_dirty = second_still_dirty

    async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]:
        return (TasteHit(query, kind, "detail", PAPER),)

    async def exclusion_tags(self, themes: Sequence[AvoidTheme]) -> Sequence[TagHit]:
        return tuple(
            TagHit(theme.id, f"urn:tag:keyword:media:fictional_{theme.id}", theme.label)
            for theme in themes
        )

    async def insights(
        self,
        kind: ContentKind,
        interests: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str] = (),
    ) -> Sequence[CatalogItem]:
        del interests, exclude_tag_ids
        self.calls.append((kind, tuple(exclude_entity_ids)))
        if kind != "movie":
            return ()
        if exclude_entity_ids:
            if self._second_still_dirty:
                return (_item(DIRTY, themes=("illness",)),)
            return (_item(CLEAN),)
        return (_item(DIRTY, themes=("illness",)), _item(CLEAN))

    async def places(
        self,
        locality: str,
        weekday: str,
        interests: Sequence[InterestLink],
        tag_ids: Sequence[str],
    ) -> Sequence[NearbyPlace]:
        del locality, weekday, interests, tag_ids
        return ()


def _one_taste() -> SessionDraft:
    return SessionDraft(("paper-kite",), ("illness",), 120, "pebble")


@pytest.mark.asyncio
async def test_fake_demo_fills_the_chair() -> None:
    kit = await BuildSessionKit(FakeQlooAdapter(), enrichment=FakeEnrichment()).execute(
        DEMO_DRAFT,
        TASTES,
        THEMES,
        locality=demo_locality(),
        weekday=demo_weekday(),
    )
    assert [item.id for item in kit.items] == [
        "north-window",
        "blue-buoy",
        "bread-tuesday",
        "cedar-hall",
        "market-morning",
    ]
    assert kit.packed.filled_minutes == LONG_CHAIR_MINUTES
    assert kit.packed.open_minutes == 0
    assert kit.items[0].why == "Because you love The Paper Kite"
    assert kit.items[0].duration_source == "confirmed"
    assert kit.items[1].duration_source == "confirmed"
    by_id = {item.id: item for item in kit.items}
    assert by_id["bread-tuesday"].duration_source == "confirmed"
    assert by_id["bread-tuesday"].minutes == 36
    assert by_id["market-morning"].duration_source == "estimated"
    assert "page count" in by_id["market-morning"].duration_note.casefold()
    assert by_id["cedar-hall"].links
    assert kit.places[0].open_until == ""
    assert kit.places[0].walk_minutes == 6
    assert len(kit.places) == 3
    assert len(kit.topics) == 5


@pytest.mark.asyncio
async def test_checker_asks_once_more_and_drops_the_theme() -> None:
    catalog = StubCatalog()
    kit = await BuildSessionKit(catalog).execute(
        _one_taste(),
        TASTES,
        THEMES,
        locality="",
        weekday=None,
    )
    movie_calls = [call for call in catalog.calls if call[0] == "movie"]
    assert len(movie_calls) == 2
    assert movie_calls[1][1] == (DIRTY,)
    other_kinds = ("tv_show", "podcast", "book", "artist")
    counts = [len([call for call in catalog.calls if call[0] == kind]) for kind in other_kinds]
    assert counts == [1, 1, 1, 1]
    assert [item.id for item in kit.items] == [CLEAN]
    assert kit.places == ()


@pytest.mark.asyncio
async def test_second_failure_is_dropped() -> None:
    catalog = StubCatalog(second_still_dirty=True)
    kit = await BuildSessionKit(catalog).execute(
        _one_taste(),
        TASTES,
        THEMES,
        locality="",
        weekday=None,
    )
    assert kit.items == ()
    assert kit.packed.open_minutes == 120


@pytest.mark.asyncio
async def test_unresolved_title_is_refused() -> None:
    class EmptySearch(StubCatalog):
        async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]:
            del query, kind
            return ()

    with pytest.raises(DraftError) as caught:
        await BuildSessionKit(EmptySearch()).execute(
            _one_taste(),
            TASTES,
            THEMES,
            locality="",
            weekday=None,
        )
    assert caught.value.code == "unresolved_taste"


@pytest.mark.asyncio
async def test_optional_prose_rewrites_the_line() -> None:
    class Shout:
        async def rewrite(self, text: str) -> str:
            return text + " Still fictional."

    kit = await BuildSessionKit(StubCatalog(), Shout()).execute(
        _one_taste(),
        TASTES,
        THEMES,
        locality="",
        weekday=None,
    )
    assert kit.items[0].why.endswith("Still fictional.")


def test_synopsis_phrase_is_a_rejection() -> None:
    item = _item(CLEAN, synopsis="A story where Illness is the plot.")
    assert rejects(item, (THEMES[0],)) is True
    assert rejects(_item(CLEAN, synopsis="A greenhouse in summer."), (THEMES[0],)) is False
