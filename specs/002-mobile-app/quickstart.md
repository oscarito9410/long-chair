# Quickstart: mobile app

From the repo root, after `npm install`:

```bash
npm run dev:mobile
```

That starts Expo for web on port 4181. For a device, from `apps/mobile`:

```bash
npx expo start
```

iOS export, doctor, and tests:

```bash
npm run export:ios -w @long-chair/mobile
npm run doctor -w @long-chair/mobile
npm test -w @long-chair/mobile
```

Signed builds, on a Mac:

```bash
npx eas-cli login
npx eas-cli build --platform ios --profile preview
npx eas-cli submit --platform ios --profile production
```

Leave `EXPO_PUBLIC_API_URL` unset for TestFlight and App Review. Set it to the FastAPI origin only when a server plan is intentional. Do not put a Qloo key in the app.
