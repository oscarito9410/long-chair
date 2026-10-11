# Security

## Reporting

Please report a vulnerability in private to the maintainer in `.github/CODEOWNERS` (@oscarito9410). Do not open a public issue, and do not send a Qloo key, a session token, or a recorded catalog payload in the report.

## What we protect

- `QLOO_API_KEY` stays on the API host. It is not in the web app and not in the Expo app.
- The review build does not set `EXPO_PUBLIC_API_URL`, so the phone does not upload tastes or themes.
- Avoided themes are content preferences. They are not a diagnosis and they are not HealthKit data.
- Replay caches of real catalog responses stay gitignored.

## Supported versions

The hackathon tree on `main` is the supported line. There is no long-term support branch yet.
