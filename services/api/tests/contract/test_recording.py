"""Replay serves a recorded body and does not call the network on a miss or a hit."""

from pathlib import Path

import httpx
import pytest
from app.adapters.file_cache import FileCache
from app.adapters.memory_cache import MemoryCache
from app.adapters.recording import RecordingQlooAdapter
from app.ports.errors import CacheMiss

PAPER = "00000000-0000-4000-8000-000000000010"
SEARCH_BODY = {
    "success": True,
    "results": {
        "entities": [
            {
                "name": "The Paper Kite",
                "entity_id": PAPER,
                "type": "urn:entity",
                "subtype": "urn:entity:movie",
                "properties": {
                    "description": "A slow road film about a repair",
                    "short_descriptions": [{"value": "A slow road film about a repair"}],
                },
            }
        ]
    },
}


def _live_transport() -> httpx.MockTransport:
    def handler(request: httpx.Request) -> httpx.Response:
        del request
        return httpx.Response(200, json=SEARCH_BODY)

    return httpx.MockTransport(handler)


def _exploding_transport() -> httpx.MockTransport:
    def handler(request: httpx.Request) -> httpx.Response:
        del request
        raise AssertionError("replay must not call the network")

    return httpx.MockTransport(handler)


@pytest.mark.asyncio
async def test_replay_uses_the_recording_and_misses_cleanly() -> None:
    cache = MemoryCache()
    live = RecordingQlooAdapter(
        mode="live",
        cache=cache,
        api_key="dummy",
        inner=_live_transport(),
    )
    hits = await live.search("The Paper Kite", "movie")
    assert hits[0].qloo_entity_id == PAPER

    replay = RecordingQlooAdapter(
        mode="replay",
        cache=cache,
        api_key="dummy",
        inner=_exploding_transport(),
    )
    again = await replay.search("The Paper Kite", "movie")
    assert again[0].name == "The Paper Kite"
    with pytest.raises(CacheMiss):
        await replay.search("Sunday Engines", "movie")


def test_file_cache_round_trip(tmp_path: Path) -> None:
    cache = FileCache(tmp_path)
    cache.put("abc", b"{}")
    assert cache.get("abc") == b"{}"
    assert cache.get("missing") is None
