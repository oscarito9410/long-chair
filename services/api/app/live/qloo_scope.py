"""Section 5 checks against the hackathon host.

Writes a shape report. It does not save response bodies. Run it only with a key:

    QLOO_API_KEY=... uv run python -m app.live.qloo_scope
"""

import asyncio
import os
from http import HTTPStatus
from pathlib import Path
from typing import Any

import httpx

from app.adapters.provider_errors import response_error
from app.adapters.queries import tag_params

REQUEST_INTERVAL_SECONDS = 0.25
MAX_ATTEMPTS = 3
BACKOFF_FACTOR = 2

HOST = "https://hackathon.api.qloo.com"
REPORT_DIR = Path(__file__).resolve().parents[2] / ".qloo-live"
SAMPLE_MOVIE = "Everything Everywhere All at Once"
CDMX = "19.4326,-99.1332"
TAG_QUERIES = ("cancer", "hospital", "grief", "terminal illness", "death of a parent")
CONTENT_TYPES = (
    "urn:entity:movie",
    "urn:entity:tv_show",
    "urn:entity:podcast",
    "urn:entity:book",
    "urn:entity:artist",
    "urn:entity:place",
)


def report_dir() -> Path:
    """Gitignored folder for the readable report."""

    return REPORT_DIR


async def run_scope(api_key: str, destination: Path) -> str:
    """Ask the open questions and return the report text. Bodies stay in memory."""

    destination.mkdir(parents=True, exist_ok=True)
    lines = ["# Qloo scope report", "", "Shapes only. Response bodies are not saved.", ""]
    headers = {"X-Api-Key": api_key}
    async with httpx.AsyncClient(base_url=HOST, headers=headers, timeout=20) as client:
        search = await _get(
            client,
            "/search",
            {"query": SAMPLE_MOVIE, "types": "urn:entity:movie", "take": "1"},
        )
        signal = _entity(search).get("entity_id")
        if not isinstance(signal, str) or not signal:
            raise RuntimeError("Scope search returned no signal entity; insights were not sent.")
        movie = await _get(
            client,
            "/v2/insights",
            {
                "filter.type": "urn:entity:movie",
                "take": "1",
                "signal.interests.entities": signal,
                "feature.explainability": "true",
            },
        )
        lines.extend(_duration_and_affinity(movie))
        lines.extend(await _types(client, signal))
        lines.extend(_search_shape(search))
        lines.extend(await _tag_queries(client))
        lines.extend(await _exclude_operators(client, movie))
        lines.extend(_explainability(movie))
        lines.extend(_streaming(movie))
        lines.extend(await _places(client, signal))
        lines.extend(_backfill(movie))
        lines.append("")
        lines.append("Rate-limit headers, when the host sends them, are copied as names only.")
    text = "\n".join(lines) + "\n"
    (destination / "scope-report.md").write_text(text, encoding="utf-8")
    return text


async def _get(client: httpx.AsyncClient, path: str, params: dict[str, str]) -> dict[str, Any]:
    response = await _paced_get(client, path, params)
    payload = response.json() if response.content else {}
    body = payload if isinstance(payload, dict) else {}
    body["_status"] = response.status_code
    body["_header_names"] = sorted(response.headers.keys())
    return body


async def _paced_get(
    client: httpx.AsyncClient, path: str, params: dict[str, str]
) -> httpx.Response:
    delay = REQUEST_INTERVAL_SECONDS
    for attempt in range(MAX_ATTEMPTS):
        await asyncio.sleep(delay)
        response = await client.get(path, params=params)
        if response.status_code == HTTPStatus.TOO_MANY_REQUESTS and attempt + 1 < MAX_ATTEMPTS:
            delay *= BACKOFF_FACTOR
            continue
        if response.status_code != HTTPStatus.OK:
            raise response_error(response, client.headers.get("X-Api-Key", ""))
        return response
    raise RuntimeError("Scope retry budget exhausted.")


def _entity(payload: dict[str, Any]) -> dict[str, Any]:
    results = payload.get("results")
    if isinstance(results, dict):
        entities = results.get("entities")
        if isinstance(entities, list) and entities and isinstance(entities[0], dict):
            return entities[0]
    if isinstance(results, list) and results and isinstance(results[0], dict):
        return results[0]
    return {}


def _duration_and_affinity(payload: dict[str, Any]) -> list[str]:
    results = payload.get("results")
    nested = isinstance(results, dict) and "duration" in results
    entity = _entity(payload)
    query = entity.get("query") if isinstance(entity.get("query"), dict) else {}
    return [
        "## 1. Envelope duration and affinity",
        f"- status: {payload.get('_status')}",
        f"- duration at root: {'duration' in payload}",
        f"- duration inside results: {nested}",
        f"- entity query keys: {sorted(query.keys()) if isinstance(query, dict) else []}",
        f"- affinity key present: {isinstance(query, dict) and 'affinity' in query}",
        "",
    ]


async def _types(client: httpx.AsyncClient, signal: str) -> list[str]:
    lines = ["## 2-5. Fields by type", ""]
    for subtype in CONTENT_TYPES:
        payload = await _get(
            client,
            "/v2/insights",
            {"filter.type": subtype, "take": "1", "signal.interests.entities": signal},
        )
        entity = _entity(payload)
        props = entity.get("properties") if isinstance(entity.get("properties"), dict) else {}
        external = entity.get("external") if isinstance(entity.get("external"), dict) else {}
        lines.append(f"### {subtype}")
        lines.append(f"- status: {payload.get('_status')}, entity keys: {sorted(entity.keys())}")
        lines.append(
            f"- tags at root: {'tags' in entity}, popularity at root: {'popularity' in entity}"
        )
        lines.append(f"- tags inside properties: {isinstance(props, dict) and 'tags' in props}")
        lines.append(f"- property keys: {sorted(props.keys()) if isinstance(props, dict) else []}")
        image = props.get("image") if isinstance(props, dict) else None
        lines.append(f"- image.url present: {isinstance(image, dict) and 'url' in image}")
        lines.append(
            f"- external families: {sorted(external.keys()) if isinstance(external, dict) else []}"
        )
        lines.append("")
    return lines


def _search_shape(payload: dict[str, Any]) -> list[str]:
    results = payload.get("results")
    entity = _entity(payload)
    return [
        "## 6. Search",
        f"- status: {payload.get('_status')}",
        f"- results is a list: {isinstance(results, list)}",
        f"- first hit keys: {sorted(entity.keys())}",
        "",
    ]


async def _tag_queries(client: httpx.AsyncClient) -> list[str]:
    lines = ["## 7. Theme tag ids", ""]
    for label in TAG_QUERIES:
        for semantic in ("false", "true"):
            payload = await _get(
                client,
                "/v2/tags",
                {**dict(tag_params(label)), "feature.semantic_search": semantic, "take": "5"},
            )
            tags = _tag_rows(payload)
            ident = (
                "tag_id"
                if any("tag_id" in row for row in tags)
                else "id"
                if any("id" in row for row in tags)
                else "neither"
            )
            status = payload.get("_status")
            lines.append(f"- {label} semantic={semantic} status={status} id-field={ident}")
            lines.append(f"  count={len(tags)}")
    lines.append("")
    return lines


def _tag_rows(payload: dict[str, Any]) -> list[dict[str, Any]]:
    results = payload.get("results")
    if isinstance(results, dict) and isinstance(results.get("tags"), list):
        return [row for row in results["tags"] if isinstance(row, dict)]
    return []


async def _exclude_operators(client: httpx.AsyncClient, movie: dict[str, Any]) -> list[str]:
    lines = ["## 8. Exclude-tags operator", ""]
    entity = _entity(movie)
    entity_id = str(entity.get("entity_id") or "")
    tags = entity.get("tags") if isinstance(entity.get("tags"), list) else []
    tag_id = ""
    if tags and isinstance(tags[0], dict):
        tag_id = str(tags[0].get("id") or "")
    if not entity_id or not tag_id:
        lines.append("- skipped: the movie sample had no entity id or tag id")
        lines.append("")
        return lines
    for key in ("operator.exclude.tags", "operator.filter.exclude.tags"):
        payload = await _get(
            client,
            "/v2/insights",
            {
                "filter.type": "urn:entity:movie",
                "signal.interests.entities": entity_id,
                "filter.exclude.tags": tag_id,
                key: "union",
                "take": "5",
            },
        )
        ids = _entity_ids(payload)
        present = entity_id in ids
        status = payload.get("_status")
        lines.append(f"- {key}: status={status} count={len(ids)} sample_present={present}")
    lines.append("")
    return lines


def _entity_ids(payload: dict[str, Any]) -> list[str]:
    results = payload.get("results")
    if not isinstance(results, dict) or not isinstance(results.get("entities"), list):
        return []
    return [str(row.get("entity_id")) for row in results["entities"] if isinstance(row, dict)]


def _explainability(payload: dict[str, Any]) -> list[str]:
    entity = _entity(payload)
    query = entity.get("query") if isinstance(entity.get("query"), dict) else {}
    root = payload.get("query") if isinstance(payload.get("query"), dict) else {}
    per = query.get("explainability") if isinstance(query, dict) else None
    top = root.get("explainability") if isinstance(root, dict) else None
    return [
        "## 9. Explainability",
        f"- per-entity type: {type(per).__name__}",
        f"- root type: {type(top).__name__}",
        f"- per-entity keys: {sorted(per.keys()) if isinstance(per, dict) else []}",
        f"- root keys: {sorted(top.keys()) if isinstance(top, dict) else []}",
        "",
    ]


def _streaming(payload: dict[str, Any]) -> list[str]:
    entity = _entity(payload)
    raw_tags = entity.get("tags")
    tags = raw_tags if isinstance(raw_tags, list) else []
    services = [
        str(row.get("name"))
        for row in tags
        if isinstance(row, dict)
        and "streaming_service" in str(row.get("type") or row.get("id") or "")
    ]
    return [
        "## 10. Streaming-service tags",
        f"- count on the first movie: {len(services)}",
        "",
    ]


async def _places(client: httpx.AsyncClient, signal: str) -> list[str]:
    payload = await _get(
        client,
        "/v2/insights",
        {
            "filter.type": "urn:entity:place",
            "signal.interests.entities": signal,
            "filter.location": CDMX,
            "filter.location.radius": "2000",
            "sort_by": "distance",
            "take": "5",
        },
    )
    entity = _entity(payload)
    props = entity.get("properties") if isinstance(entity.get("properties"), dict) else {}
    hour_keys = (
        [key for key in props if "hour" in key or "open" in key] if isinstance(props, dict) else []
    )
    return [
        "## 11. Places in Mexico City",
        f"- status: {payload.get('_status')}",
        f"- entities: {len(_entity_ids(payload))}",
        f"- hour-like property keys: {hour_keys}",
        "",
    ]


def _backfill(payload: dict[str, Any]) -> list[str]:
    entity = _entity(payload)
    return [
        "## 12-13. Backfill and limits",
        f"- entity keys that mention backfill: {[key for key in entity if 'backfill' in key]}",
        f"- response header names: {payload.get('_header_names')}",
        "",
    ]


def main() -> None:
    key = os.environ.get("QLOO_API_KEY", "").strip()
    if not key:
        print("QLOO_API_KEY is unset. The live scope check stays skipped.")
        return
    text = asyncio.run(run_scope(key, report_dir()))
    print(text)


if __name__ == "__main__":
    main()
