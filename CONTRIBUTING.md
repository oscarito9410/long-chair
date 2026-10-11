# Contributing

Long Chair is the Qloo Agentic Hackathon project: a web demo for judges, an Expo app for iPhone, and a FastAPI session kit. English only.

## Setup

Node.js 22 or newer, and [uv](https://docs.astral.sh/uv/) 0.13 with Python 3.12 for the API.

```bash
npm install
npm run dev
```

The web demo is [http://127.0.0.1:4179](http://127.0.0.1:4179).

```bash
npm run dev:mobile
```

The Expo web preview listens on port 4181. Native builds need a Mac. See the README for `eas build` and `eas submit`.

```bash
cd services/api
uv sync --extra dev
uv run uvicorn app.api.main:app --host 127.0.0.1 --port 8099
```

## Branches

Work on `main` for hackathon changes unless a change needs isolation. Branch names are lowercase `type/short-topic`, for example `feat/session-kit` or `docs/app-store`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add the ready stamp
fix: keep the sample label on the kit
docs: record the App Store notes
test: reject therapeutic claims
chore: pin the Expo SDK
```

Subjects are English, imperative, and short. No secrets in the message.

## Pull requests

Use the pull request template. Link an issue. Link the Spec Kit spec when the change belongs to `specs/001-session-kit` or `specs/002-mobile-app`. UI changes need screenshots. `.github/CODEOWNERS` lists @oscarito9410.

## Quality gates

Before you push:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run doctor -w @long-chair/mobile
```

When the API changed, from `services/api`:

```bash
uv run ruff check .
uv run ruff format --check .
uv run mypy
uv run pytest
```

SlopMD and `slop_lint.py` are informational until the inherited findings are cleaned on purpose. Do not restyle glass to silence them.

New dependencies: `node tools/slopmd/bin/slopmd.js check-dep <package>`. Exit 0: pin the exact version. Exit 1: pin it and write the one-line reason. Exit 2: stop.

## App Store copy

Do not add medical or therapeutic claims ("helps treatment", "reduces anxiety", and the same family). Keep "Not medical advice" on onboarding and in Settings. Label sample data until the catalog is live. Do not add HealthKit, analytics, or an account. The store categories stay Entertainment and Lifestyle.

## Secrets

Do not commit `.env`, `QLOO_API_KEY`, or `.qloo-cache/`. The phone never receives the Qloo key.
