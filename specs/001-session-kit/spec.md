# Feature Specification: Session kit (backend + fake Qloo)

**Feature Branch**: `main` (artifacts live in `specs/001-session-kit`; this repo stays on `main`)

**Created**: 2026-10-11

**Status**: Draft

**Input**: User description: "Session kit (backend + fake Qloo)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - A judge opens the mixed four-hour kit (Priority: P1)

A judge, with no taste-graph key of their own, asks for the prepared demo. The service
returns a four-hour chair that is full: a film, an episode, a podcast, a recording, and a
short essay, in that order, with a one-line reason on each and a short plan for the person
sitting alongside. Nothing in the request is a name or a diagnosis.

**Why this priority**: Judging has to work after the key is turned off, and this is the
profile the team already shows. If only this story ships, the demo still has a kit.

**Independent Test**: Ask for the demo kit and compare the schedule with the mixed sample
the prototype already fills. The chair is 240 minutes, the open time is zero, and the five
pieces are the ones that sample already chooses.

**Acceptance Scenarios**:

1. **Given** the mixed demo profile (every sample taste except Sunday Engines, illness and
   hospitals and cancer held out, grief and the death of a parent not held out, a 240-minute
   chair, companion Pebble), **When** a judge asks for the demo kit, **Then** the schedule is
   North Window, Harbor Lights: The Blue Buoy, Slow Kitchen Radio: Bread on a Tuesday, Mira
   Solano at Cedar Hall, and Market Morning, back to back, filling the chair.
2. **Given** that same request, **When** the kit comes back, **Then** each piece carries a
   sentence of the form "Because you love {the taste that justified it}" and the companion
   plan includes topics and nearby places from the fictional sample.
3. **Given** a demo request that also sends a personal name or a diagnosis, **When** the
   service reads it, **Then** the request is refused and that text is not used as a catalog
   query.

---

### User Story 2 - A visitor's draft becomes a kit (Priority: P2)

A visitor has already chosen tastes, themes to hold out, a chair length on the dial, and a
companion. The service stores that draft and, when asked, returns a packed kit. Which
companion was chosen does not change the pieces or their times.

**Why this priority**: The product is a planner, not only a single demo button. The demo
story can ship without this one. This one cannot be shown without a packer.

**Independent Test**: Submit two drafts that differ only by companion. The schedules match.
Submit a length that is not on the dial. The draft is refused.

**Acceptance Scenarios**:

1. **Given** a draft whose length is 60, 90, 120, 150, 180, 210, or 240 minutes and whose
   tastes are known sample works, **When** the visitor starts a session and asks for a plan,
   **Then** the response is a schedule that fits inside that length, with open minutes called
   out when the shelf does not fill the chair.
2. **Given** two drafts that are identical except for the companion, **When** both are
   planned, **Then** the scheduled pieces and times are the same.
3. **Given** a draft with no tastes, or a length the dial does not offer, **When** it is
   submitted, **Then** the service refuses it with a message that can be shown on a screen.
4. **Given** an unknown session, **When** a plan is requested, **Then** the service says the
   session was not found.

---

### User Story 3 - A held-out theme does not survive a second look (Priority: P3)

The catalog is asked to leave out the themes the visitor named. If a piece that carries one
of those themes still comes back, the service asks once more, without that piece, and then
drops anything that still fails. It does not keep asking.

**Why this priority**: The chair is for someone who asked those themes to stay out of the
room. The demo fixtures can already be clean. This story is the safety net.

**Independent Test**: A stand-in catalog returns one piece tagged with a held-out theme on
the first look, and a clean piece on the second. The kit contains the clean piece only, and
the catalog was asked a second time exactly once.

**Acceptance Scenarios**:

1. **Given** illness, hospitals, and cancer are held out, **When** the catalog returns a
   piece carrying one of those themes, **Then** that piece is not in the kit.
2. **Given** the first look included a rejected piece, **When** the service asks again,
   **Then** it asks at most once more and then drops anything that still matches a held-out
   theme.
3. **Given** a catalog query that would be invalid (for example a weekday the catalog does
   not understand), **When** the service is about to ask, **Then** it refuses before any
   lookup, and the stand-in catalog and the live client raise the same kind of refusal.

---

### Edge Cases

- The shelf has nothing that matches. The kit has zero scheduled minutes and says how much
  of the chair is still open.
- A search for a title the stand-in does not know returns an empty list, not an error.
- A replay of a private recording that was never stored fails clearly. It does not invent a
  kit and it does not call the network.
- The optional prose rewrite is absent. The template sentence is kept and the kit still
  succeeds.
- Companion places are omitted when no locality was given. The schedule still returns.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST build a session kit from tastes, held-out themes, and a chair
  length, using a catalog shaped like the documented taste-graph responses.
- **FR-002**: The system MUST serve the mixed four-hour demo without a live catalog key and
  without accepting a name or a diagnosis.
- **FR-003**: The system MUST fill that demo exactly as the existing sample does: the five
  pieces named in User Story 1, in order, with no open minutes.
- **FR-004**: The system MUST ignore the companion when choosing pieces and times.
- **FR-005**: The system MUST attach a short explanation to each scheduled piece. Until the
  catalog's explainability fields are confirmed, the sentence is "Because you love {name}".
- **FR-006**: The system MUST include a companion plan of topics drawn from the pieces that
  were kept, and nearby places when a locality and a weekday were given.
- **FR-007**: The system MUST accept chair lengths only on the existing dial: 60 through 240
  minutes, in steps of 30.
- **FR-008**: The system MUST refuse a personal name, a diagnosis, or any other medical
  field, and MUST NOT send those fields to the catalog.
- **FR-009**: The system MUST resolve held-out themes to content tags, ask for neighbors with
  those tags excluded, and check the answer.
- **FR-010**: The system MUST re-ask at most once, naming the pieces that failed the check,
  and MUST drop anything that fails the second check.
- **FR-011**: The system MUST refuse an invalid catalog query before any lookup, with the
  same refusal whether the catalog is the stand-in or the live client.
- **FR-012**: The system MUST keep stand-in documents fictional. They MUST NOT contain a live
  catalog host, a sample title from the public taste-graph docs, or a key.
- **FR-013**: The system MUST mark catalog fields that are not yet confirmed, in a note that
  sits beside the stand-in documents.
- **FR-014**: The system MUST report whether it is using the stand-in, a live catalog, or a
  private replay, without revealing a key or a raw catalog body.
- **FR-015**: The system MUST leave the existing screens unchanged in this slice. They keep
  reading the in-memory sample until a later slice wires them to this service.

### Key Entities

- **Taste**: A work the visitor already loves. It has a name, a kind, and a short detail.
  The demo uses the fictional shelf already in the prototype.
- **Held-out theme**: A kind of story that should stay out of the room (illness, hospitals,
  cancer, and the others). It is a content rule, not a description of the visitor.
- **Draft**: The chosen tastes, the held-out themes, the chair length, and a companion id.
- **Catalog piece**: A recommended work with a title, a kind, a length, a rank, the tastes
  that justified it, and the themes that appear on it.
- **Kit**: The ordered schedule, how many minutes are filled, how many are still open, the
  explanations, the companion topics, and the nearby places.
- **Session**: A stored draft that can be planned later. It is not an account and it holds
  no medical record.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The mixed four-hour demo returns a schedule whose filled minutes equal 240 and
  whose open minutes equal 0, with the five sample pieces in the prototype's order.
- **SC-002**: Every scheduled piece in that demo shows which loved work it came from, in a
  single sentence a visitor can read without opening another screen.
- **SC-003**: A request that includes a personal name or a diagnosis is refused, and a
  review of what would have been sent to the catalog shows neither field.
- **SC-004**: Two plans that differ only by companion schedule the same pieces for the same
  minutes.
- **SC-005**: When a held-out theme still appears on a returned piece, that piece is absent
  from the kit after at most one further catalog look.
- **SC-006**: An invalid catalog query is refused with no lookup. The stand-in and the live
  client agree on that refusal.

## Assumptions

- This slice delivers the service that builds a kit. The existing web screens stay on their
  sample data until a later slice.
- The stand-in catalog is deterministic and fictional. A live key is not required to pass.
- The live client exists so the same checks can run against it later. Those checks do not
  run in public automation and do not save live answers into the repository.
- Explanations use the template sentence until a recorded payload confirms the explainability
  keys. Pieces whose length the catalog has not confirmed use the team's stated fallbacks,
  labeled as assumed, except where a fictional document supplies a length the prototype
  already uses. That length is still labeled unconfirmed.
- Nearby places are the three fictional spots the prototype already shows, for the demo
  neighborhood, not a hospital chart.
- One language model is optional and off. Its absence does not block the kit.
- The companion id is stored and ignored by the packer, matching the prototype.
