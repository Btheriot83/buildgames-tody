# IDENTITY — Tileboard (locked)

**Aesthetic name:** Bathhouse Ledger  
**Frozen:** 2026-09-14 PT after Phase A Anshu 1–8  
**Core job:** Today chore complete feels physical (clay stamp → dirt wipe → exit)

## Palette (do not re-roll)
- Linen `#f4f0e8` · chalk `#e8e2d4` · tile `#faf7f1`
- Ink `#1c2428` · ink-soft `#3a474d` · ink-mute `#6b787e`
- Sea-glass `#3d7a7a` / `#2c5c5c`
- Clay `#c45c3a` / `#a0482e`
- Moss `#4a6b52` (success only)
- Rules `#d6cec0` / `#c4b9a6`
- **Forbidden:** vibe purple `#6366f1–#8b5cf6`, neon glow, glassmorphism frost

## Type
- **Mark only:** Newsreader (`--font-display`) for household name / section titles
- **UI:** Source Sans 3
- **Meta:** IBM Plex Mono (eyebrows, pills)
- **Forbidden:** Fraunces-everywhere, Inter/Geist as default, Space Grotesk + Instrument Serif duo

## Materials
- Matte ceramic + linen (Imagine: `empty-quiet.png`, `ceramic-wash.png`, stamp-beat 1–3)
- Tile grain SVG under wash — not CSS blobs alone
- Dirt = 8 porcelain segments (Tody-like pressure), not emoji

## Motion rules
- Complete sequence: press → stamp spring → check draw → dirt wipe → dust → exit
- Tech 5 reel: `StampMotion` keyframe stills on complete (supplement transitions.dev; not a new language)
- Respect `prefers-reduced-motion`
- **Do not** replace with mascot bounce or confetti carnival

## Copy voice
- Short, specific, household-utility. Verb-first. No SaaS cheerleading.
- Examples locked: “Due now”, “What’s due. Press the clay stamp. Dirt wipes clean.”, “All clear.”

## AI
- Optional: `/api/plan` from room description (BUILD_GAMES_LLM / xAI prefer; Anthropic gateway fallback on box)
- Never fake LLM with canned “AI” strings

## What we will NOT change in Phase B
- Aesthetic name / palette / type pairing
- Clay stamp as the primary complete control
- Segmented dirt meter language
- Local-first IndexedDB core loop
- No new seed, no new world, no Dusty clone
