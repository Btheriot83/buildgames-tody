# Tileboard Gauntlet Workbench — Phase B5 INTEGRITY (R5)

**Identity locked:** Fridge Magnet Board · Quiet Enamel craft (`docs/IDENTITY.md`)  
**Bar:** https://todyapp.com/ · **Demo:** https://buildgames-tody.vercel.app  
**Job ≤3s:** Today chores → slap tomato magnet complete  
**Focus:** fonts · contrast · buttons · bar gap · flat no-gradient · dream-loop  
**Gate:** `/workspace/build-games/gauntlet/INTEGRITY_GATE.md`

Baseline: `gauntlet/shots-r5/r0-baseline.png`  
Phase A: `gauntlet/shots-r5/phaseA-after.png`  
Dream-loop: `.dream-loop/target.png` / `gauntlet/shots-r5/dream-target.png`  
Bar refs: `r0-bar-todyapp.png`

**Transitions on real actions:** toast→slap/undo/add; success-check→slap; checkbox-check→magnet; number-pop→due/streak; tabs-sliding→nav; error-state-shake→Stick chore; panel-reveal→Plan a room; skeleton-reveal→load; texts-reveal→billboard.


## r1 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r1-after-fonts.png
- verdict: Due today + chore titles punch harder toward dream-target; original still wins colorful room-grid marketing.
- commit: 29d8c09
- transitions: (none this round)

## r2 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r2-after-contrast.png
- verdict: Kraft Due cards punch harder off enamel; original mint canvas still cleaner marketing.
- commit: e532357
- transitions: (none this round)

## r3 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r3-after-buttons.png
- verdict: Tomato New chore earns weight vs Undo/Plan; original coral Get Tody still slicker marketing CTA.
- commit: 006978f
- transitions: toast already fires on magnet slap / undo / add

## r4 — bar-gap
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r4-after-bar-gap.png
- verdict: List denser like Tody chore rows; original still wins colorful room tiles.
- commit: f36b8d3
- transitions: (none)

## r5 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r5-after-contrast.png, gauntlet/shots-r5/r5-bar-todyapp.png
- verdict: Residue segments read pressure closer to Tody bars; bar marketing still wins category polish.
- commit: c93c6dc
- transitions: (none this round)

## r6 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r6-after-buttons.png
- verdict: Magnet tap targets closer to dream-target DONE discs; original uses different complete UX.
- commit: 11b6abf
- transitions: checkbox-check (.t-check) on magnet stamp

## r7 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r7-after-fonts.png
- verdict: Household mark breathes toward dream-target; Newsreader kept for identity mark only.
- commit: d8b38a1
- transitions: (none)

## r8 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r8-after-contrast.png
- verdict: Later quieter than Due kraft; Due remains the job fold (flat fills only).
- commit: ca3fb83
- transitions: (none)

## r9 — bar-gap
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r9-after-bar-gap.png
- verdict: Aside CTAs stack like dream-target; Due column owns width — closer to target priority.
- commit: e5c34d4
- transitions: panel-reveal already on Plan a room

## r10 — coherence
- files: src/app/globals.css
- shot: gauntlet/shots-r5/r10-after-coherence.png, gauntlet/shots-r5/r10-bar-todyapp.png
- verdict: Quiet Enamel chrome coheres; original todyapp.com still wins colorful room-grid marketing; candidate wins physical tomato-magnet Today job + local-first. Flat no-gradient held.
- commit: 69c1373
- transitions: toast/success-check/checkbox/number-pop/tabs/error-shake/panel-reveal/skeleton/texts-reveal wired on real actions
