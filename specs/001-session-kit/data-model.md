# Data model: Session kit

Fields match the prototype types in `src/data/types.ts` unless a server-only field is
called out. Names here are the domain names. JSON uses camelCase at the API boundary.

## TasteSeed

| Field  | Rules                                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------- |
| id     | Stable slug. Demo ids: `mira-solano`, `harbor-lights`, `paper-kite`, `salt-windowlight`, `slow-kitchen`, `sunday-engines`. |
| kind   | `movie`, `tv_show`, `podcast`, `book`, or `artist`.                                                                        |
| name   | Cultural title. Safe to send to the catalog.                                                                               |
| detail | Short line. Stays on our side.                                                                                             |

## AvoidTheme

| Field  | Rules                                                                |
| ------ | -------------------------------------------------------------------- |
| id     | `illness`, `hospitals`, `cancer`, `parent-death`, `grief`.           |
| label  | Words a visitor sees.                                                |
| detail | Short line. Not sent to the catalog as a sentence about the visitor. |

The catalog sees a tag id (`urn:tag:...`), not the theme's label as a user attribute.

## SessionDraft

| Field           | Rules                                                     |
| --------------- | --------------------------------------------------------- |
| seedIds         | One or more known taste ids.                              |
| avoidIds        | Theme ids. May be empty. Unknown ids are refused.         |
| durationMinutes | Integer in {60, 90, 120, 150, 180, 210, 240}.             |
| companionId     | Required, non-empty. Stored. The packer does not read it. |

No name, diagnosis, or medical-record field exists. Extra JSON keys are refused.

## CatalogItem

| Field           | Rules                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| id              | Our slug (`north-window` and the rest), from the fixture annotation `x-long-chair-slug`.                                                |
| qlooEntityId    | Fictional UUID on the stand-in. The id the checker excludes.                                                                            |
| kind            | From `subtype` with the `urn:entity:` prefix removed.                                                                                   |
| title           | `name`.                                                                                                                                 |
| maker           | Movie: first `production_companies` entry when it is a string. Otherwise the unconfirmed `properties.creator` when present, else empty. |
| minutes         | Movie: `properties.duration`. Other kinds: fixture duration if present, else the fallback table, always with `durationSource: assumed`. |
| durationSource  | `confirmed` or `assumed`. Server-only relative to the prototype type.                                                                   |
| rank            | Position in the returned list, starting at 1.                                                                                           |
| synopsis        | `properties.description`.                                                                                                               |
| why             | "Because you love {name}".                                                                                                              |
| becauseOf       | Taste ids. From explainability scores at or above 0.1, else the interests that were sent.                                               |
| avoidedThemeIds | Theme ids whose tag ids appear on the entity.                                                                                           |

## PackedSlot and PackedSession

| Field                  | Rules                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| itemId                 | `CatalogItem.id`.                                                     |
| startMinute, endMinute | Cursor from 0. No overlaps. End of one slot is the start of the next. |
| filledMinutes          | Sum of scheduled lengths.                                             |
| durationMinutes        | The draft's length.                                                   |
| openMinutes            | `max(0, durationMinutes - filledMinutes)`.                            |

Packing rules, copied from `src/lib/pack-session.ts`:

- Shapes by minimum length: 240 film + episode + podcast + artist + book; 180 film +
  episode + podcast; 120 episode + podcast + book; below that, podcast + book.
- A slot takes the lowest rank of that kind that matches a selected taste and fits the
  remaining minutes and the slot cap.
- Up to two extras, each at least 15 minutes, preferring more taste overlap then longer
  pieces.
- `companionId` is not an input to the packer.

## CompanionTopic

id, seedId, title, prompt. The five lines already in `src/data/companion.ts`, limited to
seeds that justify a scheduled piece. Sunday Engines is absent from the demo kit.

## NearbyPlace

id, kind (`bakery`, `kitchen`, `coffee`), name, offer, walkMinutes, openUntil, priceLabel.
The three fictional places in the prototype. Returned only when a locality and a weekday
were part of the request. The demo locality is the neighborhood `Westbridge`, weekday
`sunday`. The place is not described as a hospital.

## Session

| Field             | Rules                              |
| ----------------- | ---------------------------------- |
| id                | Server-generated. Not a person.    |
| draft             | The stored draft.                  |
| tastes and themes | Resolved from ids before planning. |

Lost on process restart. Acceptable for this slice. The demo endpoint does not need a
stored session.

## SessionKit (plan response)

Packed session, the catalog pieces that were scheduled, companion topics, nearby places,
and `source` (`fake`, `live`, or `replay`).

## State

A draft is either stored or refused. A plan is computed on request. There is no
multi-step status machine. The checker is an internal step, not a state the client polls.
