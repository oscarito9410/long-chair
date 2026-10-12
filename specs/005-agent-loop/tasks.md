# Tasks: Agentic kit builder

**Input**: [plan.md](plan.md), [spec.md](spec.md), research, model, and contracts.

## Phase 1: Setup

- [x] T001 Inspect ownership and create isolated `feat/005-agent-loop`; commit design in `specs/005-agent-loop/` before implementation.
- [ ] T002 Locate or provision a task-local uv environment for `services/api/pyproject.toml` in the approved light resource window.

## Phase 2: Foundation

- [ ] T003 Extend native tool/turn contracts in `services/api/app/ports/llm.py`, retaining rewrite.
- [ ] T004 Add deterministic scripted turns in `services/api/app/adapters/fake_llm.py` and MockTransport contract tests in `services/api/tests/contract/test_llm.py`.
- [ ] T005 Implement configurable, validated HTTP native tool calls in `services/api/app/adapters/openai_llm.py`.

## Phase 3: US1 - Verified agent kit (P1 MVP)

Independent test: fictional agent returns a packed kit and injected avoided themes are removed even without a verify tool call.

- [ ] T006 [US1] Add six-tool behavior and injection tests in `services/api/tests/unit/test_agent_tools.py` and `test_agent.py`.
- [ ] T007 [US1] Implement strict known-ID/kind arguments and request state in `services/api/app/application/agent/`.
- [ ] T008 [US1] Implement catalog, checker, duration, places, and enrichment tools in `services/api/app/application/agent/tools.py`.
- [ ] T009 [US1] Implement loop and authoritative verified packing in `services/api/app/application/agent/build_agent_kit.py`.
- [ ] T010 [US1] Wire injection/configuration and response trace in `services/api/app/api/composition.py`, `schemas.py`, `agent_routes.py`, and `main.py`.
- [ ] T011 [US1] Add endpoint fake E2E and invalid-body tests in `services/api/tests/api/test_agent.py`.

## Phase 4: US2 - Bounded fallback (P1)

Independent test: no credentials, bad arguments, provider/tool failures, multiple calls, and delayed I/O produce bounded verified behavior.

- [ ] T012 [US2] Add no-key, step/time-limit, tool-error, malformed-args, and cancellation tests in `services/api/tests/unit/test_agent.py` and `tests/api/test_agent.py`.
- [ ] T013 [US2] Implement fixed error replies, bounded trace, and separate exploration/finalization deadlines in `services/api/app/application/agent/build_agent_kit.py`.
- [ ] T014 [US2] Validate key/model/budget configuration and close owned HTTP resources in `services/api/app/api/composition.py` and `main.py`.

## Phase 5: US3 - Compare and inspect (P2)

Independent test: the default keyless comparison prints three strategy rows and all five metrics without I/O.

- [ ] T015 [US3] Add scoring and table tests in `services/api/tests/unit/test_agent_metrics.py`.
- [ ] T016 [US3] Implement metrics hook in `services/api/app/application/agent/metrics.py` and comparison in `services/api/app/live/agent_metrics.py`.
- [ ] T017 [US3] Add a live opt-in test gated by both keys in `services/api/tests/live/test_agent.py`.

## Phase 6: Polish

- [ ] T018 Update setup and ADR links in `README.md`, `AGENTS.md`, `docs/adr/0002-llm-optional.md`, and `docs/architecture/ARCHITECTURE.md`.
- [ ] T019 Run all API quality gates, repo lint/typecheck/tests, format for touched docs, and informational SlopMD in `services/api/` and repository root.
- [ ] T020 Inspect diff/privacy, push only the feature branch, and open a draft PR using `.github/PULL_REQUEST_TEMPLATE.md` with issue acceptance criteria and `Closes #6`.

## Dependencies & Execution Order

T001 -> T002-T005 -> US1 -> US2 -> US3 -> polish. Tests are written before the related implementation; actual runs depend on the isolated environment. All work is serial to preserve ownership and the workstation resource reservation.

## Parallel Opportunities

Separate MockTransport/endpoint/metrics test files could be authored independently after their contracts exist. Examples: US1 tool tests and endpoint tests; US2 timeout tests and config tests; US3 table tests and live opt-in tests. This execution intentionally uses one owner and serial checks.

## Implementation Strategy

First deliver the verified keyless MVP, then exercise bounded failure behavior, then add evaluation and docs. Commit each focused change and stop after the draft PR; no merge, main push, or review-agent trigger.
