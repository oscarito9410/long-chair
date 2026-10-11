"""Gitignored file cache. A second copy belongs in a password store, not in git."""

from pathlib import Path

CACHE_FILE_MODE = 0o600


class FileCache:
    """CachePort on a private directory. Filenames are the hash keys."""

    def __init__(self, root: Path) -> None:
        self._root = root

    def get(self, key: str) -> bytes | None:
        """Read one recorded body. Missing files are a miss."""

        path = self._path(key)
        if not path.is_file():
            return None
        return path.read_bytes()

    def put(self, key: str, body: bytes) -> None:
        """Write one body with mode 0600."""

        path = self._path(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        path.chmod(CACHE_FILE_MODE)

    def _path(self, key: str) -> Path:
        return self._root / key
