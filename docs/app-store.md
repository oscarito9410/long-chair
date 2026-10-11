# App Store notes for Long Chair

Long Chair is company and entertainment for a long session. It is not a medical device, not medical advice, and not a health product.

## Listing

| Field              | Value                        |
| ------------------ | ---------------------------- |
| Name               | Long Chair                   |
| Bundle ID          | `com.oscarito9410.longchair` |
| Primary category   | Entertainment                |
| Secondary category | Lifestyle                    |
| Never use          | Medical, Health & Fitness    |

Do not file the app under Medical or Health & Fitness. Do not add a HealthKit entitlement. Do not read or write diagnosis, treatment, or HealthKit data.

## Review notes

Paste this into App Store Connect review notes:

```text
Long Chair is an entertainment app. It builds a sample playlist of fictional films, episodes, podcasts, books, and music for a long session, plus a short plan for the person sitting nearby.

It is not a medical device. It does not diagnose, treat, or give advice. Onboarding and Settings both say "Not medical advice."

The theme filter is a content preference, like hiding topics in any other media app. Those preferences stay on the device. This build does not send them to a server.

The shelf is fictional sample data, and the screens say so. There is no account and no sign-in. The app works with no network. We do not use analytics SDKs. Privacy nutrition label: Data Not Collected.

No HealthKit capability is enabled. Encryption is only the OS default (ITSAppUsesNonExemptEncryption is false).

To try it: open the app, tap "See a sample kit", then Kit, Companion, and Compare. Settings repeats the sample label and the disclaimer.
```

## Privacy nutrition label

Answer: Data Not Collected.

| Question       | Answer                               |
| -------------- | ------------------------------------ |
| Data collected | None                                 |
| Tracking       | No                                   |
| Account        | None. The app works without sign-in. |
| Diagnostics    | Not collected                        |
| Identifiers    | Not collected                        |
| Health         | Not collected. No HealthKit.         |
| Contact info   | Not collected                        |

The review build does not set `EXPO_PUBLIC_API_URL`. Planning stays on the device. A later build that calls our API would need a new label before it ships. That call would send content-tag ids only, never a name, a diagnosis, or a treatment. The Qloo key stays on the server and is not in the binary.

The privacy manifest sets `NSPrivacyTracking` false, an empty collected-data list, and an empty accessed-API list.

## Description

```text
Long Chair keeps you company through a long session.

Name a few films, shows, books, podcasts, or records you love, how long you have, and which themes should stay out of the room. Long Chair lays out a kit that fits that time, says why each piece was kept, and offers a few things to talk about with the person beside you.

This version is a fictional sample shelf. Nothing is sent. It is not medical advice.
```

## Keywords

```text
session,playlist,company,films,podcasts,books,long afternoon,entertainment
```

Do not use keywords that promise treatment, anxiety relief, or a clinical outcome.

## Age rating questionnaire draft

Answer toward the lowest rating the sample shelf supports. The shelf is fictional and has no user accounts.

| Question                         | Draft answer                                                                                                                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cartoon or fantasy violence      | None                                                                                                                                                                                      |
| Realistic violence               | None                                                                                                                                                                                      |
| Sexual content or nudity         | None                                                                                                                                                                                      |
| Profanity or crude humor         | None                                                                                                                                                                                      |
| Alcohol, tobacco, or drug use    | None                                                                                                                                                                                      |
| Mature or suggestive themes      | Infrequent or mild. The content filter exists so a person can leave illness, hospitals, cancer, grief, and the death of a parent out of the room. Those are topic labels, not depictions. |
| Horror or fear                   | None                                                                                                                                                                                      |
| Gambling                         | None                                                                                                                                                                                      |
| Medical or treatment information | None. The app does not provide medical information.                                                                                                                                       |
| Unrestricted web access          | No                                                                                                                                                                                        |
| User-generated content           | No                                                                                                                                                                                        |
| Messaging or chat                | No                                                                                                                                                                                        |
| Advertising                      | No                                                                                                                                                                                        |

If App Review asks about the theme list, point at the review notes: it is a content preference, stored on device, and the app makes no medical claim.

## Screenshot list

Capture on an iPhone-size frame, portrait, cream background. Suggested set for the 6.7 inch and 6.1 inch slots:

1. Welcome, with the sample label and "Not medical advice".
2. Tastes, one or two titles selected.
3. Session length.
4. Themes left out of the room.
5. Company, one guide selected.
6. Building the kit.
7. Ready stamp.
8. Session kit timeline.
9. Piece detail sheet.
10. Companion plan.
11. Plain-model contrast.
12. Settings, with the disclaimer and the on-device note.

## Copy rules

In-app copy must not claim treatment, therapy, or a health outcome. A unit test scans `apps/mobile` and fails if phrases such as "helps treatment" or "reduces anxiety" appear outside the checker itself. "Not medical advice" stays on the welcome flow and on Settings.

## What Oscar runs on a Mac

The signed build cannot be produced from this Linux workspace.

```bash
npm install
npx eas-cli login
npx eas-cli build --platform ios --profile preview
npx eas-cli submit --platform ios --profile production
```

Use `--profile production` for the App Store build. `eas.json` auto-increments the iOS build number for development, preview, and production. Apple credentials and the App Store Connect app record are Oscar's. Leave `EXPO_PUBLIC_API_URL` unset for the review build.
