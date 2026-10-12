# ADR 0009: Region chips and verified theme rules

- Status: accepted
- Date: 2026-10-12

## Context

The love step showed one global list of chips. A person in Mexico and a person in the United States do not reach for the same quick starts, and a GPS prompt would be the wrong way to learn that.

The shelf also treated every sample title as cleared for every built-in theme. That shortcut lived in `catalog.ts` as `clearedThemes()`. A title could enter the kit without any source saying it was safe.

## Decision

Region comes from the device locale (`es-MX`, `en-US`, and the same kind of tag). There is no location permission and no GPS. Supported seeds are Mexico, the United States, Brazil, Spain, the United Kingdom, India, and a Global fallback for any other locale. Each list sits in the four existing groups and includes one or two chips from outside that region.

`TasteSeedProvider` is the port. The static adapter returns the authored lists. `createHttpQlooTasteSeedProvider` reorders those lists by a popularity payload when an API key is passed in, and it does not call the network when the key is missing. The phone and the web demo keep using the static adapter. Free-text search stays on `TasteSearchPort`.

A manual Region control above the groups stores the choice on the device (`localStorage` on the web, `expo-secure-store` on the phone).

Each built-in theme is a rule: sample Qloo tag ids and names, plus English and Spanish synopsis keywords. `ThemeVerifier` asks three source ports: Qloo tags, TMDB keywords, and Does the Dog Die warnings. Fixture adapters answer from sample tables. HTTP adapters return no answer, and do not fetch, unless their env key is present.

A built-in verdict is `flagged` when any source or the synopsis matches the rule, `clear` only when the Qloo source and a second source both answered and nothing matched, and `unverified` otherwise. Unverified is never treated as clear.

Custom themes are the words the person typed. A synopsis hit is `flagged` at low confidence. No hit stays `unverified` at low confidence, because one keyword list cannot clear a title.

The packer admits a title only when every active built-in theme is `clear`. A flagged custom theme blocks the title. An unverified custom theme may still be packed, and the slot records `cautionThemeIds` so the kit can say the check was keyword-only. If the verified pool cannot fill a slot, the slot stays empty and the existing quiet-fill copy applies. A short chair is safer than a title we cannot vouch for. The old "every item is cleared" stamp is gone. Sample titles now carry their own evidence, including the clinic episode that fails illness and hospitals.

The golden set is `packages/core/fixtures/theme-golden.json`, exported from `packages/core/src/data/theme-golden.ts`: fifty fictional titles, each with the sources that were labeled by hand. It is not a live Qloo, TMDB, or Does the Dog Die extract. `evaluateGolden` reports precision and recall per theme. The Compare tab shows the mean and says it is not a live score. Grief is intentionally imperfect so the number is not a vanity 1.00.

## Consequences

- Locale tags without a supported country, including plain `en` or `es`, use Global.
- Live Qloo ranking, TMDB, and Does the Dog Die stay off until keys exist. The ports and contract tests are the seam.
- The sample kit draft still leaves grief and "Losing a parent" available, so the curated demo can differ from a fresh onboarding, which starts with all five themes on.
