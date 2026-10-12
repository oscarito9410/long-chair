"""Native OpenAI-compatible wire protocol with mocked HTTP only."""

import json
import os
from uuid import uuid4

import httpx
import pytest
from app.adapters.openai_llm import OpenAiLlm
from app.application.agent.arguments import TOOL_DEFINITIONS
from app.ports.llm import LlmError, LlmMessage, ToolCall


async def test_native_call_and_result_round_trip(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)
    captured = []

    def handle(request: httpx.Request) -> httpx.Response:
        captured.append(json.loads(request.content))
        assert request.url.path == "/v1/chat/completions"
        assert request.headers["authorization"] == f"Bearer {os.environ['LLM_API_KEY']}"
        return httpx.Response(
            200,
            json={
                "choices": [
                    {
                        "message": {
                            "content": None,
                            "tool_calls": [
                                {
                                    "id": "call_1",
                                    "type": "function",
                                    "function": {"name": "durations", "arguments": "{}"},
                                }
                            ],
                        }
                    }
                ]
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handle)) as client:
        llm = OpenAiLlm(os.environ["LLM_API_KEY"], "configured-model", client=client)
        result = await llm.complete([LlmMessage("user", "Known titles only.")], TOOL_DEFINITIONS)
        assert result.tool_calls == (ToolCall("call_1", "durations", "{}"),)
        await llm.complete(
            [
                LlmMessage("assistant", "", result.tool_calls),
                LlmMessage("tool", '{"count":1}', tool_call_id="call_1"),
            ],
            TOOL_DEFINITIONS,
        )
    assert captured[1]["messages"][1]["tool_call_id"] == "call_1"
    assert captured[0]["parallel_tool_calls"] is False
    assert captured[0]["tools"][0]["function"]["strict"] is True


@pytest.mark.parametrize("status,body", [(429, {"private": "body"}), (200, {"choices": []})])
async def test_failure_has_fixed_message(status: int, body: dict[str, object], monkeypatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)
    async with httpx.AsyncClient(
        transport=httpx.MockTransport(lambda request: httpx.Response(status, json=body))
    ) as client:
        llm = OpenAiLlm(os.environ["LLM_API_KEY"], "configured-model", client=client)
        with pytest.raises(LlmError) as caught:
            await llm.complete([], TOOL_DEFINITIONS)
    assert "private" not in str(caught.value)


async def test_transport_failure_is_recoverable_for_prose(monkeypatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)

    def unavailable(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("private connection context", request=request)

    async with httpx.AsyncClient(transport=httpx.MockTransport(unavailable)) as client:
        llm = OpenAiLlm(os.environ["LLM_API_KEY"], "configured-model", client=client)
        assert await llm.rewrite("Because you love a fictional title.") == (
            "Because you love a fictional title."
        )
        with pytest.raises(LlmError, match="did not answer"):
            await llm.complete([], ())


async def test_duplicate_native_call_ids_are_refused(monkeypatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)
    call = {"id": "same", "type": "function", "function": {"name": "durations", "arguments": "{}"}}
    async with httpx.AsyncClient(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(
                200, json={"choices": [{"message": {"tool_calls": [call, call]}}]}
            )
        )
    ) as client:
        with pytest.raises(LlmError, match="duplicate"):
            await OpenAiLlm(os.environ["LLM_API_KEY"], "configured-model", client=client).complete(
                [], TOOL_DEFINITIONS
            )


async def test_prose_native_response_and_blank_fallback(monkeypatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)
    replies = iter(["A replacement line.", " "])
    async with httpx.AsyncClient(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(
                200, json={"choices": [{"message": {"content": next(replies)}}]}
            )
        )
    ) as client:
        llm = OpenAiLlm(os.environ["LLM_API_KEY"], "configured-model", client=client)
        assert await llm.rewrite("Template.") == "A replacement line."
        assert await llm.rewrite("Template.") == "Template."


async def test_nullable_tool_calls_finish_normally(monkeypatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", uuid4().hex)
    async with httpx.AsyncClient(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(
                200, json={"choices": [{"message": {"content": "Ready.", "tool_calls": None}}]}
            )
        )
    ) as client:
        result = await OpenAiLlm(
            os.environ["LLM_API_KEY"], "configured-model", client=client
        ).complete([], TOOL_DEFINITIONS)
    assert result.content == "Ready."
    assert result.tool_calls == ()
