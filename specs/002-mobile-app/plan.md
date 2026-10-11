# Implementation Plan: Native Long Chair app

**Branch**: `main` | **Date**: 2026-10-11 | **Spec**: [spec.md](spec.md)

## Summary

Add an npm workspace. Move the Vite app to `apps/web`. Put framework-free kit logic in `packages/core`. Add `apps/mobile` on Expo SDK 57 with expo-router. The review build uses the fixture `KitService`. An HTTP adapter is ready for the FastAPI session API and never sees a Qloo key.

## Technical Context

**Language**: TypeScript strict, Expo SDK 57, React Native 0.86

**Testing**: Vitest for core and for the mobile claim and store-config checks. jest-expo is not required for this slice.

**Target**: iOS first. `eas.json` profiles: development, preview, production. iOS build numbers auto-increment.

**Constraints**: Entertainment / Lifestyle only. No HealthKit. No analytics. No account. Sample label until live. Original art. No material from the private third-party Expo app recorded in [ADR 0008](../../docs/adr/0008-expo-client.md).

## Constitution Check

Privacy, the medical disclaimer, fictional fixtures, and the ban on a client-side Qloo key all still hold. The web demo is unchanged in behavior.

## Project Structure

```text
apps/web/                 judge demo
apps/mobile/              Expo app
  app/                    expo-router screens
  src/                    glass, art, copy, session state
packages/core/            kit model, KitService, fixtures, tests
docs/app-store.md         review notes and the nutrition label
specs/002-mobile-app/     this feature
```

## Complexity Tracking

No constitution violation. The extra app exists because TestFlight is a separate deliverable from the judge URL.
