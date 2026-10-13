# Research: Qloo live shape

The evidence source is [issue #11](https://github.com/oscarito9410/long-chair/issues/11),
read before repository changes. No live response files or credentials were consulted.
Existing ADRs 0009/0010 establish theme verification and the single mapper. The Spec Kit
constitution and templates supplied the specification, plan and task structure.
No .agents/skills or CLAUDE.md exists in this checkout.

Decisions: normalize at the wire boundary; preserve fictional compatibility; use
bounded full-prefix tag families; retain the final checker; expose diagnostics only
internally. A static built-in exclusion vocabulary avoids a new cache or repeated tag
lookups. Core and API use one test corpus to prevent cross-language rule drift.

Unverified: real-host behavior after these changes, exact time semantics of place
hours, and additional measurement structures. No live or paid API calls were made.
