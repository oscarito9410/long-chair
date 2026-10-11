# Agent guide

Long Chair is a static design prototype. Read this before editing. The product story and the run steps live in `README.md`.

## What this repo is

A Vite + React + TypeScript UI with fictional sample data. Visitors can plan a chair, watch an illustrated agent sequence, and open the kit, the companion plan, and the plain-model contrast.

Do not add a backend, a Qloo client, an LLM SDK, authentication, or a database unless a person explicitly asks to start the hackathon build. Do not invent live API responses. Do not commit API keys or real Qloo payloads. Hackathon rules forbid Qloo data in the public repo.

When the real integration starts, map Qloo search hits and insight rows onto the types in `src/data/types.ts`. Keep the screens on those types.

## Layout

```
src/components/   Presentational UI. One component per file.
  art/            Character, CoverArt, Stamp.
  chrome/         Shell, tab bar, question frame, screen intro.
  glass/          GlassSurface and the action button and link.
  kit/            Timeline, pause, places, topics, agent steps.
  ui/             Dial, option rows, icon, wells, chips, empty state.
src/content/      How a kind, a taste, or a theme maps to a character.
src/data/         Sample records, guides, and the draft / catalog types.
src/hooks/        React hooks only.
src/lib/          Pure functions: packing, formatting, matching.
src/routing/      Hash parsing and path builders.
src/screens/      Route-level composition. One screen per file.
src/state/        The in-memory session draft.
src/tokens/       Hue names and motion numbers used by TypeScript.
src/index.css     Paint tokens and the utilities that consume them.
```

Put a new screen in `src/screens/` and register it in `src/screens/ScreenOutlet.tsx` and `src/routing/parse-route.ts`. Put a new sample record in `src/data/`. Put a reusable control in `src/components/`, not inside a screen.

Paths such as `#/kit` live only in `src/routing/paths.ts`.

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

`Character` draws an original blob mascot from a `CharacterVariant` in `src/data/character-kinds.ts`: `shape`, `hue`, optional `mood` (smile, grin, wink, content, curious), and optional `accessory` (bow, glasses, leaf, scarf, star). Shapes are pebble, bean, drop, bun, arch, and sprout. Each mascot pairs a shape with a second hue for the belly. Data files may import that type. They must not import a component.

Use the character as the icon on an `OptionRow`, as the guide on `#/company` and the companion plan, and in empty and loading states (including the building screen). Sizes are `sm`, `md`, and `lg`. `animate` adds a bob and a blink. Both keyframes are collapsed by the global `prefers-reduced-motion` rule, which leaves the open-eye pose.

Guides live in `src/data/guides.ts` (Pebble, Lumen, Nook, Brim). Each line is one adult sentence. Do not write a guide as if it were speaking to a child. The draft stores `companionId`. Packing ignores it. Do not copy another product's characters, names, or lines.

`#/company` shows the four guides in a 2×2 grid of thin-glass cards. One tap selects a guide (`aria-pressed`). The selected cell shows a check, a 2px ink border, and the name. The primary button reads "Choose" plus that name and then writes `companionId`. Skip leaves the guide unchanged. The companion plan puts "Open nearby" directly under the headline, so the hero count is the places in view. The guide is a compact line under those places. An unknown hash uses `EmptyState`: "We couldn't find that page", the pebble, and "Back to the start". If a control uses an arrow, its hit area is at least 44px and it has an `aria-label`.

### Option rows

`OptionRow` is the taste and theme control, drawn as thin glass. A selected row shows a check and a 2px ink border. The status word ("In the room" or "Left out") is visually hidden, and the button keeps `aria-pressed`. An unselected row keeps the quiet line border. Do not rely on color alone. The character sits on the right. The visible copy is the title and one short descriptor.

### Dial

`Dial` is the chair length. The arc runs from 1 hour to 4 hours. A native range sits on the dial with `role="slider"`, `aria-valuemin` 60, `aria-valuemax` 240, `aria-valuenow` in minutes, and `aria-valuetext` that includes the hour figure and "This chair". Arrow keys step 30 minutes. Four thin-glass pills under the dial (1h, 2h, 3h, 4h) set the same value, so the screen can be finished without dragging. A selected pill uses `aria-pressed` and a 2px ink border. The center figure is the hour count (a half hour shows one decimal), the word "hours", and "This chair". Hour ticks mark 1, 2, 3, and 4. The subline is "Turn the dial or tap a length." Focus draws the ink ring on `.dial`. The themes screen keeps illness, hospitals, and cancer preselected and says so: "We left out three common ones. Change any."

### Stamp and cover art

`CoverArt` paints a deterministic poster, square, or banner from a seed string plus a content or place kind. Each kind has its own composition in `cover-scene.tsx`: a film frame, stacked screens, a waveform, a book spine, a stage, or a table. A second hue (`accentHue`) shifts the motif so two items of the same kind still differ. Book and place titles are ink on a light field; other titles sit in the page color on a deep field. Pass `decorative` when the title is already in adjacent text. Filter ids use `useId`, because a kit card paints the same seed twice (the blurred bleed and the visible cover).

`Stamp` frames a square cover as perforated glass. The ready screen (`#/ready`) is the reward: "Your kit is ready", the stamp, and "Open my kit".

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

The tab bar is a floating glass capsule. The current tab is a glass lens with a 2px ink border that slides between the three links (`aria-current="page"`). Do not communicate the current tab by color alone.

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
- Sample data stays in `src/data/` behind the interfaces in `types.ts`. Components receive plain props or call a pure helper in `src/lib/`.
- `packSession` is the duration fitter. Change packing rules there, not inside `KitScreen`. It reads tastes, themes, and minutes. It does not read `companionId`.
- Reuse `QuestionFrame`, `Character`, `CoverArt`, `Dial`, `Stamp`, `GlassSurface`, `GlassButton`, `GlassLink`, `OptionRow`, `IconWell`, `HeroNumber`, and `BecauseChip` instead of copying markup. A screen has a headline and at most one short subline. Kit cards show the cover, title, type, time range, and one "Because you love" chip. Item detail adds a one-line check. Compare is a title and one line on each panel. The fictional-sample tag is welcome only.
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
npm run build
npm run dev
```

`npm run dev` serves http://127.0.0.1:4179.

## Definition of done

A change is done when all of the following are true:

- `format:check`, `lint`, `typecheck`, and `build` pass.
- New color, spacing, radius, and type choices go through the tokens above.
- A new screen is reachable from the hash router and from a control on an existing screen.
- Empty and thin results have a sentence that says what to do next.
- Reduced motion still shows the content. The dot field does not animate.
- Sample copy stays in English, and fictional records stay labeled as fictional.
- No key, no Qloo response, and no medical record was added to the tree.
