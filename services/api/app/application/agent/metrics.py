"""Outcome measures shared by the agent hook and comparison baselines."""

from collections.abc import Sequence
from dataclasses import dataclass

from app.application.checker import rejects
from app.domain.entities import AvoidTheme, SessionKit


@dataclass(frozen=True, slots=True)
class KitMetrics:
    """Pass rate/fit are fractions; diversity is a kind count; latency is milliseconds."""

    verifier_pass_rate: float
    duration_fit: float
    type_diversity: int
    steps: int
    latency_ms: float


def measure_kit(
    kit: SessionKit, held: Sequence[AvoidTheme], *, steps: int, latency_ms: float
) -> KitMetrics:
    """Empty kits have pass rate 1 (no violations), but zero fit and diversity."""

    checked = sum(not rejects(item, held) for item in kit.items)
    pass_rate = checked / len(kit.items) if kit.items else 1.0
    duration_fit = kit.packed.filled_minutes / kit.packed.duration_minutes
    return KitMetrics(
        pass_rate, duration_fit, len({item.kind for item in kit.items}), steps, latency_ms
    )
