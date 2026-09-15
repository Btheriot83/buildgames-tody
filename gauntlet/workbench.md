# Tileboard Gauntlet Workbench

**Identity locked:** Bathhouse Ledger (`docs/IDENTITY.md`) — no reseeding in Phase B  
**Bar:** https://todyapp.com/ · **Demo:** https://buildgames-tody.vercel.app  
**Baseline:** 3.8/10 honest · prior 8.4 discarded

Mobbin MCP: paid-plan gate 2026-09-14 PT — comps from live Tody + local shots.

## Phase A (Anshu 1–8 once)
- Discover/Define/Deliver + IDENTITY written
- Assets: empty-quiet, ceramic-wash, stamp-beat 1–3
- Physical stamp + dirt meter + AI `/api/plan`
- Shots: `gauntlet/screenshots/phaseA-today.png`

## Phase B — 5 rounds (execution only)

### Round 1 — Dirt pressure closer to Tody bars
- Piece: dirt meter fill semantics + continuous underlay
- Builder: `dirtFill` + `DirtMeter` continuous fill under segments
- Critic (screenshots only): vs `bar-todyapp.png` — segmented porcelain closer; continuous fill helps overdue read. Gap: Tody’s phone bars still more iconic as single gesture.
- Verdict: improvement on bar for dueness readability · keep identity

### Round 2 — Today hierarchy / mobile thumb zone
- Piece: list-first column order on ≤860px; larger stamp target
- Builder: `.today-list-col` / `.today-aside` order + 64px stamp
- Critic: mobile shot `phaseB-mobile.png` — Due list leads; household chrome demoted. Gap: aside still long on small screens.
- Verdict: clear win vs our baseline mobile clutter

### Round 3 — Physical complete timing
- Piece: stamp spring / wipe duration
- Builder: ChoreTile wait 260/520; StampMotion reel on `justDone`
- Critic: `phaseB-complete-motion.png` — toast + exit feel earned; reel present. Gap: wipe could sync tighter to segment extinguish.
- Verdict: core job feels more physical than clay ✓ square baseline

### Round 4 — AI room plan quality (same identity)
- Piece: `/api/plan` real LLM + PlanPanel copy
- Builder: BUILD_GAMES_LLM → xAI/OpenAI attempts; Anthropic gateway fallback; hand copy
- Smoke: local POST plan → `mode anthropic`, 8 bath-specific chores
- Critic: feature stays secondary (drawer), not hero — correct per identity
- Verdict: real AI serves job; no canned fake

### Round 5 — Anti-slop residue + wash tone
- Piece: background wash intensity; confirm ANTI_SLOP
- Builder: quieter sea radial; Newsreader mark only; backup in details
- Critic: no purple/Inter/glass/fake stats/Fraunces-everywhere in `phaseA-today.png`
- Verdict: tells cleared; still losing pure blind A/B to Tody’s native dirt UX — expected after 5 execution rounds, not a redesign

## Blind stance vs original
Original still wins overall product (FairShare/Dusty/native). Candidate wins on: local-first honesty, stamp physicality craft, hand copy, anti-slop materials. Continue only if compute remains — identity frozen.
