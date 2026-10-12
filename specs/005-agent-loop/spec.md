# Feature Specification: Agentic kit builder

**Feature Branch**: `feat/005-agent-loop`

**Created**: 2026-10-12

**Status**: Draft

**Input**: Issue #6: Agentic kit builder over the existing cultural catalog and session rules.

## User Scenarios & Testing

### User Story 1 - Build a verified kit with an agent (Priority: P1)

A visitor asks for a kit from selected tastes, held-out themes, and a chair length. An optional agent explores recommendations and lengths, while the server owns theme checks and packing.

**Why this priority**: A useful kit must honor the visitor's content preferences even when the agent makes a mistake.

**Independent Test**: A scripted agent with the fictional catalog returns scheduled pieces, explanations, topics, and nearby places. An injected avoided theme never appears in returned pieces.

**Acceptance Scenarios**:

1. **Given** selected tastes and themes, **When** an agent retrieves recommendations and finishes, **Then** every returned item passes the existing theme verifier and the schedule fits the chair.
2. **Given** a recommendation carrying an avoided theme, **When** the agent omits its checking action, **Then** the server still removes that recommendation.
3. **Given** optional nearby context, **When** the agent asks for places, **Then** the existing companion place rules provide the results.

### User Story 2 - Finish predictably when the agent cannot (Priority: P1)

A visitor still receives a useful deterministic kit when no model is configured, a provider fails, or an exploration budget expires.

**Why this priority**: The judge demo and keyless development must remain usable.

**Independent Test**: No-key, provider failure, invalid arguments, step exhaustion, and slow tools produce verified kits without unbounded exploration.

**Acceptance Scenarios**:

1. **Given** no model key, **When** a kit is requested, **Then** the deterministic builder returns the same kit fields and an empty trace.
2. **Given** an eight-step or time budget, **When** it is exhausted, **Then** exploration stops and the server packs verified observed items, or uses the deterministic builder if none are packable.
3. **Given** invalid tool arguments or a tool failure, **When** the agent continues, **Then** it receives a bounded error result without private arguments or provider bodies leaking into the response.

### User Story 3 - Inspect and compare the agent (Priority: P2)

A developer can inspect the exploration trace and compare it with deterministic and model-only baselines before choosing a live configuration.

**Why this priority**: The experiment should be measurable without claiming an unmeasured improvement.

**Independent Test**: A local keyless script prints verifier pass rate, duration fit, type diversity, steps, and latency for all three strategies.

**Acceptance Scenarios**:

1. **Given** completed or failed tool actions, **When** the response is inspected, **Then** the trace shows step, tool, argument summary, result count, latency, and status.
2. **Given** fictional fixtures, **When** the comparison is run, **Then** all three rows print without network or keys.

### Edge Cases

- Unknown tools, malformed JSON, extra parameters, unselected taste IDs, and unsupported content kinds are refused before catalog I/O.
- An agent cannot replace themes, chair length, catalog records, locality, or weekday through tool arguments or its final text.
- Empty recommendations leave room open; a short kit is valid.
- Multiple calls in a model turn consume the same total step budget.
- Cancellation interrupts an in-flight model or tool call; final packing uses only completed results.

## Requirements

### Functional Requirements

- **FR-001**: Support optional agent exploration through search, insights, theme verification, duration fitting, places, and enrichment actions over the existing catalog/use cases.
- **FR-002**: Always apply the existing theme verifier after exploration, including fallback paths. It is the only content safety rule.
- **FR-003**: Limit exploration to eight tool actions and eight model turns by default, with a 20-second wall budget. Finalization/fallback has its own bounded 10-second budget.
- **FR-004**: Use catalog-owned records and measured or estimated lengths; final model prose cannot supply or edit kit items.
- **FR-005**: Return the existing kit shape plus a trace. Missing model credentials produce the deterministic kit with `trace: []`.
- **FR-006**: Keep titles, IDs, content tags, and chair context within existing privacy boundaries. Do not send names, diagnoses, medical records, raw catalog bodies, or companion identity to a model.
- **FR-007**: Keyless tests must use scripted model turns and fictional or privately replayed catalog data. Live checks remain opt-in and gated by both keys.
- **FR-008**: Print a baseline comparison table without persisting catalog payloads. Live recordings remain in the existing ignored cache only.

### Key Entities

- **Agent run**: Server-owned draft, observed candidates, resolved interests, nearby places, budgets, and termination reason.
- **Tool action**: Named action with validated arguments and a mapped result or fixed error code.
- **Trace entry**: Sequential step, known tool name, redacted argument summary, result count, milliseconds, and status.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Every returned item passes the current verifier, including an avoided-theme injection test.
- **SC-002**: No scripted run exceeds its configured tool or model-turn budget, and delayed I/O is cancelled when the wall budget expires.
- **SC-003**: Every returned schedule fills at most its requested minutes.
- **SC-004**: Keyless end-to-end tests and all required quality gates pass; domain/application coverage remains at least 85 percent.
- **SC-005**: The comparison prints all five measures for three strategies without network access in its default mode.

## Assumptions

- Scope is the API experiment only; voice, mobile UI, memory, and fine-tuning are excluded.
- The API's existing checker is the verifier for this change. ADR 0009's richer frontend evidence model is not silently reimplemented in Python.
- Default wall budgets are conservative local experiment values, configurable by the server rather than request arguments.
- A real paid provider call requires separate approval; creating the capability does not run it.
