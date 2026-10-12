# Local validation

From `services/api`, with Python 3.12 and uv:

```bash
uv sync --locked --extra dev
uv run ruff check .
uv run ruff format --check .
uv run mypy
uv run pytest
uv run python -m app.live.agent_metrics
uv run uvicorn app.api.main:app --host 127.0.0.1 --port 8099
```

Send the body in [contracts/agent-api.md](contracts/agent-api.md) to `/v1/kit/agent`. With no LLM key it returns the deterministic kit and `trace: []`. Unit/API tests inject scripted FakeLlm and FakeQlooAdapter to exercise the native loop without keys or network.

Configuration: `LLM_API_KEY` falls back to `OPENAI_API_KEY`; `LLM_BASE_URL` defaults to the OpenAI `/v1` URL; a key requires explicit `LLM_MODEL`. `AGENT_MAX_STEPS` (1-32), `AGENT_TIMEOUT_SECONDS` (0-120, exclusive of zero), and `AGENT_FINALIZE_TIMEOUT_SECONDS` (0-60, exclusive of zero) are server settings. `QLOO_MODE` remains fake by default; enrichment remains fake by default.

Live checks require both `QLOO_API_KEY` and `LLM_API_KEY`, plus `RUN_LIVE_AGENT=1` and an explicit model. Only set the opt-in after approval to spend on calls. Live data is neither printed nor saved by the comparison; existing recording/cache rules still apply. Default metrics use only fictional data and make no performance superiority claim.

Repo gates: `npm run lint`, `npm run typecheck`, and `npm test` (serial/light resource window). No Android/iOS build is required for this API feature.

The comparison's fictional LLM-only selection intentionally includes an avoided
title so scoring is visible. Live mode uses the deterministic verified title pool
for its model-only selection, with no tools or raw Qloo input. These are different
evaluation conditions; do not present the scripted score as a live improvement.

If wheel-only setup skips the local project install, use
`uv run --no-sync python -m pytest` from `services/api` so that the project root is
on the import path. This is the installation-free equivalent of `uv run pytest`.
