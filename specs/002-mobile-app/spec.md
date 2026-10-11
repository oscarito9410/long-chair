# Feature Specification: Native Long Chair app

**Feature Branch**: `main` (artifacts live in `specs/002-mobile-app`; this repo stays on `main`)

**Created**: 2026-10-11

**Status**: Draft

**Input**: User description: "Expo iOS app beside the web demo, TestFlight next, App Store after live data"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Open a sample kit with no account (Priority: P1)

A person installs Long Chair, sees that the shelf is a fictional sample, and opens a kit that fits a long session. No sign-in is offered. Nothing is sent.

**Why this priority**: App Review and TestFlight both have to work before a live catalog exists.

**Independent Test**: Launch with `EXPO_PUBLIC_API_URL` unset. Welcome shows the sample label and "Not medical advice". "See a sample kit" opens a filled timeline.

**Acceptance Scenarios**:

1. **Given** a fresh install, **When** the person taps "See a sample kit", **Then** the kit lists the sample pieces and says the shelf is fictional.
2. **Given** that kit, **When** the person opens a piece, **Then** a sheet shows the cover, the title, one reason, and the theme check.
3. **Given** Settings, **When** the person reads it, **Then** "Not medical advice", the sample label, the on-device note, and the no-account note are visible.

### User Story 2 - Walk the same questions as the web demo (Priority: P1)

The person can move through tastes, length, themes, company, building, and the ready stamp, then switch among Kit, Companion, and Compare.

**Why this priority**: The native app is the same product as the judge demo, not a thinner cousin.

**Independent Test**: From welcome, tap Get started and finish on the kit. Each screen has a way forward. Themes and tastes stay on the device.

**Acceptance Scenarios**:

1. **Given** onboarding, **When** the person is on length, themes, company, or building, **Then** a back control and progress are visible, and "Not medical advice" is on the screen.
2. **Given** a theme toggle, **When** the person leaves and returns during the visit, **Then** the choice is still selected and was not uploaded.
3. **Given** reduced motion, **When** building runs, **Then** every step is already done and the dot field does not travel.

### User Story 3 - Plan through the session API without a Qloo key (Priority: P2)

When `EXPO_PUBLIC_API_URL` points at the FastAPI service, the app asks that service for a plan. The binary still has no Qloo key.

**Why this priority**: Live data comes later, through the server. The phone must not grow a catalog key.

**Independent Test**: Point the env var at a local fake-mode API. The plan source is `fake`. Request headers do not carry a Qloo key.

**Acceptance Scenarios**:

1. **Given** an API URL, **When** the kit loads, **Then** the app posts the draft to `/v1/sessions` and then posts `/plan`.
2. **Given** no API URL, **When** the kit loads, **Then** the fixture adapter runs on the device and the sample label stays.

### Edge Cases

- An unknown piece id shows "That piece is not on the shelf" and a way back to the kit.
- A failed plan shows the error and a way to restore the sample.
- Liquid glass is absent. Sheets, the tab bar, pills, and cards still read as frosted glass through the blur fallback.
- Copy that claims treatment or anxiety relief fails the mobile claim check.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The app name is Long Chair and the iOS bundle id is `com.oscarito9410.longchair`.
- **FR-002**: The app works with no account and no network in the review build.
- **FR-003**: Sample data is labeled in the UI until the plan source is `live`.
- **FR-004**: "Not medical advice" is visible in onboarding and in Settings.
- **FR-005**: Avoided themes are content preferences stored only on the device in the review build.
- **FR-006**: The app does not collect diagnosis, treatment, or HealthKit data and does not declare a HealthKit entitlement.
- **FR-007**: Copy does not make medical or therapeutic claims. A test fails if the banned phrases appear in the mobile sources.
- **FR-008**: The Qloo key is not in the app. The HTTP adapter calls only the session-kit API.
- **FR-009**: Shared kit logic lives in `packages/core` and is not copied into either app.
- **FR-010**: Covers are drawn without text. The title sits beside or below the cover.
- **FR-011**: The primary store category is Entertainment and the secondary is Lifestyle.

### Key Entities

- **Session draft**: tastes, avoided theme ids, duration, companion. On device.
- **Session plan**: packed slots, items, topics, places, and a source of fixture, fake, live, or replay.
- **Kit service**: the port both adapters implement.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Typecheck, lint, mobile tests, the web build, `expo export` for iOS, and `expo-doctor` succeed.
- **SC-002**: A reviewer can open the sample kit, the companion plan, compare, and Settings without an account.
- **SC-003**: The claim-phrase test fails if "helps treatment" or "reduces anxiety" is added to mobile copy.

## Assumptions

- The web app remains the judge demo and keeps its in-memory packer until a later change.
- Android uses the same project and is not the first store submission.
- A signed TestFlight build is produced on Oscar's Mac, not in this workspace.
