# Fixture field confidence

These JSON files are fictional. They are shaped like the documented catalog responses.
They are not recordings. Keys below are unconfirmed until a live response is seen on a
machine that has a key. That response is not committed.

## Unconfirmed

- `query.explainability` and the keys inside it (`warning`, `entities`, `entity_id`, `score`).
  The prose says per-result and top-level explainability exist. The JSON shape is not from a sample.
  Each block in the fixtures sets `x-long-chair-confidence` to `unconfirmed`.
- Search `results.entities` using the insights envelope. The search response schema was not in the sample.
- Tags `results.tags`. Tag objects copy `id`, `name`, and `type` from the movie sample. The list path is unconfirmed.
- `GET /v2/tags` query parameter `query` (see `TAGS_QUERY_KEY` in `app/adapters/queries.py`).
- `properties.duration` on tv, podcast, book, and artist. Movie duration is confirmed. Non-movie
  lengths in these files match the prototype clock and are still labeled assumed by the mapper.
- `properties.creator` for non-movies.
- Place response fields. `x-long-chair-kind`, `x-long-chair-walk-minutes`, `x-long-chair-open-until`,
  and `x-long-chair-price-label` are our annotations, not catalog fields.
- `x-long-chair-slug` and `x-long-chair-theme-id` are our annotations so the kit can use prototype ids.

## Confirmed shape we copied

- `success`, `results.entities[]`, `name`, `entity_id`, `type`, `subtype`, `properties`.
- Movie `properties.duration`, `description`, `tags[].id`, `tags[].name`, `tags[].type`,
  `popularity`, `image.url`, `production_companies`, `short_descriptions`.

## Not in these files

- Any host on qloo.com.
- Titles from the public onboarding sample.
- A catalog key.
