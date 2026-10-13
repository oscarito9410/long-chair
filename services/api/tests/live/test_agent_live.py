"""Live smoke test. Both keys alone do not authorize paid calls."""

import pytest
from app.live.agent_metrics import live_enabled, run_comparison


@pytest.mark.live
@pytest.mark.skipif(not live_enabled(), reason="Requires both keys, model, and RUN_LIVE_AGENT=1")
async def test_live_agent_comparison() -> None:
    rows = dict(await run_comparison(live=True))
    assert rows["agent"].verifier_pass_rate == 1.0
    assert 0 <= rows["agent"].duration_fit <= 1
    assert rows["deterministic"].verifier_pass_rate == 1.0
