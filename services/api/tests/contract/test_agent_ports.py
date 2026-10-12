"""Transport/schema errors become typed port failures without echoing provider bodies."""

from uuid import uuid4

import httpx
import pytest


async def test_catalog_protocol_error_is_a_safe_port_failure() -> None:
    from app.adapters.http_qloo import HttpQlooAdapter
    from app.ports.errors import QlooTransportError

    async with httpx.AsyncClient(
        base_url="https://example.invalid",
        transport=httpx.MockTransport(
            lambda request: httpx.Response(200, json={"results": "private malformed document"})
        ),
    ) as client:
        with pytest.raises(QlooTransportError, match="invalid document"):
            await HttpQlooAdapter(api_key=uuid4().hex, client=client).search(
                "The Paper Kite", "movie"
            )


async def test_enrichment_protocol_error_is_a_safe_port_failure() -> None:
    from app.adapters.enrichment import HttpEnrichment
    from app.adapters.fake_qloo import FakeQlooAdapter
    from app.application.agent.arguments import ToolArguments
    from app.application.agent.models import AgentState
    from app.application.agent.tools import AgentTools
    from app.domain.demo_profile import DEMO_DRAFT, TASTES, THEMES
    from app.ports.errors import EnrichmentTransportError

    async with httpx.AsyncClient(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(200, content=b"private malformed json")
        )
    ) as client:
        state = AgentState(DEMO_DRAFT, TASTES, THEMES, "", None)
        toolkit = AgentTools(state, FakeQlooAdapter(), HttpEnrichment(client=client))
        await toolkit.execute(ToolArguments("qloo_search", ("slow-kitchen",)))
        await toolkit.execute(ToolArguments("qloo_insights", ("podcast",)))
        with pytest.raises(EnrichmentTransportError, match="did not answer"):
            await toolkit.enrich()
