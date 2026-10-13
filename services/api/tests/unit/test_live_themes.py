"""One synthetic tag conformance corpus for both language implementations."""

import json
from pathlib import Path

import pytest
from app.adapters.documents import EntityRecord
from app.adapters.mapper import map_insights, map_tags
from app.adapters.theme_tags import theme_for_tag
from app.application.checker import rejects
from app.domain.entities import AvoidTheme

CORPUS = Path(__file__).resolve().parents[4] / "packages/core/fixtures/qloo-theme-shape.json"
CASES = json.loads(CORPUS.read_text())


@pytest.mark.parametrize("case", CASES)
def test_live_tag_shapes_survive_mapping(case):
    entity = EntityRecord.model_validate(
        {
            "name": "Synthetic Story",
            "entity_id": "synthetic",
            "types": ["urn:entity:movie"],
            "tags": [{"id": case["tag"], "name": "Uninformative label"}],
        }
    )
    item = map_insights([entity], "movie", [])[0]
    assert item.avoided_theme_ids == (case["theme"],)
    assert rejects(item, [AvoidTheme(case["theme"], "Uninformative theme", "")])
    assert map_tags(entity.tags)[0].theme_id == case["theme"]


@pytest.mark.parametrize(
    "tag",
    [
        "urn:tag:brand:media:hospital_visit",
        "urn:tag:keyword:media:hospitality",
        "urn:tag:keyword:media:death_offstage",
        "urn:tag:keyword:media:hospital_",
    ],
)
def test_families_do_not_match_unrelated_namespaces_or_prefixes(tag):
    assert theme_for_tag(tag) is None
