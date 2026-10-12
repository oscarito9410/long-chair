"""Agent HTTP contract with scripted LLM and fictional Qloo only."""

import pytest
from app.adapters.enrichment import FakeEnrichment
from app.adapters.fake_llm import FakeLlm, scripted_call
from app.adapters.fake_qloo import FakeQlooAdapter
from app.api.main import create_app
from app.domain.demo_profile import DEMO_DRAFT
from app.domain.kinds import CONTENT_KINDS
from fastapi.testclient import TestClient


def body() -> dict[str, object]:
    return {
        "draft": {
            "seedIds": list(DEMO_DRAFT.seed_ids),
            "avoidIds": list(DEMO_DRAFT.avoid_ids),
            "durationMinutes": DEMO_DRAFT.duration_minutes,
            "companionId": DEMO_DRAFT.companion_id,
        }
    }


def test_fake_endpoint_returns_kit_and_public_trace() -> None:
    llm = FakeLlm(
        [
            scripted_call("qloo_search", {"seed_ids": list(DEMO_DRAFT.seed_ids)}),
            scripted_call("qloo_insights", {"kinds": list(CONTENT_KINDS)}),
        ]
    )
    with TestClient(create_app(FakeQlooAdapter(), "fake", FakeEnrichment(), llm=llm)) as client:
        response = client.post("/v1/kit/agent", json=body())
    assert response.status_code == 200
    result = response.json()
    assert result["packed"]["filledMinutes"] == 240
    assert result["source"] == "fake"
    assert result["termination"] == "completed"
    assert result["trace"][0]["step"] == 1
    assert set(result["trace"][0]) == {
        "step",
        "tool",
        "argsSummary",
        "resultCount",
        "latencyMs",
        "status",
    }
    assert result["trace"][0]["argsSummary"] == "seed_ids: 5 value(s)"
    assert result["trace"][1]["resultCount"] > 0
    assert all(
        not set(item["avoidedThemeIds"]).intersection(DEMO_DRAFT.avoid_ids)
        for item in result["items"]
    )


def test_no_key_endpoint_is_deterministic(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with TestClient(create_app(mode="fake")) as client:
        response = client.post("/v1/kit/agent", json=body())
        created = client.post("/v1/sessions", json=body()).json()
        deterministic = client.post(f"/v1/sessions/{created['sessionId']}/plan").json()
    assert response.status_code == 200
    result = response.json()
    assert result.pop("trace") == []
    assert result.pop("termination") == "no_key"
    assert result == deterministic


@pytest.mark.parametrize(
    "extra",
    [
        {"name": "private person"},
        {"weekday": "bad"},
        {"locality": "x" * 81},
        {"maxSteps": 1000},
    ],
)
def test_invalid_request_refused_without_private_echo(extra: dict[str, object]) -> None:
    with TestClient(create_app(mode="fake", llm=FakeLlm([]))) as client:
        response = client.post("/v1/kit/agent", json=body() | extra)
    assert response.status_code == 422
    assert "private person" not in response.text


def test_finalization_timeout_returns_safe_503() -> None:
    import asyncio

    from app.application.agent.models import AgentLimits

    class SlowCatalog(FakeQlooAdapter):
        async def search(self, query, kind):
            await asyncio.sleep(10)
            return ()

    with TestClient(
        create_app(
            SlowCatalog(),
            "fake",
            FakeEnrichment(),
            llm=FakeLlm([]),
            agent_limits=AgentLimits(finalize_seconds=0.01),
        )
    ) as client:
        response = client.post("/v1/kit/agent", json=body())
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "catalog_unavailable"


def test_enrichment_failure_returns_safe_503() -> None:
    from app.ports.errors import EnrichmentTransportError

    class UnavailableEnrichment:
        async def for_item(self, item):
            raise EnrichmentTransportError()

    with TestClient(
        create_app(FakeQlooAdapter(), "fake", UnavailableEnrichment(), llm=FakeLlm([]))
    ) as client:
        response = client.post("/v1/kit/agent", json=body())
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "enrichment_unavailable"
