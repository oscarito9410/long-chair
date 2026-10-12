# ADR 0010: Qloo wire shape and enrichment

**Status:** Accepted

**Date:** 2026-10-12

## Context

The public Insights sample puts `tags`, `popularity`, `query`, `disambiguation`, and `external` on the entity, next to `properties`. Search returns `results` as a list and takes `types`. Tag search takes `filter.query`, and tag records may use `tag_id` or `id`. Invalid parameters are ignored and come back as an empty 200.

Qloo does not provide podcast episodes, song durations, book reading minutes, playback URLs, or place closing times.

Hackathon rules forbid publishing live Qloo responses in a public repository.

## Decision

- Models and fixtures follow that wire shape. The theme filter reads `entity.tags` only.
- Outgoing query keys are checked against an allowlist per endpoint before a request is sent.
- `durationSource` is `confirmed` or `estimated`. Movie and TV runtimes from `properties.duration` are confirmed. Podcast episodes and artist albums come from iTunes when enrichment is live, and from a sample record otherwise. Book minutes are `page_count` times one minute per page and are labeled estimated.
- iTunes, TMDB, and Open Library sit behind `EnrichmentPort`. The default adapter is the fictional sample. `ENRICHMENT_MODE=live` uses HTTP. TMDB runs only when `TMDB_API_KEY` is set. Spotify is a search link, not an API.
- The packer uses the enriched minutes. The app shows a card and an "Open in …" link. It does not play media.
- Place walk minutes come from coordinates. Closing time is shown only when a source provides it. The sample does not.
- TMDB attribution and the JustWatch credit live in Settings, and the JustWatch credit is repeated wherever watch providers are shown.
- Live responses go to `services/api/.qloo-live/`, which is gitignored. `python -m app.live.qloo_scope` writes a shape report there when `QLOO_API_KEY` is set.

## Consequences

A wrong parameter name fails in tests instead of emptying the kit. The sample shelf stays packable without a key. A live key can answer the open questions in the scope report without committing a response.
