# ADR 0004: One repo, API beside the web app

- Status: superseded in part by [ADR 0008](0008-expo-client.md)
- Date: 2026-10-11

The directory layout below was the decision on this date. [ADR 0008](0008-expo-client.md) moves the web app to `apps/web` and adds `apps/mobile` and `packages/core`.

## Context

The web app is the design and the deliverable. Splitting it into a second GitHub repository would freeze the UI away from the pipeline that has to feed it. A monorepo lets the contract tests and the screens change in one commit.

Moving `src/` into `apps/web` would churn every import for no user-visible gain. The Vite app stays at the root.

## Decision

```text
src/                         Vite app. Design system and the judge UI
services/api/                FastAPI
  app/domain/                pure kit, draft, packer
  app/application/           BuildSessionKit, checker, companion plan
  app/ports/                 QlooPort, LlmPort, CachePort
  app/adapters/              fake, http, recording, caches, fictional fixtures
  app/api/                   /v1 routes
  tests/                     unit, contract, API
  .qloo-cache/               gitignored
docs/                        this tree
```

There is no `apps/client` and no Flutter package. Root `package.json` is the web toolchain. The API has its own `pyproject.toml` and `uv.lock`.

`.gitignore` ignores `.env`, `.env.*`, and `.qloo-cache/`, so a recording cannot be added by accident.

## Consequences

- One public repository, one MIT license, one Devpost link.
- Developers run two processes: `npm run dev` and `uvicorn`. The screens do not call the API until a later wiring change.
- Shared types flow from OpenAPI to the FastAPI models and the TypeScript types in `src/data/types.ts`. A drift between those is a bug.
