# ADR 0008: Expo app beside the web demo

- Status: accepted
- Date: 2026-10-11
- Supersedes in part: [ADR 0004](0004-monorepo.md), [ADR 0007](0007-responsive-web-client.md)

## Context

Judges still need a hosted web demo they can finish in a browser. Oscar also wants an iPhone build on TestFlight, then App Store review once a live catalog is wired. Android comes after iOS.

The session kit already lives behind `QlooPort` in the FastAPI service. No client may hold `QLOO_API_KEY` or call `hackathon.api.qloo.com`.

A private Expo application by Divyanshu Patil and Bhavesh More, all rights reserved, was useful at the idea level: liquid-glass surfaces with an availability fallback, a themed surface palette with a tint well per screen, glass avatars and pills, mascot characters with animation states, and a split between theme tokens and components. That work is not a source tree for Long Chair.

## Decision

The repo is an npm workspace.

```text
apps/web/        Vite judge demo. Still packs the in-memory shelf.
apps/mobile/     Expo SDK 57, expo-router, TypeScript strict. iOS first.
packages/core/   Framework-free kit model, packer, copy, and fixtures.
services/api/    FastAPI. Unchanged by this decision.
```

`packages/core` exposes a `KitService` port. The fixture adapter packs the sample shelf. The HTTP adapter calls `POST /v1/sessions` and `POST /v1/sessions/{id}/plan` when `EXPO_PUBLIC_API_URL` is set. The review build leaves that variable empty, so nothing leaves the phone.

Glass on iOS uses `GlassView` from `expo-glass-effect` when `isLiquidGlassAvailable()` is true. Every other case uses `BlurView`. Characters, covers, and the dot field are original drawings. Covers contain no text.

App Store category is Entertainment, with Lifestyle as the secondary. The app is not Medical and not Health & Fitness. It does not use HealthKit, an account, or an analytics SDK. Avoided themes are content preferences kept on the device. "Not medical advice" stays visible in onboarding and in Settings. Sample data stays labeled until a live catalog is connected.

## Consequences

- The design was inspired by the third-party app named above and contains no material from it: no copied code, assets, names, mascots, or palettes.
- The judge URL remains the web app from [ADR 0007](0007-responsive-web-client.md).
- TestFlight and App Store submission run on a Mac with an Expo and Apple login. This repository cannot produce a signed binary.
- `check-dep` reported caution for `expo@57.0.27` and `react-native-reanimated@4.5.1` because other versions have advisories. These pins do not. They are required by the current Expo SDK.
