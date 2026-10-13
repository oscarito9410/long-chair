# Data model: Qloo live shape

- SearchDocument and InsightsDocument: optional success marker.
- EntityProperties: nullable wire text normalizes to empty strings; duration accepts
  positive finite numbers, otherwise None; episode_count is optional integer.
- EntityRecord: search types select subtype; provider references normalize to lists,
  with root provider entries taking precedence; optional location coordinates.
- DailyHours: opens/closes intervals or explicit closed days, with legacy string
  compatibility. Daily schedules never imply an open-until value.
- QueryBlock: optional affinity, JSON measurements, and explainability with a
  signal.interests.entities object or direct/wrapped list shape. Invalid optional
  rows are ignored without invalidating the entity or inventing attribution.
- NearbyPlace: optional address, immutable daily hour entries and rating; coordinates
  determine walk minutes. No public response schema change.
- QlooProviderError: safe public message, internal provider_message, typed status.
- ThemeRule: exact tag identifiers and namespace-bound family prefixes. Existing
  clear/flagged/unverified policy and post-fetch checker remain unchanged.
