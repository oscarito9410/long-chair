"""In-memory cache for tests and a single process."""


class MemoryCache:
    """CachePort that keeps bodies in a dict. Keys are hashes, not titles."""

    def __init__(self) -> None:
        self._bodies: dict[str, bytes] = {}

    def get(self, key: str) -> bytes | None:
        """Return a stored body, or None on a miss."""

        return self._bodies.get(key)

    def put(self, key: str, body: bytes) -> None:
        """Store a successful document."""

        self._bodies[key] = body
