"""Wire the catalog mode. Live without a key fails here, and does not fall through to fake."""

import os
from pathlib import Path

from app.adapters.enrichment import FakeEnrichment, HttpEnrichment
from app.adapters.fake_qloo import FakeQlooAdapter
from app.adapters.file_cache import FileCache
from app.adapters.openai_llm import OPENAI_BASE_URL, OpenAiLlm
from app.adapters.recording import RecordingQlooAdapter
from app.application.agent.models import AgentLimits
from app.ports.enrichment import EnrichmentPort
from app.ports.llm import LlmPort
from app.ports.qloo import QlooPort

MODES = frozenset({"fake", "live", "replay"})
DEFAULT_MODE = "fake"


def cache_dir() -> Path:
    """Private recording directory. Override with QLOO_CACHE_DIR in tests."""

    configured = os.environ.get("QLOO_CACHE_DIR")
    if configured:
        return Path(configured)
    return Path(__file__).resolve().parents[2] / ".qloo-cache"


def build_enrichment() -> EnrichmentPort:
    """Fake sample lengths unless ENRICHMENT_MODE=live. TMDB stays off without a key."""

    if os.environ.get("ENRICHMENT_MODE") != "live":
        return FakeEnrichment()
    return HttpEnrichment(
        tmdb_api_key=os.environ.get("TMDB_API_KEY", ""),
        open_library=os.environ.get("OPEN_LIBRARY") == "1",
    )


def build_qloo(mode: str) -> QlooPort:
    """Select the adapter. `live` requires QLOO_API_KEY. `replay` does not call the network."""

    if mode not in MODES:
        raise RuntimeError("QLOO_MODE must be fake, live, or replay.")
    if mode == "fake":
        return FakeQlooAdapter()
    key = os.environ.get("QLOO_API_KEY", "").strip()
    if mode == "live" and not key:
        raise RuntimeError("QLOO_MODE=live requires QLOO_API_KEY.")
    cache = FileCache(cache_dir())
    if mode == "live":
        return RecordingQlooAdapter(mode="live", cache=cache, api_key=key)
    return RecordingQlooAdapter(mode="replay", cache=cache, api_key=key or "replay")


def build_llm() -> LlmPort | None:
    """Missing credentials keep the deterministic builder; a key requires explicit model."""

    key = os.environ.get("LLM_API_KEY", "").strip() or os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        return None
    return OpenAiLlm(
        key,
        os.environ.get("LLM_MODEL", ""),
        base_url=os.environ.get("LLM_BASE_URL", OPENAI_BASE_URL),
    )


def build_agent_limits() -> AgentLimits:
    """Budget settings are server-owned; invalid configuration fails before serving."""

    defaults = AgentLimits()
    return AgentLimits(
        max_steps=int(os.environ.get("AGENT_MAX_STEPS", defaults.max_steps)),
        max_turns=int(os.environ.get("AGENT_MAX_STEPS", defaults.max_turns)),
        timeout_seconds=float(os.environ.get("AGENT_TIMEOUT_SECONDS", defaults.timeout_seconds)),
        finalize_seconds=float(
            os.environ.get("AGENT_FINALIZE_TIMEOUT_SECONDS", defaults.finalize_seconds)
        ),
    )
