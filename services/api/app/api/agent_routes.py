"""Agent HTTP boundary, keeping orchestration and content rules in application."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.present import present_kit
from app.api.routes import UNAVAILABLE, _draft, _error, _locality, _weekday
from app.api.schemas import AgentKitOut, CreateSessionIn, ToolTraceOut
from app.application.agent.build_agent_kit import BuildAgentKit
from app.application.agent.models import AgentLimits
from app.domain.demo_profile import TASTES, THEMES
from app.ports.enrichment import EnrichmentPort
from app.ports.errors import EnrichmentTransportError
from app.ports.llm import LlmPort
from app.ports.qloo import QlooPort


def register_agent_routes(
    app: FastAPI,
    qloo: QlooPort,
    enrichment: EnrichmentPort,
    llm: LlmPort | None,
    limits: AgentLimits,
) -> None:
    """Return the existing kit fields plus a redacted trace and termination reason."""

    @app.exception_handler(EnrichmentTransportError)
    async def on_enrichment(_request: Request, exc: EnrichmentTransportError) -> JSONResponse:
        return _error(UNAVAILABLE, exc.code, exc.message)

    @app.post("/v1/kit/agent", response_model=AgentKitOut)
    async def agent_kit(body: CreateSessionIn) -> AgentKitOut:
        result = await BuildAgentKit(qloo, llm, enrichment, limits=limits).execute(
            _draft(body),
            TASTES,
            THEMES,
            locality=_locality(body.locality),
            weekday=_weekday(body.weekday),
        )
        kit = present_kit(result.kit, app.state.qloo_mode)
        return AgentKitOut(
            **kit.model_dump(),
            trace=[
                ToolTraceOut(
                    step=entry.step,
                    tool=entry.tool,
                    args_summary=entry.args_summary,
                    result_count=entry.result_count,
                    latency_ms=entry.latency_ms,
                    status=entry.status,
                )
                for entry in result.trace
            ],
            termination=result.termination,
        )
