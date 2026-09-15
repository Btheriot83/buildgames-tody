# Tileboard onboarding — friend walkthrough

Skill: Friend walkthrough onboarding (`friend-walkthrough-onboarding`).  
Patterns studied: **Linear** (workspace *is* the onboarding; sample chores; teach by doing), **Notion** (one intent → usable first surface), **Calendly** (opinionated defaults, empty-state coach).

## Activation event

**A household with a preset chore pack applied, land on Today with real due chores ready to check.**

Everything in the deck moves toward that outcome. Feature tours are cut.

## Persist

| Key | Value |
| --- | --- |
| `tileboard.onboarded.v1` | `"1"` when complete or skipped |
| `tileboard.onboard.step.v1` | current card index while in progress |
| `tileboard.onboard.packs.v1` | JSON array of selected pack ids (optional) |

Never restart from zero mid-flow. Return visits with onboarded flag do not replay.

## Preset packs (opinionated defaults)

| Pack id | Rooms / chores |
| --- | --- |
| `kitchen` | Wipe island · Run dishwasher · Mop sticky tiles |
| `bath` | Scrub shower glass · Restock soap & TP |
| `living` | Vacuum rug · Dust shelves & frames |
| `weekly` | Desert-dust laundry · Fold & put away · Sweep garage grit |

User can multi-select. Applying packs merges rooms + chores into the local household (IndexedDB). Skip keeps the seeded Camelback list and marks onboarded.

## Copy deck (≤5) — wire exactly

Hand-written. Friend voice. Second person. One CTA per card. Skip always visible.

### Card 1 — start
- **Title:** Hey — let's get this house on a list.
- **Body:** I'll stay beside you for a minute. Skip anytime if you already know the drill.
- **CTA:** Show me the packs
- **Preview:** Empty checklist hero art

### Card 2 — packs (activation core)
- **Title:** Pick what this house needs.
- **Body:** Kitchen, bath, living, weekly reset — tap the cards you want. We'll stamp them onto Today.
- **CTA:** Stamp these on
- **Preview:** Pack image cards (multi-select)

### Card 3 — housemate
- **Title:** Who else lives here?
- **Body:** Add a name for the invite plate — or leave a placeholder and fill it later.
- **CTA:** Save housemate
- **Preview:** Letterpress avatar stamps + invite code

### Card 4 — today (activation land)
- **Title:** Today's list is ready.
- **Body:** Press a chore once to ink-check it. Shared house — switch who's checking anytime.
- **CTA:** Open Today
- **Preview:** Live mini chore row

### Card 5 — out of the way
- **Title:** You're set.
- **Body:** Assign, due dates, rooms — all on the board. I'll get out of the way.
- **CTA:** Done
- **Preview:** Soft check — no confetti

## Empty-state coach (Today)

When nothing is due:
- **Line:** Nothing due. Stamp a pack or add a chore.
- **Action:** Add a chore
- **Secondary:** Pick chore packs (re-opens pack step only if not onboarded; otherwise opens Rooms)

## Critic check

Friend or tour? Friend — each card names the next move, packs are the activation, last cards land on Today. No feature dump.

## Design craft (catalog)

- image-generation — hero + pack cards + avatar stamps
- make-it-alive — check-press + button press/hover from transitions.dev
- specify-the-look — Cool Letterpress Checklist (Newsreader / Source Sans 3 / IBM Plex Mono)
- cut-elements — one CTA, no badge chrome
- remove-ai-tells — no vibe-purple / glass / sparkle / fake stats
- hand-rewrite-copy — strings above are locked
