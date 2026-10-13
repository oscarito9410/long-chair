# ADR 0013: Normalize Qloo live shapes and bounded theme families

**Status:** Accepted

**Date:** 2026-10-13

## Context

Issue #11 records wire-shape observations that differ from the original fictional
fixtures. Search omits success, uses types, and nests provider ids under properties.
Insights carries external id lists and query scores. Nullable text and empty artist
duration objects must not reject an otherwise useful entity. Exact fixture-only tags
miss real exclusions and related tags such as hospital_visit.

## Decision

Extend ADR 0010 at the existing adapter boundary. Search and insights normalize into
EntityRecord. Root external providers override duplicate nested providers. Null text
becomes an empty application string. Non-numeric duration becomes unavailable, and
numeric episode_count remains an integer. Query affinity and JSON measurements stay
adapter-local. Explainability reads signal.interests.entities; missing scores retain
the seed fallback, while explicit empty, malformed or below-threshold scores do not attribute
an item to every seed. Object and list explanations are normalized independently;
invalid optional rows cannot discard the enclosing insights entity.

Coordinates prefer a complete root location, then properties.geocode, then the old
fixture lat/lon pair. NearbyPlace retains address, daily hours and rating. DailyHours parses opens/closes intervals and explicit closed=true entries in daily
lists, retaining legacy display-string compatibility; no closing time is inferred without a local
date/time context. The public place response remains unchanged.

Use issue-listed identifiers plus namespace-bound underscore families in the existing
backend mapping and core theme verifier. Generic death_of families and death/death_and_remembrance tags map to grief.
Explicit parent, parents, mother and father relations map to parent-death. Exact
identifiers win, then the longest bounded family prefix. Keep legacy fixture tags. A shared
synthetic conformance corpus tests both language implementations; runtime code stays
native to each independently packaged service. The existing checker remains the
final admission decision. Known built-ins send stable exact exclusion ids without a
runtime tag lookup; custom lookup uses semantic search with the media keyword type.
Qloo exclusions are only a first pass and cannot replace the checker.

Provider 400, 401, 403 and exhausted 429 become distinct QlooTransportError subclasses.
Their provider_message retains the selected diagnostic message internally, with the
configured credential redacted. Public message and exception text stay generic; raw
bodies do not escape through the API error handler. Retry count remains bounded.

The scope script resolves a search signal first, adds it to every insights call,
spaces requests by at least 0.25 seconds, and backs off on 429. Exhausted retries or
other HTTP failures stop the run instead of producing a successful-looking report.
No unsupported video_game insights call is added. Scope location uses WKT POINT(longitude latitude); named locality requests keep
filter.location.query. The CLI defaults to the gitignored .qloo-live directory and
restores the QLOO_LIVE_DIR override for a private report location. Reports contain shapes and counts, not tag ids,
streaming names, descriptions, credentials, or response bodies.

Pytest requires --run-live for marked external tests in addition to existing key/env
gates. Ordinary tests block real HTTP transports; mock and ASGI transports still work.
The scheduled/manual live contract workflow explicitly opts in.

## Consequences

No new dependencies, UI changes, or paid calls are needed to exercise these contracts.
Issue identifiers are vocabulary, not a copied response. All added entity records are
invented. Real-host validation is still required separately: this change does not claim
the live scope acceptance item passed. New provider field shapes may require further
normalization; unknown measurements remain JSON inside the adapter.
