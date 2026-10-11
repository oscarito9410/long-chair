"""Deterministic catalog. Same request, same fictional document. No network."""

import unicodedata
from collections.abc import Sequence
from pathlib import Path

from app.adapters.documents import InsightsDocument
from app.adapters.mapper import map_insights, map_places, map_search, map_tags
from app.adapters.validation import validate_insights, validate_places, validate_search
from app.domain.entities import AvoidTheme, CatalogItem, NearbyPlace
from app.domain.kinds import ContentKind
from app.ports.models import InterestLink, TagHit, TasteHit

FIXTURE_DIR = Path(__file__).resolve().parent / "fixtures"

INSIGHT_FILES: dict[ContentKind, str] = {
    "movie": "insights-movie.json",
    "tv_show": "insights-tv.json",
    "podcast": "insights-podcast.json",
    "book": "insights-book.json",
    "artist": "insights-artist.json",
}


class FakeQlooAdapter:
    """QlooPort backed by committed fictional fixtures."""

    def __init__(self, fixture_dir: Path = FIXTURE_DIR) -> None:
        self._fixture_dir = fixture_dir

    async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]:
        """Return the fixture hit whose name matches `query`, or an empty sequence."""

        validate_search(query, kind)
        document = self._read("search.json")
        needle = _folded(query)
        hits = [hit for hit in map_search(document, kind) if _matches(hit, needle)]
        return tuple(hits)

    async def exclusion_tags(self, themes: Sequence[AvoidTheme]) -> Sequence[TagHit]:
        """Return tag ids for the themes we know. Unknown themes contribute nothing."""

        wanted = {theme.id for theme in themes}
        document = self._read("tags.json")
        return tuple(hit for hit in map_tags(document) if hit.theme_id in wanted)

    async def insights(
        self,
        kind: ContentKind,
        interests: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str] = (),
    ) -> Sequence[CatalogItem]:
        """Fixture neighbors with excluded tags and entity ids removed."""

        validate_insights(kind, interests, exclude_tag_ids, exclude_entity_ids)
        document = self._read(INSIGHT_FILES[kind])
        blocked_tags = set(exclude_tag_ids)
        blocked_ids = set(exclude_entity_ids)
        kept = [
            entity
            for entity in document.results.entities
            if entity.entity_id not in blocked_ids
            and not blocked_tags.intersection(tag.id for tag in entity.properties.tags)
        ]
        filtered = document.model_copy(
            update={"results": document.results.model_copy(update={"entities": kept})}
        )
        return map_insights(filtered, kind, interests)

    async def places(
        self,
        locality: str,
        weekday: str,
        interests: Sequence[InterestLink],
        tag_ids: Sequence[str],
    ) -> Sequence[NearbyPlace]:
        """Fictional places when the query is valid. The locality is not a hospital."""

        validate_places(locality, weekday, interests, tag_ids)
        document = self._read("insights-place.json")
        return map_places(document)

    def _read(self, name: str) -> InsightsDocument:
        path = self._fixture_dir / name
        return InsightsDocument.model_validate_json(path.read_text(encoding="utf-8"))


def _folded(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value)
    plain = "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")
    return plain.casefold().strip()


def _matches(hit: TasteHit, needle: str) -> bool:
    return any(needle in _folded(field) for field in (hit.name, *hit.aliases) if field)
