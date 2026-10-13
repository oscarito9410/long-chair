"""Live catalog scope. Skipped unless QLOO_API_KEY is already set."""

import os
from pathlib import Path

import pytest

pytestmark = [
    pytest.mark.live,
    pytest.mark.skipif(
        not os.environ.get("QLOO_API_KEY"),
        reason="live catalog scope stays off unless QLOO_API_KEY is set",
    ),
]


@pytest.mark.asyncio
async def test_live_scope_writes_a_report(tmp_path: Path) -> None:
    from app.live.qloo_scope import run_scope

    text = await run_scope(os.environ["QLOO_API_KEY"], tmp_path)
    assert "Envelope duration" in text
    assert "Theme tag ids" in text
    assert os.environ["QLOO_API_KEY"] not in text
    assert (tmp_path / "scope-report.md").is_file()
