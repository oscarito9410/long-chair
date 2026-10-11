# ADR 0006: Flutter for iOS, Android, and the hosted demo

- Status: superseded by [ADR 0007](0007-responsive-web-client.md)
- Date: 2026-10-11
- Superseded: 2026-10-11

This note recommended a Flutter app for iOS, Android, and the hosted site. That recommendation is withdrawn. Do not scaffold `apps/client`, and do not follow any step that assumed Flutter, Riverpod, freezed, TestFlight, or an APK.

The living decision is [ADR 0007](0007-responsive-web-client.md): a responsive web app in `src/`, with the pipeline in the Python API. A native Swift client is post-hackathon only.
