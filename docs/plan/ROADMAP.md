# Roadmap

30 October 2026, 21:45 America/Mexico_City is the submission deadline. The client is the Expo app in [ADR 0005](../adr/0005-client-strategy.md): iOS, Android, and a hosted web export from the same codebase. The API is still FastAPI behind `QlooPort`. The Qloo key has no arrival date. The fake adapter is what the clients talk to until the key-arrival checklist runs.

This calendar assumes Oscar on the Expo app and one teammate on the API. If one person is doing both, protect the client dates and let the live Qloo switch slip. The web export, the APK, and an internal TestFlight build matter more than a live key on submission day.

The Vite prototype stays the design reference until 22 October, when the Expo web export is meant to replace it as the public URL. Nothing here is implemented yet.

## Lead times that do not compress

- Apple Developer enrollment starts 11 October if the account is not already active. Individual enrollment is often the same day and sometimes 48 hours. An organization account that still needs D-U-N-S will not clear in time. Use an individual account in that case.
- The first iOS cloud build needs an active account. After that, a build is about 15 to 25 minutes, plus about 10 to 15 minutes of App Store Connect processing. Internal testers can install then.
- The public TestFlight link needs Beta App Review on the first build of the version. Plan on 48 hours, and on one rejection. The submission date is 23 October so a resubmit can still land before the 30th. Apple's published App Review figure (half of submissions under 24 hours, 90 percent under 48 hours) is the only clock they give. It is not a guarantee.
- The Android APK has no review. The Play Store does, and we are not shipping there.
- The hosted website does not wait on Apple.

## Day by day

### Sunday 11 October

- This amendment is the decision: Expo for all three surfaces.
- Enroll in the Apple Developer Program, or confirm the existing account can create an app and an App Store Connect API key for EAS.
- Pick the bundle id and the Android package name. Create the App Store Connect record as soon as the account allows. Export compliance will be "HTTPS only."

### Monday 12 October

- Client: `apps/mobile` on the current stable Expo SDK that includes `expo-glass-effect`. Expo Router routes for the twelve screens, empty. Tokens from the prototype (page, ink, four hues, spacing, type floors). EAS project linked.
- Client: first Android APK of that shell, so the pipe is real. Install it on a device.
- API: repository skeleton only if it does not slow the Apple setup. The API gate is the 17th.

### Tuesday 13 October

- Client: one glass component. iOS 26 uses `GlassView` after `isGlassEffectAPIAvailable()` and `isLiquidGlassAvailable()`. Android and older iOS use a translucent card. Web uses the cream glass CSS. Reduced transparency turns glass into the opaque card on every platform.
- Client: character SVG on `react-native-svg`. Welcome and the taste list, backed by in-app sample data.

### Wednesday 14 October

- Client: chair dial with the four length pills and 30-minute slider steps, themes with the three defaults called out, company as the 2×2 grid and "Choose {name}".
- API: FastAPI app, `QlooPort`, `FakeQlooAdapter`, health endpoint. No key.

### Thursday 15 October

- Client: building steps, ready stamp, kit timeline. Tab bar uses the glass component and clears the last row by the bar height, the safe area, and 24px.
- API: pydantic documents for the Qloo shapes, fictional fixtures, mapper for movies.

### Friday 16 October

- Client: item, companion with places under the headline, compare, unknown. A judge can walk welcome to compare on a simulator against sample data.
- API: checker stub and `packSession` twin. The mixed 4-hour draft still fills.

### Saturday 17 October

- API gate: contract tests green on the fake adapter, `GET /v1/health` reports `fake`, `.qloo-cache/` ignored, no `.env` committed.
- Client: point the app at that API for search and plan. If the API slipped, the app keeps its in-memory sample and the integration moves to the 18th. The screens do not wait.

### Sunday 18 October

- `expo export --platform web` on a preview URL, talking to the fake API.
- Fix what the export gets wrong: fonts, the dial, the tab bar, safe area, focus. The preview has to complete the same path as the simulator.

### Monday 19 October

- First iOS EAS build to internal TestFlight. Team installs it the same day.
- Refresh the APK from that commit and put the file where the team can download it.
- Fix crashes those installs find. Do not add screens.

### Tuesday 20 October

- Type floors, 48px targets, and contrast on glass, checked on the iOS build, an Android device or emulator, and the web preview.
- Pointer-following dots are optional. A still dot texture is enough if the canvas is costing the day.

### Wednesday 21 October

- Places and the checker are visible in the app, including the empty-search and "nothing matched" lines.
- If the Qloo key has arrived, run the key-arrival checklist below. If it has not, stay on fake and keep going.

### Thursday 22 October

- Production host: Expo web export on Vercel or Cloudflare Pages, API on Fly.io with a volume (or a Render instance that does not sleep). CORS locked to that origin.
- This URL becomes the Devpost demo. The Vite prototype URL, if one is up, is no longer the submission.
- Privacy read: no name field, no diagnosis field, logs free of Qloo bodies.

### Friday 23 October

- Submit the iOS build to TestFlight Beta App Review for an external group. Beta description, feedback email, contact, and a note that no login is required. Turn on the public link only after approval.
- Ship an APK from the same commit and link it from the hosted demo's README or a `/download` note in the Devpost draft.
- This is the Apple lead-time gate. Missing it makes the public link unlikely.

### Saturday 24 October

- Watch the review. A rejection gets one focused resubmit the same day (privacy text, encryption answers, placeholder content).
- If the key is live, warm the mixed demo into the private cache and copy that directory to the password store.

### Sunday 25 October

- If the external build is approved, create the public TestFlight link and open it on a phone that is not the author's.
- If it is still in review, do not block the video or the website. The website is the judge path.

### Monday 26 October

- Two-minute video, English. Prefer a device recording of the iOS app from welcome through kit, companion places, and compare. Include one shot of the hosted site. Say that themes are held out and that this is not medical advice.
- Replay drill: `QLOO_MODE=replay`, no key, demo plan still returns.

### Tuesday 27 October

- Devpost draft: public repo, MIT in About, hosted URL, TestFlight link if it is approved, APK link, English description, video.
- Read the draft once for a Qloo payload, a key, or a cache dump. None of those belong there.

### Wednesday 28 October

- Fix only bugs on the hosted path and the install paths.
- A second iOS build goes up only to answer a review rejection. Later builds of the same version sometimes skip review. Do not spend the day on a new feature in the hope that they will.

### Thursday 29 October

- Freeze. Confirm the web host and the API host stay awake. Write down who restarts them.
- Reinstall the APK and, if the link exists, the TestFlight build, from a clean phone.

### Friday 30 October, before 21:45 CDMX

- Submit.
- Links on the form: the hosted web demo, the TestFlight public link when Apple has approved it, and the APK.
- MIT license in About. English description. Public repository.
- If TestFlight is still in review, submit anyway. The web demo meets the hosted-demo rule. Say the public iOS link is in review. Do not hold the form for Apple.

After submission, leave both hosts up through judging. When the key is deactivated, set `QLOO_MODE=replay`. Do not redeploy a client that calls Qloo directly.

## Key arrival

Run this the day the key arrives, then return to the calendar. It does not move the 23 October TestFlight submission.

1. `QLOO_API_KEY` goes in the API host's secret store only. The Expo app and the web export do not grow that variable.
2. Run the live contract entry once, locally. Update the unconfirmed fields in `docs/architecture/qloo-port.md` in the same change as the mapper. Do not commit response bodies.
3. Record with `QLOO_MODE=live` into the gitignored cache.
4. Warm the mixed 4-hour demo. Copy the warmed directory to the private password store.
5. Point the hosted API at `live` only after that warm succeeds.

## If a day slips

Drop, in this order: pointer-following dots, Caveat stickers, a second polish pass on glass. Keep the twelve screens, the fake API, the web export, the APK, and the 23 October TestFlight submission.

Do not start SwiftUI, Compose, Capacitor, or Kotlin Multiplatform to "save" a slip. Capacitor is a conversation only if the Expo app cannot finish welcome-to-compare by 21 October, and even then the web export of whatever already works is still the demo.

## Devpost checklist

- [ ] Public repository
- [ ] OSI-approved license in the About field (MIT)
- [ ] Hosted demo URL a judge can finish with no key and no install
- [ ] TestFlight public link, or a written note that Beta App Review is still open
- [ ] APK link from the same commit as the web export
- [ ] English description, including that Long Chair is not medical advice
- [ ] Video
- [ ] No Qloo response, key, or `.qloo-cache` contents in the repo, the binary, or the description
- [ ] Replay drill done, and the private copy of the warmed demo exists outside GitHub

## Explicitly later

- Accounts, a database of people, and saved medical context.
- App Store and Play Store listings.
- A SwiftUI client.
- A model that chooses or rejects titles on its own.
- Publishing Qloo fixtures so the tests look like production.
