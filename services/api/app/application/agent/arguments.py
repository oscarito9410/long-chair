"""One definition of tool argument fields and strict dispatch validation."""

import json
from collections.abc import Sequence
from dataclasses import dataclass

from app.domain.kinds import CONTENT_KINDS
from app.ports.llm import MAX_TOOL_ARGUMENT_CHARS, ToolCall, ToolDefinition

MAX_ARGUMENT_VALUES = 32


@dataclass(frozen=True, slots=True)
class ToolSpec:
    """A supported action, with zero or one required enum-array argument."""

    name: str
    description: str
    field: str = ""
    choices: tuple[str, ...] = ()


TOOL_SPECS = (
    ToolSpec("qloo_search", "Resolve selected cultural taste IDs before insights.", "seed_ids"),
    ToolSpec(
        "qloo_insights",
        "Retrieve catalog neighbors; server owns theme exclusions.",
        "kinds",
        CONTENT_KINDS,
    ),
    ToolSpec("verify_themes", "Remove observed candidates that fail the server's theme checker."),
    ToolSpec("durations", "Preview the verified schedule using catalog lengths and chair rules."),
    ToolSpec("places", "Find nearby places using server-owned locality and weekday."),
    ToolSpec("enrich", "Look up lengths and links through the configured enrichment port."),
)
SPEC_BY_NAME = {spec.name: spec for spec in TOOL_SPECS}


def _definition(spec: ToolSpec) -> ToolDefinition:
    properties: dict[str, object] = {}
    if spec.field:
        items: dict[str, object] = {"type": "string"}
        if spec.choices:
            items["enum"] = list(spec.choices)
        properties[spec.field] = {
            "type": "array",
            "items": items,
            "minItems": 1,
            "maxItems": MAX_ARGUMENT_VALUES,
        }
    return ToolDefinition(
        spec.name,
        spec.description,
        {
            "type": "object",
            "properties": properties,
            "required": [spec.field] if spec.field else [],
            "additionalProperties": False,
        },
    )


TOOL_DEFINITIONS = tuple(_definition(spec) for spec in TOOL_SPECS)


class ToolArgumentError(Exception):
    """Invalid untrusted call; fixed codes only, never echo argument values."""

    def __init__(self, code: str = "invalid_args") -> None:
        self.code = code
        super().__init__(code)


@dataclass(frozen=True, slots=True)
class ToolArguments:
    """Validated action and values. Summary deliberately omits all values."""

    name: str
    values: tuple[str, ...] = ()
    summary: str = "no arguments"


def parse_arguments(call: ToolCall, selected_seed_ids: Sequence[str]) -> ToolArguments:
    """Refuse unknown actions, malformed/extra fields, duplicates, and unknown selections."""

    spec = SPEC_BY_NAME.get(call.name)
    if spec is None:
        raise ToolArgumentError("unknown_tool")
    if len(call.arguments) > MAX_TOOL_ARGUMENT_CHARS:
        raise ToolArgumentError()
    try:
        raw: object = json.loads(call.arguments)
    except (ValueError, RecursionError) as exc:
        raise ToolArgumentError() from exc
    if not isinstance(raw, dict) or set(raw) != ({spec.field} if spec.field else set()):
        raise ToolArgumentError()
    if not spec.field:
        return ToolArguments(spec.name)
    values = raw[spec.field]
    if not isinstance(values, list) or not 1 <= len(values) <= MAX_ARGUMENT_VALUES:
        raise ToolArgumentError()
    allowed = set(spec.choices or selected_seed_ids)
    if any(not isinstance(value, str) or value not in allowed for value in values):
        raise ToolArgumentError()
    if len(set(values)) != len(values):
        raise ToolArgumentError()
    return ToolArguments(spec.name, tuple(values), f"{spec.field}: {len(values)} value(s)")
