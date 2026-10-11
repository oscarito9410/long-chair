# Roadmap

30 October 2026, 21:45 America/Mexico_City is the submission deadline. The client is the Flutter app in [ADR 0006](../adr/0006-flutter-client.md): iOS, Android, and a Flutter web build from the same code. [ADR 0005](../adr/0005-client-strategy.md) is withdrawn. The API is FastAPI behind `QlooPort`. Clients call that API and never call Qloo. The fake adapter carries the app until the key-arrival checklist runs.

This calendar assumes Oscar on the Flutter app and one teammate on the API. If one person is doing both, protect the client dates and let the live Qloo switch slip. The judge URL, the APK, and an internal TestFlight build matter more than a live key on submission day.

The Vite app in `src/` stays the design reference. On 22 October the Flutter web build is meant to become the public URL. If the 20 October feel pass fails, the Vite app pointed at the same API remains the URL, and Flutter still ships the installable builds. Nothing here is implemented yet.

## Lead times that do not compress

- Apple Developer enrollment starts 11 October if the account is not already active. Individual enrollment is often the same day and sometimes 48 hours. An organization account that still needs D-U-N-S will not make it. Use an individual account in that case.
- `flutter build ipa` needs a Mac or a macOS CI runner. Upload with Xcode, Transporter, or fastlane. App Store Connect processing is about 10 to 15 minutes. Internal testers can install then.
- The public TestFlight link needs Beta App Review on the first build of the version. Plan on 48 hours and one rejection. Submit on 23 October. Apple's published App Review figure (half of submissions under 24 hours, 90 percent under 48 hours) is the only clock they give. It is not a guarantee.
- The Android APK has no review. `flutter build apk --release` is the file. The Play Store is out of scope.
- The hosted website does not wait on Apple.

## Day by day

### Sunday 11 October

- Decision recorded: Flutter for all three surfaces. The previous client note is superseded.
- Enroll in the Apple Developer Program, or confirm the existing account can create an app.
- Pick the bundle id and the Android application id. Create the App Store Connect record as soon as the account allows. Export compliance will be "HTTPS only."

### Monday 12 October

- Client: `apps/client` with `very_good_analysis`, Riverpod, and freezed. Feature folders exist and are empty. `LongChairTheme` holds the prototype tokens (page, ink, four hues, spacing, type floors). `GlassSurface` blurs on iOS and falls back to the opaque card.
- Routes for the twelve screens, empty.
- API: repository skeleton only if it does not slow the Apple setup. The API gate is the 17th.

### Tuesday 13 October

- Client: character drawing in Flutter, matching the prototype shapes. Welcome and the taste list, backed by in-app sample data that uses the same draft types.
- Glass checked on an iOS simulator and in Chrome. Reduced transparency shows the opaque card.

### Wednesday 14 October

- Client: chair dial with the four length pills and 30-minute slider steps, themes with the three defaults called out, company as the 2×2 grid and "Choose {name}".
- API: FastAPI app, `QlooPort`, `FakeQlooAdapter`, health endpoint. No key.

### Thursday 15 October

- Client: building steps, ready stamp, kit timeline. The tab bar uses `GlassSurface` and clears the last row by the bar height, the safe area, and 24px.
- API: pydantic documents for the Qloo shapes, fictional fixtures, mapper for movies.

### Friday 16 October

- Client: item, companion with places under the headline, compare, unknown. A person can walk welcome to compare on a simulator against sample data.
- API: checker stub and `packSession` twin. The mixed 4-hour draft still fills.

### Saturday 17 October

- API gate: contract tests green on the fake adapter, `GET /v1/health` reports `fake`, `.qloo-cache/` ignored, no `.env` committed.
- Client: repositories call that API for search and plan. If the API slipped, the app keeps its in-memory sample and the wiring moves to the 18th. The screens do not wait.

### Sunday 18 October

- `flutter build web` on a preview URL, talking to the fake API. Phone-width column on a laptop.
- Fix fonts, the dial, the tab bar, safe area, and focus. Note any scroll jank from blur. Kit cards may go opaque on web if the list stutters. iOS keeps the blur.

### Monday 19 October

- First `flutter build ipa` to internal TestFlight. The team installs it the same day.
- `flutter build apk --release` from that commit, installed on an Android device.
- Fix crashes those installs find. Do not add screens.

### Tuesday 20 October

- Web-feel pass by someone other than the author: welcome through compare on a phone browser and a laptop. This decides the Devpost URL.
- If the web build is calm enough, it becomes the candidate URL. If blur or the first load makes the path unpleasant, the URL will be the Vite app on the same API, and that choice is written down the same day.
- Type floors, 48px targets, and contrast on glass, on iOS, Android, and the chosen web build.

### Wednesday 21 October

- Places and the checker are visible in the Flutter app, including the empty-search and "nothing matched" lines.
- If the Qloo key has arrived, run the key-arrival checklist below. If it has not, stay on fake.

### Thursday 22 October

- Production host: the chosen web build on Vercel or Cloudflare Pages, API on Fly.io with a volume (or a Render instance that does not sleep). CORS locked to that origin.
- This URL is the Devpost demo. The other web build can stay up for design comparison. It is not the submission URL.
- Privacy read: no name field, no diagnosis field, logs free of Qloo bodies. The APK and the IPA contain no Qloo key.

### Friday 23 October

- Submit the iOS build to TestFlight Beta App Review for an external group. Beta description, feedback email, contact, and a note that no login is required. Turn on the public link only after approval.
- Refresh the APK from the same commit and link it from the demo notes in the Devpost draft.
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

After submission, leave both hosts up through judging. When the key is deactivated, set `QLOO_MODE=replay`. Do not ship a client that calls Qloo.

## Key arrival

Run this the day the key arrives, then return to the calendar. It does not move the 23 October TestFlight submission.

1. `QLOO_API_KEY` goes in the API host's secret store only. The Flutter app does not grow that variable.
2. Run the live contract entry once, locally. Update the unconfirmed fields in `docs/architecture/qloo-port.md` in the same change as the mapper. Do not commit response bodies.
3. Record with `QLOO_MODE=live` into the gitignored cache.
4. Warm the mixed 4-hour demo. Copy the warmed directory to the private password store.
5. Point the hosted API at `live` only after that warm succeeds.

## If a day slips

Drop, in this order: pointer-following dots, the Caveat welcome stickers, a shader glass experiment. Keep the twelve screens, the fake API, a judge URL, the APK, and the 23 October TestFlight submission.

Do not start a second UI toolkit to recover a slip. Kotlin Multiplatform, SwiftUI-plus-Compose, and a React Native app are out. If Flutter web fails the 20 October pass, the Vite app is the URL. That is the fallback already in the plan.

## Devpost checklist

- [ ] Public repository
- [ ] OSI-approved license in the About field (MIT)
- [ ] Hosted demo URL a judge can finish with no key and no install
- [ ] TestFlight public link, or a written note that Beta App Review is still open
- [ ] APK link from the same commit as the Flutter app
- [ ] English description, including that Long Chair is not medical advice
- [ ] Video
- [ ] No Qloo response, key, or `.qloo-cache` contents in the repo, the binary, or the description
- [ ] Replay drill done, and the private copy of the warmed demo exists outside GitHub

## Explicitly later

- Accounts, a database of people, and saved medical context.
- App Store and Play Store listings.
- A SwiftUI client, or a Kotlin Multiplatform split, after the Flutter app has shipped.
- A shader liquid-glass package, and only if `GlassSurface` looks too flat on a device.
- A model that chooses or rejects titles on its own.
- Publishing Qloo fixtures so the tests look like production.
