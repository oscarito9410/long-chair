"""Wire coordinates and daily place schedules, without inferred local closing times."""

from pydantic import AliasChoices, BaseModel, Field, model_validator


class Coordinates(BaseModel):
    """Coordinates provided by location or properties.geocode."""

    latitude: float | None = Field(default=None, validation_alias=AliasChoices("latitude", "lat"))
    longitude: float | None = Field(
        default=None, validation_alias=AliasChoices("longitude", "lon", "lng")
    )


class DailyHours(BaseModel):
    """One daily interval or closure. Display is legacy synthetic-fixture compatibility."""

    opens: str | None = None
    closes: str | None = None
    closed: bool = False
    display: str = ""

    @model_validator(mode="before")
    @classmethod
    def legacy_display(cls, value: object) -> object:
        return {"display": value} if isinstance(value, str) else value

    def label(self) -> str:
        """Retain a daily schedule without treating it as today's closing time."""
        if self.closed:
            return "Closed"
        if self.opens is not None and self.closes is not None:
            return f"{self.opens}-{self.closes}"
        return self.display
