# Agent endpoint contract

`POST /v1/kit/agent` accepts the existing CreateSessionIn body:

```json
{
  "draft": {
    "seedIds": ["paper-kite"],
    "avoidIds": ["illness"],
    "durationMinutes": 120,
    "companionId": "pebble"
  },
  "locality": "Westbridge",
  "weekday": "sunday"
}
```

Extra request/draft fields are refused. Existing invalid-draft/locality/weekday rules apply.

Response: existing `packed`, `items`, `topics`, `places`, and `source`, plus `trace` and `termination`. Example trace shape (counts and timings are illustrative):

```json
{
  "step": 1,
  "tool": "qloo_search",
  "argsSummary": "seed_ids: 1 value(s)",
  "resultCount": 1,
  "latencyMs": 0.5,
  "status": "ok"
}
```

The trace excludes raw arguments, provider text, result bodies, API keys, and raw catalog responses. No key returns the deterministic kit and empty trace, with `termination=no_key`. Boundaries reuse existing 422 and 503 error envelopes. Finalization deadline failure returns 503 with a fixed English message.

Tools: qloo_search requires selected `seed_ids`; qloo_insights requires supported `kinds`. verify_themes, durations, places, and enrich require empty objects. The model cannot specify exclusions, locality, weekdays, durations, or item records.
