# ADR 0005: Client strategy (withdrawn)

- Status: superseded by [ADR 0007](0007-responsive-web-client.md)
- Date: 2026-10-11
- Superseded: 2026-10-11

This note recommended a React Native toolchain for iOS, Android, and the hosted site. Oscar has little experience there and does not want it. The recommendation is withdrawn. Do not scaffold that app, and do not follow any step that assumed it.

The living decision is [ADR 0007](0007-responsive-web-client.md): a responsive web app in `src/`, with the agentic pipeline staying in the Python API. [ADR 0006](0006-flutter-client.md) is superseded. A native Swift client is post-hackathon only.
