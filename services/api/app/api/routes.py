"""Session kit routes. Packing stays in the use case."""

import logging
import unicodedata
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.present import present_kit
from app.api.schemas import (
    CreateSessionIn,
    DemoIn,
    ErrorDetail,
    ErrorOut,
    HealthOut,
    SessionCreatedOut,
    SessionKitOut,
    TasteHitOut,
    TasteSearchOut,
)
from app.application.build_session_kit import BuildSessionKit
from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES, demo_locality, demo_weekday
from app.domain.draft import resolve_tastes, resolve_themes, validate_draft
from app.domain.entities import SessionDraft
from app.domain.errors import DraftError
from app.domain.kinds import CONTENT_KINDS, WEEKDAYS, Weekday
from app.domain.limits import LOCALITY_MAX_CHARS
from app.ports.enrichment import EnrichmentPort
from app.ports.errors import CacheMiss, QlooTransportError, QlooValidationError
from app.ports.models import TasteHit
from app.ports.qloo import QlooPort

logger = logging.getLogger(__name__)

CREATED = 201
UNPROCESSABLE = 422
NOT_FOUND = 404
UNAVAILABLE = 503
TASTE_QUERY_MIN = 2
TASTE_RESULT_LIMIT = 8
TASTE_KINDS = {"artist", "show", "film", "book", "podcast", "game", "tag"}
TASTE_KIND_BY_CONTENT = {
    "movie": "film",
    "tv_show": "show",
    "podcast": "podcast",
    "book": "book",
    "artist": "artist",
}


class SessionNotFoundError(Exception):
    """A plan was asked for a session id this process does not have."""


def register_routes(app: FastAPI, qloo: QlooPort, enrichment: EnrichmentPort) -> None:
    """Attach the kit routes. `qloo` is the process-wide catalog adapter."""

    sessions: dict[str, tuple[SessionDraft, str, Weekday | None]] = {}

    @app.get("/v1/health", response_model=HealthOut)
    async def health() -> HealthOut:
        return HealthOut(ok=True, qloo_mode=str(app.state.qloo_mode))

    @app.post("/v1/demo/plan", response_model=SessionKitOut)
    async def demo_plan(_body: DemoIn | None = None) -> SessionKitOut:
        kit = await BuildSessionKit(qloo, enrichment=enrichment).execute(
            DEMO_DRAFT,
            TASTES,
            THEMES,
            locality=demo_locality(),
            weekday=demo_weekday(),
        )
        logger.info("plan source=%s slots=%s", app.state.qloo_mode, len(kit.packed.slots))
        return present_kit(kit, app.state.qloo_mode)

    @app.post("/v1/sessions", response_model=SessionCreatedOut, status_code=CREATED)
    async def create_session(body: CreateSessionIn) -> SessionCreatedOut:
        draft = _draft(body)
        validate_draft(draft)
        resolve_tastes(draft, TASTES)
        resolve_themes(draft, THEMES)
        locality = _locality(body.locality)
        weekday = _weekday(body.weekday)
        session_id = str(uuid4())
        sessions[session_id] = (draft, locality, weekday)
        return SessionCreatedOut(session_id=session_id)

    @app.post("/v1/sessions/{session_id}/plan", response_model=SessionKitOut)
    async def plan_session(session_id: str) -> SessionKitOut:
        stored = sessions.get(session_id)
        if stored is None:
            raise SessionNotFoundError
        draft, locality, weekday = stored
        kit = await BuildSessionKit(qloo, enrichment=enrichment).execute(
            draft,
            TASTES,
            THEMES,
            locality=locality,
            weekday=weekday,
        )
        logger.info("plan source=%s slots=%s", app.state.qloo_mode, len(kit.packed.slots))
        return present_kit(kit, app.state.qloo_mode)

    @app.get("/v1/tastes/search", response_model=TasteSearchOut)
    async def search_tastes(q: str = "") -> TasteSearchOut:
        return await collect_taste_hits(qloo, q, str(app.state.qloo_mode))


def _draft(body: CreateSessionIn) -> SessionDraft:
    draft = body.draft
    return SessionDraft(
        seed_ids=tuple(draft.seed_ids),
        avoid_ids=tuple(draft.avoid_ids),
        duration_minutes=draft.duration_minutes,
        companion_id=draft.companion_id,
    )


def _locality(value: str | None) -> str:
    text = (value or "").strip()
    if len(text) > LOCALITY_MAX_CHARS:
        raise DraftError("invalid_locality", "Locality must be a neighborhood name.")
    return text


def _folded_query(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value)
    plain = "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")
    return plain.casefold().strip()


def _taste_kind(hit: TasteHit) -> str:
    custom = hit.taste_kind.strip()
    if custom in TASTE_KINDS:
        return custom
    return TASTE_KIND_BY_CONTENT[hit.kind]


def _taste_row(hit: TasteHit) -> TasteHitOut:
    return TasteHitOut(
        id=hit.slug or hit.qloo_entity_id,
        name=hit.name,
        kind=_taste_kind(hit),
        detail=hit.detail,
    )


async def collect_taste_hits(qloo: QlooPort, query: str, source: str) -> TasteSearchOut:
    """Search every content kind through the catalog port. Short text is an empty list."""

    if len(_folded_query(query)) < TASTE_QUERY_MIN:
        return TasteSearchOut(results=[], source=source)
    results: list[TasteHitOut] = []
    seen: set[str] = set()
    for kind in CONTENT_KINDS:
        for hit in await qloo.search(query, kind):
            row = _taste_row(hit)
            if row.id in seen:
                continue
            seen.add(row.id)
            results.append(row)
            if len(results) >= TASTE_RESULT_LIMIT:
                return TasteSearchOut(results=results, source=source)
    return TasteSearchOut(results=results, source=source)


def _weekday(value: str | None) -> Weekday | None:
    if value is None or not value.strip():
        return None
    for day in WEEKDAYS:
        if day == value:
            return day
    raise DraftError("invalid_weekday", "Weekday must be a day name.")


def install_error_handlers(app: FastAPI) -> None:
    """Map domain and port errors onto the shared error body."""

    @app.exception_handler(DraftError)
    async def on_draft(_request: Request, exc: DraftError) -> JSONResponse:
        return _error(UNPROCESSABLE, exc.code, exc.message)

    @app.exception_handler(QlooValidationError)
    async def on_query(_request: Request, exc: QlooValidationError) -> JSONResponse:
        return _error(UNPROCESSABLE, exc.code, exc.message)

    @app.exception_handler(QlooTransportError)
    async def on_transport(_request: Request, exc: QlooTransportError) -> JSONResponse:
        return _error(UNAVAILABLE, exc.code, exc.message)

    @app.exception_handler(CacheMiss)
    async def on_miss(_request: Request, exc: CacheMiss) -> JSONResponse:
        return _error(UNAVAILABLE, exc.code, exc.message)

    @app.exception_handler(SessionNotFoundError)
    async def on_session(_request: Request, _exc: SessionNotFoundError) -> JSONResponse:
        return _error(NOT_FOUND, "not_found", "That session was not found.")

    @app.exception_handler(RequestValidationError)
    async def on_body(_request: Request, _exc: RequestValidationError) -> JSONResponse:
        return _error(
            UNPROCESSABLE,
            "invalid_body",
            "The request body is not a valid session draft.",
        )


def _error(status: int, code: str, message: str) -> JSONResponse:
    body = ErrorOut(error=ErrorDetail(code=code, message=message))
    return JSONResponse(status_code=status, content=body.model_dump())
