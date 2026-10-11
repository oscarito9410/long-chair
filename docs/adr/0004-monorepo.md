# ADR 0004: One repo, API beside the prototype

- Status: accepted
- Date: 2026-10-11

## Context

The prototype is the design. Splitting it into a second GitHub repository would freeze the UI away from the pipeline that has to feed it. A monorepo lets the contract tests and the screens change in one pull request.

Moving `src/` into `apps/web` on the same day as this document would churn every import for no user-visible gain. The docs-only pass leaves the Vite app where it is.

## Decision

Target layout, created when implementation starts:

```text
src/                         Vite prototype. Design reference, and the fallback judge URL
apps/client/                 Flutter app: iOS, Android, and web
  lib/core/theme/            ThemeExtension tokens
  lib/core/glass/            GlassSurface
  lib/features/              feature-first domain, data, presentation
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

The first implementation milestone adds `apps/client` and `services/api` without moving `src/`. The Vite app keeps running as the design reference. A move of `src/` into `apps/` is optional and, if it happens, is a commit that only moves files.

`apps/client` has its own `pubspec.yaml`. Root `package.json` stays the prototype toolchain. The API has its own `pyproject.toml`.

`.gitignore` ignores `.env`, `.env.*`, and `.qloo-cache/` from this document onward, so a recording cannot be added by accident.

## Consequences

- One public repository, one MIT license, one Devpost link.
- Developers run two processes. The README will say so when the API exists. Until then, `npm run dev` is still the whole prototype.
- Shared types flow from OpenAPI to the FastAPI models and the Flutter freezed models. The TypeScript types in `src/data/types.ts` stay the design reference. A drift between those three is a bug.
