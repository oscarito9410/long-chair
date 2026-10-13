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


def test_shared_corpus_covers_every_production_tag_and_family():
    from app.adapters.theme_tags import TAG_FAMILIES, TAG_TO_THEME

    tags = {case["tag"] for case in CASES}
    assert {tag for tag in TAG_TO_THEME if "fictional_" not in tag} <= tags
    assert {prefix + "synthetic" for prefix in TAG_FAMILIES} <= tags


def test_generic_bereavement_does_not_claim_a_parent_relation():
    assert theme_for_tag("urn:tag:keyword:media:death_of_grandmother") == "grief"
    assert theme_for_tag("urn:tag:keyword:media:death_of_friend") == "grief"
    assert theme_for_tag("urn:tag:keyword:media:death_of_mother") == "parent-death"
    assert theme_for_tag("urn:tag:keyword:media:death_of_father_synthetic") == "parent-death"
