# Feature Specification: Region chips and verified themes

**Feature Branch**: `main`

**Created**: 2026-10-12

**Status**: Draft

**Input**: Region-aware interest chips from device locale, and theme rules that must be verified before a title counts as clear.

## User Scenarios & Testing

### User Story 1 - Chips follow the device region (Priority: P1)

A person opens "What do you love?" and sees quick-start chips for their region, still in Watch, Listen, Follow and play, and Make and learn. A couple of chips come from outside that region. Search still adds anything they type.

**Independent Test**: Locale `es-MX` shows Liga MX, telenovelas, and Bad Bunny. Locale `en-US` shows NFL, MLB, country, and sitcoms. An unknown locale uses the global mix (anime, soccer, K-pop, jazz). Each list has one or two outside chips.

**Acceptance Scenarios**:

1. **Given** no saved region and a locale of `es-MX`, **When** the love step opens, **Then** the chips are the Mexico list and no location prompt appears.
2. **Given** the Region control, **When** the person chooses United States, **Then** the chips change and the choice is still selected after a reload.
3. **Given** a typed query, **When** the person submits it, **Then** search resolves it through the existing taste search path and the groups step aside.

### User Story 2 - Themes are rules, not a blanket clearance (Priority: P1)

Illness, Hospitals, Cancer, Losing a parent, and Grief start on. The person can turn any off and can add a free-text theme. A title enters the kit only when every active built-in theme is verified clear.

**Independent Test**: The clinic sample is flagged for illness. A greenhouse film with empty sample sources is clear. A custom theme with no synopsis hit is unverified and does not display as clear. Fifty sample titles produce a precision and recall figure on Compare.

**Acceptance Scenarios**:

1. **Given** a fresh onboarding, **When** the themes step opens, **Then** all five defaults are on.
2. **Given** a custom theme, **When** it is added, **Then** it is labeled keyword-only and lower confidence.
3. **Given** a packed title, **When** the person opens "Why it passed", **Then** the sheet names the source and the tag or keyword, and says the evidence is a sample.

## Requirements

- Region is locale only. No GPS and no permission prompt.
- Domain types, seed lists, rules, the verifier, and the score stay in `packages/core`. Adapters sit behind `TasteSeedProvider` and `ThemeVerifier`.
- Unverified titles never count as clear. See ADR 0009 for the short-chair decision.
- The golden fixture is `packages/core/fixtures/theme-golden.json`, written from `packages/core/src/data/theme-golden.ts`. Each row records sample Qloo tags, TMDB keywords, and content warnings. It is not a live extract.
