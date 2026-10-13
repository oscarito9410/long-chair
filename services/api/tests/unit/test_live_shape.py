"""Invented records exercising issue #11 shapes, never copied provider data."""

import pytest
from app.adapters.documents import InsightsDocument, SearchDocument
from app.adapters.mapper import map_insights, map_places, map_search
from app.ports.models import InterestLink

KINDS = ("artist", "movie", "tv_show", "podcast", "book", "place")
SEED = InterestLink("seed", "Paper Seed", "00000000-0000-4000-8000-000000000001")


@pytest.mark.parametrize("kind", KINDS)
@pytest.mark.parametrize("search", [True, False])
def test_synthetic_shapes(kind, search):
    row = {
        "name": "Invented Lantern",
        "entity_id": "00000000-0000-4000-8000-000000000002",
        "types": ["urn:entity", f"urn:entity:{kind}"],
        "properties": {
            "duration": {} if kind == "artist" else 42,
            "episode_count": 8,
            "content_rating": None,
            "website": None,
            "description": None,
            "channel": None,
            "publisher": None,
            "release_date": None,
            "external": {"spotify": {"id": "synthetic-search"}},
        },
        "query": {
            "affinity": 0.8,
            "measurements": {"synthetic": {"value": 0.4}},
            "explainability": {
                "signal.interests.entities": [{"entity_id": SEED.qloo_entity_id, "score": 0.9}]
            },
        },
    }
    if search:
        entity = SearchDocument.model_validate({"results": [row]}).results[0]
        assert entity.external["spotify"][0].id == "synthetic-search"
    else:
        row.pop("types")
        row["type"] = "urn:entity"
        row["subtype"] = f"urn:entity:{kind}"
        row["external"] = {"spotify": [{"id": "synthetic-insights"}]}
        entity = InsightsDocument.model_validate({"results": {"entities": [row]}}).results.entities[
            0
        ]
        assert entity.external["spotify"][0].id == "synthetic-insights"
    assert entity.subtype == f"urn:entity:{kind}"
    assert entity.properties.episode_count == 8
    assert entity.query.affinity == 0.8
    assert entity.query.measurements == {"synthetic": {"value": 0.4}}
    if kind != "place":
        assert map_search([entity], kind)[0].name == "Invented Lantern"
        assert map_insights([entity], kind, [SEED])[0].because_of == ("seed",)
    if kind == "artist":
        assert entity.properties.duration is None


@pytest.mark.parametrize("location_key", ["location", "geocode"])
def test_places_keep_location_and_metadata(location_key):
    row = {
        "name": "Fictional Coffee",
        "entity_id": "synthetic-place",
        "types": ["urn:entity:place"],
        "tags": [{"id": "urn:tag:category:place:coffee", "name": "Coffee"}],
        "properties": {
            "address": "1 Fictional Lane",
            "hours": {"Monday": ["09:00-17:00"]},
            "price_level": 2,
            "business_rating": 4.2,
            "website": None,
        },
    }
    coordinates = {"latitude": 40.00431674, "longitude": -74.0}
    if location_key == "location":
        row["location"] = coordinates
    else:
        row["properties"]["geocode"] = coordinates
    entity = SearchDocument.model_validate({"results": [row]}).results[0]
    place = map_places([entity])[0]
    assert place.walk_minutes == 6
    assert place.address == "1 Fictional Lane"
    assert place.hours == (("Monday", ("09:00-17:00",)),)
    assert place.rating == 4.2
    assert place.price_label == "A modest meal"
    assert place.open_until == ""


def test_explicit_empty_or_low_scores_do_not_invent_attribution():
    for scores in ([], [{"entity_id": SEED.qloo_entity_id, "score": 0.01}]):
        entity = SearchDocument.model_validate(
            {
                "results": [
                    {
                        "name": "Fictional Movie",
                        "entity_id": "synthetic-movie",
                        "types": ["urn:entity:movie"],
                        "query": {"explainability": {"signal.interests.entities": scores}},
                    }
                ]
            }
        ).results[0]
        assert map_insights([entity], "movie", [SEED])[0].because_of == ()


def test_sparse_location_falls_back_and_single_hours_normalize():
    row = {
        "entity_id": "synthetic",
        "name": "Fictional Coffee",
        "subtype": "urn:entity:place",
        "location": {},
        "tags": [{"id": "urn:tag:category:place:coffee"}],
        "properties": {
            "geocode": {"lat": 40.00431674, "lng": -74.0},
            "hours": {"Monday": "09:00-17:00"},
        },
    }
    entity = SearchDocument.model_validate({"results": [row]}).results[0]
    place = map_places([entity])[0]
    assert place.walk_minutes == 6
    assert place.hours == (("Monday", ("09:00-17:00",)),)


@pytest.mark.parametrize("duration", [{}, [], "unknown", None, True, float("inf")])
def test_non_numeric_duration_is_unavailable(duration):
    entity = SearchDocument.model_validate(
        {
            "results": [
                {
                    "entity_id": "synthetic",
                    "name": "Fictional",
                    "properties": {"duration": duration},
                }
            ]
        }
    ).results[0]
    assert entity.properties.duration is None


def test_external_providers_merge_without_losing_nested_only_ids():
    entity = SearchDocument.model_validate(
        {
            "results": [
                {
                    "entity_id": "synthetic",
                    "name": "Fictional",
                    "external": {"tmdb": [{"id": 123456789}], "spotify": [{"id": "root"}]},
                    "properties": {
                        "external": {"spotify": {"id": "nested"}, "isbn": {"id": "synthetic-isbn"}}
                    },
                }
            ]
        }
    ).results[0]
    assert entity.external["tmdb"][0].id == "123456789"
    assert entity.external["spotify"][0].id == "root"
    assert entity.external["isbn"][0].id == "synthetic-isbn"
