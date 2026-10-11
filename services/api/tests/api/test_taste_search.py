"""Taste search stays on the catalog port and does not claim a live key."""

from app.api.main import create_app
from fastapi.testclient import TestClient


def test_search_returns_soccer_and_anime_as_sample() -> None:
    client = TestClient(create_app(mode="fake"))

    soccer = client.get("/v1/tastes/search", params={"q": "futbol"})
    assert soccer.status_code == 200
    body = soccer.json()
    assert body["source"] == "fake"
    assert body["results"][0] == {
        "id": "soccer",
        "name": "Soccer",
        "kind": "tag",
        "detail": "The sport, from five-a-side to a final",
    }

    anime = client.get("/v1/tastes/search", params={"q": "anime"})
    assert anime.status_code == 200
    assert anime.json()["results"][0]["id"] == "anime"
    assert anime.json()["results"][0]["kind"] == "tag"
    assert anime.json()["results"][0]["name"] == "Anime"


def test_short_query_does_not_search() -> None:
    client = TestClient(create_app(mode="fake"))
    response = client.get("/v1/tastes/search", params={"q": "a"})
    assert response.status_code == 200
    assert response.json() == {"results": [], "source": "fake"}
