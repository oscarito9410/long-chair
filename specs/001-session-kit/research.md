# Research: Session kit (backend + fake Qloo)

## Decision: Stay on the Vite app

- **Decision**: The deliverable client is the existing React, Vite, and TypeScript app,
  grown feature-first. Flutter is superseded. Swift is post-hackathon only.
- **Rationale**: The prototype already has the design system, the twelve screens, and the
  packer behavior the demo must match. Another client would spend the hackathon on a port.
- **Alternatives considered**: Flutter (ADR 0006, superseded). Expo / React Native
  (ADR 0005, superseded). Kotlin Multiplatform with SwiftUI and Compose (not chosen).

## Decision: FastAPI hexagonal service

- **Decision**: Python 3.12, FastAPI, layers `domain`, `application`, `ports`,
  `adapters`, `api` under `services/api`.
- **Rationale**: ADR 0001. The pipeline is a few calls plus a pure packer. Oscar can
  review Python. The web app never holds the key.
- **Alternatives considered**: A Node server sharing TypeScript types. Rejected in
  ADR 0001. Putting Qloo calls in the Vite bundle. Forbidden.

## Decision: Fake fixtures shaped like documented Qloo JSON

- **Decision**: Committed fixtures use the movie insights envelope (`success`,
  `results.entities[]`, `name`, `entity_id`, `subtype`, `properties`). Fictional titles
  only. Unconfirmed keys are listed in `fixtures/CONFIDENCE.md` and carry
  `x-long-chair-confidence` where a value is ours.
- **Rationale**: Contract tests can treat the fake and the live client as the same port.
  Hackathon rules forbid real Qloo payloads in the public repo.
- **Alternatives considered**: Reuse the public docs samples (Django Unchained, Guardians
  of the Galaxy). Rejected. Plain domain JSON with no Qloo shape. Rejected, because the
  mapper would be untested against the real envelope.

## Decision: Non-movie duration

- **Decision**: Movie `properties.duration` is confirmed and used as minutes. Other kinds
  use a fixture duration when present and still label the source assumed, because that
  field is unconfirmed. Missing durations fall back to tv 44, podcast 36, book 30,
  artist 28. The book fixture uses 24 minutes so the mixed demo still fills 240.
- **Rationale**: The prototype's Market Morning is 24 minutes. A 30-minute assumption
  would leave the last slot empty. The label stays honest.
- **Alternatives considered**: Force the 30-minute fallback and accept an open 24 minutes.
  Rejected. The spec requires the demo to fill.

## Decision: Checker asks once

- **Decision**: Insights are requested with exclusion tags. The checker drops anything
  whose theme tags or description still match a held-out theme, then one insights call
  per kind is repeated with `filter.exclude.entities`. A second failure is a drop, not a
  loop.
- **Rationale**: Matches the architecture note. The fake adapter filters tags itself. A
  stub port in the unit tests forces the second look.
- **Alternatives considered**: Trust the catalog filter only. Rejected. Loop until clean.
  Rejected.

## Decision: Explanations

- **Decision**: "Because you love {seed name}" from explainability links when the
  unconfirmed block names an input entity at score 0.1 or above. Otherwise the interests
  that were sent.
- **Rationale**: The prose on docs.qloo.com describes the block. The JSON keys are not
  confirmed. The sentence matches the prototype.
- **Alternatives considered**: Wait for a live recording before returning any why line.
  Rejected. The kit would ship blank.

## Decision: Live contract tests stay out of CI

- **Decision**: Shared cases run on the fake adapter always. The HTTP adapter runs the
  pre-I/O refusal cases against a transport that throws if used. A live module skips
  unless `QLOO_API_KEY` is set, and it must not write bodies into the repo.
- **Rationale**: A failed assertion on a live body would publish Qloo data in a log.
- **Alternatives considered**: Record live JSON as golden files. Forbidden.

## Decision: no-slop-design vendored

- **Decision**: Copy the MIT skill into `.cursor/skills/no-slop-design`, without the
  `docs/images` tree. Run `slop_lint.py` on `src/` in CI with `continue-on-error`.
- **Rationale**: The license allows copying if the copyright and permission notice stay.
  The check is a question, not a rewrite of the existing glass and type rules. Blocking
  it on day one would fail CI on the prototype's deliberate glass.
- **Alternatives considered**: Document a clone step and do not vendor. Unnecessary,
  because the license allows the copy. Make the lint blocking immediately. Rejected for
  this slice.

## Decision: Frontend tests are not added in this slice

- **Decision**: CI runs format, lint, typecheck, and build for the Vite app, and
  `slop_lint.py` as a non-blocking step. Component tests wait until a screen calls the
  API.
- **Rationale**: The spec says the screens stay unchanged. Adding a test runner would
  touch the frontend toolchain for no new behavior.
- **Alternatives considered**: Vitest around `packSession`. Useful later, out of this
  slice. The Python packer is the one under test.
