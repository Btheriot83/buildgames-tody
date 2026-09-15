# Define — Tileboard / Cool Letterpress Checklist

Sources: catalog `/data/techniques/*.json` + `prompts.json` · 2026-09-15 ~12:40 AM PT

## Technique 10 — specify-the-look (prompts.json)

Catalog prompt pattern applied; **picked** pairing (not default aesthetic):

- Fonts: Newsreader (display) / Source Sans 3 (UI) / IBM Plex Mono (folio meta)
- Colors: paper `#FAF9F7`, chalk `#F0EEEA`, ink `#221C24`, slate `#3D4F63`, done `#3F5A4A`, rule `#D4D0C8`
- Mood: Quiet Folio desk + physical checklist — cool-plain materials

Rejected: (A) tomato kraft neo-brutal (B) Tody mint coral room grid (C) warm linen brass

## Technique 04 — image-generation

Catalog ask: enrich with image generation; verify in browser. Used Higgsfield `gpt_image_2_5` (local MCP; keys not shipped).

| Asset | Path |
|-------|------|
| Letterpress paper wash | `public/art/letterpress-paper.png` |
| Empty checklist | `public/art/empty-checklist.png` |
| Press beat 1–3 | `public/art/press-beat-{1,2,3}.png` |

Body uses flat paper fill + soft photo wash at low opacity (not decorative gradient chrome).

## Technique 05 — video-motion

Catalog video prompts target fal.ai crystal/suitcase demos. **Documented fallback for chore complete:** keyframe still reel (`StampMotion` press-beat 1→2→3) + CSS check-press / residue wipe on real complete action; `prefers-reduced-motion` honored. transitions.dev on toast/tabs/check. Full fal video pass deferred — stills serve stamp complete without decorative loop spam.

## Technique 03 — critic-subagents

Catalog critic procedure (`critic-subagents` index 1) — screenshot only, fresh context, studio bar, score /10. Stop rule ≥9 lives with implementer, **not** in critic prompt.

Shots: `gauntlet/shots-beat/phaseA-home.png`, `gauntlet/shots-beat/bar-todyapp.png`, later `beatN-*.png`.

Critic rounds logged below after independent LLM calls (image-only).


## Critic log (Technique 03)

### Infrastructure
- Direct vision via `ANTHROPIC_BASE_URL` (z.ai/glm) **failed**: first call hallucinated unrelated dark-mode agency site; second reported it cannot fetch hosted image URLs. Documented in `gauntlet/shots-beat/critic-A1.txt`.
- Builder does not self-grade as studio score. Shots remain under `gauntlet/shots-beat/` for an independent critic pass.

### Observed gaps closed in beats (screenshot-driven, not self-score)
- Blank idle checks (`t-check` dash hide) → visible ink check (beat4)
- Deckle photo wash AI-paste → flat paper + optional grain (beat1/9)
- Soft shadows / clay tomato → flat ink letterpress (beat1/6)
- Job strip / due heading collision → spacing (beat9)
- Member accent rainbow → muted ink dots (beat9)

### Vs Tody bar
Bar shot: `gauntlet/shots-beat/bar-todyapp.png` (mint marketing + red/orange overdue scream + colorful room tiles).
Candidate: cool-plain letterpress checklist — different aesthetic, aiming higher craft restraint. Phase B continues until independent critic says WIN.
