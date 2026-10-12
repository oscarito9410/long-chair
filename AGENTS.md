# Agent guide

Long Chair is a responsive web demo for the Qloo Agentic Hackathon, an Expo app for iPhone, and a FastAPI session service. Read this before editing. The product story and the run steps live in `README.md`.

## What this repo is

The judge deliverable is the Vite + React + TypeScript app in `apps/web`. It is mobile-first and widens for a tablet and a desktop. Those screens still render the in-memory sample shelf. They do not call the API yet.

The iPhone app is `apps/mobile` (Expo SDK 57, expo-router). Android uses the same project later. Shared kit logic lives in `packages/core` and is imported by both apps. Do not copy it into a screen. [ADR 0008](docs/adr/0008-expo-client.md) is the native decision. [ADR 0007](docs/adr/0007-responsive-web-client.md) still governs the judge demo. [ADR 0006](docs/adr/0006-flutter-client.md) is superseded.

The session API lives in `services/api`. It is hexagonal: domain, application, ports, adapters, and the HTTP layer. `BuildSessionKit` resolves tastes, asks for insights with exclusion tags, checks once, packs the chair, and returns explanations plus a companion plan. `FakeQlooAdapter` is the default. `HttpQlooAdapter` and `RecordingQlooAdapter` stay behind `QlooPort`.

`POST /v1/kit/agent` adds optional native tool calling behind `LlmPort`. Its owned
loop lives in `app/application/agent`; tools use existing Qloo/enrichment ports and
the checker/packer. The server rechecks after exploration, including fallback.
No model key keeps the deterministic kit and an empty trace. See
[ADR 0011](docs/adr/0011-agent-loop.md) and `specs/005-agent-loop/quickstart.md`.
Tests inject `FakeLlm`; paid live calls require approval plus explicit opt-in.

The mobile app talks to that API only through `KitService` when `EXPO_PUBLIC_API_URL` is set. The Qloo key never goes in the app. The review build leaves the variable unset and packs fixtures on the device. Store categories are Entertainment and Lifestyle. Copy must not claim treatment or a health outcome. "Not medical advice" stays on onboarding and in Settings. A test in `apps/mobile/src/medical-claims.test.ts` fails if the banned phrases appear.

`check-dep` returned caution for `expo@57.0.28` and `react-native-reanimated@4.5.1` because other versions have advisories. These pins do not. They are the Expo SDK 57 set.

Read `docs/architecture/ARCHITECTURE.md`, `docs/architecture/qloo-port.md`, `docs/adr/`, and `docs/plan/ROADMAP.md` before changing the pipeline or the hosting plan.

## Code rules

These apply to code this team writes. The design-system rules further down still govern `src/`.

- **SlopMD.** The prime directives between the `slopmd` markers in this file, and the same block in `.cursor/rules/slopmd.mdc`, are binding. Before any new dependency, run `node tools/slopmd/bin/slopmd.js check-dep <package>`. Exit 0: pin the exact version. Exit 1: pin it and write the one-line reason. Exit 2: stop for a person. The lab scan is `node tools/slopmd/bin/slopmd.js <path>`.
- **Design slop.** `.cursor/skills/no-slop-design` is the visual reference. `slop_lint.py` is informational. Do not restyle the prototype to chase it. Do not add another code anti-slop plugin.
- **Ports and adapters.** The pipeline calls `QlooPort`. `HttpQlooAdapter`, `FakeQlooAdapter`, and `RecordingQlooAdapter` are the only Qloo I/O. Screens and the packer do not import `httpx` or know the host `hackathon.api.qloo.com`.
- **One mapper.** Qloo JSON becomes catalog items, taste hits, and nearby places in a single module. Adapters do not each invent a mapping.
- **Contract tests.** The fake and HTTP adapters share one suite. CI runs the fake entry on every relevant change. The live HTTP entry runs only from the scheduled or manual workflow, and only when the `QLOO_API_KEY` repo secret is set. It must not print the key or write a response into the repo.
- **Validate, then send.** A bad Qloo parameter comes back as an empty success. Reject it in the adapter before the request.
- **SOLID.** The port is the interface the pipeline depends on. Each adapter has one job. The checker, the packer, and the prose step are separate. A new adapter does not require a change to the pipeline. The packer still ignores `companionId`.
- **DRY.** Parameter validation, the JSON models, and the mapper exist once. Do not copy the contract tests per adapter.
- **Clean boundaries.** Domain types cross the API. Qloo documents stay inside the adapter. The optional model sees titles we already kept, not a chart and not the raw payload.
- **Web client.** When a screen starts calling the API, it does so through a typed repository aimed at `/v1`. Feature folders stay feature-first. Do not put a Qloo client, an LLM SDK, authentication, or a database in the Vite app.
- **Privacy.** No personal name, diagnosis, or medical record on the wire to Qloo or to a model. Exclusion themes are content tags, not a description of the visitor.
- **Replay.** The judge demo after the key is deactivated reads the private cache. That cache is gitignored. A second copy lives in the team's password store, not on GitHub.

Do not invent live API responses. Do not commit API keys, `.env` files, `.qloo-cache/`, or real Qloo payloads. Hackathon rules forbid Qloo data in the public repo. Fictional fixtures that match the documented JSON shape are allowed. A recording of a real response is not a fixture.

Map Qloo search hits and insight rows onto the types in `packages/core/src/data/types.ts` inside the adapter. Keep the screens on those types.

## Layout

```
apps/web/         Judge demo. Presentational UI under src/.
apps/mobile/      Expo app. app/ routes, src/ glass, art, and session state.
packages/core/    Kit model, packer, copy, fixtures, KitService. No React.
services/api/     FastAPI.
```

Web UI, under `apps/web/src/`:

```
src/components/   Presentational UI. One component per file.
  art/            Character, CoverArt, Stamp.
  chrome/         Shell, tab bar, question frame, screen intro.
  glass/          GlassSurface and the action button and link.
  kit/            Timeline, pause, places, topics, agent steps.
  ui/             Dial, option rows, icon, wells, chips, empty state.
src/content/      How a kind, a taste, or a theme maps to a character. Sample records are in packages/core.
src/hooks/        React hooks only.
src/lib/          Web-only helpers. Packing and formatting live in packages/core.
src/routing/      Hash parsing and path builders.
src/screens/      Route-level composition. One screen per file.
src/state/        The in-memory session draft.
src/tokens/       Hue names and motion numbers used by TypeScript.
src/index.css     Paint tokens and the utilities that consume them.
```

Put a new web screen in `apps/web/src/screens/` and register it in `ScreenOutlet.tsx` and `parse-route.ts`. Put a new sample record in `packages/core`. Put a reusable control in `apps/web/src/components/`, not inside a screen.

Paths such as `#/kit` live only in `apps/web/src/routing/paths.ts`. Mobile routes live in `apps/mobile/app/`.

## TypeScript and naming

- `strict`, `noUncheckedIndexedAccess`, and `verbatimModuleSyntax` are on. Fix types. Do not widen to `any` or silence the compiler.
- Named exports only.
- Component files are `PascalCase.tsx` and export a component of the same name.
- Non-component modules are `kebab-case.ts`.
- Hooks are `use-thing.ts` and export `useThing`.
- Types are `PascalCase`. Values are `camelCase`.
- Import with the `.ts` or `.tsx` extension, matching the rest of the repo.
- Prefer `import type` for types.
- Keep a file under about 220 lines. Split before it becomes a second job.
- Do not leave commented-out code.

## Design tokens

Color, radius, type size, blur, shadow, and z-index are defined once, as `--lc-*` variables in `src/index.css`. Tailwind reads them through `@theme inline`, so utilities such as `bg-page`, `text-ink`, `bg-seaglass-deep`, and `rounded-card` are the tokens, not new colors.

`src/tokens/tokens.ts` holds what CSS cannot: hue names and the motion numbers for the dot field and the agent steps. `src/tokens/hue-styles.ts` maps each hue to its wash and deep-background class.

Do not write a hex, rgb, or hsl value in a component. The favicon and the `theme-color` meta tag mirror `--lc-page` and `--lc-seaglass-deep`. If those two tokens change, update the favicon and the meta tag in the same change.

### Palette

Four hues, plus ink and the page. Every chromatic surface uses one of the four.

| Token          | Role                                                   |
| -------------- | ------------------------------------------------------ |
| apricot        | Warmth, film, listening                                |
| seaglass       | The path forward, episodes, podcasts                   |
| honey          | Food and a pause. Not podcasts                         |
| wisteria       | Reading, and themes held back                          |
| ink / ink-soft | Text. ink-soft is secondary copy and must stay ≥ 4.5:1 |
| page           | The warm paper behind everything                       |
| card           | White-ish rows, covers, and the stamp                  |
| line           | Disabled controls, quiet borders, unselected row edges |

Washes are `color-mix` of a hue into the page (`wash-apricot`, `wash-seaglass`, `wash-honey`, `wash-wisteria`). Deep hues (`*-deep`) are only for icon wells and for text that sits on them in the page color. Two content kinds may share a hue. Do not invent a fifth hue for a new card.

### Spacing, type, radius

Spacing is the scale 4, 8, 16, 24, 32, 64. In Tailwind that is `1`, `2`, `4`, `6`, `8`, `16`. Do not use the steps in between (`p-3`, `gap-5`, `mt-10`, and the rest).

Body copy is `text-lg` (1.125rem) or larger. Secondary copy is `text-base` (1rem) or larger: tile descriptors, kit time ranges, "Not medical advice", and any other supporting line. `html` sets `font-size: 100%` so those rem sizes follow the visitor's font setting. At a 16px root that is 18px and 16px. Do not use `text-sm`, `text-xs`, or a px font size on readable text. Tab labels are `text-base` (1rem) with an icon under `sm`, and `text-lg` from `sm` up, which stays above the 0.75rem floor. Card titles may stay at `text-2xl`. Secondary ink (`text-ink-soft`) has to clear 4.5:1 on the cream page and on every glass fill. Glows stay in the corners, off the text column. Measure before darkening `--lc-ink-soft`.

Radii: `rounded-card` for rows and covers, `rounded-panel` for the detail sheet, `rounded-tag` for chips and stickers, `rounded-full` only for real actions (the near-black primary pill, the quiet text link still uses the pill hit area), the tab bar, and icon wells. Do not put a pill, a shadow, or a fill behind a label that is not an action. The fictional-sample tag appears once, on welcome. The column is `--lc-content` (800px), applied by the `.page` class. Question screens narrow further to `--lc-question` (440px).

Nunito is the UI font. Caveat (the `.hand` class) is only the decorative welcome stickers, which are `aria-hidden`. Privacy notes, footnotes, instructions, and every other line use Nunito. Do not set `.hand` on a sentence a person needs to read to use the app.

The layout is mobile-first. Design and capture at a 390×844 phone, and let the same column widen toward the tablet. Kit cards become a row beside the cover from 800px.

### One question per screen

Onboarding is four hash screens, not one form: `#/love`, `#/chair`, `#/themes`, `#/company`. Each uses `QuestionFrame`: a centered bold `h1`, a short subline, one job in the body, then a full-width near-black primary pill and a quiet text link under it ("Skip for now" or "You can change this anytime"). The quiet link is still a real control (`GlassLink` tone `quiet`) at the 48px target and the 16px type floor. Continue on tastes stays disabled until one title is selected. Skip advances without requiring a change.

`#/onboarding` is an alias of `#/love`.

### Characters

`Character` draws an original blob mascot from a `CharacterVariant` in `src/data/character-kinds.ts`: `shape`, `hue`, optional `mood` (smile, grin, wink, content, curious), and optional `accessory` (bow, glasses, leaf, scarf, star). Shapes are pebble, bean, drop, bun, arch, sprout, and diamond: a rounded blob, a bean, a puffy triangle, a cloud, a tilted rounded square, a four-petal flower, and a wobbly diamond. Shared paths and the deeper character hues live in `src/data/character-art.ts`. Each mark is one solid fill with a soft inner highlight. There is no belly patch, no outline, and no drawn accessory; the accessory field stays on the variant so existing guides and rows still type-check. The face is two dark vertical eye pills with a white glint, set off to one side. An `Expression` in `src/data/character-expression.ts` can add a tiny mouth, filled brow arcs, and a blush. Moods still map onto those poses: smile is calm, grin is greeting, wink is attention, content is support, curious is thinking. The pose describes the drawing. It never claims the person in the chair is being read. Data files may import that type. They must not import a component.

Welcome uses greeting. The company step starts on attention and switches the chosen guide to celebration after a tap. Three taps within 1.2 seconds, or the accessible Tickle control, play a 2.4 second giggle and then ignore taps until it ends. Building holds thinking, then celebration when the kit is ready. The companion plan uses support. Empty states use sleepy. The recovery screen uses determined. Sizes are `sm`, `md`, and `lg`. `animate` bobs and blinks on the UI thread (CSS on the web). `settle` plays a damped arrival of about two seconds. Reduced motion leaves the settled pose. The page pauses those loops while it is hidden. `#/marks` shows every shape across the four hues. `#/expressions` shows every shape in every expression and is only routed in dev; the mobile route redirects outside `__DEV__`. Neither gallery is linked from navigation.

Guides live in `src/data/guides.ts` (Pebble, Lumen, Nook, Brim). Each line is one adult sentence. Do not write a guide as if it were speaking to a child. The draft stores `companionId`. Packing ignores it. Do not copy another product's characters, names, or lines.

`#/company` shows the four guides in a 2×2 grid of thin-glass cards. One tap selects a guide (`aria-pressed`). The selected cell shows a check, a 2px ink border, and the name. The primary button reads "Choose" plus that name and then writes `companionId`. Skip leaves the guide unchanged. The companion plan leads with the guide: the blob is the avatar, and the header bubble is the personality plus the first sentence of the quote. "Open nearby" is the section under that header. An unknown hash uses `EmptyState`: "We couldn't find that page", the pebble, and "Back to the start". If a control uses an arrow, its hit area is at least 44px and it has an `aria-label`.

### Option rows

`OptionRow` is the taste and theme control, drawn as thin glass. A selected row shows a check and a 2px ink border. The status word ("In the room" or "Left out") is visually hidden, and the button keeps `aria-pressed`. An unselected row keeps the quiet line border. Do not rely on color alone. The character sits on the right. The visible copy is the title and one short descriptor.

### Dial

`Dial` is the chair length. The arc runs from 1 hour to 4 hours. A native range sits on the dial with `role="slider"`, `aria-valuemin` 60, `aria-valuemax` 240, `aria-valuenow` in minutes, and `aria-valuetext` that includes the hour figure and "This chair". Arrow keys step 30 minutes. Four thin-glass pills under the dial (1h, 2h, 3h, 4h) set the same value, so the screen can be finished without dragging. A selected pill uses `aria-pressed` and a 2px ink border. The center figure is the hour count (a half hour shows one decimal), the word "hours", and "This chair". Hour ticks mark 1, 2, 3, and 4. The subline is "Turn the dial or tap a length." Focus draws the ink ring on `.dial`. The themes screen keeps illness, hospitals, and cancer preselected and says so: "We left out three. Change any." Chair, themes, company, and building (steps 3 through 6, after welcome and tastes) show a back chevron and four progress dots.

### Stamp and cover art

`CoverArt` paints a deterministic poster, square, or banner from a seed string plus a content or place kind. Each kind has its own composition in `cover-scene.tsx`: a film frame, stacked screens, a waveform, a book spine, a stage, or a table. A second hue (`accentHue`) shifts the motif so two items of the same kind still differ. The illustration has no title drawn on it. A glass type pill (Film, Podcast, and the rest) sits on the cover, and the title is set once in the text under the art. Pass `decorative` when that title is already adjacent. Filter ids use `useId`, because a kit card paints the same seed twice (the blurred bleed and the visible cover).

`Stamp` frames a square cover as perforated glass. The ready screen (`#/ready`) is the reward: "Your kit is ready", a fan of two or three covers behind the stamp, one line with the piece count and the chair length (the sample is 5 pieces and 4h 00m), and "Open my kit" in a sticky glass dock.

### Glass

The page stays warm off-white. `SoftBlobs` paints three large, soft glows in the palette hues, parked in the corners and masked out of the text column. They drift a little. Do not bring them back to full-bleed saturated color. Do not put body text on a glow.

Glass is reserved. `GlassSurface` and `glassClass` are the only recipe. Thickness sets blur, saturation, and fill:

| Thickness | Blur | Saturate | Fill | Use when                                                                         |
| --------- | ---- | -------- | ---- | -------------------------------------------------------------------------------- |
| thin      | 12px | 112%     | 86%  | Rows, building steps, companion cards, compare panels, length pills, guide picks |
| regular   | 24px | 145%     | 52%  | Dial disc, guide card, stamp, cover badges, the tab lens                         |
| thick     | 32px | 160%     | 68%  | Tab bar, kit cards over a blurred cover, the item sheet over the poster          |

Shapes are `badge`, `chip`, `bar`, `sheet`, `card`, `pill`, `row`, `disc`, and `sticker`. A tint (`glass-tint-*`) is a light wash of the palette hue, not the saturated step. Strong glass keeps a 1px light edge, a short top sheen, a faint inner shadow, and a small drop shadow. Thin glass keeps the edge and a softer sheen, and almost no shadow. Pressable glass scales to 0.98.

Pointer-following sheen is only on the tab bar and kit cards (`follow` on `glassClass`). Do not add it to rows, steps, or panels.

Primary actions are solid near-black (`.glass-ink`) with a 1px top highlight. They are not tinted glass and they do not pick up the page color. Quiet actions stay `.action-quiet`: transparent, ink, no border and no shadow.

Welcome notes are paper (`.sticker`), a hue mixed into the card, with a light frost. They are not glass surfaces.

`prefers-reduced-transparency: reduce`, and a missing backdrop-filter, paint light glass as opaque card and the primary as opaque ink, with no blur and no sheen. The glows quiet down in that mode too.

The tab bar is a floating glass capsule. The current tab is a frosted glass lens that slides between the three links in 180ms (`aria-current="page"`). The move is instant when the visitor prefers reduced motion. The current icon and label are bolder. There is no ink pill around the lens. Do not communicate the current tab by color alone.

### Tab clearance

Screens with the tab bar use `.page-pad-tabs`. That column is its own scrollport, `100dvh` minus `--lc-tab-dock` (the bar plus the dock inset or `env(safe-area-inset-bottom)`), with 24px of padding inside the scroller. Content moves above the bar. It does not slide underneath it. Screens without the bar use `.page-pad` and scroll the document, including the safe-area inset. The phone tab stacks the icon over the label, so the bar token includes the extra stack height. Route changes reset scroll on `.page`.

### Icon wells

`IconWell` paints a circle in the deep step of a hue, with the icon in the page color. Use it for a Lucide mark that is not a character (the compare cross and check, a pause, an agent step). `Icon` is the Lucide wrapper. Do not put a neutral gray circle behind an icon.

### Hero number

Building, Kit, Companion, and Compare each have one `HeroNumber`: the figure that matters (chair length, time filled, themes held back, places open). The dial is the hero on the chair screen. Welcome has no hero number; its `h1` is the promise. Do not add a second display-sized number on the same screen. Empty and unknown states omit it. The figure uses `.hero-figure`.

### Motion

Corner glows drift slowly and stay off the text. Characters bob and blink when `animate` is set. Screen changes use `.screen-enter`. The building steps check off on `motion.stepIntervalMs`. All of this is covered by the global `prefers-reduced-motion: reduce` rule in `index.css`, which collapses animation and transition time. Do not add a motion effect that ignores that query.

### Dot field

`src/components/background/DotField.tsx` is a quiet texture behind every screen, including building. `dot-model.ts` is the math, so the component only owns the canvas lifecycle.

- A grid of small dots, lightly jittered, colored by cycling the four hue tokens read from CSS at runtime.
- Dots near the pointer ease slightly brighter and toward the pointer, then ease home. The loop stops once they have settled.
- Alphas in `tokens.ts` stay low. The field is paper grain, not a spectacle.
- `mode="gather"` remains on `DotField` for a later loading state; nothing in the prototype turns it on.
- The canvas is sized with `devicePixelRatio`, capped by `motion.maxDevicePixelRatio`.
- Drawing is scheduled with `requestAnimationFrame` and cancelled when the document is hidden.
- `prefers-reduced-motion: reduce` draws the field once and does not follow the pointer or gather.

Keep the field quiet. This screen sits beside a person for hours. Do not add trails, flashes, a dark mesh, or a tight vortex.

## Components and data

- Screens compose. They do not fetch, and they do not own palette values.
- Sample data stays in `packages/core` behind the interfaces in `types.ts`. Components receive plain props or call a pure helper from that package.
- `packSession` is the duration fitter. Change packing rules there, not inside `KitScreen`. It reads tastes, themes, and minutes. It does not read `companionId`.
- Reuse `QuestionFrame`, `Character`, `CoverArt`, `Dial`, `Stamp`, `GlassSurface`, `GlassButton`, `GlassLink`, `OptionRow`, `IconWell`, `HeroNumber`, and `BecauseChip` instead of copying markup. A screen has a headline and at most one short subline. Kit cards show the cover, title, type, time range, and one "Because you love" chip. Item detail is a bottom sheet over the dimmed kit and adds one check: "No illness, hospital, or cancer themes." Compare is a title and one line on each panel, and the plain-model panel lists the themes it would bring with the same chips as the kit header. The fictional-sample tag is welcome only.
- Session state is the draft in `SessionContext` (tastes, themes, minutes, companion). The packed kit is derived with `usePackedSession`. Do not store a second copy of the kit.
- Do not thread the draft through props from `App`. Call `useSession` in the screen that needs it.

## Accessibility

- One `h1` per screen, inside `QuestionFrame`, `ScreenIntro`, or `EmptyState`.
- Interactive controls meet `--lc-target` (48px) in height. Cards that are links count as the target.
- Characters, cover art used as decoration, icon wells, and stickers are `aria-hidden`.
- Tastes, themes, length pills, and guide picks are toggle buttons with `aria-pressed`. Chair length is also the dial slider. Arrow keys on that slider move 30 minutes.
- The building sequence checks steps off one by one. `prefers-reduced-motion: reduce` shows every step already done. The sequence exposes the current step and a polite live region, and it offers a way forward before the timer finishes.
- Focus uses the visible `:focus-visible` ring. Do not remove outlines.
- Ink on the page and on glass, page-colored type on the near-black primary, and page-colored glyphs on deep wells are the contrast pairs. Do not put text on a corner glow. Do not fade text with opacity to mean "disabled". Disabled buttons use the `line` token.

## Commands

From the repo root:

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
npm run dev:mobile
npm run export:ios
npm run doctor
npm run lint:slop
npm run lint:slopmd
```

`npm run dev` serves the web demo at http://127.0.0.1:4179. `npm run dev:mobile` serves the Expo app for web on port 4181.

Signed iOS builds run on a Mac:

```bash
npx eas-cli login
npx eas-cli build --platform ios --profile preview
npx eas-cli submit --platform ios --profile production
```

Leave `EXPO_PUBLIC_API_URL` unset for TestFlight and App Review. Profiles live in `apps/mobile/eas.json`. iOS build numbers auto-increment. See `docs/app-store.md`.

`lint:slop` and `lint:slopmd` are informational. CI runs them and does not fail the build on their findings yet.

The API, from `services/api` with [uv](https://docs.astral.sh/uv/) 0.13:

```bash
uv sync --extra dev
uv run ruff check .
uv run ruff format --check .
uv run mypy
uv run pytest
```

`pytest` includes the shared FakeQloo contract tests and fails if coverage on `app/domain` and `app/application` is under 85 percent. The live HTTP test stays skipped unless `QLOO_API_KEY` is set.

## Definition of done

A change is done when all of the following are true:

- `format:check`, `lint`, `typecheck`, `test`, and `build` pass for the web app when it changed.
- `ruff`, `mypy`, and `pytest` pass for the API when it changed.
- New color, spacing, radius, and type choices go through the tokens above.
- A new screen is reachable from the hash router and from a control on an existing screen.
- Empty and thin results have a sentence that says what to do next.
- Reduced motion still shows the content. The dot field does not animate.
- Sample copy stays in English, and fictional records stay labeled as fictional.
- No key, no Qloo response, and no medical record was added to the tree.

<!-- slopmd:begin -->

# SlopMD Prime Directives

Non-negotiable rules for all code you write or modify in this project.

## Before writing

1. Read neighboring code first. Match the project's style, idioms, libraries, layers, and test patterns, even against your own preference.
2. Search the repo and the standard library for an existing helper before writing a new one.
3. Never add a dependency without verification: it must exist on the official registry, be established, and be pinned to an exact version. If SlopMD is installed, run `npx slopmd check-dep <package>` and stop for human approval when it requires it.

## Naming

4. Name by domain intent, not mechanism. One term per concept across the codebase; reuse the project's existing vocabulary.
5. Banned in identifiers: `enhanced`, `improved`, `new`, `simple`, `my`, `_v2`, `final`, and meaning-free suffixes like `Manager`, `Helper`, `Util`, `Processor`, `Data`, `Info`, unless they name a real pattern already in use here.

## Functions and abstraction

6. Split functions by subproblem, never by line count. If understanding one algorithm requires hopping between fragments, inline them back.
7. Guard clauses over nesting. More than 3 levels of nesting means refactor.
8. No wrappers that only delegate, no interfaces with a single implementation, no design pattern unless you can name the axis of change it isolates today.
9. Duplication is cheaper than the wrong abstraction. Abstract on the third occurrence, and only when the copies represent the same knowledge.

## Comments and docs

10. Never write comments that narrate the code, apologize, or address the reviewer ("as requested", "in a real app you would"). If a block needs a what-comment, extract a well-named function instead.
11. Do document public interfaces: contract, units, ranges, invariants, and the why behind non-obvious decisions.
12. Plain ASCII punctuation everywhere: no em dashes, en dashes, middle dots, or typographic quotes. No emojis in code, comments, logs, commit messages, or docs.

## Errors, types, and security

13. Catch only what you can handle. Never catch-and-continue silently, never bare `except`, never an empty catch block.
14. Validate at system boundaries. Inside them, trust inputs and assert the impossible instead of re-validating everywhere.
15. No `any` or type-suppression directives without a written justification on the same line.
16. Named constants instead of magic numbers, hardcoded strings, and inline URLs.
17. Never hardcode secrets, keys, tokens, or credentials anywhere, including tests, comments, and docs. Config comes from the environment.
18. Parameterize every query. Never concatenate untrusted input into SQL, shell, HTML, paths, or eval.

## Performance

19. No queries, network calls, or blocking I/O inside loops over records; batch or prefetch. Run independent async operations concurrently unless a real dependency or rate limit forces sequence.
20. Anything subtler: measure before optimizing, and never trade clarity for an unmeasured win.

## Diff discipline

21. One intent per diff. Never mix refactoring with behavior change, never reformat lines you did not otherwise touch, no drive-by renames.
22. Tests must be able to fail: never assert the mock, never test implementation details, never weaken or delete a failing test to go green.
23. Before finishing: remove debug prints, unused imports, dead branches, and commented-out code.
24. If you cannot explain why the code works, it is not done.

<!-- slopmd:end -->
