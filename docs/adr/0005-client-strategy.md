# ADR 0005: One Expo codebase for iOS, Android, and the hosted demo

- Status: accepted
- Date: 2026-10-11
- Amended: 2026-10-11, after Oscar asked for a first-class iOS and Android app

The earlier decision in this file called mobile a stretch goal and kept the Vite app as the submission. That decision is withdrawn. Judges still need a URL they can open with no install. The way to satisfy both is one client that exports a website and ships two native binaries.

## Context

Long Chair has to be usable end to end by a judge: a hosted web demo, and installable builds for iOS and Android. The deadline is 30 October 2026, 21:45 America/Mexico_City. The Qloo key is not here yet. The team is small, and Oscar, who is leading it, builds Swift and iOS, React Native, and Python backends. He wants the mobile app to look like a product, not a page inside a shell.

The visual language is already decided: warm cream, restrained glass, 48px targets, rem type floors, the twelve screens in the prototype. Liquid glass is part of that language on the surfaces listed in `AGENTS.md` (tab bar, kit cards, dial, stamp). It is not a full-screen effect.

What a judge can actually open:

| Path                            | What it takes                                                            | Promise by 30 October                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Public HTTPS URL                | Static export on Vercel or Cloudflare Pages                              | Yes. This is the path that cannot slip                                                                                                       |
| Android APK                     | EAS Build, file hosted next to the demo                                  | Yes, once the client boots. Sideload, no Play review                                                                                         |
| TestFlight public link          | Apple Developer account, EAS upload, Beta App Review, then a public link | A real goal if the account exists this week and the first external build is submitted by 23 October. A rejection cycle can miss the deadline |
| App Store or Play Store listing | Full review, and Play's closed-testing wait for new personal accounts    | No. Out of scope                                                                                                                             |

## Options

### A. Expo, Expo Router, and react-native-web

One React Native app. Expo Router is the navigator on iOS, Android, and web. `expo export --platform web` is the hosted demo. EAS Build produces the iOS binary and the Android APK.

What moves from the prototype: the tokens (cream, ink, the four hues, the 4/8/16/24/32/64 spacing scale, the type floors), the copy, the screen order, the SVG paths for characters and covers, and the pure session types. `packSession` stays a pure function and moves to the API. The screens call that API.

What does not move: Tailwind classes, `backdrop-filter` rules, the hash router, and the DOM glass components. Those are a design reference. Rebuilding them as React Native views is the client work. Planning it as a wrap of `src/components` would miss the deadline and still look like the website.

Liquid glass:

- `expo-glass-effect` `GlassView` is native iOS liquid glass (`UIVisualEffectView`). Expo's docs limit it to iOS 26 and above, and to iOS and tvOS. On Android, web, and older iOS it renders a normal `View`. Call `isGlassEffectAPIAvailable()` and `isLiquidGlassAvailable()` before using it. Some iOS 26 betas crash without the first check.
- Use it on the reserved surfaces only: tab bar, kit cards, dial disc, stamp. Guard reduced transparency and skip the effect when the visitor has asked for less of it.
- Android and older iOS use the same layouts with a translucent card, or `expo-blur` where the blur stays readable. Ink on that surface still has to clear 4.5:1. This matches the prototype's reduced-transparency fallback.
- Web uses a platform file that applies the existing cream-and-thin-glass recipe in CSS, including `backdrop-filter` where the browser has it. The hosted demo should look like the prototype, not like an unstyled `View`.
- A WebView shader package that imitates liquid glass on every platform is rejected. It is a second renderer, it is heavy beside a long session, and it fights the restrained glass we already chose.

Distribution:

- Apple Developer Program is 99 USD a year. An individual enrollment is often the same day and sometimes two days. An organization enrollment waits on D-U-N-S and can blow the calendar. Enroll on 11 October if the account does not already exist. Use an individual account if the organization path is not already approved.
- EAS Build compiles iOS in the cloud, so the team does not need a Mac for the binary. The first credential setup is an afternoon once the Apple account is active. A cloud build is on the order of 15 to 25 minutes. App Store Connect processing is on the order of 10 to 15 minutes. Internal TestFlight (the team, up to 100 App Store Connect users) can install as soon as processing finishes. No Beta App Review.
- External TestFlight, which is the public link judges would tap, requires Beta App Review on the first build of a version. Apple does not publish a TestFlight-only clock. Its App Review figure is at least half of submissions in under 24 hours and 90 percent in under 48 hours. Later builds of the same version sometimes skip review. The first one does not. Budget a rejection and a resubmit. Submit the external build on 23 October, with a beta description, a feedback email, export-compliance answers, and a note that the demo needs no account.
- Android is an EAS APK on a URL. There is no store review. Play production, including the 14-day closed-testing rule on new personal accounts, is out of scope.

This option gives Oscar a native app on the stack he already ships, one design system, and a website from the same commit as the binaries.

### B. SwiftUI and Kotlin with Compose

The strongest iOS craft, and a second Android app. The hosted demo is then a third client, the Vite app, which will drift from both. Liquid glass on iOS is the system material. Android glass is a separate Compose implementation. Web glass stays the CSS we have. Three glass stacks, two navigation models, one API, nineteen days, and a Qloo integration that has not started. Android is the one that would slip, and the website would stay the prototype rather than the same product. This is the wrong shape for a deadline that requires all three.

### C. Capacitor around the Vite app

The fastest binary, because the UI already exists. WebKit on iOS will run a good share of the CSS glass. Android WebView is the weak glass host. The result is the website in a frame, which is the look Oscar does not want. TestFlight review still applies, so the "fast" path does not remove the Apple lead time. Capacitor is the fallback only if the Expo app cannot complete the twelve screens by 21 October. It is not the plan.

### D. Kotlin Multiplatform

Shared logic would sit in Kotlin, with SwiftUI and Compose still to build, and the website still separate. The shared part is the smaller part. The lead's daily native work is Swift and React Native, not Kotlin. Setup cost lands before any judge-visible screen. Not for this deadline.

## Decision

Build the client in Expo with Expo Router and react-native-web. iOS, Android, and the hosted web demo are that app.

- The Devpost URL is the Expo web export. It has to work on 30 October even if TestFlight is still in review.
- The Android deliverable is an APK from the same commit, linked beside the demo.
- The iOS deliverable is TestFlight. Internal builds start as soon as the Apple account can upload. The public link is submitted for Beta App Review on 23 October. If that review misses the deadline, the web demo and the internal build still stand, and the Devpost text says the public link is pending rather than omitting iOS.
- The Vite app in `src/` stays the design reference until the Expo web export completes the same welcome-to-compare path. Then the hosted URL switches. We do not keep two UIs alive after that switch.
- The Qloo key stays on the API. The app and the web export both call `Long Chair`'s HTTP API. Neither binary contains the key.
- Play Store and App Store listings are after judging.

The plan assumes two tracks at once: Oscar on the Expo client, and one teammate on the FastAPI service in [the roadmap](../plan/ROADMAP.md). If Oscar is the only person coding, the fake adapter carries the demo and the live Qloo switch is what moves, not the three clients.

## Consequences

- `apps/mobile` is the client milestone. Do not start it until implementation is requested. The prototype at the repo root keeps running until then.
- Glass is one component with three platform files. Screens do not each check iOS version.
- Type floors, 48px targets, and tab clearance are re-checked on a 390-wide phone, on an Android device or emulator, and in the web export.
- The demo video prefers a device recording of the iOS app, with the hosted site as the path a judge can repeat without TestFlight.
- A native SwiftUI rewrite is a project after judging, against the same API.
