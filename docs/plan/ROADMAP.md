# Roadmap

30 October 2026, 21:45 America/Mexico_City is the submission deadline. The client is the responsive web app in [ADR 0007](../adr/0007-responsive-web-client.md). [ADR 0006](../adr/0006-flutter-client.md) and [ADR 0005](../adr/0005-client-strategy.md) are withdrawn. The API is FastAPI behind `QlooPort`. The web app calls that API and never calls Qloo. The fake adapter carries the demo until the key-arrival checklist runs.

The session-kit slice is in `services/api` and is tested against `FakeQlooAdapter`. The Vite screens still use the in-memory sample shelf. Wiring those screens to `/v1` is the next product change. A native Swift app is post-hackathon only. TestFlight and an APK are not deliverables.

## What has to stay true

- The judge URL is a hosted web build a person can finish with no key and no install.
- The Qloo key lives only on the API host.
- After the key is deactivated, `QLOO_MODE=replay` serves the warmed demo from the private cache.
- Replay is drilled before submission. A second copy of that cache lives outside GitHub.
- The medical disclaimer stays. Requests carry titles and a neighborhood, not a name or a diagnosis.

## Remaining path

### Now

- Keep the fake adapter green. CI runs ruff, mypy, pytest with the coverage gate, and the shared contract tests.
- Do not restyle `src/` to chase the design slop lint. Do not add another code anti-slop plugin.

### Wire the web app

- Typed repositories in the Vite app call `/v1`. Screens render the server's packed session. They stop packing once that endpoint is the source.
- Phone, tablet, and desktop keep the tokens, glass, type floors, and 48px targets already in `AGENTS.md`.
- Empty, loading, and error states use the sentences the API returns. A 503 still offers the sample demo.

### Host

- Static `dist/` on Vercel or Cloudflare Pages. API on Fly.io with a volume, or a Render instance that does not sleep.
- CORS locked to the web origin. No `QLOO_API_KEY` on the frontend project.
- Write down who restarts the hosts if they sleep.

### Submit

- Devpost: public repo, MIT in About, hosted URL, English description, video.
- The video shows welcome through the kit, companion places, and compare, and says this is not medical advice.
- Read the draft once for a Qloo payload, a key, or a cache dump. None of those belong there.

## Key arrival

Run this the day the key arrives. It does not replace the fake adapter until the warm succeeds.

1. `QLOO_API_KEY` goes in the API host's secret store, and in the GitHub Actions secret if the scheduled live contract should run. The web app does not grow that variable.
2. Run the live contract entry once, locally. Update the unconfirmed fields in `docs/architecture/qloo-port.md` in the same change as the mapper. Do not commit response bodies. Do not print the key.
3. Record with `QLOO_MODE=live` into the gitignored cache.
4. Warm the mixed 4-hour demo. Copy the warmed directory to the private password store.
5. Point the hosted API at `live` only after that warm succeeds.
6. Before the key dies, switch the host to `QLOO_MODE=replay` on purpose.

## If a day slips

Drop, in this order: pointer-following dots, the Caveat welcome stickers, a shader glass experiment. Keep the twelve screens, the fake API, and a judge URL.

Do not start a second UI toolkit to recover a slip. Flutter, React Native, Kotlin Multiplatform, and a SwiftUI client are out until after the hackathon.

## Devpost checklist

- [ ] Public repository
- [ ] OSI-approved license in the About field (MIT)
- [ ] Hosted demo URL a judge can finish with no key and no install
- [ ] English description, including that Long Chair is not medical advice
- [ ] Video
- [ ] No Qloo response, key, or `.qloo-cache` contents in the repo or the description
- [ ] Replay drill done, and the private copy of the warmed demo exists outside GitHub

## Explicitly later

- Accounts, a database of people, and saved medical context.
- App Store and Play Store listings. TestFlight and a sideload APK.
- A Swift client, after the hackathon.
- A shader liquid-glass package.
- A model that chooses or rejects titles on its own.
- Publishing Qloo fixtures so the tests look like production.
