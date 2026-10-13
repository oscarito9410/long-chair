# Tasks: Qloo live wire shape

**Input**: spec.md and plan.md in specs/007-qloo-live-shape.

## Setup

- [x] T001 Read issue and repository constitution, architecture, ADRs and prior specs.
- [x] T002 Create isolated branch from origin/main; configure local personal identity.
- [x] T003 Commit specify/plan/tasks artifacts before implementation.

## US1 - Catalog normalization

- [x] T004 Add synthetic six-kind shape regressions in services/api/tests/unit.
- [x] T005 Normalize documents and map place metadata in services/api/app/adapters.
- [x] T006 Test explainability thresholds, external precedence and nullable fields.

## US2 - Theme verification

- [x] T007 Test and extend issue-listed ids and bounded families in backend/core rules.
- [x] T008 Send semantic media tag parameters and verify exclusion request behavior.

## US3 - Errors and scope

- [x] T009 Add typed provider errors and mocked status/envelope/retry tests.
- [x] T010 Repair scope signal, pacing, backoff and shape-only output; mock full run.

## Completion

- [x] T011 Write ADR 0013 and quickstart with provenance and validation evidence.
- [x] T012 Run required API and aggregate JS checks, informational scans, diff review.
- [ ] T013 Commit, push feature branch, open draft PR using template and Closes #11.

## Dependencies

T003 precedes all implementation. Tests precede their fixes. US2 uses US1's normalized
entity; US3 can be tested independently. Completion follows all three stories.
