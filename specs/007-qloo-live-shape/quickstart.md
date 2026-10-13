# Validation: Qloo live wire shape

## Deterministic checks

From services/api, with uv 0.13.0 and Python 3.12:

```bash
uv sync --frozen --extra dev
uv run ruff check .
uv run ruff format --check .
uv run mypy
env -u QLOO_API_KEY -u LLM_API_KEY -u OPENAI_API_KEY -u RUN_LIVE_AGENT uv run pytest
```

From the repository root, with Node 22:

```bash
npm ci --ignore-scripts
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run lint:slopmd
npm run lint:slop
```

## Verified on 2026-10-13

- API Ruff lint/format and strict mypy pass.
- API pytest: 183 passed, 3 live tests skipped; domain/application coverage 98.15%.
- Aggregate JS: formatting, ESLint and all workspace typechecks pass.
- Vitest: mobile 25, web 11, core 85 tests pass (121 total).
- Web production build passes. No native build, export, signing or deployment ran.
- SlopMD and design scans completed; findings remain informational. Design grade A.
- git diff --check passes; .qloo-live/scope-report.md is ignored.
- Fictional values only: the shared tag corpus contains issue-listed vocabulary and
  synthetic family variants, not real entity records. No API keys were used.

Existing tool warnings: Starlette testclient deprecation and mobile Vite config loader
notice. Locked npm dependencies report audit findings; dependency upgrades are outside
this issue. Node 22 was used for all JS checks rather than the workstation's Node 23.

## Live acceptance pending

No live calls were made because the task forbids paid API calls. The following command
is for a separately authorized run from services/api with the key supplied privately:

```bash
uv run python -m app.live.qloo_scope
```

It skips when QLOO_API_KEY is absent. With a key, it resolves a search signal, spaces
requests by at least 0.25 seconds, backs off on 429, and writes scope-report.md only
under the fixed gitignored .qloo-live directory. An HTTP error after retries fails the
run. The zero-400/429 real-host acceptance item is unverified. Mock tests exercise the
whole sequence, bounded retries, missing-signal refusal, and value-free reporting.
