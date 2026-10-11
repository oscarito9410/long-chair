# Long Chair

A calm session kit for the hours people already spend in an infusion or dialysis chair.

**What you love, minus what hurts, sized to your session.**

Someone names a few films, shows, books, podcasts, or records, how long the chair is, and which themes should stay out of the room (illness, hospitals, cancer, the death of a parent, grief). Long Chair turns that into a timeline that fits the visit, says why each piece was kept, and prepares a small plan for the person sitting alongside: things to talk about, and places to eat that are open nearby.

This repository is a **static design prototype** for the [Qloo Agentic Hackathon](https://qloo.devpost.com/). It is here to validate the idea and iterate on the interface. It is not the hackathon submission build.

## Scope

**This prototype is:**

- A clickable, mobile-first web UI that still widens for a tablet.
- A full pass through the product: welcome, one question at a time, an illustrated agent sequence, a stamp when the kit is ready, a session kit, a piece detail, a companion plan, and a plain-model contrast.
- Driven by a typed sample shelf. Changing the session length or the tastes changes which pieces are packed into the kit.
- Honest about being a sample. Welcome carries one tag: the shelf is fictional and nothing is sent. It is not medical advice.

**This prototype is not:**

- A backend. There is no FastAPI server, no database, and no account.
- A Qloo client. Nothing calls `https://hackathon.api.qloo.com`. There is no `QLOO_API_KEY`.
- A language-model feature. Explanations are written into the sample shelf.
- Medical software. It does not collect names, diagnoses, or any health information, and it does not give advice.
- A store of real Qloo responses. Hackathon rules forbid publishing Qloo data in a public repo. Every title on the Long Chair shelf is fictional. The comparison screen names _The Fault in Our Stars_ only as the familiar example of what an unfiltered model often reaches for. No text from that work is included.

Refreshing the page restores the sample profile. Choices live in memory for the visit only.

## Screens

Open the app and move through the story, or jump with the hash:

| Screen      | Hash                  | What you do                                                                                    |
| ----------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| Welcome     | `#/welcome`           | The promise, paper notes of tastes, then get started or open the sample kit.                   |
| Tastes      | `#/love`              | One question: what belongs in the room. `#/onboarding` lands here too.                         |
| Length      | `#/chair`             | Turn the dial, or tap 1h, 2h, 3h, or 4h. Arrow keys move 30 minutes.                           |
| Themes      | `#/themes`            | What should stay out of the room.                                                              |
| Company     | `#/company`           | Tap one of four guides, then Choose that name. Skip leaves the guide as it was.                |
| Building    | `#/building`          | Watch the five agent steps check off.                                                          |
| Ready       | `#/ready`             | A postage-style card for this chair, then open the kit.                                        |
| Session kit | `#/kit`               | A timeline whose durations add up to the chair. Each card is a cover, a title, and one reason. |
| Piece       | `#/item/north-window` | Cover, creator, why it was kept, and a one-line theme check.                                   |
| Companion   | `#/companion`         | Places open nearby sit under the headline. The guide is a short line below them.               |
| Contrast    | `#/compare`           | An unfiltered title beside the piece Long Chair kept, each with one line.                      |

After the kit exists, a floating glass tab bar switches among Kit, Companion, and Compare. The sample chair is 4 hours with Pebble as the guide. Most of the shelf is selected, Sunday Engines is not, and grief and the death of a parent are not held back, so both row states are visible. **See a sample kit** on the welcome screen opens that timeline immediately.

The five illustrated steps are the agent this product will run once a key exists: resolve names, match taste, exclude themes, check every pick again, fit the clock.

## Project structure

```
src/
  components/     UI. One component per file.
    art/          Characters, generated covers, and the stamp.
    background/   A quiet dot field and soft blobs.
    chrome/       Shell, tab bar, question frame, and screen intro.
    glass/        Glass surfaces, and the action buttons and links.
    kit/          Timeline, pause, places, topics, agent steps.
    ui/           Dial, option rows, icon, well, hero number, chips.
  content/        Hue, icon, and character roles. Not sample records.
  data/           Fictional shelf, guides, and the draft shape. No fetching.
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

The interface is meant to be readable at arm's length, in a chair, on a phone first. Body type is 1.125rem (18px at a 16px root) or larger, and supporting lines are 1rem. A four-hue palette (apricot, sea glass, honey, wisteria) plus ink and a warm page color. Podcasts use sea glass, with episodes. Honey is food and a pause. Each onboarding question is its own screen, with a near-black primary pill and a quiet text link. Original blob characters mark choices, keep company, and sit in empty states. Soft color glows sit in the corners. Glass is kept for the tab bar, the dial, covers, the stamp, and thin cards. Rows and panels stay calm. Welcome leads with the promise, paper notes, and no oversized number. Building, the kit, the companion plan, and the contrast each keep one figure.

The background is a faint canvas of dots. They ease toward a pointer, then settle. The field pauses when the tab is hidden and draws once, still, when the visitor prefers reduced motion. Nunito carries the UI. Caveat is only the welcome stickers. Both are open fonts (SIL Open Font License) loaded through Fontsource.

`AGENTS.md` is the design-system and code guide for anyone changing the repo.

## Roadmap to the hackathon build

The judging build is a hosted web app plus a small API. This prototype is the UI it will use. The decision record is:

- [Architecture](docs/architecture/ARCHITECTURE.md): context, containers, the agent pipeline, sequences, the data model, and the API sketch.
- [QlooPort](docs/architecture/qloo-port.md): one port, a live adapter, a fake adapter, and a recording adapter. Contract tests are shared. Fixtures are fictional.
- [ADRs](docs/adr/): FastAPI, an optional prose model, hosting, the monorepo, and the client strategy.
- [Roadmap](docs/plan/ROADMAP.md): gates from 11 October through submission on 30 October 2026, 21:45 America/Mexico_City.

The client is one Flutter app: iOS, Android, and a web build from the same code. Judges get a URL they can finish in the browser, a TestFlight link once Apple approves the beta, and an APK. The Vite prototype stays the design reference, and it is the fallback URL if the Flutter web build is unpleasant to use. The API is Python and FastAPI. Clients call that API and never call Qloo. The key stays on the server. Until the key arrives, the pipeline runs on the fake adapter. After the key is turned off, judges hit a private replay cache that is not in this repository.

Do not commit Qloo responses, keys, or a copy of the replay cache. The Devpost page needs a public repo, the MIT license in the About field, the hosted demo URL, and an English description. The product is not medical advice, and the request to Qloo carries titles and a neighborhood, not a name or a diagnosis.

## License

[MIT](LICENSE). Nunito and Caveat remain under the SIL Open Font License.
