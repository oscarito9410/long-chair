# ADR 0011: Optional model tool loop over Qloo

- Status: accepted
- Date: 2026-10-12
- Supersedes: ADR 0002's prose-only restriction for `/v1/kit/agent` only.

## Context

Issue #6 asks for an agent that can choose catalog retrieval actions while preserving the deterministic product, existing ports, and theme exclusions. The existing LlmPort has only a prose rewrite method. The Python checker rejects mapped theme IDs and whole synopsis phrases; ADR 0009's richer frontend evidence verifier is not currently in the API.

## Decision

Extend LlmPort with typed native tool turns. Use a small owned async loop in `application/agent`, with an OpenAI-compatible Chat Completions adapter using existing httpx. No SDK or framework is added. Base URL and model are configurable; `LLM_API_KEY` falls back to `OPENAI_API_KEY`. A key requires an explicit model. A missing key invokes BuildSessionKit without a model.

The six tools call existing Qloo/enrichment ports and checker/packer functions. The model selects known taste IDs and recommendation kinds. Server state owns draft, avoid rules, locality, weekday, candidates, durations, and enrichment. Only mapped titles that pass the existing checker go back to the model; raw Qloo bodies remain inside adapters. Final model text is ignored for kit records. There is no second model content policy.

Reapply the checker after the loop and before packing, even when the model never calls verify_themes. The checker remains the only content safety rule. The model cannot clear tags, inject records, replace avoid themes, or edit measured lengths. A short chair remains preferable to a rejected piece. Existing deterministic endpoints retain their behavior.

Bound exploration by total calls, model turns, and wall time. Cancel in-flight work at the deadline, then finalize verified candidates or invoke a separately bounded deterministic fallback. If finalization cannot finish, return the existing 503 envelope. Trace contains counts, sanitized argument structure, status, and milliseconds only.

Keyless tests use scripted FakeLlm, fictional Qloo fixtures, and mocked HTTP. A comparison script reports verifier pass rate, duration fit, type diversity, steps, and latency for agent/deterministic/model-only strategies. The model-only baseline is an evaluation input, never a production path that skips verification. Live tests require both keys and explicit spending opt-in; no live call is made as part of implementation.

## Consequences

- ADR 0002's optionality, privacy, and deterministic-verifier requirements remain accepted. The agent endpoint permits selection of retrieval actions; final content rules and packing remain server-owned.
- The API verifier has the documented limits of its existing checker. Integrating ADR 0009's evidence sources is a separate decision.
- A trace supports review without dumping arguments, provider errors, or catalog data.
- Eight calls can batch insight kinds; tools remain recoverable under bad arguments and port failures.
- Default metrics are scripted fictional examples, not a live evaluation or an improvement claim.
