# Long Chair

A calm session kit for the hours people already spend in an infusion or dialysis chair.

**What you love, minus what hurts, sized to your session.**

Someone names a few films, shows, books, podcasts, or records, how long the chair is, and which themes should stay out of the room (illness, hospitals, cancer, the death of a parent, grief). Long Chair turns that into a timeline that fits the visit, says why each piece was kept, and prepares a small plan for the person sitting alongside: things to talk about, and places to eat that are open nearby.

This repository is a **static design prototype** for the [Qloo Agentic Hackathon](https://qloo.devpost.com/). It is here to validate the idea and iterate on the interface. It is not the hackathon submission build.

## Scope

**This prototype is:**

- A clickable, tablet-first web UI with a phone layout.
- A full pass through the product: welcome, onboarding, an illustrated agent sequence, a session kit, a piece detail, a companion plan, and a plain-model contrast.
- Driven by a typed sample shelf. Changing the session length or the tastes changes which pieces are packed into the kit.
- Honest about being a sample. A banner on every screen says the data is fictional and nothing is sent.

**This prototype is not:**

- A backend. There is no FastAPI server, no database, and no account.
- A Qloo client. Nothing calls `https://hackathon.api.qloo.com`. There is no `QLOO_API_KEY`.
- A language-model feature. Explanations are written into the sample shelf.
- Medical software. It does not collect names, diagnoses, or any health information, and it does not give advice.
- A store of real Qloo responses. Hackathon rules forbid publishing Qloo data in a public repo. Every title on the Long Chair shelf is fictional. The comparison screen names _The Fault in Our Stars_ only as the familiar example of what an unfiltered model often reaches for. No text from that work is included.

Refreshing the page restores the sample profile. Choices live in memory for the visit only.

## Screens

Open the app and move through the story, or jump with the hash:

| Screen      | Hash                  | What you do                                                                                       |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| Welcome     | `#/welcome`           | The promise, and the three parts of the product.                                                  |
| Onboarding  | `#/onboarding`        | Choose tastes, a chair length (1–4 hours), and themes to leave out.                               |
| Building    | `#/building`          | Watch the five agent steps. The dot field gathers while it works.                                 |
| Session kit | `#/kit`               | A timeline whose durations add up to the chair. Each card has a why-chip and the themes left out. |
| Piece       | `#/item/north-window` | Why that piece was kept, and the second check against the themes.                                 |
| Companion   | `#/companion`         | Conversation starters from the same tastes, and fictional places shown as open nearby.            |
| Contrast    | `#/compare`           | An unfiltered suggestion beside the piece Long Chair kept, with the excluded themes visible.      |

After the kit exists, a glass tab bar switches among Kit, Companion, and Compare. The sample patient already loves the whole shelf and a 4 hour chair, so **See the sample kit** on the welcome screen opens a full timeline immediately.

The five illustrated steps are the agent this product will run once a key exists: resolve names, match taste, exclude themes, check every pick again, fit the clock.

## Project structure

```
src/
  components/     UI. One component per file.
    background/   Dot field and the soft blobs behind the glass.
    chrome/       Shell, tab bar, screen intro, sample banner.
    glass/        Frosted panel, buttons, links.
    kit/          Timeline, pause, places, topics, agent steps.
    ui/           Icon, well, hero number, chips, empty state.
  content/        Hue and icon roles. Not sample records.
  data/           Fictional shelf and the draft shape. No fetching.
  hooks/
  lib/            Packing, duration labels, taste matching.
  routing/        Hash routes.
  screens/        One screen per file.
  state/          In-memory draft.
  tokens/         Hue names and motion numbers.
  index.css       The only place color, radius, and type size are defined.
```

Screens read `SessionDraft` and `CatalogItem`. A later adapter can fill those same types from Qloo without rewriting the screens.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

The dev server is [http://127.0.0.1:4179](http://127.0.0.1:4179).

Other scripts:

| Script                 | What it does                          |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Vite on port 4179.                    |
| `npm run build`        | Typecheck and write a static `dist/`. |
| `npm run preview`      | Serve that build on port 4179.        |
| `npm run typecheck`    | `tsc -b` with strict TypeScript.      |
| `npm run lint`         | ESLint, including type-aware rules.   |
| `npm run format`       | Prettier write.                       |
| `npm run format:check` | Prettier check.                       |

There are no environment variables. The app does not read a `.env` file.

## Design

The interface is meant to be readable at arm's length, in a chair, on a tablet. Large type, a four-hue palette (apricot, sea glass, honey, wisteria) plus ink and a warm page color, frosted panels, and one oversized number per screen for the thing that matters: the length of the chair, the time filled, the themes held back, the places still open.

The background is a canvas of dots. They brighten and ease toward a pointer, then settle. On the building screen they drift inward and pulse. The field pauses when the tab is hidden and draws once, still, when the visitor prefers reduced motion. Nunito carries the UI. Caveat is only for short asides. Both are open fonts (SIL Open Font License) loaded through Fontsource.

`AGENTS.md` is the design-system and code guide for anyone changing the repo.

## Roadmap to the hackathon build

The judging build has to be a working Qloo integration, hosted so a judge can use it without cloning the repo, through the end of judging. This prototype is the design to hang that on.

1. **Qloo adapter.** A server-side client for `https://hackathon.api.qloo.com` with the `X-Api-Key` header. `QLOO_API_KEY` stays on the server, never in the client and never in git. When the key is absent, the server keeps serving this sample shelf and labels it as such.
2. **Resolve.** `GET /search` turns the names a person types into entity ids. The onboarding chips become a search field. Still no names or medical data in the payload.
3. **Recommend.** `GET /v2/insights` across `movie`, `tv_show`, `podcast`, `book`, and `artist`, with `signal.interests.entities` and `feature.explainability=true`. The why-chips should quote those signals.
4. **Exclude.** `GET /v2/tags` resolves the themes into real tag ids. Insights then receives `filter.exclude.tags`. A checker reads each candidate's tags and description and asks again if something slips through. That second pass is already the shape of the "Checked again" panel.
5. **Pack.** Keep the duration fitter in `src/lib/pack-session.ts`. It is pure and does not care whether a row came from the shelf or from insights.
6. **Companion places.** `filter.type` for places, with `filter.location.query` and `filter.hours`, around a hospital the companion names. The sample center and the three cafés are placeholders.
7. **Optional prose model.** An env var such as `LLM_API_KEY` may rewrite explanations and conversation starters. The product still has to make sense with that variable unset. Taste, exclusion, and timing stay Qloo's job, not the model's.
8. **Host it.** This prototype can ship today as static `dist/` on Cloudflare Pages, Netlify, Vercel, or GitHub Pages. The live hackathon demo needs a small API beside it (Render, Fly, or a single Node host) so the key never reaches the browser. Cache the demo profiles on the server. Keys are turned off when the hackathon ends, and judges still need the demo through 16 November 2026.
9. **Do not commit Qloo payloads.** Tests and the public repo keep using fictional fixtures. Record a two-minute walkthrough for the Devpost page. The product text stays in English.

## License

[MIT](LICENSE). Nunito and Caveat remain under the SIL Open Font License.
