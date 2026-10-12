# Feature Specification: Qloo wire shape and enrichment

**Feature Branch**: `main`

**Created**: 2026-10-12

**Status**: Draft

**Input**: Match the documented Qloo response shape, and fill durations and open-links from secondary sources.

## User Scenarios & Testing

### User Story 1 - Theme tags survive a realistic payload (Priority: P1)

A movie recommendation carries keyword tags beside `properties`. The theme filter sees those tags.

**Independent Test**: A fixture shaped like the public Insights sample, with an illness tag on the entity, is flagged. The same tag nested only inside `properties` is not.

### User Story 2 - A piece has a length and a place to open it (Priority: P1)

The kit uses a confirmed runtime, an iTunes episode or album length, or an estimated reading time. Each card can open Apple Podcasts, Apple Music, Apple TV, Open Library, Spotify search, or Maps. Nothing plays inside the app.

**Independent Test**: The sample book is labeled estimated. The sample film keeps its runtime and offers "Open in Apple TV". Places show walk minutes and do not invent a closing time.

## Requirements

- Search sends `types`. Tag search sends `filter.query`. `TagRecord` accepts `id` and `tag_id`.
- Outgoing parameters are allowlisted per endpoint.
- Enrichment adapters are fake by default and HTTP when `ENRICHMENT_MODE=live`.
- Live Qloo bodies stay in `services/api/.qloo-live/`.
- See ADR 0010.
