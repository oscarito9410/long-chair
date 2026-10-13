"""Optional query evidence is tolerant; it cannot invalidate a catalog entity."""

import math

from pydantic import BaseModel, ConfigDict, Field, JsonValue, field_validator


class ExplainEntity(BaseModel):
    """One finite, normalized signal score."""

    entity_id: str
    score: float


class Explainability(BaseModel):
    """Explicit empty or unusable scores never imply attribution to every seed."""

    warning: str | None = None
    entities: list[ExplainEntity] = Field(default_factory=list)


def _score_rows(value: object) -> list[object]:
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        rows = value.get("signal.interests.entities", value.get("entities"))
        return rows if isinstance(rows, list) else []
    return []


def _scores(value: object) -> list[ExplainEntity]:
    found: list[ExplainEntity] = []
    for row in _score_rows(value):
        if not isinstance(row, dict):
            continue
        if "signal.interests.entities" in row or "entities" in row:
            found.extend(_scores(row))
            continue
        entity_id, score = row.get("entity_id"), row.get("score")
        if not isinstance(entity_id, str) or not entity_id.strip():
            continue
        if isinstance(score, bool) or not isinstance(score, (int, float)):
            continue
        if 0 <= score <= 1 and math.isfinite(score):
            found.append(ExplainEntity(entity_id=entity_id, score=float(score)))
    return found


class QueryBlock(BaseModel):
    """Per-entity scores and provider measurements, kept inside the adapter."""

    model_config = ConfigDict(extra="allow")

    explainability: Explainability | None = None
    affinity: float | None = None
    measurements: JsonValue = None

    @field_validator("explainability", mode="before")
    @classmethod
    def optional_evidence(cls, value: object) -> Explainability | None:
        """Normalize object/list variants and retain usable rows in mixed lists."""
        if value is None or isinstance(value, Explainability):
            return value
        warning = value.get("warning") if isinstance(value, dict) else None
        return Explainability(
            entities=_scores(value), warning=warning if isinstance(warning, str) else None
        )
