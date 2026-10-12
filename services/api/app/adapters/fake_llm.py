"""Scripted language-model turns for deterministic tests and fictional comparisons."""

import json
from collections.abc import Sequence

from app.ports.llm import LlmError, LlmMessage, LlmTurn, ToolCall, ToolDefinition


class FakeLlm:
    """Consume fixed turns/errors. Exhaustion ends the run without network or randomness."""

    def __init__(self, turns: Sequence[LlmTurn | LlmError]) -> None:
        self._turns = iter(turns)
        self.requests: list[tuple[tuple[LlmMessage, ...], tuple[ToolDefinition, ...]]] = []

    async def rewrite(self, text: str) -> str:
        return text

    async def complete(
        self, messages: Sequence[LlmMessage], tools: Sequence[ToolDefinition]
    ) -> LlmTurn:
        self.requests.append((tuple(messages), tuple(tools)))
        turn = next(self._turns, LlmTurn())
        if isinstance(turn, LlmError):
            raise turn
        return turn


def scripted_call(name: str, arguments: dict[str, object]) -> LlmTurn:
    """One fictional tool turn. The call ID only has to be unique within its turn."""

    return LlmTurn(tool_calls=(ToolCall(f"call_{name}", name, json.dumps(arguments)),))
