"""Comparison reports measurable outcomes and labels its fictional baseline."""

from app.live.agent_metrics import comparison_table, run_comparison


async def test_keyless_comparison_prints_three_rows_and_all_measures() -> None:
    rows = await run_comparison()
    assert {name for name, metrics in rows} == {"agent", "deterministic", "llm_only"}
    by_name = dict(rows)
    assert by_name["agent"].verifier_pass_rate == 1.0
    assert by_name["deterministic"].duration_fit == 1.0
    assert by_name["llm_only"].verifier_pass_rate < 1.0
    assert by_name["agent"].steps == 6
    assert by_name["deterministic"].steps == 0
    text = comparison_table(rows)
    for label in ("verifier_pass", "duration_fit", "type_diversity", "steps", "latency_ms"):
        assert label in text
    assert "agent" in text and "deterministic" in text and "llm_only" in text
