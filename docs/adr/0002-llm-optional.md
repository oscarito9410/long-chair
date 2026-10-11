# ADR 0002: The language model is optional and writes prose only

- Status: accepted
- Date: 2026-10-11

## Context

The hackathon sits at the intersection of Qloo and language models. Judges will look for an agent. The product also has to make sense when no model key is configured, and it must not send medical context to a third model.

The prototype already explains a pick with "Because you love {name}" and a one-line theme check. Those lines are enough to understand the kit.

## Decision

Taste, exclusion, the checker, and the clock are Qloo plus our rules. A model does not choose titles, does not decide that a theme is present, and does not set durations.

An optional prose step runs after the plan exists, and only when `LLM_API_KEY` is set:

- It may rewrite `CatalogItem.why` and a `CompanionTopic` prompt.
- It may not add or remove items, change `minutes`, or clear an `avoidedThemeIds` entry.
- The input is the kept titles, the seed names, and the template line. It is not the visitor's name, not a diagnosis, and not the raw Qloo document.
- The client is any OpenAI-compatible chat endpoint (`LLM_BASE_URL`, `LLM_MODEL`, `LLM_API_KEY`). We do not pin a vendor in the architecture. A small, cheap model is the intended setting. If the call fails or the key is unset, the template line is the product.

The on-screen agent is the pipeline in `docs/architecture/ARCHITECTURE.md`: resolve, insights, checker, packer, companion plan. That is the agent we can demonstrate with the fake adapter before a Qloo key or a model key exists.

The checker stays deterministic. A later experiment may let a model flag a description, and the flag is only a hint. The rules still have to reject the row on their own. We will not ship a model-only checker before the deadline.

## Consequences

- The demo video can show the agent with both keys, or with Qloo only, or with the fake adapter. It must not depend on the model to produce a kit.
- Hosting needs no GPU and no model bill to be valid.
- Prompt text, if we add it, lives in the API repo and stays English. It does not contain a medical persona or a patient.
