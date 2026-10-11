# Quickstart: Session kit

Validates the service slice. The Vite screens are unchanged. Do not set `QLOO_API_KEY`
for this path.

## Prerequisites

- Python 3.12
- Node 22 if you also want the existing prototype

## Setup

From the repository root:

```bash
python3 -m pip install -e "services/api[dev]"
```

Or, from `services/api` with a virtualenv:

```bash
cd services/api
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"
```

## Checks

From `services/api`, with that environment on `PATH`:

```bash
ruff check .
ruff format --check .
mypy
pytest
```

`pytest` fails if coverage on `app/domain` and `app/application` is under 85 percent.

The web app, from the repository root:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run build
python3 .cursor/skills/no-slop-design/scripts/slop_lint.py src
```

The slop lint is informational. A finding does not mean the prototype is wrong.

## Demo kit

```bash
cd services/api
uvicorn app.api.main:app --host 127.0.0.1 --port 8099
```

In another shell:

```bash
curl -s http://127.0.0.1:8099/v1/health
curl -s -X POST http://127.0.0.1:8099/v1/demo/plan -H 'content-type: application/json' -d '{}'
```

Expect `qlooMode` of `fake`. Expect `filledMinutes` 240 and `openMinutes` 0. The slot
order is North Window, Harbor Lights: The Blue Buoy, Slow Kitchen Radio: Bread on a
Tuesday, Mira Solano at Cedar Hall, Market Morning.

A body of `{"name":"someone"}` on that route is a 422.

## What this does not do

- It does not call `hackathon.api.qloo.com`.
- It does not change a screen in `src/`.
- It does not read or write `.qloo-cache/` during the fake demo.
