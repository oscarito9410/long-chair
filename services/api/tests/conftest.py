"""Offline by default: credentials alone never authorize provider requests."""

import httpx
import pytest


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--run-live", action="store_true", help="Explicitly authorize marked live tests"
    )


def pytest_configure(config: pytest.Config) -> None:
    config.addinivalue_line("markers", "live: explicitly authorized external provider test")


def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:
    if config.getoption("--run-live"):
        return
    for item in items:
        if item.get_closest_marker("live"):
            item.add_marker(pytest.mark.skip(reason="Live tests require --run-live"))


@pytest.fixture(autouse=True)
def offline_http(request: pytest.FixtureRequest, monkeypatch: pytest.MonkeyPatch) -> None:
    """Mock/ASGI transports remain usable; actual HTTP transports fail before I/O."""
    if request.node.get_closest_marker("live") and request.config.getoption("--run-live"):
        return

    def refuse(*args: object, **kwargs: object) -> httpx.Response:
        raise AssertionError("Network HTTP is disabled for ordinary tests; use a mock transport")

    async def refuse_async(*args: object, **kwargs: object) -> httpx.Response:
        return refuse(*args, **kwargs)

    monkeypatch.setattr(httpx.HTTPTransport, "handle_request", refuse)
    monkeypatch.setattr(httpx.AsyncHTTPTransport, "handle_async_request", refuse_async)
