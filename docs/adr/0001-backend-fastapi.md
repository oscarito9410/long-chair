# ADR 0001: Python and FastAPI for the session API

- Status: accepted
- Date: 2026-10-11

## Context

The prototype is a Vite and TypeScript UI. The hackathon build needs a server that holds the Qloo key, runs the pipeline, and stays up for judges. The team is small. Oscar, who is leading it, builds Python backends and the web client.

A Node server would share the TypeScript types with the UI. That is the strongest argument against Python. The pipeline is a handful of HTTP calls, a pure packer, and a checker. It is not a large domain that will suffer from a second copy of five interfaces.

## Decision

The session API is Python 3.12 and FastAPI.

- FastAPI publishes the OpenAPI document the web client follows. The source is the schema in `docs/architecture/ARCHITECTURE.md`, then the FastAPI models. The Vite app keeps the TypeScript types in `src/data/types.ts`. Hand-copied fields that drift are a bug.
- `httpx` is enough for the Qloo GET calls. Pydantic models are the shared `InsightsDocument` the contract tests already assume.
- The packer moves as a pure function. Its rules stay the ones in `src/lib/pack-session.ts`. A Python port of that function is tested against the same fixture sessions as the TypeScript one, so the two implementations cannot diverge while both exist. Once the API owns packing, the UI stops packing and renders the server's `PackedSession`.
- Oscar can review and extend a Python service without the team adopting a backend language nobody owns.

We will not put Qloo calls in the Vite app "just until the server exists." The key would land in the bundle.

## Consequences

- Two languages in the monorepo. The boundary is HTTP and OpenAPI, not a shared package.
- The UI keeps rendering `CatalogItem` and `PackedSession`. It stops importing `packSession` once the plan endpoint exists.
- Local development is `uvicorn` plus `npm run dev`. The fake adapter means this works with no key.
- A later rewrite of the API in TypeScript is allowed if the port, the schema, and the contract tests move with it. That rewrite is not in scope before 30 October 2026.
