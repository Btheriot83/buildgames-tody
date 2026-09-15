# Tileboard Gauntlet Workbench — Phase B3 (R3)

**Identity locked:** Fridge Magnet Board (`docs/IDENTITY.md`) — no reseed  
**Bar:** https://todyapp.com/ · **Demo:** https://buildgames-tody.vercel.app  
**Job ≤3s:** Today chores → slap magnet stamp complete  
**Focus:** fonts · contrast · buttons · close A/B vs live Tody · flat no-gradient

## Bar A/B refs
- `gauntlet/screenshots/r3-bar-todyapp.png` — marketing hero, sans hierarchy, coral CTA, room tiles + overdue bars
- `gauntlet/screenshots/r3-bar-method.png` — method strip / list density
- Baseline demo: `r3-demo-baseline.png` · After: `r3-after-home.png`, `r3-after-loop.png`, `r3-after-mobile.png`

## Phase B3 — 20 rounds (execution under locked Fridge Magnet Board)

### Round 1 — Type hierarchy (Newsreader = mark only)
- Piece: job-verb + Due today used Newsreader → AI display feel vs Tody’s clean sans
- Builder: `.job-verb` + `.section-title` → Source Sans 700; Newsreader kept on household mark only
- Critic (A/B vs bar): closer to Tody headline craft; mark still Fridge Magnet. Gap: mark size still large on desktop.
- Verdict: keep · visible type shift

### Round 2 — Source Sans weight ladder
- Piece: default Next font load skimmed weights → soft hierarchy
- Builder: layout loads 400/500/600/700; body 400, titles 700, meta 500
- Critic: titles punch; meta readable. Gap: none blocking.
- Verdict: keep

### Round 3 — Billboard clamp (anti display-gimmick)
- Piece: clamp(2.4–3.6rem) household name screamed poster
- Builder: clamp(2–2.85rem), tighter line-height; mobile clamp down further
- Critic: still ≤3s household read without drowning Due list. Gap: ok.
- Verdict: keep

### Round 4 — Kill teal leftovers (contrast)
- Piece: `::selection` + `.status-due` used bathhouse teal rgba(61,122,122) against cobalt sea
- Builder: cobalt rgba(47,95,158); due pill font-weight 700
- Critic: no washed teal/cobalt clash. Gap: none.
- Verdict: keep · anti-slop

### Round 5 — Ink mute / rule darken
- Piece: `#6a7580` meta washed on kraft; soft rules
- Builder: `--ink-mute #4f5a64`, `--ink-soft #2e3842`, stronger `--rule-strong`
- Critic: meta holds on kraft cards vs enamel. Gap: ok.
- Verdict: keep

### Round 6 — Button weight system
- Piece: Undo / New chore / Plan all ghost → no CTA hierarchy (Tody’s coral CTA earns weight)
- Builder: New chore = `btn-clay` + ink border + hard shadow; Plan = `btn-primary`; Undo = ink-border ghost
- Critic (`r3-after-home`): tomato/cobalt/ghost triad readable in ≤3s. Gap: none.
- Verdict: biggest button win

### Round 7 — Tomato magnet DONE microtype
- Piece: DONE at 0.42rem unread; idle check too faint
- Builder: DONE 0.55rem; idle check opacity 0.55; magnet 62px (70 mobile)
- Critic: stamp affordance clearer vs bar tap targets. Gap: ok.
- Verdict: keep

### Round 8 — Chore title density
- Piece: titles soft vs Tody room-task list bold
- Builder: `.chore-title` 1.1rem / 700 / slight negative tracking; meta ink-soft 500
- Critic: list reads chore-first like bar phone mock. Gap: ok.
- Verdict: keep

### Round 9 — Overdue wording close to Tody
- Piece: `6d late` cryptic vs bar “5 days overdue”
- Builder: ChoreTile → `N days overdue` / `Due today`; overdue pill `#fde8e4` / `#8f1f16`
- Critic: A/B language closer; contrast holds. Gap: long pill wraps on tiny phones — acceptable.
- Verdict: keep

### Round 10 — Dirt meter contrast
- Piece: off segments washed; fill opacity muddy
- Builder: darker off-state; on-state solid clay/mustard/moss; fill opacity dialed down so segments lead
- Critic: residue pressure readable like Tody bars without copying gradients. Gap: ok.
- Verdict: keep · flat

### Round 11 — Job strip leads materials
- Piece: fridge plate + magnet rail sat above job strip (R2 residual)
- Builder: DOM reorder — job-strip then compact materials; plate max-height 72px
- Critic: job verb first; materials secondary. Gap: materials still on desktop — intentional craft cue.
- Verdict: keep

### Round 12 — Later section contrast
- Piece: Later tiles soft white-on-enamel
- Builder: `.later-card` kraft-lite + ink border + titled weight 650
- Critic: Later no longer disappears. Gap: ok.
- Verdict: keep

### Round 13 — Tabs craft
- Piece: chalk tabs low-contrast vs Tody segmented clarity
- Builder: ink border on `.t-tabs`, active pill ink border + hard offset shadow; tab weight 650
- Critic: Today/Rooms/History/Stuff state obvious. Gap: ok.
- Verdict: keep

### Round 14 — Field contrast
- Piece: cream fields blended into enamel
- Builder: white fields, 1.5px rule-strong, focus sea ring
- Critic: Add member / Acting as readable. Gap: none.
- Verdict: keep

### Round 15 — Job strip kraft punch
- Piece: kraft strip washed vs enamel photo
- Builder: `#f6e4c8` fill, 2.5px ink, clay offset; hint ink-soft 500
- Critic: strip is hero chrome after tabs. Gap: ok.
- Verdict: keep

### Round 16 — Aside CTA row
- Piece: Add member ghost; action row equal-weight mush
- Builder: Add = `btn-primary btn-compact`; `.aside-actions` flex with clay/primary/ghost roles
- Critic (`r3-after-home`): New chore tomato + Plan cobalt earn weight. Gap: none.
- Verdict: keep

### Round 17 — Rooms / History titles sans
- Piece: room + history heads still display serif
- Builder: `.room-title` + `.section-title` Source Sans; Shared history / Stuff follow
- Critic: UI coherent sans; only household mark serifs. Gap: ok.
- Verdict: keep

### Round 18 — Flat hard bar reaffirm
- Piece: Brandon Inkwell gradient veto
- Builder: decorative gradient kill selectors; skel flat chalk; toast/blur tokens 0; WaterShader unused
- Critic: `linear/radial/conic` only appear in kill rules. Gap: none.
- Verdict: pass hard bar

### Round 19 — Mobile type + magnet
- Piece: mobile density vs Tody phone mock tap size
- Builder: magnet 70px; Due title 1.15rem; materials-row hidden ≤860px; job strip first
- Critic (`r3-after-mobile`): Due + magnets own fold; overdue pills readable. Gap: long overdue string wraps — ok.
- Verdict: keep

### Round 20 — Coherence + blind stance
- Piece: smoothing after 1–19
- Builder: assignee chip sea-deep 700; eyebrow sea-deep; tile ink borders; footer voice unchanged
- Critic blind vs bar: original still wins native multi-room color tiles + marketing polish; candidate wins local-first magnet job, overdue wording parity, CTA weight, type contrast, flat kraft craft.
- Verdict: B3 complete under Fridge Magnet Board · identity frozen

## Blind stance vs original (end of B3)
Original (todyapp.com) still wins category polish and colorful room grid. Candidate closed craft gaps on type hierarchy, overdue language, button weight, and contrast while staying Fridge Magnet Board + flat. No reseed.

## Visible deltas (≤3s vs R2 live)
1. Job strip before materials; sans job verb
2. New chore tomato / Plan cobalt / Undo ghost triad
3. `N days overdue` pills (Tody-like)
4. Stronger ink borders + tab pill contrast
5. Larger DONE magnet label + darker meta ink
