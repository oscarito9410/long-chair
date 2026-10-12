# Implementation Plan: Agentic kit builder

**Branch**: `feat/005-agent-loop` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Issue #6 and `specs/005-agent-loop/spec.md`.

## Summary

Add a self-owned async Python tool loop behind `LlmPort`. Catalog and enrichment ports own I/O; the server owns selected tastes, avoided themes, lengths, and final packing. Expose `POST /v1/kit/agent` with the existing kit fields plus a redacted trace. No model key invokes the deterministic builder.

## Technical Context

**Language/Version**: Python 3.12+, strict mypy.

**Primary Dependencies**: Existing FastAPI, httpx, pydantic; no new runtime dependencies and no agent framework.

**Storage**: Per-request in-memory state. Existing ignored recording cache for Qloo replay only.

**Testing**: pytest/pytest-asyncio, deterministic FakeLlm, FakeQlooAdapter, httpx MockTransport, existing 85 percent domain/application coverage gate.

**Target Platform**: Existing FastAPI service and uv toolchain.

**Project Type**: API endpoint and local comparison script.

**Performance Goals**: Eight tool calls/turns, 20 seconds exploration, 10 seconds finalization/fallback by default. Cancel awaited I/O on timeout.

**Constraints**: No paid calls during implementation. No raw Qloo payloads or keys in git. Trace contains bounded summaries rather than model-supplied values. No client/native changes.

**Scale/Scope**: One request-scoped loop, six tools, one endpoint, three comparison strategies.

## Constitution Check

Pre-research and post-design gates pass: inner layers import only domain/ports; adapters own HTTP/parsing; schema validation happens at boundaries; the checker and packer are reused. Tests cover behavior and cancellation with fictional fixtures. No dependency additions. ADR 0011 supersedes only ADR 0002's prohibition on selecting retrieval actions, retaining optionality and server verification. No accessibility or client changes.

## Project Structure

```text
specs/005-agent-loop/
  spec.md, plan.md, research.md, data-model.md, quickstart.md, tasks.md
  checklists/requirements.md
  contracts/agent-api.md
services/api/app/
  ports/llm.py                     Native turn/tool contracts and typed provider failures
  adapters/openai_llm.py           OpenAI-compatible Chat Completions HTTP adapter
  adapters/fake_llm.py             Scripted turns; no I/O
  application/agent/               Loop, tools, arguments, state, metrics
  api/agent_routes.py              HTTP input/presentation
  live/agent_metrics.py            Fictional comparison; explicit optional live mode
services/api/tests/
  unit/test_agent*.py
  contract/test_llm.py
  api/test_agent.py
  live/test_agent.py
```

**Structure Decision**: Keep orchestration independent of FastAPI and HTTP. Separate wire parsing, validated tool arguments, tool dispatch, run budgets, and finalization. Extend the existing LlmPort with native complete turns while retaining rewrite for existing use cases.

## Phase 0: Research

[research.md](research.md) resolves protocol, safety, and baseline choices using repository code and official function-calling documentation. No unresolved technical choices require additional agents.

## Phase 1: Design

[data-model.md](data-model.md), [contract](contracts/agent-api.md), [quickstart.md](quickstart.md), and [ADR 0011](../../docs/adr/0011-agent-loop.md) define the boundaries. The model receives verified mapped titles and summaries only. Untrusted final text never supplies records. Server finalization re-enriches as needed, verifies, and packs; empty pools use a bounded deterministic fallback. Provider errors use fixed codes rather than external messages.
