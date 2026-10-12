# QlooPort

The pipeline depends on one interface, `QlooPort`. Three adapters implement it. A shared mapper and a shared JSON schema sit beside them, so the fake and the live client cannot drift.

The package is `services/api`. `FakeQlooAdapter` is the default. `HttpQlooAdapter` talks to the hackathon host. `RecordingQlooAdapter` records and replays through a cache. Fictional fixtures live under `services/api/app/adapters/fixtures/`.

## Shape

```text
pipeline  -->  QlooPort  -->  HttpQlooAdapter ----> hackathon.api.qloo.com
                      \-->  FakeQlooAdapter ----> committed fictional fixtures
                      \-->  RecordingQlooAdapter --> HttpQlooAdapter
                                         \--> gitignored local cache
```

`RecordingAdapter` is a decorator. It is the live adapter and the replay adapter, depending on mode.

The port's methods return domain types (`TasteSeed`, `CatalogItem`, `NearbyPlace` from `src/data/types.ts`). Qloo's JSON does not leave the adapter. Each adapter parses JSON with one shared pydantic model, `InsightsDocument` / `SearchDocument` / `TagsDocument`, then one shared mapper builds the domain object. Contract tests check both layers.

```python
class QlooPort(Protocol):
    async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]: ...

    async def exclusion_tags(self, themes: Sequence[AvoidTheme]) -> Sequence[TagHit]: ...

    async def insights(
        self,
        kind: ContentKind,
        interest_ids: Sequence[str],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str] = (),
    ) -> Sequence[CatalogItem]: ...

    async def places(
        self,
        locality: str,
        weekday: Weekday,
        interest_ids: Sequence[str],
        tag_ids: Sequence[str],
    ) -> Sequence[NearbyPlace]: ...
```

`TasteHit` is a `TasteSeed` plus `qloo_entity_id`. `TagHit` is our `AvoidTheme` id plus the Qloo tag id and the tag's display name. `Weekday` is the seven names `filter.hours` accepts.

Adapters do not pack sessions, do not call a model, and do not read `companionId`.

## Modes

`QLOO_MODE` selects the composition in the API's entrypoint:

| Mode     | Adapter                                                                         | When                                                         |
| -------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `fake`   | `FakeQlooAdapter`                                                               | Local development and CI. No key. Default                    |
| `live`   | `RecordingAdapter` around `HttpQlooAdapter`, writes on                          | The key is present. Every successful response is recorded    |
| `replay` | `RecordingAdapter` around a transport that errors if asked to go to the network | The key is absent or dead, and the private cache must answer |

`GET /v1/health` returns the mode. A missing key with `QLOO_MODE=live` fails at startup. It does not silently become fake.

## HttpQlooAdapter

Base URL: `https://hackathon.api.qloo.com`. Header: `X-Api-Key: {QLOO_API_KEY}`. The key is read from the environment on the server. It is not in the repo, the image, the frontend bundle, or a log.

| Method           | HTTP                                                   |
| ---------------- | ------------------------------------------------------ |
| `search`         | `GET /search?query={text}&types=urn:entity:{kind}`     |
| `insights`       | `GET /v2/insights` with the query parameters below     |
| `places`         | `GET /v2/insights` with `filter.type=urn:entity:place` |
| `exclusion_tags` | `GET /v2/tags`                                         |

`/search` is the path from Qloo's public hackathon instructions (a Devpost staff note with a working curl). `/v2/insights` is the documented Insights route. `/v2/tags` takes `filter.query`. Entity tags, popularity, disambiguation, and external ids sit beside `properties`, not inside it. Search `results` is a list. See ADR 0010.

Insights query string for a content type:

```text
filter.type=urn:entity:movie
signal.interests.entities={id},{id}
filter.exclude.tags={urn:tag:...},{urn:tag:...}
operator.exclude.tags=union
feature.explainability=true
take=20
```

Add `filter.exclude.entities={id},{id}` only on the checker's retry.

Places:

```text
filter.type=urn:entity:place
filter.location.query={locality}
filter.hours=monday
filter.tags={urn:tag:...}
signal.interests.entities={id},{id}
feature.explainability=true
take=10
```

`signal.interests.entities` is documented as a comma-separated list on GET. Do not JSON-encode it. JSON bodies are for POST, which version 1 does not use.

### Validate before sending

Invalid parameters are known to return an empty result with a success status, rather than an error. The adapter refuses to send a request that fails this list:

- `filter.type` is one of the six urns above (`place` included).
- Every interest id and excluded entity id is an id we received from search or from a previous insights call. We do not invent ids.
- Every tag id starts with `urn:tag:`.
- `filter.hours` is one of `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`.
- `operator.exclude.tags` is `union` or `intersection`. We send `union`.
- `feature.explainability` is `true`.
- `take` is an integer from 1 to 20 until a documented maximum says otherwise.
- No extra query keys. A typo is worse than a missing filter, because it can erase the response.
- `query` on search is 1 to 120 characters, the cultural title only.
- `filter.location.query` is 1 to 80 characters. No medical words are required, and none are added by us.

The validator is one function used by the HTTP adapter. The fake adapter runs it too, so a bad call fails in CI the same way.

Timeouts: 8 seconds per call, 20 seconds for the fan-out of five insight calls. Retry only on 429 and on connection errors, twice, with backoff. Do not retry an empty 200.

## FakeQlooAdapter

Deterministic. No network. The same request returns the same document for the life of the fixture file.

Fixtures are JSON files shaped like the documented Qloo responses, populated with Long Chair's fictional shelf (`North Window`, `Harbor Lights`, `Slow Kitchen Radio`, and the rest). They are not copies of Qloo entities, ids, images, or descriptions. Entity ids in fixtures are stable UUIDs we generate and prefix in a comment as fictional. Image URLs are omitted, or point nowhere. The UI keeps drawing `CoverArt` from a seed. It does not need a Qloo image to function.

Layout, once the API exists:

```text
services/api/app/adapters/fake/fixtures/
  search-movie-north-window.json
  insights-movie.json
  insights-tv-show.json
  insights-podcast.json
  insights-book.json
  insights-artist.json
  insights-place.json
  tags-themes.json
```

A request the fixture set does not know returns an empty `results.entities` array and `success: true`, after validation. That lets the contract tests cover the real-miss path. A request that fails validation raises the same error the HTTP adapter raises.

### Documented response shape

Confirmed from the Insights onboarding sample on docs.qloo.com (the sample is a movie):

```json
{
  "success": true,
  "results": {
    "entities": [
      {
        "name": "North Window",
        "entity_id": "00000000-0000-4000-8000-000000000001",
        "type": "urn:entity",
        "subtype": "urn:entity:movie",
        "properties": {
          "description": "A slow road film about a repair.",
          "duration": 108,
          "image": { "url": "" },
          "popularity": 0.5,
          "tags": [
            {
              "id": "urn:tag:keyword:media:fictional_repair",
              "name": "Repair",
              "type": "urn:tag:keyword:media"
            }
          ]
        }
      }
    ]
  }
}
```

The sample also includes, on movies, `release_year`, `release_date`, `content_rating`, `akas`, `filming_location`, `production_companies`, `release_country`, `short_descriptions`, and `websites`. Fixtures may include them. The mapper requires only `name`, `entity_id`, `subtype`, and `properties.tags`. `properties.description` and `properties.duration` are required for movies.

`properties.tags[].id`, `name`, and `type` are confirmed.

### Explainability block

Confirmed in the Insights parameter prose, not by a JSON sample. The fixture includes a block, and the keys below that the prose did not name are marked unconfirmed in the fixture file with `"x-long-chair-confidence": "unconfirmed"` on those keys. JSON does not have comments, so the confidence lives in a sibling `fixtures/CONFIDENCE.md` that lists every key.

Prose we are following:

- Per result, a `query.explainability` section lists input entities and scores from 0 to 1.
- Scores at or above 0.1 are always present.
- Top-level `query.explainability` summarizes average influence.
- `query.explainability.warning` appears when explainability could not be computed.

The fixture uses this shape, and the mapper accepts it. If the first recording uses different keys, the mapper changes and the fixture changes in the same commit. The port's return type does not change.

```json
{
  "query": {
    "explainability": {
      "warning": null,
      "entities": [{ "entity_id": "00000000-0000-4000-8000-000000000010", "score": 0.8 }]
    }
  }
}
```

Whether this object sits on each entity, beside `results`, or both, is the unconfirmed part. The prose says both "each result includes a `query.explainability` section" and "the top-level `query.explainability` object". Fixtures include both. The mapper reads whichever is present.

### Search and tags

The search response schema was not in the onboarding sample. The fake search fixture uses the same entity envelope as insights (`success`, `results.entities[]` with `name`, `entity_id`, `subtype`). That is an assumption, recorded as unconfirmed. The first live `/search` call either confirms it or we split `SearchDocument` from `InsightsDocument`.

The tags fixture uses `{ "success": true, "results": { "tags": [ { "id": "urn:tag:...", "name": "...", "type": "urn:tag:..." } ] } }`. The `tags` path is unconfirmed. Tag objects in the movie sample use `id`, `name`, and `type`, and the fixture copies that part.

## RecordingAdapter

Wraps `HttpQlooAdapter`.

- Cache directory: `services/api/.qloo-cache/`, gitignored, mode `0600` files.
- Key: SHA-256 of the method name plus the canonical query string (parameters sorted, values trimmed). The cultural title is inside the hash input and is not used as a filename.
- `live`: call HTTP, and on a 200 write the body. Never write a body that failed validation on the way out. Never write 4xx or 5xx bodies.
- `replay`: read the cache. Do not call the network. A miss raises `CacheMiss`, which the API turns into 503.
- The warmed demo is a folder of those files produced by running the mixed demo profile, plus the search queries on its seed titles, once, while the key works.
- A second copy of that folder goes to the team's private password store. It does not go to GitHub, a public gist, a CI artifact, or a Docker image layer.

Deleting the cache is always safe for privacy and fatal for the post-key demo. The roadmap treats "warmed demo copied off the machine" as a gate before submission.

## Mapper

One module, `map_entity`, used by every adapter.

| Domain field                  | Source                                                                                                   | Confidence                                                                                                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CatalogItem.id`              | `entity_id`                                                                                              | Confirmed                                                                                                                                                                                           |
| `CatalogItem.title`           | `name`                                                                                                   | Confirmed                                                                                                                                                                                           |
| `CatalogItem.kind`            | `subtype` with the `urn:entity:` prefix removed                                                          | Confirmed for movies (`urn:entity:movie`). The same pattern is assumed for the other four kinds                                                                                                     |
| `CatalogItem.maker`           | `properties.production_companies[0]` for movies                                                          | Confirmed that the array exists on the movie sample. Which element is "the" maker is our choice. Other kinds: unconfirmed, use an empty string until a recording shows a creator field              |
| `CatalogItem.minutes`         | `properties.duration` for movies                                                                         | Confirmed, integer minutes. Other kinds: unconfirmed. Assumed defaults, logged as assumed: tv 44, podcast 36, book 30, artist 28. These numbers exist so the packer can run. They are not Qloo data |
| `CatalogItem.rank`            | Position in `results.entities`, starting at 1                                                            | Our rule. No affinity field was in the sample                                                                                                                                                       |
| `CatalogItem.synopsis`        | `properties.description`                                                                                 | Confirmed on the movie sample                                                                                                                                                                       |
| `CatalogItem.why`             | Template from explainability, or "Because you love {seed}"                                               | Template is ours. Explainability keys are unconfirmed                                                                                                                                               |
| `CatalogItem.becauseOf`       | Seed ids whose entity ids appear in explainability                                                       | Depends on the unconfirmed keys. Fallback: the interest ids we sent                                                                                                                                 |
| `CatalogItem.avoidedThemeIds` | The theme ids whose tag ids appear on the entity                                                         | Tag ids on the entity are confirmed. Our theme ids are ours                                                                                                                                         |
| `NearbyPlace.name`            | `name`                                                                                                   | Assumed, same envelope                                                                                                                                                                              |
| `NearbyPlace.walkMinutes`     | Not a Qloo field. Our estimate from distance if a coordinate exists, else a fixture value                | Coordinates on the place payload are unconfirmed                                                                                                                                                    |
| `NearbyPlace.openUntil`       | Unconfirmed property. Until then the UI keeps "Open now" when `filter.hours` matched the request weekday | The filter is confirmed. The response clock is not                                                                                                                                                  |
| `NearbyPlace.priceLabel`      | Ours ("Light meal, low price") when `filter.price_level.max` was sent and the call succeeded             | `filter.price_level.max` is a documented request parameter. The response field is unconfirmed                                                                                                       |
| `TasteSeed.detail`            | `properties.short_descriptions[0].value` when present, else a short slice of `description`               | `short_descriptions` is confirmed on the movie sample                                                                                                                                               |

The mapper drops entities whose `subtype` is not one of the kinds we asked for. It drops entities with no `entity_id` or no `name`.

## Contract tests

One suite, two entry points. Both construct a `QlooPort` and run the same cases. CI runs the fake entry always. The live entry runs only when `QLOO_API_KEY` is set in the developer's environment. It never runs in public CI, because a public log or a failed assertion diff could capture a Qloo body.

Shared cases:

1. A known movie title returns one hit whose `subtype` is `urn:entity:movie`, with a non-empty `entity_id` and `name`.
2. Insights for that id returns entities of the requested subtype only.
3. Every returned tag id starts with `urn:tag:`.
4. Asking to exclude a tag that the fixture (or the live catalog, when recording) attaches to a row keeps that row out of the mapped list. Against live, this case uses a tag id taken from the first response in memory. It does not hard-code a production id into the repo.
5. A second insights call that also passes `filter.exclude.entities` does not return those ids.
6. `feature.explainability=true` is sent. If the document contains explainability, scores are numbers from 0 to 1. If it contains `warning`, the results array is still present.
7. An invalid `filter.hours` raises before any I/O.
8. Places with a weekday and a locality return only `urn:entity:place` rows, or an empty list.
9. The mapper produces a `CatalogItem` whose `minutes` is a positive integer. For non-movies the test allows the assumed default and checks that the log or the item metadata says the duration was assumed.
10. Fake and live adapters reject the same invalid request with the same exception type.

Schema cases, fake fixtures only in CI:

- Every committed fixture validates against `InsightsDocument`, `SearchDocument`, or `TagsDocument`.
- A fixture that uses an unconfirmed key lists that key in `fixtures/CONFIDENCE.md`.
- A test fails if a fixture contains a URL on `qloo.com`, a non-fiction entity id we did not generate, or a title from the documented public sample (`Django Unchained`, `Guardians of the Galaxy`). Those samples belong in this prose, not in fixture data.

The live entry point validates the response against the same pydantic models and does not write the body into the test tree. Recording, if the developer turned it on, goes to the gitignored cache only.

Swapping adapters is safe when this suite is green for fake, and the live entry has been run once after the key arrives and again after any mapper change.

## Field confidence

Confirmed means we read it on docs.qloo.com (Insights reference or the onboarding sample) or in Qloo's public hackathon curl.

| Item                                                                                                                                                                                                                                       | Status                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Host `https://hackathon.api.qloo.com`, header `X-Api-Key`                                                                                                                                                                                  | Confirmed (public staff curl)                                                                            |
| `GET /search?query&type`                                                                                                                                                                                                                   | Confirmed (public staff curl). Response schema unconfirmed                                               |
| `GET /v2/insights`                                                                                                                                                                                                                         | Confirmed                                                                                                |
| `filter.type`, `signal.interests.entities` as comma-separated ids, `filter.exclude.tags`, `operator.exclude.tags`, `feature.explainability`, `filter.hours`, `filter.location.query`, `filter.location`, `filter.exclude.entities`, `take` | Confirmed as request parameters                                                                          |
| Silent empty results on invalid parameters                                                                                                                                                                                                 | Team constraint. Design for it. Not a sentence we found in the public reference                          |
| Entity envelope `success`, `results.entities[]`, `name`, `entity_id`, `type`, `subtype`, `properties`                                                                                                                                      | Confirmed for the movie insights sample                                                                  |
| `properties.duration` (movie, minutes), `description`, `tags[].id/name/type`, `popularity`, `image.url`, `production_companies`, `short_descriptions`                                                                                      | Confirmed on that movie sample                                                                           |
| Explainability exists at per-result and top-level `query.explainability`, scores 0 to 1, optional `warning`                                                                                                                                | Confirmed in prose. JSON keys inside the object unconfirmed                                              |
| `results.duration` as a timing field                                                                                                                                                                                                       | Unconfirmed. Mentioned by a third-party SDK note, absent from the onboarding sample. Do not depend on it |
| Duration, creator, and episode length for tv, podcast, book, artist                                                                                                                                                                        | Unconfirmed                                                                                              |
| Place response fields for hours, coordinates, and price                                                                                                                                                                                    | Unconfirmed. The request filters are confirmed                                                           |
| `GET /v2/tags` path and its query parameters                                                                                                                                                                                               | Path matches the public SDK's hackathon base. Parameter names unconfirmed                                |
| A numeric affinity distinct from list order and from `properties.popularity`                                                                                                                                                               | Unconfirmed. Do not invent the field                                                                     |
