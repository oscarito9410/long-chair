# Research: Native Long Chair app

## Decision: Expo SDK 57

Expo SDK 57 is the current stable SDK (package `expo@57.0.27`). expo-router 57, `expo-glass-effect` 57, and `expo-doctor` 1.20.4 match that SDK. React Native 0.86.3 is the bundled runtime.

`check-dep` returned caution for `expo` and `react-native-reanimated` only because other versions have advisories. The pinned versions do not. Both are required.

The workspace hoists React 19.3.0 for the web app. React Native accepts `^19.2.3`. `expo.install.exclude` lists `react`, `react-dom`, and `@types/react` so the doctor does not force a downgrade of the web app.

## Decision: Fixture on device, HTTP only to our API

The review build leaves `EXPO_PUBLIC_API_URL` empty. `createKitService` then uses the fixture adapter. A set URL posts the draft to the existing FastAPI routes. The phone never sends `X-Api-Key`.

## Decision: Glass fallback

`isLiquidGlassAvailable()` is false on web, on Android, and on iOS before the liquid-glass OS. Those builds use `BlurView`. The iOS bundle loads `GlassView` only from the `.ios` module.

## Decision: Vitest for mobile logic

The claim scan and the store-config checks are Node tests. They do not need a native runtime. `expo export --platform ios` proves the bundle resolves.

## Alternatives considered

A second copy of the packer inside the Expo app was rejected. A HealthKit entitlement was rejected. Medical and Health & Fitness categories were rejected.
