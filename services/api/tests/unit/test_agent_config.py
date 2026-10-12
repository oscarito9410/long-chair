"""Server-owned credentials and budgets; no provider call is made."""

from uuid import uuid4

import pytest
from app.adapters.openai_llm import OpenAiLlm
from app.api.composition import build_agent_limits, build_llm
from app.application.agent.models import AgentLimits


@pytest.fixture(autouse=True)
def clear_model_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in (
        "LLM_API_KEY",
        "OPENAI_API_KEY",
        "LLM_MODEL",
        "LLM_BASE_URL",
        "AGENT_MAX_STEPS",
        "AGENT_TIMEOUT_SECONDS",
        "AGENT_FINALIZE_TIMEOUT_SECONDS",
    ):
        monkeypatch.delenv(name, raising=False)


def test_no_credentials_does_not_construct_model() -> None:
    assert build_llm() is None
    assert build_agent_limits() == AgentLimits()


@pytest.mark.parametrize("key_name", ["LLM_API_KEY", "OPENAI_API_KEY"])
def test_either_environment_key_configures_native_adapter(monkeypatch, key_name: str) -> None:
    monkeypatch.setenv(key_name, uuid4().hex)
    monkeypatch.setenv("LLM_MODEL", "configured-model")
    monkeypatch.setenv("LLM_BASE_URL", "http://localhost:1234/v1")
    assert isinstance(build_llm(), OpenAiLlm)


def test_key_requires_explicit_model(monkeypatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)
    with pytest.raises(ValueError, match="LLM_MODEL"):
        build_llm()


@pytest.mark.parametrize("url", ["ftp://localhost/v1", "https://host/v1?key=private", "relative"])
def test_invalid_base_url_refused(url: str) -> None:
    with pytest.raises(ValueError, match="base URL"):
        OpenAiLlm(uuid4().hex, "configured-model", base_url=url)


def test_configured_budget_and_invalid_budget(monkeypatch) -> None:
    monkeypatch.setenv("AGENT_MAX_STEPS", "3")
    monkeypatch.setenv("AGENT_TIMEOUT_SECONDS", "0.5")
    monkeypatch.setenv("AGENT_FINALIZE_TIMEOUT_SECONDS", "2")
    assert build_agent_limits() == AgentLimits(3, 3, 0.5, 2)
    monkeypatch.setenv("AGENT_MAX_STEPS", "0")
    with pytest.raises(ValueError):
        build_agent_limits()
