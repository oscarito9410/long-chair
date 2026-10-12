"""Live catalog client. Validates, then sends. Does not record bodies."""

import asyncio
from collections.abc import Sequence

import httpx
from pydantic import BaseModel, ValidationError

from app.adapters.documents import InsightsDocument, SearchDocument
from app.adapters.mapper import map_insights, map_places, map_search, map_tags
from app.adapters.queries import insights_params, place_params, search_params, tag_params
from app.adapters.validation import validate_insights, validate_places, validate_search
from app.domain.entities import AvoidTheme, CatalogItem, NearbyPlace
from app.domain.kinds import ContentKind
from app.ports.errors import QlooTransportError
from app.ports.models import InterestLink, TagHit, TasteHit

QLOO_HOST = "https://hackathon.api.qloo.com"
SEARCH_PATH = "/search"
INSIGHTS_PATH = "/v2/insights"
TAGS_PATH = "/v2/tags"
HTTP_OK = 200
HTTP_TOO_MANY = 429
HTTP_UNAUTHORIZED = 401
HTTP_FORBIDDEN = 403
MAX_ATTEMPTS = 3
FIRST_BACKOFF_SECONDS = 0.25
BACKOFF_FACTOR = 2
REQUEST_TIMEOUT_SECONDS = 8


class HttpQlooAdapter:
    """QlooPort over HTTPS. The key stays in memory on this process."""

    def __init__(self, *, api_key: str, client: httpx.AsyncClient | None = None) -> None:
        self._api_key = api_key
        self._client = client or httpx.AsyncClient(
            base_url=QLOO_HOST,
            timeout=REQUEST_TIMEOUT_SECONDS,
        )

    async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]:
        """Search by title. An empty entity list is a real miss."""

        validate_search(query, kind)
        document = _decode(
            SearchDocument, await self._get_body(SEARCH_PATH, search_params(query, kind))
        )
        return map_search(document.results, kind)

    async def exclusion_tags(self, themes: Sequence[AvoidTheme]) -> Sequence[TagHit]:
        """Resolve each theme label. The tag query parameter name is unconfirmed."""

        found: list[TagHit] = []
        for theme in themes:
            document = _decode(
                InsightsDocument, await self._get_body(TAGS_PATH, tag_params(theme.label))
            )
            found.extend(hit for hit in map_tags(document.results.tags) if hit.theme_id == theme.id)
        return tuple(found)

    async def insights(
        self,
        kind: ContentKind,
        interests: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str] = (),
    ) -> Sequence[CatalogItem]:
        """Insights for one kind. Explainability is requested on every call."""

        validate_insights(kind, interests, exclude_tag_ids, exclude_entity_ids)
        params = insights_params(kind, interests, exclude_tag_ids, exclude_entity_ids)
        document = _decode(InsightsDocument, await self._get_body(INSIGHTS_PATH, params))
        return map_insights(document.results.entities, kind, interests)

    async def places(
        self,
        locality: str,
        weekday: str,
        interests: Sequence[InterestLink],
        tag_ids: Sequence[str],
    ) -> Sequence[NearbyPlace]:
        """Places near a locality. Invalid hours raise before the request."""

        validate_places(locality, weekday, interests, tag_ids)
        params = place_params(locality, weekday, interests, tag_ids)
        document = _decode(InsightsDocument, await self._get_body(INSIGHTS_PATH, params))
        return map_places(document.results.entities)

    async def _get_body(self, path: str, params: Sequence[tuple[str, str]]) -> bytes:
        if not self._api_key.strip():
            raise QlooTransportError("The catalog key is not configured.")
        response = await self._send(path, params)
        if response.status_code in {HTTP_UNAUTHORIZED, HTTP_FORBIDDEN}:
            raise QlooTransportError("The catalog key was refused.")
        if response.status_code != HTTP_OK:
            raise QlooTransportError("The catalog did not answer.")
        return response.content

    async def _send(self, path: str, params: Sequence[tuple[str, str]]) -> httpx.Response:
        delay = FIRST_BACKOFF_SECONDS
        headers = {"X-Api-Key": self._api_key}
        for attempt in range(MAX_ATTEMPTS):
            try:
                response = await self._client.get(path, params=list(params), headers=headers)
            except httpx.HTTPError as exc:
                if attempt + 1 == MAX_ATTEMPTS:
                    raise QlooTransportError("The catalog connection failed.") from exc
                await asyncio.sleep(delay)
                delay *= BACKOFF_FACTOR
                continue
            if response.status_code == HTTP_TOO_MANY and attempt + 1 < MAX_ATTEMPTS:
                await asyncio.sleep(delay)
                delay *= BACKOFF_FACTOR
                continue
            return response
        raise QlooTransportError("The catalog did not answer.")


def _decode[Document: BaseModel](model: type[Document], body: bytes) -> Document:
    """Convert provider schema errors into a safe port failure the agent can recover from."""

    try:
        return model.model_validate_json(body)
    except ValidationError as exc:
        raise QlooTransportError("The catalog returned an invalid document.") from exc
