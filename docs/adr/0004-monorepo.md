# ADR 0004: One repo, API beside the prototype

- Status: accepted
- Date: 2026-10-11

## Context

The prototype is the design. Splitting it into a second GitHub repository would freeze the UI away from the pipeline that has to feed it. A monorepo lets the contract tests and the screens change in one pull request.

Moving `src/` into `apps/web` on the same day as this document would churn every import for no user-visible gain. The docs-only pass leaves the Vite app where it is.

## Decision

Target layout, created when implementation starts:

```text
src/                         Vite prototype, design reference until the Expo web export replaces it
apps/mobile/                 Expo Router client: iOS, Android, and web export
services/api/                FastAPI
  app/ports/qloo.py          QlooPort
  app/adapters/http.py
  app/adapters/fake.py
  app/adapters/recording.py
  app/adapters/fake/fixtures/   fictional, committed
  app/pipeline/              resolve, checker, packer, planner
  app/mapping/               Qloo document to CatalogItem
  tests/contract/            the shared suite
  .qloo-cache/               gitignored
docs/                        this tree
```

The first implementation milestone adds `apps/mobile` and `services/api` without moving `src/`. The Vite app keeps running until the Expo web export is the hosted demo. A move of `src/` into `apps/` is optional and, if it happens, is a commit that only moves files.

`apps/mobile` has its own `package.json`. Root `package.json` stays the prototype toolchain until that handoff. The API has its own `pyproject.toml`.

`.gitignore` ignores `.env`, `.env.*`, and `.qloo-cache/` from this document onward, so a recording cannot be added by accident.

## Consequences

- One public repository, one MIT license, one Devpost link.
- Developers run two processes. The README will say so when the API exists. Until then, `npm run dev` is still the whole prototype.
- Shared types flow from OpenAPI to TypeScript, not from `src/data/types.ts` into Python by hand. When the API is added, those TypeScript types stay the UI's view of the schema, and a test checks they still match.
