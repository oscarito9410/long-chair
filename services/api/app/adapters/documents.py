"""Pydantic documents shaped like the documented catalog responses.

Unconfirmed keys are accepted and listed in fixtures/CONFIDENCE.md.
"""

from pydantic import BaseModel, ConfigDict, Field


class ShortDescription(BaseModel):
    """One short line. Confirmed on the movie sample as an object with `value`."""

    model_config = ConfigDict(extra="allow")

    value: str = ""


class TagRecord(BaseModel):
    """A content tag. `theme_id` is our annotation, not a catalog field."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    id: str
    name: str
    type: str
    theme_id: str | None = Field(default=None, alias="x-long-chair-theme-id")


class ExplainEntity(BaseModel):
    """One explainability score. The surrounding object shape is unconfirmed."""

    model_config = ConfigDict(extra="allow")

    entity_id: str
    score: float


class Explainability(BaseModel):
    """Scores from 0 to 1. `warning` is set when the catalog could not explain."""

    model_config = ConfigDict(extra="allow")

    warning: str | None = None
    entities: list[ExplainEntity] = Field(default_factory=list)


class QueryBlock(BaseModel):
    """Wrapper for the unconfirmed explainability object."""

    model_config = ConfigDict(extra="allow")

    explainability: Explainability | None = None


class EntityProperties(BaseModel):
    """Properties we read. Place extensions are our annotations."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    description: str = ""
    duration: int | None = None
    tags: list[TagRecord] = Field(default_factory=list)
    production_companies: list[str] = Field(default_factory=list)
    creator: str | None = None
    short_descriptions: list[ShortDescription] = Field(default_factory=list)
    place_kind: str | None = Field(default=None, alias="x-long-chair-kind")
    walk_minutes: int | None = Field(default=None, alias="x-long-chair-walk-minutes")
    open_until: str | None = Field(default=None, alias="x-long-chair-open-until")
    price_label: str | None = Field(default=None, alias="x-long-chair-price-label")
    aliases: list[str] = Field(default_factory=list, alias="x-long-chair-aliases")
    taste_kind: str = Field(default="", alias="x-long-chair-taste-kind")


class EntityRecord(BaseModel):
    """One entity. `slug` is our annotation so the kit can use the prototype ids."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    name: str
    entity_id: str
    subtype: str
    properties: EntityProperties = Field(default_factory=EntityProperties)
    query: QueryBlock | None = None
    slug: str | None = Field(default=None, alias="x-long-chair-slug")


class ResultSet(BaseModel):
    """Result envelope. `tags` is used by the tags document and is unconfirmed there."""

    model_config = ConfigDict(extra="allow")

    entities: list[EntityRecord] = Field(default_factory=list)
    tags: list[TagRecord] = Field(default_factory=list)


class InsightsDocument(BaseModel):
    """Shared envelope for insights, search, and tags fixtures."""

    model_config = ConfigDict(extra="allow")

    success: bool
    results: ResultSet = Field(default_factory=ResultSet)
    query: QueryBlock | None = None
