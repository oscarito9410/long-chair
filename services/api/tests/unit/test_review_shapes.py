"""Review regressions with invented values and no recorded provider responses."""

import pytest
from app.adapters.documents import InsightsDocument
from app.adapters.mapper import map_insights, map_places
from app.ports.models import InterestLink

SEED = InterestLink("paper", "Fictional Paper", "synthetic-seed")


def document(**fields):
    return InsightsDocument.model_validate(
        {
            "results": {
                "entities": [
                    {
                        "entity_id": "synthetic-entity",
                        "name": "Fictional Stop",
                        "subtype": "urn:entity:place",
                        **fields,
                    }
                ]
            }
        }
    )


def test_daily_hours_objects_preserve_split_intervals_and_closure():
    entity = document(
        tags=[{"id": "urn:tag:category:place:coffee"}],
        properties={
            "hours": {
                "Monday": [
                    {"opens": "08:30", "closes": "12:00"},
                    {"opens": "14:00", "closes": "18:30"},
                ],
                "Tuesday": [{"closed": True}],
                "Wednesday": [],
                "Thursday": None,
            }
        },
    ).results.entities[0]
    assert entity.properties.hours["Monday"][0].opens == "08:30"
    assert entity.properties.hours["Tuesday"][0].closed is True
    place = map_places([entity])[0]
    assert dict(place.hours) == {
        "Monday": ("08:30-12:00", "14:00-18:30"),
        "Tuesday": ("Closed",),
        "Wednesday": (),
        "Thursday": (),
    }
    assert place.open_until == ""


@pytest.mark.parametrize(
    "explanation",
    [
        [{"entity_id": SEED.qloo_entity_id, "score": 0.9}],
        {"signal.interests.entities": [{"entity_id": SEED.qloo_entity_id, "score": 0.9}]},
        [{"signal.interests.entities": [{"entity_id": SEED.qloo_entity_id, "score": 0.9}]}],
        {
            "entities": [
                None,
                {"score": "invalid"},
                {"entity_id": SEED.qloo_entity_id, "score": 0.9},
            ]
        },
    ],
)
def test_explanation_variants_keep_usable_scores(explanation):
    entity = document(
        subtype="urn:entity:movie", query={"explainability": explanation}
    ).results.entities[0]
    assert map_insights([entity], "movie", [SEED])[0].because_of == ("paper",)


@pytest.mark.parametrize(
    "explanation",
    [
        [],
        {},
        "unexpected",
        7,
        True,
        {"signal.interests.entities": None},
        {"entities": "unexpected"},
        [{"entity_id": "synthetic-seed", "score": float("nan")}],
        [{"entity_id": "synthetic-seed", "score": True}],
        [{"entity_id": "synthetic-seed", "score": 4}],
    ],
)
def test_invalid_optional_explanation_does_not_discard_entity_or_invent_attribution(explanation):
    entity = document(
        subtype="urn:entity:movie", query={"explainability": explanation}
    ).results.entities[0]
    item = map_insights([entity], "movie", [SEED])[0]
    assert item.title == "Fictional Stop"
    assert item.because_of == ()
