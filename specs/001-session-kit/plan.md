# Implementation Plan: Session kit (backend + fake Qloo)

**Branch**: `main` | **Date**: 2026-10-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-session-kit/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. Spec Kit's feature
directory is `specs/001-session-kit`. Git stays on `main` for this repository.

## Summary

Ship the first service slice: a FastAPI app that builds a session kit from the fictional
shelf, through `BuildSessionKit`, with `FakeQlooAdapter` as the catalog. The mixed
four-hour demo fills exactly. `HttpQlooAdapter` shares the contract tests and does not
call the network in CI. The Vite screens are not changed.

## Technical Context

**Language/Version**: Python 3.12 for the API. TypeScript 6 strict remains the web app
and is not part of this slice's behavior change.

**Primary Dependencies**: FastAPI, Pydantic v2, httpx. Pytest, pytest-cov, Ruff, mypy.
The web app keeps Vite, React, ESLint, and Prettier.

**Storage**: In-memory sessions. Fake fixtures committed as JSON. Recording cache
gitignored. No database.

**Testing**: pytest. Unit tests for the packer and `BuildSessionKit`. One contract suite
for the fake adapter, plus the same refusal checks on the HTTP adapter with a transport
that fails if it is asked to send. Live HTTP tests skip unless `QLOO_API_KEY` is set.
API tests via FastAPI's test client. Coverage gate at 85 percent on `app/domain` and
`app/application`.

**Target Platform**: Linux server for the API. Static web app later. Local dev is uvicorn
plus the existing Vite server.

**Project Type**: Web service beside an existing static web prototype.

**Performance Goals**: A demo plan returns in well under a second on the fake adapter.
No load target beyond a handful of judges.

**Constraints**: No Qloo key or live body in git. No name or diagnosis on the catalog
wire. Inner layers do not import outer layers. Frontend source is docs-only in this slice.
`slop_lint.py` is wired and non-blocking.

**Scale/Scope**: One use case that returns a kit, one demo profile, six fictional tastes,
five themes, and the pieces the four-hour sample already uses.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle            | This plan                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| SOLID, cohesion, DRY | One use case, one port, one mapper, one contract suite.                                                                       |
| Dependency rule      | `domain` imports no I/O. `application` imports domain and ports. Adapters and FastAPI sit outside. A unit test scans imports. |
| Ports and adapters   | `QlooPort`, `LlmPort`, `CachePort`. Fake, HTTP, and recording adapters.                                                       |
| Test-first           | Tests are tasks that land with the behavior they lock. Coverage gate is in pytest config.                                     |
| Strict typing        | `mypy --strict` on `app`. TS strict is unchanged.                                                                             |
| Lint and size        | Ruff and the existing ESLint/Prettier jobs. Modules stay small.                                                               |
| No dead code         | Flutter guidance is removed from living docs in the same change.                                                              |
| ADRs                 | ADR 0007 records the web client and supersedes ADR 0006.                                                                      |
| Privacy              | Demo and session bodies reject name and diagnosis. Fixtures are fictional.                                                    |
| Accessibility        | No screen changes. The constitution rule stays in force for the next UI slice.                                                |
| No AI slop           | Skill vendored. `lint:slop` and a non-blocking CI step.                                                                       |

Post-design: the same gates hold. No violation needs a complexity row.

## Project Structure

### Documentation (this feature)

```text
specs/001-session-kit/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── session-kit.openapi.yaml
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
services/api/
├── pyproject.toml
├── app/
│   ├── domain/          kit, session, themes, entities, packer
│   ├── application/     BuildSessionKit, PlanCompanion
│   ├── ports/           QlooPort, LlmPort, CachePort
│   ├── adapters/        fake, http, recording, fixtures, mapper
│   └── api/             FastAPI routes
└── tests/
    ├── unit/
    ├── contract/
    └── api/

src/                     existing Vite app, unchanged except docs that mention it
.github/workflows/ci.yml
```

**Structure Decision**: The API lives in `services/api` so the Vite app can stay at the
repo root. Layout follows ADR 0004 as amended by ADR 0007.

## Complexity Tracking

No constitution violations.
