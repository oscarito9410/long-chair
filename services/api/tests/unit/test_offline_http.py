"""Default test policy fails before an actual HTTP transport can reach a provider."""

import httpx
import pytest


def test_sync_http_is_blocked() -> None:
    with httpx.Client() as client, pytest.raises(AssertionError, match="Network HTTP is disabled"):
        client.get("https://example.invalid")


async def test_async_http_is_blocked() -> None:
    async with httpx.AsyncClient() as client:
        with pytest.raises(AssertionError, match="Network HTTP is disabled"):
            await client.get("https://example.invalid")
