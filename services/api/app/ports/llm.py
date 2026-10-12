"""Optional language-model port. Catalog documents and private identity stay outside it."""

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Literal, Protocol

MAX_TOOL_ARGUMENT_CHARS = 8192


class LlmError(Exception):
    """A model transport or protocol failure with a fixed, public-safe message."""


@dataclass(frozen=True, slots=True)
class ToolCall:
    """Native function call; argument JSON is untrusted until tool dispatch."""

    id: str
    name: str
    arguments: str


@dataclass(frozen=True, slots=True)
class LlmMessage:
    """Conversation entry. Tool replies retain the provider's call ID."""

    role: Literal["system", "user", "assistant", "tool"]
    content: str
    tool_calls: tuple[ToolCall, ...] = ()
    tool_call_id: str = ""


@dataclass(frozen=True, slots=True)
class ToolDefinition:
    """Function contract with required fields and no extra properties."""

    name: str
    description: str
    parameters: dict[str, object]


@dataclass(frozen=True, slots=True)
class LlmTurn:
    """One model decision. A turn without calls ends exploration."""

    content: str = ""
    tool_calls: tuple[ToolCall, ...] = ()


class LlmPort(Protocol):
    """Prose and native tool turns over mapped titles only; never a medical record."""

    async def rewrite(self, text: str) -> str:
        """Return a replacement sentence, or retain it when the model is unavailable."""

    async def complete(
        self, messages: Sequence[LlmMessage], tools: Sequence[ToolDefinition]
    ) -> LlmTurn:
        """Return a native turn or raise LlmError; callers own execution and budgets."""
