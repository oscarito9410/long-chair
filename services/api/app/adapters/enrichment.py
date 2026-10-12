"""Fake and HTTP enrichment. The fake path is the default and never calls the network."""

import asyncio
import json
import time
from collections.abc import Sequence
from pathlib import Path
from urllib.parse import quote

import httpx

from app.domain.entities import CatalogItem
from app.domain.kinds import ContentKind, DurationSource
from app.ports.enrichment import Enrichment
from app.ports.errors import EnrichmentTransportError

FIXTURE_PATH = Path(__file__).resolve().parent / "fixtures" / "enrichment.json"
ITUNES_SEARCH = "https://itunes.apple.com/search"
TMDB_FIND = "https://api.themoviedb.org/3/find"
SPOTIFY_SEARCH = "https://open.spotify.com/search/"
ITUNES_MIN_INTERVAL_SECONDS = 3.0
HTTP_OK = 200


class FakeEnrichment:
    """Sample episodes, albums, and links keyed by our entity id."""

    def __init__(self, path: Path = FIXTURE_PATH) -> None:
        raw = json.loads(path.read_text(encoding="utf-8"))
        self._rows: dict[str, Enrichment] = {}
        if isinstance(raw, dict):
            items = raw.get("items")
            if isinstance(items, dict):
                for entity_id, row in items.items():
                    if isinstance(entity_id, str) and isinstance(row, dict):
                        self._rows[entity_id] = _from_row(row)

    async def for_item(self, item: CatalogItem) -> Enrichment:
        return self._rows.get(item.qloo_entity_id, Enrichment())


class HttpEnrichment:
    """iTunes, TMDB, and Open Library. TMDB stays quiet without TMDB_API_KEY."""

    def __init__(
        self,
        *,
        tmdb_api_key: str = "",
        open_library: bool = False,
        client: httpx.AsyncClient | None = None,
    ) -> None:
        self._tmdb_api_key = tmdb_api_key.strip()
        self._open_library = open_library
        self._client = client or httpx.AsyncClient(timeout=8)
        self._cache: dict[str, Enrichment] = {}
        self._next_itunes = 0.0

    async def for_item(self, item: CatalogItem) -> Enrichment:
        cached = self._cache.get(item.qloo_entity_id)
        if cached is not None:
            return cached
        try:
            extra = await self._lookup(item)
        except (httpx.HTTPError, ValueError) as exc:
            raise EnrichmentTransportError() from exc
        self._cache[item.qloo_entity_id] = extra
        return extra

    async def _lookup(self, item: CatalogItem) -> Enrichment:
        if item.kind == "podcast":
            return await self._itunes(item, "podcastEpisode", "Open in Apple Podcasts")
        if item.kind == "artist":
            album = await self._itunes(item, "album", "Open in Apple Music")
            spotify = ("Search in Spotify", f"{SPOTIFY_SEARCH}{quote(item.title)}")
            return Enrichment(
                minutes=album.minutes,
                duration_source=album.duration_source,
                duration_note=album.duration_note,
                title=album.title,
                links=(*album.links, spotify),
            )
        if item.kind in {"movie", "tv_show"} and self._tmdb_api_key:
            return await self._tmdb(item)
        if item.kind == "book" and self._open_library:
            search = f"https://openlibrary.org/search?q={quote(item.title)}"
            return Enrichment(links=(("Open in Open Library", search),))
        return Enrichment()

    async def _itunes(self, item: CatalogItem, entity: str, label: str) -> Enrichment:
        await self._throttle()
        params = {"term": item.title, "entity": entity, "limit": "5"}
        response = await self._client.get(ITUNES_SEARCH, params=params)
        if response.status_code != HTTP_OK:
            return Enrichment()
        payload = response.json()
        results = payload.get("results") if isinstance(payload, dict) else None
        if not isinstance(results, list):
            return Enrichment()
        return _itunes_pick(results, label)

    async def _tmdb(self, item: CatalogItem) -> Enrichment:
        kind: ContentKind = item.kind
        params = {"api_key": self._tmdb_api_key, "external_source": "imdb_id"}
        url = f"{TMDB_FIND}/{quote(item.qloo_entity_id)}"
        response = await self._client.get(url, params=params)
        if response.status_code != HTTP_OK:
            return Enrichment()
        payload = response.json()
        if not isinstance(payload, dict):
            return Enrichment()
        return _tmdb_pick(payload, kind)

    async def _throttle(self) -> None:
        wait = self._next_itunes - time.monotonic()
        if wait > 0:
            await asyncio.sleep(wait)
        self._next_itunes = time.monotonic() + ITUNES_MIN_INTERVAL_SECONDS


def _from_row(row: dict[str, object]) -> Enrichment:
    minutes = row.get("minutes")
    source = row.get("durationSource")
    links = _links(row.get("links"))
    providers = row.get("watchProviders")
    title = row.get("title")
    note = row.get("durationNote")
    if source == "confirmed":
        duration_source: DurationSource | None = "confirmed"
    elif source == "estimated":
        duration_source = "estimated"
    else:
        duration_source = None
    return Enrichment(
        minutes=minutes if isinstance(minutes, int) else None,
        duration_source=duration_source,
        duration_note=note if isinstance(note, str) else "",
        title=title if isinstance(title, str) and title else None,
        links=links,
        watch_providers=tuple(name for name in providers if isinstance(name, str))
        if isinstance(providers, list)
        else (),
    )


def _links(value: object) -> tuple[tuple[str, str], ...]:
    if not isinstance(value, list):
        return ()
    found: list[tuple[str, str]] = []
    for row in value:
        if isinstance(row, dict):
            label = row.get("label")
            href = row.get("href")
            if isinstance(label, str) and isinstance(href, str):
                found.append((label, href))
    return tuple(found)


def _itunes_pick(results: Sequence[object], label: str) -> Enrichment:
    for row in results:
        if not isinstance(row, dict):
            continue
        millis = row.get("trackTimeMillis")
        view = row.get("trackViewUrl") or row.get("collectionViewUrl")
        if not isinstance(millis, int) or millis <= 0 or not isinstance(view, str):
            continue
        name = row.get("trackName") or row.get("collectionName")
        title = name if isinstance(name, str) else None
        return Enrichment(
            minutes=max(1, round(millis / 60_000)),
            duration_source="confirmed",
            duration_note="Length from iTunes.",
            title=title,
            links=((label, view),),
        )
    return Enrichment()


def _tmdb_pick(payload: dict[str, object], kind: ContentKind) -> Enrichment:
    key = "movie_results" if kind == "movie" else "tv_results"
    rows = payload.get(key)
    if not isinstance(rows, list) or not rows or not isinstance(rows[0], dict):
        return Enrichment()
    first = rows[0]
    runtime = first.get("runtime")
    providers = first.get("watch_providers")
    names: tuple[str, ...] = ()
    if isinstance(providers, list):
        names = tuple(name for name in providers if isinstance(name, str))
    minutes = runtime if isinstance(runtime, int) and runtime > 0 else None
    return Enrichment(
        minutes=minutes,
        duration_source="confirmed" if minutes else None,
        duration_note="Runtime from TMDB." if minutes else "",
        watch_providers=names,
    )
