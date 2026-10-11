# Long Chair Constitution

## Core Principles

### I. SOLID

Each module has one reason to change. Callers depend on interfaces (ports, repository
contracts, component props), not on concrete adapters or screens. A new adapter, a new
screen, or a new content kind extends the system without rewriting the pipeline or the
packers. Functions that mix parsing, policy, and I/O are split before they are merged.

### II. High cohesion and low coupling

A feature owns its screens, state, and data access. A use case owns one outcome. Domain
types are the language shared across a boundary. The web app does not import the API
package. The API does not import React. Qloo JSON does not leave the adapter that parsed it.

### III. DRY

Validation rules, JSON models, mappers, design tokens, and packer rules exist once.
Contract tests are one suite run against each adapter, not a copy per adapter. A second
implementation of the same rule is a bug. Shared copy that would couple unrelated features
stays duplicated on purpose, and that choice is written down.

### IV. Clean Architecture dependency rule

Inner layers never import outer layers. Domain imports nothing from application, ports,
adapters, or the API framework. Application imports domain and ports. Adapters and the API
layer sit outside and depend inward. A test may wire an adapter to a use case. Production
domain code may not.

### V. Ports and adapters

The pipeline depends on `QlooPort`, `LlmPort`, and `CachePort`. `HttpQlooAdapter`,
`FakeQlooAdapter`, and `RecordingQlooAdapter` are the Qloo I/O. The web client talks to
our `/v1` API through typed repository interfaces. Screens do not call Qloo, and they do
not pack a session once the plan endpoint owns that job.

### VI. Test-first where practical

New domain rules and use cases start with a failing unit test when the behavior is already
specified. Adapters share contract tests. The HTTP API has tests. The web client has
component tests once a screen is wired to the API. Coverage on `domain` and `application`
stays at or above 85 percent. A test that needs a live Qloo key does not run in public CI
and does not snapshot a live body.

### VII. Strict typing

TypeScript stays `strict`. Python stays `mypy --strict` on the API package. Python on the
frontend toolchain, when type-checked there, uses pyright. `Any` is not a way through a
review. Unconfirmed external fields are typed as optional and named in the fixture
confidence note.

### VIII. Linters, formatters, and small modules

Ruff and ESLint are required in CI. Formatters are required in CI. A function does one
thing and fits on a screen. A module stays near a single responsibility, about 220 lines,
and is split before it takes a second job. Warnings are not left behind to land a change.

### IX. No dead code

Unused exports, commented-out blocks, unreachable branches, and abandoned feature flags
are removed in the same change that makes them unused. A scaffold for a client that the
team has dropped does not stay in the tree as living instructions.

### X. Architecture decision records

Every significant decision is an ADR in `docs/adr/`: the choice, the context, and the
consequences. Superseding a decision updates the old record's status and points at the new
one. Chat history is not the record.

### XI. Privacy

Qloo and any language model receive cultural titles, entity ids, tag ids, and an optional
locality. They do not receive a person's name, a companion's real name, a diagnosis, a
treatment, or a medical record. Exclusion themes are sent as content-tag ids. Keys,
recorded Qloo bodies, and the demo-profile cache stay out of git. The medical disclaimer
stays visible. Long Chair is not medical advice.

### XII. Accessibility

Interactive targets are at least 48px. Body text is at least 1.125rem. Supporting text is
at least 1rem. Focus is visible. The product is usable with a keyboard and with reduced
motion. Color is not the only signal. Contrast on glass meets WCAG AA for the text that
sits on it.

### XIII. No AI slop in the design

Visual and interaction choices are made on purpose and can be named. Default-reflex
gradients, interchangeable card grids, and copy that could sit on any product are treated
as defects. The design skill at `.cursor/skills/no-slop-design` is the reference. Its
`slop_lint.py` check runs on frontend files. It is informational until the team turns it
into a blocking gate. A lint hit is a question, not an automatic rewrite of the existing
design system.

### XIV. No AI slop in the code

SlopMD is the code check. The prime directives between the `slopmd` markers in `AGENTS.md`
and in `.cursor/rules/slopmd.mdc` are binding for code and docs this team writes. Before
any new dependency, run `check-dep` and pin an exact version. Exit 0 may proceed. Exit 1
needs a one-line reason. Exit 2 stops until a person decides. The lab scan covers the API
and `src/`. Both scans run in CI and stay non-blocking until the inherited prototype
tree is clean and a person turns the gate into a failing check. Do not add another code
anti-slop plugin.

## Product constraints

The deliverable is a responsive web app: React, Vite, and TypeScript, evolving the
prototype in `src/`. Phone, tablet, and desktop layouts share one design system (tokens,
`GlassSurface`, characters, cover art). A native Swift app is a post-hackathon idea, not
a commitment. Flutter and React Native are not the client plan.

The API is Python and FastAPI, arranged as domain, application, ports, adapters, and an
API layer. Deploy is a static frontend and a small API process. The fake Qloo adapter is
the default until a key exists. After the key is deactivated, judges are served from the
private demo-profile cache.

Fictional sample data only in the public repository. No Qloo key. No live Qloo payload.

## Quality gates

A change is done when, for the code it touches:

- The relevant tests pass, including the coverage gate on domain and application.
- `mypy --strict` and the TypeScript build are clean for the packages that changed.
- Ruff, ESLint, and the formatters are clean in CI.
- `slop_lint.py` and the SlopMD lab scan have been run on the code this change touches.
  A failure there does not fail CI yet. Inherited prototype findings do not block until
  that tree is cleaned on purpose.
- Privacy and accessibility principles still hold.
- A significant decision has an ADR.

`AGENTS.md` is the day-to-day guide. This constitution wins if they disagree.

## Governance

This constitution supersedes informal practice. An amendment updates this file, bumps the
version, and notes the date. A new principle or a material expansion is a minor version. A
redefinition that invalidates an existing principle is a major version. Wording fixes are
a patch.

Reviews check the dependency rule, the privacy rules, and the test gate before merge.
Complexity that breaks a principle is rejected or recorded as an ADR with the simpler
alternative and why it lost.

**Version**: 1.1.0 | **Ratified**: 2026-10-11 | **Last Amended**: 2026-10-11
