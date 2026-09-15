# Tileboard Gauntlet Workbench — Phase B6 INTEGRITY (R6)

**Identity locked:** Fridge Magnet Board · Quiet Enamel craft (`docs/IDENTITY.md`) — **no reseed**  
**Bar:** https://todyapp.com/ · **Demo:** https://buildgames-tody.vercel.app  
**Job ≤3s:** Today chores → slap tomato magnet complete  
**Focus:** fonts · contrast · buttons · bar gap · flat no-gradient · dream-loop refine  
**Gate:** `/workspace/build-games/gauntlet/INTEGRITY_GATE.md`

Baseline: `gauntlet/shots-r6/r0-baseline.png` / `r0-local.png`  
Dream-loop: `.dream-loop/target.png` / `gauntlet/shots-r6/dream-target.png` (refined from local baseline via Higgsfield)  
Bar refs: `r0-bar-todyapp.png`, `r5-bar-todyapp.png`, `r10-bar-todyapp.png`

**Transitions on real actions:** toast→slap/undo/add; success-check→slap; checkbox-check→magnet; number-pop→due/streak; tabs-sliding→nav; error-state-shake→Stick chore; panel-reveal→Plan a room; skeleton-reveal→load; texts-reveal→billboard.

## r1 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r6/r1-after-fonts.png
- verdict: Due today + chore titles denser toward dream-target; original todyapp.com still wins colorful room-grid marketing.
- commit: 621abca
- transitions: (none this round)

## r2 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r6/r2-after-contrast.png
- verdict: Quiet Enamel linen + kraft slips punch harder; bar mint canvas still cleaner marketing chrome.
- commit: ae8ebab
- transitions: (none this round)

## r3 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r6/r3-after-buttons.png
- verdict: Tomato New chore earns stamp weight vs quieter Undo; original coral Get Tody still slicker marketing CTA.
- commit: fd80f9c
- transitions: toast already fires on magnet slap / undo / add

## r4 — bar-gap
- files: src/app/globals.css; src/components/BoardApp.tsx
- shot: gauntlet/shots-r6/r4-after-bar-gap.png
- verdict: COMPLETE rubber-stamp on kraft job strip closes dream gap; denser Due rows; bar still wins room-tile marketing.
- commit: 705ad8c
- transitions: (none)

## r5 — contrast (+ bar A/B)
- files: src/components/DirtMeter.tsx; src/app/globals.css
- shot: gauntlet/shots-r6/r5-after-contrast.png; gauntlet/shots-r6/r5-bar-todyapp.png
- verdict: 4-seg residue + Light/Medium/Heavy labels read closer to Tody pressure bars; bar marketing still wins category polish.
- commit: 95e0833
- transitions: (none this round)

## r6 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r6/r6-after-buttons.png
- verdict: Magnet DONE discs larger toward dream-target; original uses different complete UX.
- commit: bbd7f4f
- transitions: checkbox-check (.t-check) on magnet stamp

## r7 — fonts
- files: src/components/BoardApp.tsx; src/app/globals.css
- shot: gauntlet/shots-r6/r7-after-fonts.png
- verdict: Tileboard brand row + Newsreader household mark breathe toward dream; identity type pairing held.
- commit: b4a5d16
- transitions: texts-reveal on billboard

## r8 — contrast
- files: src/app/globals.css; gauntlet/shots-r6/dream-target.png
- shot: gauntlet/shots-r6/r8-after-contrast.png
- verdict: Cobalt flat active Today tab + quieter Later; dream-target refined from local baseline.
- commit: 1550c43
- transitions: tabs-sliding on nav

## r9 — bar-gap
- files: src/components/BoardApp.tsx; src/components/ChoreTile.tsx; src/app/globals.css
- shot: gauntlet/shots-r6/r9-after-bar-gap.png
- verdict: Overdue-by-N wording + member stamp counts + stacked aside CTAs toward dream; Due column owns width.
- commit: c3d3aa9
- transitions: panel-reveal already on Plan a room

## r10 — coherence (+ bar A/B)
- files: src/app/globals.css
- shot: gauntlet/shots-r6/r10-after-coherence.png; gauntlet/shots-r6/r10-bar-todyapp.png
- verdict: Quiet Enamel chrome coheres; original todyapp.com still wins colorful room-grid marketing; candidate wins physical tomato-magnet Today job + local-first Quiet Enamel craft. Flat no-gradient held.
- commit: 9561eba
- transitions: toast/success-check/checkbox/number-pop/tabs/error-shake/panel-reveal/skeleton/texts-reveal wired on real actions
