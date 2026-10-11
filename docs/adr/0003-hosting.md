# ADR 0003: Static web app and a small always-on API

- Status: accepted
- Date: 2026-10-11

## Context

Judges have to open the product without cloning the repo and without a Qloo key of their own. The key is turned off when the hackathon ends. The demo still has to run for judging. Real Qloo responses cannot live in the public repository, so the post-key demo is a private cache on the host.

The frontend that judges open is a static export. The API is a long-running FastAPI process with a disk.

## Decision

- Web: `flutter build web` on Vercel or Cloudflare Pages, from the same commit as the iOS and Android builds. No server functions. No environment variable named `QLOO_API_KEY` in that project. The Vite prototype stays the design reference. If the Flutter web feel pass fails, that Vite build, pointed at the same API, is the submission URL instead.
- API: Fly.io with a persistent volume mounted at the recording cache path. Render is the fallback if Fly is awkward, on a paid instance that does not sleep. A sleeping free dyno is a bad judge experience and a bad place to keep the only copy of the cache.
- The API origin is the only one with `QLOO_API_KEY`, `QLOO_MODE`, and the optional `LLM_*` variables, set in the host's secret store.
- `QLOO_MODE=live` while the key works, and the warmed demo is written to the volume. Before the key dies, switch the hosted service to `QLOO_MODE=replay`. Do that on purpose. Do not wait for the first 401 during judging.
- A second copy of the warmed demo directory goes to the team's private password store the same day it is recorded.
- CORS allows the web origin only.
- The submission URL is the hosted web build pointed at the API. TestFlight and the APK are additional links on the Devpost page. They do not replace the URL.

Vercel or Cloudflare for the API was rejected. Serverless disks are a poor fit for a cache that must survive deactivation, and a cold start in front of a judge is unnecessary.

## Consequences

- Two bills, both small, both required to stay up through judging. The roadmap's last gate is "who is on call if the host sleeps."
- The public repo's README links to the web URL. It does not link to a cache dump.
- Logs on the host follow the observability rules in the architecture doc. The log drain is not a back door for Qloo bodies.
