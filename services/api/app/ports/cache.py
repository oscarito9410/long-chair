"""Private recording cache. Keys are hashes. Values are raw catalog documents."""

from typing import Protocol


class CachePort(Protocol):
    """Read and write recorded documents. A miss is `None`, not an exception."""

    def get(self, key: str) -> bytes | None:
        """Return the recorded body, or None when this request was never stored."""

    def put(self, key: str, body: bytes) -> None:
        """Store a successful document. Callers must not pass error bodies."""
