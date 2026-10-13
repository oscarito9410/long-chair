"""Shared catalog contract. The live entry is skipped unless a key is present."""

import json
import os
from collections.abc import Sequence

import httpx
import pytest
from app.adapters.fake_qloo import FIXTURE_DIR, FakeQlooAdapter
from app.adapters.http_qloo import HttpQlooAdapter
from app.domain.demo_profile import THEMES
from app.domain.entities import CatalogItem
from app.ports.errors import QlooValidationError
from app.ports.models import InterestLink
from app.ports.qloo import QlooPort

PAPER = "00000000-0000-4000-8000-000000000010"
WARD = "00000000-0000-4000-8000-000000000007"
ILLNESS = "urn:tag:keyword:media:fictional_illness"
BANNED = ("qloo.com", "Django Unchained", "Guardians of the Galaxy")
INTEREST = InterestLink("paper-kite", "The Paper Kite", PAPER)


async def _invalid_hours(port: QlooPort) -> None:
    with pytest.raises(QlooValidationError):
        await port.places("Westbridge", "funday", (INTEREST,), ())


@pytest.mark.asyncio
async def test_fake_search_finds_the_fictional_film() -> None:
    hits = await FakeQlooAdapter().search("The Paper Kite", "movie")
    assert len(hits) == 1
    assert hits[0].name == "The Paper Kite"
    assert hits[0].qloo_entity_id == PAPER


@pytest.mark.asyncio
async def test_fake_search_folds_spanish_aliases() -> None:
    port = FakeQlooAdapter()
    soccer = await port.search("futbol", "book")
    assert [hit.slug for hit in soccer] == ["soccer"]
    assert soccer[0].taste_kind == "tag"
    accented = await port.search("fútbol", "book")
    assert [hit.slug for hit in accented] == ["soccer"]
    anime = await port.search("anime", "tv_show")
    assert [hit.slug for hit in anime] == ["anime"]
    assert anime[0].taste_kind == "tag"


@pytest.mark.asyncio
async def test_fake_insights_drop_an_excluded_tag_and_entity() -> None:
    port = FakeQlooAdapter()
    kept = await port.insights("movie", (INTEREST,), (ILLNESS,))
    assert all(item.qloo_entity_id != WARD for item in kept)
    assert any(item.id == "north-window" for item in kept)
    assert all(item.minutes > 0 for item in kept)
    tags = await port.exclusion_tags(THEMES)
    assert tags
    assert all(hit.qloo_tag_id.startswith("urn:tag:") for hit in tags)
    again = await port.insights("movie", (INTEREST,), (), (WARD,))
    assert all(item.qloo_entity_id != WARD for item in again)


@pytest.mark.asyncio
async def test_fake_places_are_places() -> None:
    places = await FakeQlooAdapter().places("Westbridge", "sunday", (INTEREST,), ())
    assert places
    assert {place.kind for place in places} <= {"bakery", "kitchen", "coffee"}


@pytest.mark.asyncio
async def test_fake_and_http_refuse_invalid_hours_before_io() -> None:
    await _invalid_hours(FakeQlooAdapter())

    def explode(request: httpx.Request) -> httpx.Response:
        del request
        raise AssertionError("invalid hours must not be sent")

    transport = httpx.MockTransport(explode)
    async with httpx.AsyncClient(transport=transport) as client:
        await _invalid_hours(HttpQlooAdapter(api_key="dummy", client=client))


@pytest.mark.asyncio
async def test_http_requests_explainability() -> None:
    seen: dict[str, str] = {}

    def record(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        return httpx.Response(200, json={"success": True, "results": {"entities": []}})

    transport = httpx.MockTransport(record)
    async with httpx.AsyncClient(transport=transport, base_url="https://example.com") as client:
        adapter = HttpQlooAdapter(api_key="dummy", client=client)
        items: Sequence[CatalogItem] = await adapter.insights(
            "movie",
            (INTEREST,),
            (),
        )
    assert items == ()
    assert "feature.explainability=true" in seen["url"]


@pytest.mark.asyncio
async def test_http_search_sends_types_and_reads_a_result_list() -> None:
    seen: dict[str, str] = {}

    def record(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        return httpx.Response(
            200,
            json={
                "success": True,
                "duration": 2,
                "results": [
                    {
                        "name": "The Paper Kite",
                        "entity_id": PAPER,
                        "subtype": "urn:entity:movie",
                        "tags": [],
                        "properties": {"description": "A slow road film"},
                    }
                ],
            },
        )

    transport = httpx.MockTransport(record)
    async with httpx.AsyncClient(transport=transport, base_url="https://example.com") as client:
        hits = await HttpQlooAdapter(api_key="example-key", client=client).search(
            "The Paper Kite",
            "movie",
        )
    assert hits[0].qloo_entity_id == PAPER
    assert "types=urn" in seen["url"]
    assert "type=" not in seen["url"].split("?", maxsplit=1)[-1].replace("types=", "")


def test_fixtures_are_fictional_and_mark_unconfirmed_keys() -> None:
    note = (FIXTURE_DIR / "CONFIDENCE.md").read_text(encoding="utf-8")
    assert "unconfirmed" in note.casefold()
    assert "query.explainability" in note
    blobs = [path.read_text(encoding="utf-8") for path in FIXTURE_DIR.glob("*.json")]
    combined = "\n".join(blobs)
    for banned in BANNED:
        assert banned not in combined
    assert "x-long-chair-confidence" in combined
    for blob in blobs:
        json.loads(blob)


@pytest.mark.live
@pytest.mark.skipif(
    not os.environ.get("QLOO_API_KEY"),
    reason="live catalog checks stay off this machine unless a key is set",
)
@pytest.mark.asyncio
async def test_live_search_is_opt_in() -> None:
    """Runs only when QLOO_API_KEY is already set. Bodies are not saved."""

    port = HttpQlooAdapter(api_key=os.environ["QLOO_API_KEY"])
    hits = await port.search("The Paper Kite", "movie")
    assert isinstance(hits, Sequence)
