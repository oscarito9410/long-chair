# Agent records

- `ToolCall`: provider call ID, action name, raw JSON argument text. Parsing occurs only at dispatch, so malformed JSON becomes a recoverable error.
- `LlmTurn`: optional assistant text and ordered calls. A turn without calls ends exploration; assistant text never changes items.
- `LlmMessage`: role, content, optional calls/call ID. No diagnosis, real identity, or raw catalog documents.
- `ToolDefinition`: action name, description, JSON parameter schema; strict, required fields, no extra properties.
- `AgentState`: validated draft and chosen tastes/themes, resolved InterestLinks, mapped candidates keyed by catalog ID, enriched IDs, places. State is per request.
- `ToolTrace`: step starts at 1; known action or `unknown`; argument summary lists only validated field names/counts; result count >= 0; latency milliseconds >= 0; status `ok`, `error`, or `timeout`.
- `AgentResult`: SessionKit, trace tuple, termination (`completed`, `step_limit`, `time_limit`, `provider_error`, or `no_key`), and model turn count for local metrics.

Transitions: validate -> explore (await turn -> validate arguments -> run tool -> append trace/result) -> verify/enrich/pack -> optional deterministic fallback -> response. Timeout cancels awaited work. Request cancellation propagates.
