# ADR 0006: Flutter for iOS, Android, and the hosted demo

- Status: accepted
- Date: 2026-10-11
- Supersedes: [ADR 0005](0005-client-strategy.md)

## Context

Judges need a hosted demo they can finish in a browser, and installable builds for iOS and Android. The deadline is 30 October 2026, 21:45 America/Mexico_City. About nineteen days remain. The Qloo key is not here yet.

Oscar leads the team. His deepest client experience is Flutter. He also builds Swift and iOS, and Python backends. He has little React Native experience, so that option is closed. The alternative he would consider is Kotlin Multiplatform for a shared domain layer, with SwiftUI and Compose for the two native interfaces.

The pipeline (resolve, insights, checker, packer, companion plan) lives in the Python API from [ADR 0001](0001-backend-fastapi.md). Every client calls that API. No client holds `QLOO_API_KEY` or calls `hackathon.api.qloo.com`.

The Vite app in `src/` is the design reference: warm cream, restrained glass, the twelve screens, the type floors, the 48px targets. It is not thrown away. It is not the codebase we extend into the store builds.

## What a judge can open

| Path                      | How we ship it                                                                              | By 30 October                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Public HTTPS URL          | Flutter web build on Vercel or Cloudflare Pages, or the Vite app if the web-feel pass fails | Required. This path cannot slip                                                                        |
| Android APK               | `flutter build apk --release`, file hosted beside the demo                                  | Yes, after the app boots. Sideload. No Play review                                                     |
| TestFlight public link    | Apple Developer account, upload, Beta App Review, then a public link                        | A real goal if the account is active this week and the first external build is submitted on 23 October |
| App Store or Play listing | Full store review. Play also has a closed-testing wait on new personal accounts             | Out of scope                                                                                           |

Apple Developer Program is 99 USD a year. An individual enrollment is often the same day and sometimes two days. An organization account that still needs D-U-N-S will not clear. Enroll on 11 October if the account is not already active, and use an individual account when the organization path is not already approved.

Internal TestFlight (the team, up to 100 App Store Connect users) can install as soon as processing finishes, about 10 to 15 minutes after upload. There is no Beta App Review for internal testers. A `flutter build ipa` needs a Mac or a macOS CI runner. Oscar already ships iOS, so a Mac is the assumed path. A cloud build is optional, not a requirement.

The public TestFlight link needs Beta App Review on the first build of a version. Apple does not publish a TestFlight-only clock. Its App Review figure is at least half of submissions under 24 hours and 90 percent under 48 hours. Later builds of the same version sometimes skip review. The first one does not. Budget one rejection. Submit the external build on 23 October with a beta description, a feedback email, export-compliance answers (HTTPS only), and a note that the demo needs no account. The public link is created only after approval.

## Option A: Flutter, one codebase

One Dart app in `apps/client`. The same widgets run on iOS, Android, and the web build (`flutter build web`). Twelve screens, written once, against the design reference.

Speed over nineteen days: this is the option that fits. Oscar is fastest in Flutter. The work is a faithful port of screens he can already see, plus a thin API client. The backend teammate can build the fake adapter in parallel. The risk is Flutter web feel, called out below, not a second UI toolkit.

### Liquid glass

The look we want is the prototype's restrained glass, not a full-screen refraction toy. `GlassSurface` is our widget. It clips, blurs with `BackdropFilter` and `ImageFilter.blur`, and tints with the cream token. Thickness (thin, regular, thick) comes from a `ThemeExtension`, the same three roles as the prototype: rows and pills, the dial and the stamp, the tab bar and kit cards.

Checked on pub.dev while writing this note:

| Package                             | What it is                                                                                                                             | Why it is not the plan                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `liquid_glass_renderer` 0.2.0-dev.4 | Shader refraction. Impeller only. The package says web, Windows, and Linux are unsupported. It offers `FakeGlass` via backdrop filters | Experimental, and it cannot render the judge website                                                                                      |
| `liquid_glass_kit` 1.0.0            | `BackdropFilter` widgets, a quality enum, and a `ThemeExtension`. Claims web under the CanvasKit renderer                              | The same effect as a widget we can own in one file. A third-party kit is another API to restyle into our tokens                           |
| `flutter_liquid_glass_kit`          | Native SwiftUI glass on iOS 26 and macOS 26, Flutter blur on Android and web                                                           | Real iOS 26 glass, plus platform views and scroll coordination. A possible follow-up after the first TestFlight, not a day-one dependency |
| `flutter_liquid_glass_widgets`      | Shader widgets built on the renderer above, with heavier motion                                                                        | Louder than the cream glass we already chose, and the shader path does not cover web                                                      |

Reduced transparency and a slow web GPU use the opaque card, which the prototype already does. Android may drop the blur radius on a low-end device. iOS keeps the blur. We do not adopt a shader package to chase iOS 26 glass before the twelve screens exist.

### Flutter web as the judge demo

Flutter web can host the same screens. It will not feel like the Vite app.

The first load is heavier. Scroll and text selection feel like an app inside a page. `BackdropFilter` is the jank risk, especially on a kit list. The column stays phone-width on a desktop browser so the demo matches the phone captures.

Mitigations: glass only on the reserved surfaces, opaque kit cards on web if a scroll pass drops frames, and the CanvasKit or skwasm renderer rather than a legacy HTML renderer. On 20 October someone who is not the author finishes welcome through compare on the hosted preview, on a phone browser and a laptop. If that pass is unpleasant, the Devpost URL stays a build of the Vite prototype pointed at the same API. The Flutter iOS and Android builds still ship. The Vite app remains the design reference in either case. We do not keep designing two visual languages.

### Structure

Feature-first, with three layers inside each feature. The domain layer does not import Flutter.

```text
apps/client/lib/
  main.dart
  app.dart
  core/theme/          LongChairTheme ThemeExtension: hues, space, radius, type
  core/glass/          GlassSurface
  core/network/        HTTP client for our API only
  features/kit/
    domain/            entities, repository interface
    data/              DTO, repository implementation
    presentation/      widgets and providers
```

The same split applies to welcome, tastes, chair, themes, company, building, ready, item, companion, and compare.

Repository interfaces live in `domain`. `data` implements them with HTTP calls to `/v1`. Presentation depends on the interface, not on Dio or on JSON. That is the dependency inversion for the client: a widget test can fake the repository, and the screen never learns a Qloo host.

State: Riverpod, with `riverpod_generator` where it saves a hand-written provider. The app is a draft plus a few plan requests, not a stream of events. Bloc would add an event type and a state type for each of those requests. Riverpod keeps that as a provider and an `AsyncValue`, which is enough. Overrides in tests stay local. Bloc remains a fine library. It is more ceremony than this client needs.

Models that cross the wire use `freezed` and `json_serializable`, shaped like `SessionDraft`, `CatalogItem`, `PackedSession`, `CompanionTopic`, and `NearbyPlace` in `src/data/types.ts`. The OpenAPI document is the source. When the API changes, the Dart models change in the same commit. Hand-copied fields that drift are a bug.

Lint: `very_good_analysis`. It is stricter than `flutter_lints` and closer to the TypeScript bar already in this repo (`strict`, no dead code, public API docs where the package asks). `flutter_lints` would be the lighter default. We want the stricter set on a codebase that will be read by judges and by the team after the deadline.

DRY and SOLID in practice: one `GlassSurface`, one theme extension, one API client, one repository per feature. Screens compose. They do not parse Qloo JSON, pack a timeline, or invent a second color.

## Option B: Kotlin Multiplatform, SwiftUI, and Compose

Shared Kotlin holds the DTOs, the API client, and the repository interfaces. SwiftUI draws iOS. Jetpack Compose draws Android. The hosted demo is a separate web app, the Vite prototype, because KMP does not produce that site.

What is genuinely good: iOS glass can be the system material. SwiftUI on iOS 26 uses `glassEffect` and `GlassEffectContainer`. That is the real liquid glass, closer to the system than a Flutter blur. Compose blurs with `Modifier.blur` or a library such as Haze. It is a different implementation and a different look. The website keeps the CSS glass it already has. Three glass stacks, each honest for its platform.

What does not fit the deadline: the screens are the work. Twelve screens in SwiftUI and twelve in Compose, plus wiring the Vite app to the new API so judges have a URL, is three deliveries. Oscar can write the SwiftUI ones. Compose is another toolkit, and Flutter is the one he is fastest in. The shared Kotlin layer is an HTTP client and models. The Python API already owns the agent. Sharing a domain in Kotlin duplicates the thin part and leaves the thick part, the UI, split in two.

KMP is a reasonable architecture after judging, if a native iOS app becomes its own product and the Flutter app has earned its keep. It is not the hackathon plan.

## Decision

Build `apps/client` in Flutter. iOS, Android, and the intended hosted demo are that app. The Vite prototype stays the design reference. It is also the fallback URL if the 20 October web-feel pass fails.

- Riverpod, freezed models, feature-first layers, repository interfaces, `very_good_analysis`, tokens in a `ThemeExtension`, glass in `GlassSurface`.
- The agentic logic stays in FastAPI. Clients call `/v1` only.
- TestFlight external review is submitted on 23 October. The APK is linked beside the demo. The website is what we submit even if Apple is still reviewing.
- Shader liquid-glass packages stay off the dependency list. `GlassSurface` owns the blur. A native-iOS glass package is a follow-up only after the first internal build looks too flat, and only if it does not break Android or web.

The calendar assumes Oscar on the Flutter app and one teammate on the API. If one person does both, the live Qloo switch is what moves. The web demo, the APK, and an internal TestFlight build stay on the dates in [the roadmap](../plan/ROADMAP.md).

## Consequences

- Do not scaffold `apps/client` until implementation is requested. The Vite app keeps running.
- No React Native toolchain in the repo.
- Glass, type floors, 48px targets, and tab clearance are checked on an iOS device or simulator, an Android device or emulator, and the web build.
- The demo video prefers a device recording of the iOS app, plus one shot of whichever URL is the judge path.
- A SwiftUI client after judging would call the same API and would not receive the Qloo key.
