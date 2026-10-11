"""The judge demo and health, with no catalog key."""

from app.api.main import create_app
from fastapi.testclient import TestClient

FILLED = 240
ORDER = [
    "north-window",
    "blue-buoy",
    "bread-tuesday",
    "cedar-hall",
    "market-morning",
]


def test_health_reports_fake() -> None:
    client = TestClient(create_app(mode="fake"))
    response = client.get("/v1/health")
    assert response.status_code == 200
    assert response.json() == {"ok": True, "qlooMode": "fake"}


def test_demo_plan_fills_the_chair() -> None:
    client = TestClient(create_app(mode="fake"))
    response = client.post("/v1/demo/plan", json={})
    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "fake"
    assert body["packed"]["filledMinutes"] == FILLED
    assert body["packed"]["openMinutes"] == 0
    assert [slot["itemId"] for slot in body["packed"]["slots"]] == ORDER
    assert body["items"][0]["why"] == "Because you love The Paper Kite"
    assert len(body["places"]) == 3
    assert len(body["topics"]) == 5


def test_demo_refuses_a_name() -> None:
    client = TestClient(create_app(mode="fake"))
    response = client.post("/v1/demo/plan", json={"name": "someone"})
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_body"
    assert "someone" not in response.text
