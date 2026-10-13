"""Network-free scope flow: invented bodies, deterministic pacing and retry checks."""

import httpx
import pytest
from app.live import qloo_scope
from app.ports.errors import QlooRateLimitError


async def test_scope_resolves_signal_paces_and_writes_shapes_only(tmp_path, monkeypatch):
    requests = []
    delays = []
    client_type = httpx.AsyncClient
    entity = {
        "entity_id": "synthetic-signal",
        "name": "Private synthetic title",
        "tags": [{"id": "private-tag-id", "name": "Private tag label"}],
        "properties": {"description": "Private synthetic prose"},
    }

    def handler(request):
        requests.append(request)
        if len(requests) == 2:
            return httpx.Response(429, json={"errors": [{"message": "Try later"}]})
        if request.url.path == "/search":
            return httpx.Response(200, json={"results": [entity]})
        if request.url.path == "/v2/insights":
            assert request.url.params["signal.interests.entities"] == "synthetic-signal"
            assert "video_game" not in str(request.url)
            if "filter.location" in request.url.params:
                assert request.url.params["filter.location"] == "POINT(-99.1332 19.4326)"
                assert "filter.location.query" not in request.url.params
        return httpx.Response(200, json={"results": {"entities": [entity], "tags": entity["tags"]}})

    async def sleep(delay):
        delays.append(delay)

    def client(**kwargs):
        return client_type(**kwargs, transport=httpx.MockTransport(handler))

    monkeypatch.setattr(qloo_scope.httpx, "AsyncClient", client)
    monkeypatch.setattr(qloo_scope.asyncio, "sleep", sleep)
    text = await qloo_scope.run_scope("synthetic-credential", tmp_path)
    assert requests[0].url.path == "/search"
    assert len(delays) == len(requests)
    assert all(delay >= 0.25 for delay in delays)
    assert 0.5 in delays
    assert "status: 400" not in text and "status: 429" not in text
    for private in ("synthetic-signal", "Private", "private-tag-id", "synthetic-credential"):
        assert private not in text
    assert (tmp_path / "scope-report.md").read_text() == text


async def test_scope_stops_after_three_rate_limits(monkeypatch):
    delays = []

    async def sleep(delay):
        delays.append(delay)

    monkeypatch.setattr(qloo_scope.asyncio, "sleep", sleep)
    async with httpx.AsyncClient(
        base_url="https://example.invalid",
        transport=httpx.MockTransport(
            lambda request: httpx.Response(429, json={"error": {"message": "Slow down"}})
        ),
    ) as client:
        with pytest.raises(QlooRateLimitError):
            await qloo_scope._get(client, "/search", {})
    assert delays == [0.25, 0.5, 1.0]


async def test_empty_search_does_not_send_invalid_insights(tmp_path, monkeypatch):
    client_type = httpx.AsyncClient
    requests = []

    def handler(request):
        requests.append(request)
        return httpx.Response(200, json={"results": []})

    monkeypatch.setattr(
        qloo_scope.httpx,
        "AsyncClient",
        lambda **kwargs: client_type(**kwargs, transport=httpx.MockTransport(handler)),
    )
    with pytest.raises(RuntimeError, match="no signal"):
        await qloo_scope.run_scope("synthetic", tmp_path)
    assert len(requests) == 1
    assert not (tmp_path / "scope-report.md").exists()


def test_scope_output_override_is_restored(tmp_path, monkeypatch):
    monkeypatch.setenv("QLOO_LIVE_DIR", str(tmp_path))
    assert qloo_scope.report_dir() == tmp_path
    monkeypatch.delenv("QLOO_LIVE_DIR")
    assert qloo_scope.report_dir() == qloo_scope.REPORT_DIR


def test_place_query_keeps_named_locality_separate_from_coordinates():
    from app.adapters.queries import place_params
    from app.ports.models import InterestLink

    params = dict(
        place_params(
            " Fictional Neighborhood ",
            "monday",
            [InterestLink("seed", "Paper", "synthetic-seed")],
            [],
        )
    )
    assert params["filter.location.query"] == "Fictional Neighborhood"
    assert "filter.location" not in params
