"""Pydantic documents shaped like the documented catalog responses.

Tags, popularity, query, disambiguation, and external live on the entity.
Search `results` is a list. Insights `results` is an object with `entities`.
Unconfirmed keys stay in fixtures/CONFIDENCE.md.
"""

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ShortDescription(BaseModel):
    """A multilingual short line. `languages` is part of the wire object."""

    model_config = ConfigDict(extra="allow")

    value: str = ""
    languages: list[str] = Field(default_factory=list)


class TagRecord(BaseModel):
    """A tag from an entity (`id`) or from /v2/tags (`tag_id`)."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    id: str = ""
    name: str = ""
    type: str = ""
    theme_id: str | None = Field(default=None, alias="x-long-chair-theme-id")

    @model_validator(mode="before")
    @classmethod
    def fold_identifiers(cls, data: object) -> object:
        """Copy `tag_id` into `id`, and the first `types` entry into `type`."""

        if not isinstance(data, dict):
            return data
        folded = dict(data)
        raw_id = folded.get("id") or folded.get("tag_id") or ""
        folded["id"] = str(raw_id)
        if not folded.get("type"):
            types = folded.get("types")
            if isinstance(types, list) and types and isinstance(types[0], str):
                folded["type"] = types[0]
        return folded


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


class ImageRef(BaseModel):
    """`properties.image.url` on the wire."""

    model_config = ConfigDict(extra="allow")

    url: str = ""


class ExternalRef(BaseModel):
    """One external id. Extra rating fields are ignored by the mapper."""

    model_config = ConfigDict(extra="allow")

    id: str = ""


class EntityProperties(BaseModel):
    """Nested properties. Tags and popularity are not read from here."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    description: str = ""
    short_description: str = ""
    duration: int | None = None
    content_rating: str = ""
    release_year: int | None = None
    release_date: str = ""
    publication_year: int | None = None
    page_count: int | None = None
    episode_count: str = ""
    image: ImageRef | None = None
    production_companies: list[str] = Field(default_factory=list)
    short_descriptions: list[ShortDescription] = Field(default_factory=list)
    channel: str = ""
    publisher: str = ""
    address: str = ""
    city: str = ""
    neighborhood: str = ""
    lat: float | None = None
    lon: float | None = None
    price_level: int | None = None
    business_rating: float | None = None
    website: str = ""
    place_kind: str | None = Field(default=None, alias="x-long-chair-kind")
    aliases: list[str] = Field(default_factory=list, alias="x-long-chair-aliases")
    taste_kind: str = Field(default="", alias="x-long-chair-taste-kind")


class EntityRecord(BaseModel):
    """One entity. Root tags are what the theme filter reads."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    name: str
    entity_id: str
    subtype: str = ""
    type: str = ""
    properties: EntityProperties = Field(default_factory=EntityProperties)
    popularity: float | None = None
    tags: list[TagRecord] = Field(default_factory=list)
    query: QueryBlock | None = None
    disambiguation: str = ""
    external: dict[str, list[ExternalRef]] = Field(default_factory=dict)
    slug: str | None = Field(default=None, alias="x-long-chair-slug")


class ResultSet(BaseModel):
    """Insights envelope. `duration` inside results is accepted and not required."""

    model_config = ConfigDict(extra="allow")

    entities: list[EntityRecord] = Field(default_factory=list)
    tags: list[TagRecord] = Field(default_factory=list)


class InsightsDocument(BaseModel):
    """Insights and tags envelope. `results` is an object."""

    model_config = ConfigDict(extra="allow")

    success: bool
    results: ResultSet = Field(default_factory=ResultSet)
    duration: int | None = None
    query: QueryBlock | None = None


class SearchDocument(BaseModel):
    """Search envelope. `results` is a plain list of entities."""

    model_config = ConfigDict(extra="allow")

    success: bool
    results: list[EntityRecord] = Field(default_factory=list)
    duration: int | None = None
