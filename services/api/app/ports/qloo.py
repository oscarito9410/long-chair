"""Catalog port. The pipeline depends on this, not on a host or a fixture file."""

from collections.abc import Sequence
from typing import Protocol

from app.domain.entities import AvoidTheme, CatalogItem, NearbyPlace
from app.domain.kinds import ContentKind
from app.ports.models import InterestLink, TagHit, TasteHit


class QlooPort(Protocol):
    """Search, exclusion tags, insights, and places. Implementations do not pack a session."""

    async def search(self, query: str, kind: ContentKind) -> Sequence[TasteHit]:
        """Resolve a cultural title. An unknown title is an empty sequence, not an error."""

    async def exclusion_tags(self, themes: Sequence[AvoidTheme]) -> Sequence[TagHit]:
        """Map held-out themes to content-tag ids. Labels are not sent as user attributes."""

    async def insights(
        self,
        kind: ContentKind,
        interests: Sequence[InterestLink],
        exclude_tag_ids: Sequence[str],
        exclude_entity_ids: Sequence[str] = (),
    ) -> Sequence[CatalogItem]:
        """Neighbors of `kind`. Exclusion is applied before the sequence is returned."""

    async def places(
        self,
        locality: str,
        weekday: str,
        interests: Sequence[InterestLink],
        tag_ids: Sequence[str],
    ) -> Sequence[NearbyPlace]:
        """Places open on `weekday` near `locality`. Invalid weekday raises before I/O."""
