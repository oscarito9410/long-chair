"""Wire-shape regressions. A realistic entity keeps tags beside properties."""

import pytest
from app.adapters.documents import InsightsDocument, SearchDocument, TagRecord
from app.adapters.mapper import map_insights
from app.adapters.queries import require_allowed, search_params, tag_params
from app.domain.walk import SAMPLE_ORIGIN_LAT, SAMPLE_ORIGIN_LON, walk_minutes
from app.ports.errors import QlooValidationError
from app.ports.models import InterestLink

WARD = "00000000-0000-4000-8000-000000000007"
INTEREST = InterestLink("paper-kite", "The Paper Kite", "00000000-0000-4000-8000-000000000010")


def test_theme_filter_reads_tags_at_the_entity_root() -> None:
    realistic = {
        "success": True,
        "duration": 8,
        "results": {
            "entities": [
                {
                    "name": "Ward Clock",
                    "entity_id": WARD,
                    "type": "urn:entity",
                    "subtype": "urn:entity:movie",
                    "popularity": 0.4,
                    "disambiguation": "Sample",
                    "tags": [
                        {
                            "id": "urn:tag:keyword:media:fictional_illness",
                            "name": "Illness",
                            "type": "urn:tag:keyword:media",
                        }
                    ],
                    "properties": {
                        "description": "A night shift.",
                        "duration": 90,
                        "content_rating": "PG-13",
                        "image": {"url": "https://example.com/sample.jpg"},
                        "short_descriptions": [{"value": "A shift.", "languages": ["en", "es"]}],
                    },
                }
            ]
        },
    }
    buried = {
        "success": True,
        "results": {
            "entities": [
                {
                    "name": "Ward Clock",
                    "entity_id": WARD,
                    "subtype": "urn:entity:movie",
                    "properties": {
                        "description": "A night shift.",
                        "tags": [
                            {
                                "id": "urn:tag:keyword:media:fictional_illness",
                                "name": "Illness",
                                "type": "urn:tag:keyword:media",
                            }
                        ],
                    },
                }
            ]
        },
    }
    seen = map_insights(
        InsightsDocument.model_validate(realistic).results.entities, "movie", (INTEREST,)
    )
    missed = map_insights(
        InsightsDocument.model_validate(buried).results.entities, "movie", (INTEREST,)
    )
    assert seen[0].avoided_theme_ids == ("illness",)
    assert missed[0].avoided_theme_ids == ()


def test_search_results_are_a_list_and_tags_accept_tag_id() -> None:
    document = SearchDocument.model_validate(
        {
            "success": True,
            "duration": 3,
            "results": [
                {
                    "name": "North Window",
                    "entity_id": "00000000-0000-4000-8000-000000000001",
                    "subtype": "urn:entity:movie",
                }
            ],
        }
    )
    assert document.results[0].name == "North Window"
    tag = TagRecord.model_validate(
        {
            "tag_id": "urn:tag:keyword:media:fictional_grief",
            "name": "Grief",
            "types": ["urn:tag:keyword:media"],
        }
    )
    assert tag.id == "urn:tag:keyword:media:fictional_grief"
    assert tag.type == "urn:tag:keyword:media"


def test_outgoing_params_stay_on_the_allowlist() -> None:
    search = search_params("North Window", "movie")
    assert ("types", "urn:entity:movie") in search
    assert all(key != "type" for key, _value in search)
    tags = tag_params("Grief")
    assert tags == [("filter.query", "Grief")]
    with pytest.raises(QlooValidationError):
        require_allowed("search", [("type", "urn:entity:movie")])


def test_walk_minutes_follow_the_sample_offsets() -> None:
    bakery = walk_minutes(40.00431674, -74.0, SAMPLE_ORIGIN_LAT, SAMPLE_ORIGIN_LON)
    kitchen = walk_minutes(40.00647512, -74.0, SAMPLE_ORIGIN_LAT, SAMPLE_ORIGIN_LON)
    coffee = walk_minutes(40.00287783, -74.0, SAMPLE_ORIGIN_LAT, SAMPLE_ORIGIN_LON)
    assert (bakery, kitchen, coffee) == (6, 9, 4)
