# Implementation Plan: Qloo live wire shape

**Branch**: `fix/007-qloo-live-shape` | **Date**: 2026-10-13 | **Spec**: [spec.md](spec.md)

## Summary

Normalize provider variants in Pydantic adapter documents; map metadata once. Extend
existing theme rules and keep post-fetch verification authoritative. Add typed provider
failures without changing public error safety. Repair the opt-in scope script with
signal resolution, sequential pacing, bounded retries, and shape-only reporting.

## Technical Context

Python 3.12+, Pydantic, httpx, pytest and uv in services/api. TypeScript strict and
Vitest in packages/core. No new dependencies or persistent stores. Network-free tests
use synthetic records and httpx.MockTransport. No heavy native builds.

## Constitution Check

Before implementation: passes SOLID, ports, dependency direction, strict typing,
privacy, and test requirements. Qloo documents stay outside domain; the checker and
packer remain the admission path. Existing fictional compatibility is retained.
After implementation: verify these boundaries with tests and diff review.

## Project Structure

- services/api/app/adapters: documents, mapper, query parameters, HTTP error handling.
- services/api/app/ports/errors.py: typed provider failures.
- services/api/app/domain/entities.py: optional place metadata only if needed.
- services/api/app/live/qloo_scope.py: opt-in diagnostic request sequence.
- packages/core/src/data: existing theme rules and signal judging.
- services/api/tests/unit and packages/core: deterministic regressions.
- docs/adr/0013-qloo-live-shape.md: normalization and theme-family decision.

## Validation

Run focused regressions first, then uv run ruff check/format, mypy, pytest; npm
format:check, lint, typecheck, test; informational SlopMD/design scans. Use environment
without live keys. Record actual results in quickstart.md and the draft PR. Live scope
acceptance stays unchecked because live paid calls are explicitly forbidden.
