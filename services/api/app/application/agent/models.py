"""Request-owned agent state and bounded public run records."""

import math
from dataclasses import dataclass, field
from typing import Literal

from app.domain.entities import (
    AvoidTheme,
    CatalogItem,
    NearbyPlace,
    SessionDraft,
    SessionKit,
    TasteSeed,
)
from app.domain.kinds import Weekday
from app.ports.models import InterestLink

Termination = Literal["completed", "step_limit", "time_limit", "provider_error", "no_key"]
MAX_STEPS = 32
MAX_TIMEOUT_SECONDS = 120.0
MAX_FINALIZE_SECONDS = 60.0


@dataclass(frozen=True, slots=True)
class AgentLimits:
    """Tool calls/turns and seconds. Finalization has an independent deadline."""

    max_steps: int = 8
    max_turns: int = 8
    timeout_seconds: float = 20.0
    finalize_seconds: float = 10.0

    def __post_init__(self) -> None:
        if not 1 <= self.max_steps <= MAX_STEPS or not 1 <= self.max_turns <= MAX_STEPS:
            raise ValueError("Agent step and turn limits must be between 1 and 32.")
        for value, cap in (
            (self.timeout_seconds, MAX_TIMEOUT_SECONDS),
            (self.finalize_seconds, MAX_FINALIZE_SECONDS),
        ):
            if not math.isfinite(value) or not 0 < value <= cap:
                raise ValueError("Agent deadlines must be finite, positive, and within bounds.")


@dataclass(frozen=True, slots=True)
class ToolTrace:
    """One action: summaries have field names/counts only, never raw values or bodies."""

    step: int
    tool: str
    args_summary: str
    result_count: int
    latency_ms: float
    status: Literal["ok", "error", "timeout"]


@dataclass(frozen=True, slots=True)
class AgentResult:
    """Verified kit and trace; model turns are retained for the local metrics hook."""

    kit: SessionKit
    trace: tuple[ToolTrace, ...]
    termination: Termination
    model_turns: int = 0


@dataclass(slots=True)
class AgentState:
    """Mapped observed records only. Model arguments cannot replace the draft or rules."""

    draft: SessionDraft
    tastes: tuple[TasteSeed, ...]
    held: tuple[AvoidTheme, ...]
    locality: str
    weekday: Weekday | None
    links: dict[str, InterestLink] = field(default_factory=dict)
    candidates: dict[str, CatalogItem] = field(default_factory=dict)
    enriched_ids: set[str] = field(default_factory=set)
    rejected_entity_ids: set[str] = field(default_factory=set)
    places: tuple[NearbyPlace, ...] = ()
