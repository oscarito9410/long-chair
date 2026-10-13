# Feature Specification: Qloo live wire shape

**Feature Branch**: `fix/007-qloo-live-shape`

**Created**: 2026-10-13

**Status**: Draft

**Input**: Issue #11, Fix Qloo adapters and theme verifier for the live API shape.

## User Scenarios & Testing

### User Story 1 - Resolve and explain catalog results (Priority: P1)

A visitor searches for a cultural title and receives a kit without schema failures.

**Independent Test**: Synthetic search and insights envelopes parse artist, movie,
tv_show, podcast, book, and place rows. Search types and nested external ids normalize
to the same entity model as insights. Null text and empty artist duration are accepted.

**Acceptance Scenarios**:

1. Given search without success and with types, mapping retains the requested kind.
2. Given query explainability scores, only qualifying linked seeds explain the item.
3. Given place location or geocode, mapping retains coordinates, address, hours,
   rating, and price without inventing city or closing time.

### User Story 2 - Hold excluded themes out (Priority: P1)

The existing verifier recognizes real tag identifiers and bounded tag families.

**Independent Test**: Each built-in theme is flagged by its issue-listed identifiers;
hospital_visit and death_of_grandmother are also flagged. Unrelated namespaces and
near-miss prefixes do not match. Unknown evidence retains the existing verifier policy.

**Acceptance Scenarios**:

1. Given excluded themes, insights receives filter.exclude.tags as a first pass.
2. Given a returned excluded family tag, the existing checker still rejects the row.
3. Given tag search, semantic search and media tag-type filtering are sent.

### User Story 3 - Diagnose provider failures safely (Priority: P2)

Provider errors remain typed and carry their diagnostic message internally. The scope
script resolves a signal before insights, spaces requests, and retries rate limits.

**Independent Test**: Mock HTTP covers both error envelopes, 400/401/403/429, bounded
retries, signal propagation, and reports with shape information only.

## Requirements

- Normalize optional success, nullable text, numeric episode_count, external ids,
  explainability, affinity and measurements at the adapter boundary.
- Keep ports and the existing mapper/checker architecture; no new dependencies.
- Maintain fictional fixture compatibility and use only synthetic regression records.
- Retry 429 with bounded backoff; pace scope requests at least 0.25 seconds apart.
- Do not probe unsupported video_game insights. No new content types.
- Keep scope output in the gitignored .qloo-live folder by default.
- No UI, voice #7, credentials, deployment, or live paid calls in this change.

## Success Criteria

- All six supported wire shapes parse and map deterministically without API keys.
- All issue-listed theme identifiers and bounded family examples are covered.
- API Ruff, formatting, mypy and full pytest coverage gate pass.
- Aggregate JS formatting, lint, typecheck and tests pass.
- Draft PR links Closes #11 and states that live acceptance was not executed.

## Assumptions and Edge Cases

Issue #11 is the wire-shape evidence; no real response is copied. Unknown measurements
remain adapter-local JSON. Non-numeric duration is unavailable, not zero. Root external
ids take precedence over duplicate nested providers. Missing explainability preserves
the established fallback; an explicitly empty score list does not invent attribution.
Family matching is scoped to media/qloo tag namespaces and underscore boundaries.
The death_of family intentionally blocks broader bereavement under parent-death, as
requested by the issue. Real-host zero-error behavior requires a separately authorized
live run and cannot be proven by mocked tests.

## Review corrections (2026-10-13)

- Parse daily hours as lists of objects with opens/closes or closed=true, preserving
  legacy display strings without inferring an open-until time.
- Explainability accepts object or list shapes. Invalid optional explanations must
  never discard an insights entity; valid finite scores survive mixed lists.
- Scope coordinates use WKT POINT(longitude latitude). Named locality queries retain
  filter.location.query; no coordinate string is placed in that parameter.
- Generic death_of families and death/death_and_remembrance tags map to grief.
  Parent, mother, and father relations alone map to parent-death. Cross-language
  parity must also assert absence of a parent-death flag for unrelated bereavement.
- Restore QLOO_LIVE_DIR override; its contents remain private and outside commits.
- Default pytest must remain offline even when credentials are present. Live tests
  require explicit command-line opt-in in addition to their existing key/env gates.

External reviewer results are not implementation-agent validation. No live calls or
real response data may be used for this revision.
