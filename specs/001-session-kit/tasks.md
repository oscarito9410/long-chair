---
description: "Tasks for the session kit service slice"
---

# Tasks: Session kit (backend + fake Qloo)

**Input**: Design documents from `/specs/001-session-kit/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required. Unit tests for the packer and BuildSessionKit, shared contract tests, API tests. Coverage gate on domain and application.

**Organization**: Tasks are grouped by user story so each story can be tested on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: API project skeleton beside the existing Vite app

- [x] T001 Create `services/api` layout (`app/domain`, `app/application`, `app/ports`, `app/adapters`, `app/api`, `tests`) per `specs/001-session-kit/plan.md`
- [x] T002 Add `services/api/pyproject.toml` with exact pins for FastAPI, uvicorn, pydantic, httpx, pytest, pytest-cov, pytest-asyncio, ruff, and mypy after SlopMD check-dep
- [x] T003 [P] Configure ruff, mypy strict, and pytest-cov fail-under 85 on `app/domain` and `app/application` in `services/api/pyproject.toml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure domain, ports, and the shared Qloo document mapper. No user story is done until this exists.

- [x] T004 Add domain types and draft rules in `services/api/app/domain/entities.py` and `services/api/app/domain/draft.py`
- [x] T005 [P] Add the pure packer in `services/api/app/domain/packer.py`, matching `src/lib/pack-session.ts`
- [x] T006 [P] Add `QlooPort`, `LlmPort`, and `CachePort` in `services/api/app/ports/`
- [x] T007 [P] Add shared pydantic documents, query validation, and the mapper in `services/api/app/adapters/documents.py`, `validation.py`, and `mapper.py`
- [x] T008 Add an import test in `services/api/tests/unit/test_dependency_rule.py` that domain does not import outer layers

**Checkpoint**: Domain and ports exist. Adapters can implement the port.

---

## Phase 3: User Story 1 - Mixed four-hour demo (Priority: P1)

**Goal**: A judge gets the full fictional four-hour kit with no live key.

**Independent Test**: `POST /v1/demo/plan` returns filled minutes 240, open minutes 0, and the five sample pieces in order.

### Tests for User Story 1

- [x] T009 [P] [US1] Packer fixture test for the 240-minute fill in `services/api/tests/unit/test_packer.py`
- [x] T010 [P] [US1] API test for `POST /v1/demo/plan` and `GET /v1/health` in `services/api/tests/api/test_demo_plan.py`

### Implementation for User Story 1

- [x] T011 [P] [US1] Fictional Qloo-shaped fixtures and `services/api/app/adapters/fixtures/CONFIDENCE.md`
- [x] T012 [US1] `FakeQlooAdapter` in `services/api/app/adapters/fake_qloo.py`
- [x] T013 [US1] `BuildSessionKit` and companion topics in `services/api/app/application/build_session_kit.py` and `plan_companion.py`
- [x] T014 [US1] Demo route in `services/api/app/api/routes.py` using `services/api/app/domain/demo_profile.py`

**Checkpoint**: The demo kit is independently testable.

---

## Phase 4: User Story 2 - Visitor draft (Priority: P2)

**Goal**: A stored draft plans a kit. The companion does not change the schedule. Bad drafts and names are refused.

**Independent Test**: Two sessions that differ only by companion return the same slots. A body with `name` is 422. An unknown session is 404.

### Tests for User Story 2

- [x] T015 [P] [US2] API tests for create, plan, companion independence, and refused fields in `services/api/tests/api/test_sessions.py`

### Implementation for User Story 2

- [x] T016 [US2] `POST /v1/sessions` and `POST /v1/sessions/{sessionId}/plan` in `services/api/app/api/routes.py` with an in-memory store
- [x] T017 [US2] Map validation errors to `{ error: { code, message } }` without echoing a name or a diagnosis

**Checkpoint**: User stories 1 and 2 both work.

---

## Phase 5: User Story 3 - Checker and shared contract (Priority: P3)

**Goal**: One re-query, then a drop. Fake and HTTP adapters share the refusal behavior. Live calls stay out of CI.

**Independent Test**: A stub catalog that returns a held-out theme on the first look is asked once more, and the kit omits that piece. An invalid weekday raises before any I/O on both adapters.

### Tests for User Story 3

- [x] T018 [P] [US3] Checker unit test in `services/api/tests/unit/test_build_session_kit.py`
- [x] T019 [P] [US3] Shared contract tests in `services/api/tests/contract/test_qloo_contract.py`
- [x] T020 [P] [US3] HTTP offline test and skipped live test in `services/api/tests/contract/test_qloo_contract.py`

### Implementation for User Story 3

- [x] T021 [US3] Checker re-query inside `BuildSessionKit` (one extra insights pass, then drop)
- [x] T022 [US3] `HttpQlooAdapter` and `RecordingQlooAdapter` in `services/api/app/adapters/http_qloo.py` and `recording.py`
- [x] T023 [US3] Cache port adapters in `services/api/app/adapters/memory_cache.py` and `file_cache.py`

**Checkpoint**: All three stories pass on the fake adapter.

---

## Phase 6: Polish and cross-cutting

- [x] T024 [P] Supersede the Flutter ADR with `docs/adr/0007-responsive-web-client.md` and update ROADMAP, README, AGENTS, and architecture docs
- [x] T025 [P] Vendor SlopMD and no-slop-design, add prime directives, and add `.github/workflows/ci.yml`
- [x] T026 Run ruff, mypy, pytest, and the SlopMD lab scan on `services/api`; fix findings in this slice

---

## Dependencies and execution order

### Phase dependencies

- Setup first, then foundational work, then stories in order P1, P2, P3.
- Polish docs can be written alongside the API. The scan in T026 is last.

### User story dependencies

- User Story 1 needs the packer, the fake adapter, and the demo route.
- User Story 2 reuses BuildSessionKit. It does not change packing rules.
- User Story 3 adds the checker and the HTTP adapter. The demo stays green without a live key.

### Parallel opportunities

- T003, T005, T006, and T007 touch different files.
- T009 and T010 can be written together.
- T018, T019, and T020 can be written together.

## Parallel example: User Story 1

```bash
# Tests and fixtures can be drafted together:
# tests/unit/test_packer.py
# tests/api/test_demo_plan.py
# app/adapters/fixtures/*.json
```

## Implementation strategy

1. Setup and domain packer.
2. Fake adapter and demo endpoint. Stop and check the 240-minute fill.
3. Session routes and privacy refusals.
4. Checker, contract tests, and the HTTP adapter that does not call the network in CI.
5. Docs, CI, and the lab scan.

The Vite screens in `src/` stay on sample data.

## Notes

- Tests are part of the slice because the constitution requires them for domain and use cases.
- Do not commit a Qloo key, a live body, or `.qloo-cache/`.
- SlopMD check-dep must pass before a new dependency is added. Pin exact versions.
