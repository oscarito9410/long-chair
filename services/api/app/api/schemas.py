"""HTTP bodies for the session kit. Camel case on the wire."""

from pydantic import BaseModel, ConfigDict, Field


class ErrorDetail(BaseModel):
    """A code and a sentence a screen can show. Never a stack or a catalog body."""

    code: str
    message: str


class ErrorOut(BaseModel):
    """The only error envelope."""

    error: ErrorDetail


class DraftIn(BaseModel):
    """A chair draft. Extra keys, including a name or a diagnosis, are refused."""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    seed_ids: list[str] = Field(alias="seedIds")
    avoid_ids: list[str] = Field(alias="avoidIds")
    duration_minutes: int = Field(alias="durationMinutes")
    companion_id: str = Field(alias="companionId")


class CreateSessionIn(BaseModel):
    """Start a session. Locality and weekday are optional and are not medical fields."""

    model_config = ConfigDict(extra="forbid")

    draft: DraftIn
    locality: str | None = None
    weekday: str | None = None


class DemoIn(BaseModel):
    """Empty object. Any added field is refused."""

    model_config = ConfigDict(extra="forbid")


class HealthOut(BaseModel):
    """Liveness and the catalog mode."""

    model_config = ConfigDict(populate_by_name=True)

    ok: bool
    qloo_mode: str = Field(alias="qlooMode")


class SlotOut(BaseModel):
    """One scheduled range, in minutes from the start of the chair."""

    model_config = ConfigDict(populate_by_name=True)

    item_id: str = Field(alias="itemId")
    start_minute: int = Field(alias="startMinute")
    end_minute: int = Field(alias="endMinute")


class PackedOut(BaseModel):
    """The schedule and the minutes still open."""

    model_config = ConfigDict(populate_by_name=True)

    slots: list[SlotOut]
    filled_minutes: int = Field(alias="filledMinutes")
    duration_minutes: int = Field(alias="durationMinutes")
    open_minutes: int = Field(alias="openMinutes")


class ItemOut(BaseModel):
    """A scheduled piece. `durationSource` is confirmed only for movie lengths from the catalog."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    qloo_entity_id: str = Field(alias="qlooEntityId")
    kind: str
    title: str
    maker: str
    minutes: int
    rank: int
    synopsis: str
    why: str
    because_of: list[str] = Field(alias="becauseOf")
    avoided_theme_ids: list[str] = Field(alias="avoidedThemeIds")
    duration_source: str = Field(alias="durationSource")


class TopicOut(BaseModel):
    """A companion prompt."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    seed_id: str = Field(alias="seedId")
    title: str
    prompt: str


class PlaceOut(BaseModel):
    """A nearby stop."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    kind: str
    name: str
    offer: str
    walk_minutes: int = Field(alias="walkMinutes")
    open_until: str = Field(alias="openUntil")
    price_label: str = Field(alias="priceLabel")


class SessionKitOut(BaseModel):
    """A plan. `source` says fake, live, or replay."""

    packed: PackedOut
    items: list[ItemOut]
    topics: list[TopicOut]
    places: list[PlaceOut]
    source: str


class TasteHitOut(BaseModel):
    """One taste the love step can pick. `kind` is our shelf type, not a catalog urn."""

    id: str
    name: str
    kind: str
    detail: str


class TasteSearchOut(BaseModel):
    """Search results. `source` stays fake until a live catalog key is connected."""

    results: list[TasteHitOut]
    source: str


class SessionCreatedOut(BaseModel):
    """The id of a stored draft. It is not an account."""

    model_config = ConfigDict(populate_by_name=True)

    session_id: str = Field(alias="sessionId")
