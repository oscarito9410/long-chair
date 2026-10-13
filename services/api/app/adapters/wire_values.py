"""Normalize nullable text and endpoint-specific entity shapes at the boundary."""

from pydantic import BaseModel, model_validator


class NullableTextModel(BaseModel):
    """Provider null text means unavailable; application strings remain non-null."""

    @model_validator(mode="before")
    @classmethod
    def empty_null_text(cls, data: object) -> object:
        if not isinstance(data, dict):
            return data
        return {
            key: ""
            if value is None and key in cls.model_fields and cls.model_fields[key].annotation is str
            else value
            for key, value in data.items()
        }


def normalize_entity(data: object) -> object:
    """Unify search types and nested external ids with insights fields."""

    if not isinstance(data, dict):
        return data
    folded = dict(data)
    types = folded.get("types")
    if not folded.get("subtype") and isinstance(types, list):
        folded["subtype"] = next(
            (kind for kind in types if isinstance(kind, str) and kind.startswith("urn:entity:")),
            "",
        )
    properties = folded.get("properties")
    nested = properties.get("external") if isinstance(properties, dict) else None
    external = dict(nested) if isinstance(nested, dict) else {}
    root = folded.get("external")
    if isinstance(root, dict):
        external.update(root)
    folded["external"] = {
        provider: [refs] if isinstance(refs, dict) else refs
        for provider, refs in external.items()
        if refs is not None
    }
    return folded
