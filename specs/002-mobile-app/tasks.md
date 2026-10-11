# Tasks: Native Long Chair app

**Input**: [spec.md](spec.md), [plan.md](plan.md)

## Phase 1 - Shared kit

- [x] T001 Move domain helpers and fixtures into `packages/core`
- [x] T002 Add `KitService` with fixture and HTTP adapters and tests
- [x] T003 Point the web app at `@long-chair/core` without changing screen behavior

## Phase 2 - Expo app

- [x] T004 Scaffold `apps/mobile` on Expo SDK 57 with expo-router and strict TypeScript
- [x] T005 Port welcome, tastes, length, themes, company, building, ready, kit, item sheet, companion, compare, and settings
- [x] T006 Glass tab bar, sheets, and cards via `GlassView`, with `BlurView` when liquid glass is unavailable
- [x] T007 Original icon, splash, bundle id, privacy manifest, and `eas.json`

## Phase 3 - Store and checks

- [x] T008 Write `docs/app-store.md` (review notes, nutrition label, description, keywords, age rating, screenshots)
- [x] T009 Fail the build when banned claim phrases appear in mobile copy
- [x] T010 Extend CI with mobile typecheck, lint, test, and expo-doctor
