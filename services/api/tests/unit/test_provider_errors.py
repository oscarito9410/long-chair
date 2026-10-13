"""Provider rejection shapes use synthetic diagnostic text and no network."""

import httpx
import pytest
from app.adapters.http_qloo import HttpQlooAdapter
from app.domain.demo_profile import THEMES
from app.ports.errors import (
    QlooAuthenticationError,
    QlooAuthorizationError,
    QlooBadRequestError,
    QlooRateLimitError,
)
from app.ports.models import InterestLink


@pytest.mark.parametrize(
    "status,error_type",
    [
        (400, QlooBadRequestError),
        (401, QlooAuthenticationError),
        (403, QlooAuthorizationError),
        (429, QlooRateLimitError),
    ],
)
@pytest.mark.parametrize(
    "body",
    [
        {"error": {"reason": "Synthetic reason", "message": "Synthetic rejection"}},
        {"errors": [{"message": "Synthetic rejection"}]},
    ],
)
async def test_provider_diagnostics_and_bounded_retries(status, error_type, body, monkeypatch):
    attempts = []
    delays = []

    async def sleep(delay):
        delays.append(delay)

    def handler(request):
        attempts.append(request)
        return httpx.Response(status, json=body)

    monkeypatch.setattr("app.adapters.http_qloo.asyncio.sleep", sleep)
    async with httpx.AsyncClient(
        base_url="https://example.invalid", transport=httpx.MockTransport(handler)
    ) as client:
        with pytest.raises(error_type) as caught:
            await HttpQlooAdapter(api_key="synthetic", client=client).search("Fictional", "movie")
    assert caught.value.provider_message == "Synthetic rejection"
    assert caught.value.status_code == status
    assert "Synthetic rejection" not in str(caught.value)
    assert len(attempts) == (3 if status == 429 else 1)
    assert delays == ([0.25, 0.5] if status == 429 else [])


async def test_builtin_exclusions_are_sent_without_tag_lookup():
    requests = []

    def handler(request):
        requests.append(request)
        return httpx.Response(200, json={"results": {"entities": []}})

    async with httpx.AsyncClient(
        base_url="https://example.invalid", transport=httpx.MockTransport(handler)
    ) as client:
        adapter = HttpQlooAdapter(api_key="synthetic", client=client)
        tags = await adapter.exclusion_tags(THEMES)
        await adapter.insights(
            "movie",
            [InterestLink("seed", "Paper Seed", "00000000-0000-4000-8000-000000000001")],
            [tag.qloo_tag_id for tag in tags],
        )
    assert len(requests) == 1
    sent = requests[0].url.params["filter.exclude.tags"].split(",")
    assert "urn:tag:theme:qloo:cancer" in sent
    assert "urn:tag:keyword:media:hospital" in sent
    assert all("fictional" not in tag for tag in sent)


@pytest.mark.parametrize("body", [b"not json", b'{"error":{"reason":"Reason only"}}'])
def test_malformed_error_or_reason_only_has_typed_failure(body):
    from app.adapters.provider_errors import response_error

    error = response_error(httpx.Response(400, content=body), "")
    assert isinstance(error, QlooBadRequestError)
    assert error.provider_message
    assert "not json" not in error.provider_message
    if body.startswith(b"{"):
        assert error.provider_message == "Reason only"


def test_diagnostic_does_not_echo_credentials():
    from app.adapters.provider_errors import response_error

    error = response_error(
        httpx.Response(401, json={"error": {"message": "Rejected synthetic-value"}}),
        "synthetic-value",
    )
    assert isinstance(error, QlooAuthenticationError)
    assert error.provider_message == "Rejected [redacted]"
