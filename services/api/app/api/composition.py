"""Wire the catalog mode. Live without a key fails here, and does not fall through to fake."""

import os
from pathlib import Path

from app.adapters.fake_qloo import FakeQlooAdapter
from app.adapters.file_cache import FileCache
from app.adapters.recording import RecordingQlooAdapter
from app.ports.qloo import QlooPort

MODES = frozenset({"fake", "live", "replay"})
DEFAULT_MODE = "fake"


def cache_dir() -> Path:
    """Private recording directory. Override with QLOO_CACHE_DIR in tests."""

    configured = os.environ.get("QLOO_CACHE_DIR")
    if configured:
        return Path(configured)
    return Path(__file__).resolve().parents[2] / ".qloo-cache"


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
