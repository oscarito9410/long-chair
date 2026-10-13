"""Catalog tag vocabulary shared by exclusion resolution and entity mapping.

Families include the namespace and an underscore boundary. The death_of family is
intentionally broader than parents to hold out related bereavement stories.
"""

TAG_TO_THEME: dict[str, str] = {
    "urn:tag:keyword:media:fictional_illness": "illness",
    "urn:tag:keyword:media:fictional_hospitals": "hospitals",
    "urn:tag:keyword:media:fictional_cancer": "cancer",
    "urn:tag:keyword:media:fictional_parent_death": "parent-death",
    "urn:tag:keyword:media:fictional_grief": "grief",
    "urn:tag:genre:media:illness": "illness",
    "urn:tag:theme:qloo:terminal_illness": "illness",
    "urn:tag:keyword:media:hospital": "hospitals",
    "urn:tag:setting:qloo:hospital": "hospitals",
    "urn:tag:theme:qloo:cancer": "cancer",
    "urn:tag:keyword:qloo:cancer": "cancer",
    "urn:tag:keyword:media:death_of_parent": "parent-death",
    "urn:tag:archetype:qloo:the_dying_parent": "parent-death",
    "urn:tag:theme:qloo:parental_grief": "parent-death",
    "urn:tag:theme:qloo:grief": "grief",
    "urn:tag:keyword:media:grief": "grief",
}

TAG_FAMILIES: dict[str, str] = {
    "urn:tag:genre:media:illness_": "illness",
    "urn:tag:theme:qloo:terminal_illness_": "illness",
    "urn:tag:keyword:media:hospital_": "hospitals",
    "urn:tag:setting:qloo:hospital_": "hospitals",
    "urn:tag:theme:qloo:cancer_": "cancer",
    "urn:tag:keyword:qloo:cancer_": "cancer",
    "urn:tag:keyword:media:death_of_": "parent-death",
    "urn:tag:archetype:qloo:the_dying_parent_": "parent-death",
    "urn:tag:theme:qloo:parental_grief_": "parent-death",
    "urn:tag:theme:qloo:grief_": "grief",
    "urn:tag:keyword:media:grief_": "grief",
}


def theme_for_tag(tag_id: str) -> str | None:
    """Resolve exact identifiers first, then bounded catalog families."""
    exact = TAG_TO_THEME.get(tag_id)
    if exact is not None:
        return exact
    return next(
        (
            theme
            for prefix, theme in TAG_FAMILIES.items()
            if tag_id.startswith(prefix) and len(tag_id) > len(prefix)
        ),
        None,
    )
