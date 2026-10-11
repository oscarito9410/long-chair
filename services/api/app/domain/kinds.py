"""Content kinds and weekdays shared by the session kit."""

from typing import Literal

ContentKind = Literal["movie", "tv_show", "podcast", "book", "artist"]
PlaceKind = Literal["bakery", "kitchen", "coffee"]
Weekday = Literal["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
DurationSource = Literal["confirmed", "assumed"]
CatalogMode = Literal["fake", "live", "replay"]

CONTENT_KINDS: tuple[ContentKind, ...] = ("movie", "tv_show", "podcast", "book", "artist")
WEEKDAYS: tuple[Weekday, ...] = (
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
)
PLACE_KINDS: tuple[PlaceKind, ...] = ("bakery", "kitchen", "coffee")
