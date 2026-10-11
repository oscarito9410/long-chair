"""Optional prose port. The kit is complete when this is absent."""

from typing import Protocol


class LlmPort(Protocol):
    """Rewrite one explanation. Must not receive a name, a diagnosis, or a catalog body."""

    async def rewrite(self, text: str) -> str:
        """Return a replacement sentence, or the same sentence when no model is configured."""
