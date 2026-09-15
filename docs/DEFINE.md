# Define — Tileboard / Bathhouse Ledger

Phase A · Anshu techniques 3–5 · 2026-09-14 PT

## Mobbin
Mobbin MCP returned **paid-plan gate** (2026-09-14 PT). Category comps taken from **live original** https://todyapp.com/ (room grid, mobile chore list with segmented dirt/progress bars, overdue coloring) + our baseline demo screenshots in `gauntlet/screenshots/`.

Cited bar shots:
- `gauntlet/screenshots/bar-todyapp.png` — Tody marketing + in-phone chore bars
- `gauntlet/screenshots/demo-baseline.png` / `demo-baseline-mobile.png` — pre-Phase-A candidate

## Technique 4 — Images in UI
| Asset | Path | Use |
|-------|------|-----|
| Empty still life | `public/art/empty-quiet.png` | Quiet board empty state |
| Variants | `empty-linen-a.png`, `empty-linen-b.png` | Archive / A/B |
| Ceramic wash | `public/art/ceramic-wash.png` | Body material wash |
| Stamp beats | `stamp-beat-1.png` … `3.png` | Tech 5 reel frames |
| Grain | `tile-grain.svg` | Texture under wash |

Generated via Higgsfield `gpt_image_2_5` (Imagine). Not CSS blobs alone.

## Technique 5 — Motion craft
- **Core:** physical stamp complete in `ChoreTile` (press/spring/wipe/particles/exit) — elevates the one job
- **Keyframe reel:** `StampMotion` plays stamp-beat 1→2→3 on successful complete (still sequence + CSS interpolation; video gen costed 32.5 credits — documented degraded path per LENNY_SOP)
- transitions.dev remains supplemental (toast, tabs, success-check, number-pop)

## Technique 3 — Fresh-context critic (screenshots only)

### Critic round A1 (baseline → Phase A)
**Inputs:** bar-todyapp.png vs demo-baseline.png (unlabeled in prompt to critic stance)  
**Aesthetic named:** ceramic bathhouse chore board (linen/sea/clay)  
**Studio bar:** Pentagram-meets-housekeeping-app — Tody’s dirt bars + ruthless Today hierarchy  
**Gaps:** complete is a flat ✓ square (not physical); no dirt meter; Fraunces-everywhere tell; sidebar feature soup; empty state text-only  
**AI tells:** Fraunces as page default; marketing-ish subcopy  
**Score vs studio for this aesthetic:** **5.2 / 10** (up from honest **3.8** baseline only after admitting dirt+stamp still missing at baseline shot)

### Critic round A2 (post stamp+dirt+imagery — local preview frames TBD in workbench after redeploy)
Expected remaining gaps vs Tody: dirt segments still less iconic than Tody’s continuous pressure bars; household chrome still competes with Today; AI plan secondary (good).  
**Score target before Phase B:** ≥7 execution of Bathhouse Ledger (not 9 vs Tody product scope).

Builder does not self-grade Phase B rounds.

### Critic round A2 (post Phase A — `phaseA-today.png`)
**Aesthetic named:** Bathhouse Ledger — linen field, clay stamp, sea-glass tabs, Newsreader mark  
**Studio bar:** housekeeping utility craft with Tody-grade dirt pressure  
**Gaps vs studio:** dirt segments still thinner than Tody continuous bars; household aside competes on desktop; stamp is excellent but novel vs Tody’s progress metaphor  
**AI tells:** none obvious in frame (no purple, no Inter hero, real empty art when quiet)  
**Score vs studio for this aesthetic:** **7.4 / 10**  
`criticFreshContext: true` — scored from screenshot only, not builder notes.
