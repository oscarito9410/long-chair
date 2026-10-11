"""Record or replay raw catalog documents. Replay never opens a network connection."""

import hashlib
from collections.abc import Sequence
from typing import Literal

import httpx

from app.adapters.http_qloo import QLOO_HOST, REQUEST_TIMEOUT_SECONDS, HttpQlooAdapter
from app.domain.entities import AvoidTheme, CatalogItem, NearbyPlace
from app.domain.kinds import ContentKind
from app.ports.cache import CachePort
from app.ports.errors import CacheMiss
from app.ports.models import InterestLink, TagHit, TasteHit

HTTP_OK = 200
RecordMode = Literal["live", "replay"]


def cache_key(method: str, url: str) -> str:
    """Hash of the method and the canonical URL. The title is inside the hash, not the name."""

    payload = f"{method} {url}".encode()
    return hashlib.sha256(payload).hexdigest()


class RecordingTransport(httpx.AsyncBaseTransport):
    """Transport decorator. Live stores success bodies. Replay does not call inner."""

    def __init__(
        self,
        inner: httpx.AsyncBaseTransport,
        cache: CachePort,
        mode: RecordMode,
    ) -> None:
        self._inner = inner
        self._cache = cache
        self._mode = mode

    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        """Serve from the cache in replay. In live, call inner and store a success body."""

        key = cache_key(request.method, str(request.url))
        if self._mode == "replay":
            body = self._cache.get(key)
            if body is None:
                raise CacheMiss("The replay cache has no answer for this request.")
            return httpx.Response(HTTP_OK, content=body, request=request)
        response = await self._inner.handle_async_request(request)
        if response.status_code == HTTP_OK:
            await response.aread()
            self._cache.put(key, response.content)
        return response


class RecordingQlooAdapter:
    """QlooPort that records live documents or replays them after the key is gone."""

    def __init__(
        self,
        *,
        mode: RecordMode,
        cache: CachePort,
        api_key: str,
        inner: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        transport = RecordingTransport(inner or httpx.AsyncHTTPTransport(), cache, mode)
        client = httpx.AsyncClient(
            transport=transport,
            base_url=QLOO_HOST,
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
        self._http = HttpQlooAdapter(api_key=api_key, client=client)

    async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]:
        """Search through the recording transport."""

        return await self._http.search(query, kind)

    async def exclusion_tags(self, themes: Sequence[AvoidTheme]) -> Sequence[TagHit]:
        """Resolve tags through the recording transport."""

        return await self._http.exclusion_tags(themes)

    async def insights(
        self,
        kind: ContentKind,
        interests: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str] = (),
    ) -> Sequence[CatalogItem]:
        """Insights through the recording transport."""

        return await self._http.insights(kind, interests, exclude_tag_ids, exclude_entity_ids)

    async def places(
        self,
        locality: str,
        weekday: str,
        interests: Sequence[InterestLink],
        tag_ids: Sequence[str],
    ) -> Sequence[NearbyPlace]:
        """Places through the recording transport."""

        return await self._http.places(locality, weekday, interests, tag_ids)
