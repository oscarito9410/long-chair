"""Companion prompts for the fictional shelf. One row per taste id."""

from collections.abc import Sequence

from app.domain.entities import CatalogItem, CompanionTopic

TOPICS: tuple[CompanionTopic, ...] = (
    CompanionTopic(
        "greenhouse",
        "paper-kite",
        "The repair, continued",
        (
            "The Paper Kite is a slow repair. "
            "If you had a week and a cracked pane, where would you start?"
        ),
    ),
    CompanionTopic(
        "buoy",
        "harbor-lights",
        "Who moved the blue buoy?",
        "The night desk follows one quiet clue. You can trade guesses without spoiling the ending.",
    ),
    CompanionTopic(
        "bread",
        "slow-kitchen",
        "Bread on a Tuesday",
        (
            "The episode is one loaf and a long rise. "
            "Ask what you would bake if the afternoon had an oven."
        ),
    ),
    CompanionTopic(
        "cedar",
        "mira-solano",
        "The song for the ride home",
        (
            "Cedar Hall is a small room and a warm voice. "
            "Pick one track to replay in the car, and say why."
        ),
    ),
    CompanionTopic(
        "morning",
        "salt-windowlight",
        "A kitchen before anyone talks",
        "Market Morning is about light on a counter. Describe the first room you want after this.",
    ),
    CompanionTopic(
        "trains",
        "sunday-engines",
        "The smallest train",
        (
            "Sunday Engines loves short lines and open windows. "
            "What is the smallest train either of you has ridden?"
        ),
    ),
)

_BY_SEED = {topic.seed_id: topic for topic in TOPICS}


def topics_for(items: Sequence[CatalogItem]) -> tuple[CompanionTopic, ...]:
    """Topics for tastes that justify a scheduled piece, in first-seen order."""

    seen: list[str] = []
    for item in items:
        for seed_id in item.because_of:
            if seed_id not in seen:
                seen.append(seed_id)
    return tuple(topic for seed_id in seen if (topic := _BY_SEED.get(seed_id)) is not None)
