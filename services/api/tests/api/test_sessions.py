"""Stored drafts. The companion does not change the schedule."""

import pytest
from app.api.composition import build_qloo
from app.api.main import create_app
from fastapi.testclient import TestClient

ORDER = [
    "north-window",
    "blue-buoy",
    "bread-tuesday",
    "cedar-hall",
    "market-morning",
]


def _draft(companion: str) -> dict[str, object]:
    return {
        "seedIds": [
            "paper-kite",
            "harbor-lights",
            "slow-kitchen",
            "mira-solano",
            "salt-windowlight",
        ],
        "avoidIds": ["illness", "hospitals", "cancer"],
        "durationMinutes": 240,
        "companionId": companion,
    }


def _client() -> TestClient:
    return TestClient(create_app(mode="fake"))


def test_two_companions_share_a_schedule() -> None:
    client = _client()
    pebble = client.post(
        "/v1/sessions",
        json={"draft": _draft("pebble"), "locality": "Westbridge", "weekday": "sunday"},
    )
    lumen = client.post("/v1/sessions", json={"draft": _draft("lumen")})
    assert pebble.status_code == 201
    assert lumen.status_code == 201
    first = client.post(f"/v1/sessions/{pebble.json()['sessionId']}/plan")
    second = client.post(f"/v1/sessions/{lumen.json()['sessionId']}/plan")
    assert first.status_code == 200
    assert [slot["itemId"] for slot in first.json()["packed"]["slots"]] == ORDER
    assert first.json()["packed"]["slots"] == second.json()["packed"]["slots"]
    assert first.json()["places"]
    assert second.json()["places"] == []


def test_unknown_session_and_bad_draft() -> None:
    client = _client()
    missing = client.post("/v1/sessions/not-a-session/plan")
    assert missing.status_code == 404
    assert missing.json()["error"]["code"] == "not_found"
    bad = client.post("/v1/sessions", json={"draft": _draft("pebble") | {"durationMinutes": 45}})
    assert bad.status_code == 422
    named = client.post("/v1/sessions", json={"diagnosis": "private", "draft": _draft("pebble")})
    assert named.status_code == 422
    assert "private" not in named.text


def test_live_mode_without_a_key_fails(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("QLOO_API_KEY", raising=False)
    with pytest.raises(RuntimeError):
        build_qloo("live")
