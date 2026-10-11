# Agent guide

Long Chair is a static design prototype. Read this before editing. The product story and the run steps live in `README.md`.

## What this repo is

A Vite + React + TypeScript UI with fictional sample data. Visitors can plan a chair, watch an illustrated agent sequence, and open the kit, the companion plan, and the plain-model contrast.

Do not add a backend, a Qloo client, an LLM SDK, authentication, or a database unless a person explicitly asks to start the hackathon build. Do not invent live API responses. Do not commit API keys or real Qloo payloads. Hackathon rules forbid Qloo data in the public repo.

When the real integration starts, map Qloo search hits and insight rows onto the types in `src/data/types.ts`. Keep the screens on those types.

## Layout

```
src/components/   Presentational UI. One component per file.
src/content/      How a kind or a place maps to a hue and an icon.
src/data/         Sample records and the draft / catalog types.
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

| Token          | Role                                                |
| -------------- | --------------------------------------------------- |
| apricot        | Warmth, film, listening                             |
| seaglass       | The path forward, episodes, the solid action button |
| honey          | Food, podcasts, a pause                             |
| wisteria       | Reading, and themes held back                       |
| ink / ink-soft | Text                                                |
| page           | The paper behind everything                         |
| line           | Disabled controls and quiet borders                 |

Washes are `color-mix` of a hue into the page (`wash-apricot`, `wash-seaglass`, `wash-honey`, `wash-wisteria`). Deep hues (`*-deep`) are only for icon wells and for text that sits on them in the page color. Two content kinds may share a hue. Do not invent a fifth hue for a new card.

### Spacing, type, radius

Spacing is the scale 4, 8, 16, 24, 32, 64. In Tailwind that is `1`, `2`, `4`, `6`, `8`, `16`. Do not use the steps in between (`p-3`, `gap-5`, `mt-10`, and the rest).

Body copy is `text-lg` or larger. Do not use `text-sm` or `text-xs`. The tab label may be `text-base` under `sm` so the word "Companion" fits a phone, and `text-lg` from `sm` up.

Radii: `rounded-card` for pastel cards, `rounded-panel` for glass sheets, `rounded-full` for pills, wells, and buttons. The column is `--lc-content` (800px), applied by the `.page` class.

Nunito is the UI font. Caveat (the `.hand` class) is only for a short aside, one per screen at most.

### Glass

Frosted surfaces use the `glass` utility: a page-tinted fill, backdrop blur, a top specular edge, and a soft inner border. `GlassPanel`, quiet `GlassButton` / `GlassLink`, and the tab bar all use it. `Specular` is the 1px highlight. Text sits on that tint, never on a fully transparent blur.

Pastel cards use `pastel-card` plus one wash. They are solid, not frosted.

### Icon wells

`IconWell` paints a circle in the deep step of the card's hue, with the icon in the page color. The well belongs to the card. Do not put a neutral gray circle behind an icon.

### Hero number

Each primary screen has one `HeroNumber`: the figure that matters (chair length, time filled, themes held back, places open). Do not add a second display-sized number on the same screen. Empty and unknown states omit it. The figure uses `.hero-figure`.

### Motion

Blobs drift slowly. Screen changes use `.screen-enter`. Both are covered by the global `prefers-reduced-motion: reduce` rule in `index.css`, which collapses animation and transition time. Do not add a motion effect that ignores that query.

### Dot field

`src/components/background/DotField.tsx` is the interactive background. `dot-model.ts` is the math, so the component only owns the canvas lifecycle.

- A grid of small dots, lightly jittered, colored by cycling the four hue tokens read from CSS at runtime.
- Dots near the pointer ease brighter, larger, and slightly toward the pointer, then ease home. The loop stops once they have settled, so an idle chair does not animate forever.
- `mode="gather"` (the building screen) pulls the field inward and pulses it. Leaving that screen returns the mode to `ambient` and the dots ease back.
- The canvas is sized with `devicePixelRatio`, capped by `motion.maxDevicePixelRatio`.
- Drawing is scheduled with `requestAnimationFrame` and cancelled when the document is hidden.
- `prefers-reduced-motion: reduce` draws the field once and does not follow the pointer or gather.

Keep the field quiet. This screen sits beside a person for hours. Do not add trails, flashes, or a tight vortex.

## Components and data

- Screens compose. They do not fetch, and they do not own palette values.
- Sample data stays in `src/data/` behind the interfaces in `types.ts`. Components receive plain props or call a pure helper in `src/lib/`.
- `packSession` is the duration fitter. Change packing rules there, not inside `KitScreen`.
- Reuse `GlassPanel`, `GlassButton`, `GlassLink`, `SelectCard`, `IconWell`, `HeroNumber`, `BecauseList`, and `AvoidedRow` instead of copying markup.
- Session state is the draft in `SessionContext` (selected tastes, themes, and minutes). The packed kit is derived with `usePackedSession`. Do not store a second copy of the kit.
- Do not thread the draft through props from `App`. Call `useSession` in the screen that needs it.

## Accessibility

- One `h1` per screen, inside `ScreenIntro` or, for the empty routes, inside `EmptyState`.
- Interactive controls meet `--lc-target` (48px) in height. Cards that are links count as the target.
- Icon wells and decorative SVGs are `aria-hidden`.
- Tastes, themes, and duration are real checkboxes and radios inside labels, not click-only divs.
- The building sequence exposes the current step and a polite live region, and it offers a way to the kit before the timer finishes.
- Focus uses the visible `:focus-visible` ring. Do not remove outlines.
- Ink on the page, and page-colored glyphs on deep wells, are the contrast pairs. Do not put ink-soft text on a deep hue. Do not fade text with opacity to mean "disabled". Disabled buttons use the `line` token.

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
