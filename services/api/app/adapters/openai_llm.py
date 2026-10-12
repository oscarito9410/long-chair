"""OpenAI-compatible native function calls over Chat Completions, without an SDK."""

from collections.abc import Sequence
from typing import Literal

import httpx
from pydantic import BaseModel, Field, ValidationError

from app.ports.llm import (
    MAX_TOOL_ARGUMENT_CHARS,
    LlmError,
    LlmMessage,
    LlmTurn,
    ToolCall,
    ToolDefinition,
)

OPENAI_BASE_URL = "https://api.openai.com/v1"
CHAT_COMPLETIONS = "/chat/completions"
HTTP_TIMEOUT_SECONDS = 15.0
HTTP_OK = 200
MAX_TOOL_CALLS_PER_TURN = 32
MAX_TOOL_NAME_CHARS = 64
MAX_CALL_ID_CHARS = 128
MAX_CONTENT_CHARS = 16000


class FunctionWire(BaseModel):
    name: str = Field(min_length=1, max_length=MAX_TOOL_NAME_CHARS)
    arguments: str = Field(max_length=MAX_TOOL_ARGUMENT_CHARS)


class ToolCallWire(BaseModel):
    id: str = Field(min_length=1, max_length=MAX_CALL_ID_CHARS)
    type: Literal["function"]
    function: FunctionWire


class MessageWire(BaseModel):
    content: str | None = Field(default=None, max_length=MAX_CONTENT_CHARS)
    tool_calls: list[ToolCallWire] | None = Field(default=None, max_length=MAX_TOOL_CALLS_PER_TURN)


class ChoiceWire(BaseModel):
    message: MessageWire


class CompletionWire(BaseModel):
    choices: list[ChoiceWire] = Field(min_length=1)


class OpenAiLlm:
    """Configurable chat endpoint; closes owned clients, never logs provider bodies or keys."""

    def __init__(
        self,
        api_key: str,
        model: str,
        *,
        base_url: str = OPENAI_BASE_URL,
        client: httpx.AsyncClient | None = None,
    ) -> None:
        url = httpx.URL(base_url)
        if url.scheme not in {"http", "https"} or not url.host or url.query or url.fragment:
            raise ValueError("LLM_BASE_URL must be an HTTP(S) API base URL.")
        if not api_key.strip() or not model.strip():
            raise ValueError("A model key requires an explicit LLM_MODEL.")
        self._key = api_key.strip()
        self._model = model.strip()
        self._url = base_url.rstrip("/") + CHAT_COMPLETIONS
        self._client = client

    async def rewrite(self, text: str) -> str:
        try:
            turn = await self.complete([LlmMessage("user", text)], ())
        except LlmError:
            return text
        return turn.content.strip() or text

    async def complete(
        self, messages: Sequence[LlmMessage], tools: Sequence[ToolDefinition]
    ) -> LlmTurn:
        payload: dict[str, object] = {
            "model": self._model,
            "messages": [_message_wire(message) for message in messages],
        }
        if tools:
            payload.update(
                {
                    "tools": [_tool_wire(tool) for tool in tools],
                    "tool_choice": "auto",
                    "parallel_tool_calls": False,
                }
            )
        try:
            if self._client is not None:
                response = await self._request(self._client, payload)
            else:
                async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS) as client:
                    response = await self._request(client, payload)
        except httpx.HTTPError as exc:
            raise LlmError("The model did not answer.") from exc
        if response.status_code != HTTP_OK:
            raise LlmError("The model did not answer.")
        try:
            message = CompletionWire.model_validate_json(response.content).choices[0].message
        except ValidationError as exc:
            raise LlmError("The model returned an invalid turn.") from exc
        calls = tuple(
            ToolCall(call.id, call.function.name, call.function.arguments)
            for call in message.tool_calls or ()
        )
        if len({call.id for call in calls}) != len(calls):
            raise LlmError("The model returned duplicate call IDs.")
        return LlmTurn(message.content or "", calls)

    async def _request(
        self, client: httpx.AsyncClient, payload: dict[str, object]
    ) -> httpx.Response:
        return await client.post(
            self._url,
            headers={"Authorization": f"Bearer {self._key}"},
            json=payload,
            timeout=HTTP_TIMEOUT_SECONDS,
        )


def _message_wire(message: LlmMessage) -> dict[str, object]:
    row: dict[str, object] = {"role": message.role, "content": message.content}
    if message.tool_call_id:
        row["tool_call_id"] = message.tool_call_id
    if message.tool_calls:
        row["tool_calls"] = [
            {
                "id": call.id,
                "type": "function",
                "function": {
                    "name": call.name,
                    "arguments": call.arguments,
                },
            }
            for call in message.tool_calls or ()
        ]
    return row


def _tool_wire(tool: ToolDefinition) -> dict[str, object]:
    return {
        "type": "function",
        "function": {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.parameters,
            "strict": True,
        },
    }
