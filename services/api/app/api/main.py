"""ASGI entrypoint. `uvicorn app.api.main:app`."""

import os

from fastapi import FastAPI

from app.api.agent_routes import register_agent_routes
from app.api.composition import (
    DEFAULT_MODE,
    build_agent_limits,
    build_enrichment,
    build_llm,
    build_qloo,
)
from app.api.routes import install_error_handlers, register_routes
from app.application.agent.models import AgentLimits
from app.ports.enrichment import EnrichmentPort
from app.ports.llm import LlmPort
from app.ports.qloo import QlooPort


def create_app(
    qloo: QlooPort | None = None,
    mode: str | None = None,
    enrichment: EnrichmentPort | None = None,
    *,
    llm: LlmPort | None = None,
    agent_limits: AgentLimits | None = None,
) -> FastAPI:
    """Build the app. Tests pass a fake port. The process default reads QLOO_MODE."""

    resolved = mode if mode is not None else os.environ.get("QLOO_MODE", DEFAULT_MODE)
    catalog = qloo if qloo is not None else build_qloo(resolved)
    enricher = enrichment if enrichment is not None else build_enrichment()
    app = FastAPI(title="Long Chair API")
    app.state.qloo_mode = resolved
    install_error_handlers(app)
    register_routes(app, catalog, enricher)
    register_agent_routes(
        app,
        catalog,
        enricher,
        llm if llm is not None else build_llm(),
        agent_limits if agent_limits is not None else build_agent_limits(),
    )
    return app


app = create_app()
