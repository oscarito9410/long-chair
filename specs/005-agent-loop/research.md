# Research: Agentic kit builder

## Native tool protocol

- Decision: Implement OpenAI-compatible Chat Completions with existing httpx, strict function schemas, and `parallel_tool_calls=false`. Preserve assistant call IDs and pass each result in a `role=tool` message with `tool_call_id`.
- Rationale: Fits existing LlmPort and configurable base URL without a framework or dependency. Validate provider responses at the adapter and tool arguments at dispatch.
- Alternatives: Responses API would pin the protocol more tightly to one vendor; agent frameworks add ownership and dependencies without required behavior.
- Source: [Official OpenAI function calling guide](https://developers.openai.com/api/docs/guides/function-calling), read 2026-10-12.

## Verification and finalization

- Decision: Reuse `checker.rejects`, `pack_session`, enrichment, scheduled_items, and companion planning. Agent arguments select known taste IDs/content kinds only; exclusions, locality, weekday, and draft duration remain server-owned.
- Rationale: The current Python checker handles mapped IDs and synopsis phrases; the richer frontend ADR 0009 model is outside this issue. All candidates exposed to the model already pass the checker. Final server verification cannot be skipped by omitting the checking tool.
- Alternatives: Model-produced records or model clearance would bypass the authoritative verifier and are rejected.

## Budgets and comparison

- Decision: Bound tool count and turn count independently; use asyncio timeout for exploration and finalization/fallback. Keep trace entries for completed, failed, and interrupted calls. No credentials means no model construction.
- Rationale: A slow model/tool must be interrupted, not checked only after it returns. Partial candidates may be packed if verified. Baseline measures are outcomes, not promises of improvement.
- Alternatives: A model-only comparison is a separate scripted no-tool selection over the fictional shelf, scored before verification so its violations remain visible. It is never a production bypass. Live comparison remains explicitly opt-in.
