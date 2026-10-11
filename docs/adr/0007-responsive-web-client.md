# ADR 0007: Responsive web app as the client

- Status: accepted
- Date: 2026-10-11
- Supersedes: [ADR 0006](0006-flutter-client.md)

## Context

Judges need a hosted demo they can finish in a browser. The deadline is 30 October 2026, 21:45 America/Mexico_City. The Qloo key is not here yet.

[ADR 0006](0006-flutter-client.md) chose Flutter for iOS, Android, and a web build, with TestFlight and an APK as extra links. That split the work into a second UI toolkit while a Vite prototype of the twelve screens already existed. The pipeline stays in the Python API from [ADR 0001](0001-backend-fastapi.md). No client holds `QLOO_API_KEY` or calls `hackathon.api.qloo.com`.

## Decision

The deliverable is the responsive web app in `src/`: React, Vite, and TypeScript, evolved from the prototype. Phone, tablet, and desktop share one design system (tokens, `GlassSurface`, characters, cover art).

- Screens stay feature-first. When they leave sample data, they call `/v1` through typed repository interfaces. They do not pack a session and they do not parse a Qloo document.
- The static build is the judge URL. App Store, Play, TestFlight, and an APK are not deliverables.
- A native Swift app is a post-hackathon idea, not a commitment. Flutter and React Native are not the plan.

## Consequences

- One visual language. The prototype rules in `AGENTS.md` stay in force.
- Hosting is the static `dist/` plus the small API in [ADR 0003](0003-hosting.md).
- The session-kit API can land before the screens are wired. Until that wiring, the UI keeps the in-memory sample shelf.
- Do not reintroduce Expo, EAS, Riverpod, or a Flutter app.
