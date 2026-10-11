"""Second look at catalog rows. One caller, deterministic rules, no I/O."""

import re
from collections.abc import Sequence

from app.domain.entities import AvoidTheme, CatalogItem


def rejects(item: CatalogItem, held: Sequence[AvoidTheme]) -> bool:
    """True when a held-out theme is still on the piece.

    A matching theme id counts. So does the theme label as a whole phrase in the synopsis.
    """

    held_ids = {theme.id for theme in held}
    if any(theme_id in held_ids for theme_id in item.avoided_theme_ids):
        return True
    synopsis = item.synopsis.casefold()
    for theme in held:
        phrase = re.escape(theme.label.casefold())
        if re.search(rf"\b{phrase}\b", synopsis):
            return True
    return False
