# Fixture field confidence

These JSON files are fictional. They follow the documented wire shape.
They are not recordings, and they are not responses from a live catalog.
A live response belongs in `services/api/.qloo-live/`, which is gitignored.

## Confirmed on the public movie sample

- Envelope `success`, root `duration` (the OpenAPI also allows `duration` inside `results`; both parse).
- Entity `name`, `entity_id`, `type`, `subtype`.
- `popularity`, `tags`, `query`, `disambiguation`, and `external` on the entity, beside `properties`.
- `properties.description`, `properties.duration` for a movie, `properties.image.url`,
  `properties.content_rating`, `properties.release_year`, `properties.production_companies`.
- `properties.short_descriptions[]` as `{value, languages}`.
- `tags[]` on an entity use `id`, `name`, and `type`.
- `GET /search` returns `results` as an array and takes `types` (plural).
- `GET /v2/tags` takes `filter.query`. Tag records from taste analysis use `tag_id`.
  Entity tags use `id`. The model accepts both.

## Issue #11 shape observations

The issue records omitted search success, nullable text, empty artist duration,
integer episode_count, search types, nested search external ids, root insights
external lists, query.affinity, query.measurements, and
query.explainability.signal.interests.entities. New tests use invented values for
these shapes. They are not live recordings. Place location/properties.geocode are
normalized; old lat/lon fields remain only for fixture compatibility.

## Documented, still checked by the live scope script

- Where affinity sits (`query.affinity` is the likely place; the flattened schema calls it `affinity`).
- Whether `properties.duration` arrives for a TV show.
- Additional page_count variants beyond the existing numeric fixture.
- Which external id families appear for podcast, artist, and book.
- Additional explainability fields beyond issue #11.
- Which exclude-tags operator removes a known hit.
- Whether streaming-service tags are global or by country.
- Place hours fields and place coverage for Mexico City.

## Our annotations

- `x-long-chair-slug`, `x-long-chair-theme-id`, `x-long-chair-taste-kind`, `x-long-chair-aliases`.
- `x-long-chair-kind` on a place, used only when a category tag is missing.
- Older fixture `query.explainability.entities` is an unconfirmed legacy shape. The
  issue #11 signal.interests.entities shape is now explicitly tested.
- `enrichment.json` is a sample iTunes, TMDB, and Open Library stand-in. It is not a catalog body.

## Left off on purpose

- Podcast episode duration, artist concert duration, and book `duration`. Those are not catalog fields.
- `properties.creator`.
- Place closing times. Walk minutes prefer location or geocode; lat/lon is legacy.
- Any host on qloo.com, and any title from the public onboarding sample.
