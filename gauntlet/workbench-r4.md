# Tileboard Gauntlet Workbench — Phase B4 INTEGRITY (R4)

**Identity locked:** Fridge Magnet Board (`docs/IDENTITY.md`) — no reseed  
**Bar:** https://todyapp.com/ · **Demo:** https://buildgames-tody.vercel.app  
**Job ≤3s:** Today chores → slap magnet stamp complete  
**Focus:** fonts · contrast · buttons · bar gap · flat no-gradient  
**Gate:** `/workspace/build-games/gauntlet/INTEGRITY_GATE.md`

Baseline: `gauntlet/shots-r4/r0-baseline.png`  
Bar refs: `r0-bar-todyapp.png`, `r0-bar-method.png`

**Dream-loop:** `.dream-loop/target.png` (also `gauntlet/shots-r4/dream-target.png`) — refined from live baseline; identity Newsreader mark kept.  
**Transitions on real actions:** toast→slap/undo/add; success-check→slap; checkbox-check→magnet; number-pop→due/streak; tabs-sliding→nav; error-state-shake→Stick chore; panel-reveal→Plan a room; skeleton-reveal→load; texts-reveal/stagger→billboard.



## r1 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r1-after-fonts.png
- verdict: Due today header heavier/larger vs baseline; original still wins colorful room grid polish.
- commit: bee9b45
- transitions: (none this round)


## r2 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r2-after-contrast.png
- verdict: Kraft Due cards punch harder off enamel; original still cleaner mint marketing canvas.
- commit: 630fb5b
- transitions: (none this round)

## r3 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r3-after-buttons.png
- verdict: Tomato New chore earns weight vs Plan/Undo; original coral CTA still slicker marketing.
- commit: e24e6b3
- transitions: toast already fires on magnet slap / undo / add

## r4 — bar-gap
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r4-after-bar-gap.png
- verdict: List denser like Tody rows; original still wins colorful room tiles.
- commit: 8b8b38d
- transitions: (none)

## r5 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r5-after-contrast.png, gauntlet/shots-r4/r5-bar-todyapp.png
- verdict: Overdue pills hotter/clearer vs live; bar marketing still wins category polish.
- commit: c44e296
- transitions: (none this round)

## r6 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r6-after-buttons.png
- verdict: Magnet tap targets closer to dream-target DONE discs; original uses different complete UX.
- commit: 8576254
- transitions: checkbox-check (.t-check) on magnet stamp

## r7 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r7-after-fonts.png
- verdict: Titles punch chore-first toward target; original still wins colorful room chrome.
- commit: cdccea0
- transitions: (none)

## r8 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r8-after-contrast.png
- verdict: Residue segments read pressure like Tody bars; flat fills only.
- commit: 591f1cc
- transitions: (none)

## r9 — bar-gap
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r9-after-bar-gap.png
- verdict: Materials demoted so Due owns fold — closer to dream-target priority.
- commit: 06bd127
- transitions: (none)

## r10 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r10-after-fonts.png, gauntlet/shots-r4/r10-bar-todyapp.png
- verdict: Job verb louder utility; original hero marketing type still wins landing.
- commit: 1b996b4
- transitions: number-pop-in on due count + streak

## r11 — buttons
- files: src/app/globals.css, src/components/BoardApp.tsx
- shot: gauntlet/shots-r4/r11-after-buttons.png
- verdict: Stick chore CTA + error shake wired on empty title; original has no fridge form.
- commit: 0df0b86
- transitions: error-state-shake (.t-input-wrap.is-error / .is-shaking) on Stick chore validation

## r12 — bar-gap
- files: src/app/globals.css, src/components/PlanPanel.tsx
- shot: gauntlet/shots-r4/r12-after-bar-gap.png
- verdict: Plan opens as kraft panel (panel-reveal); original has no AI plan sheet.
- commit: 07d83fd
- transitions: panel-reveal (.t-panel-slide data-open) on Plan a room

## r13 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r13-after-contrast.png
- verdict: Tab pill harder ink edge toward target; original uses soft iOS segments.
- commit: 1aaf9a1
- transitions: tabs-sliding (.t-tabs / .t-tabs-pill) on Today/Rooms/History/Stuff

## r14 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r14-after-fonts.png
- verdict: Meta line mono utility closer to Tody density labels; mark stays Newsreader.
- commit: a7762ea
- transitions: (none)

## r15 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r15-after-buttons.png, gauntlet/shots-r4/r15-bar-todyapp.png
- verdict: CTA triad matches dream-target weight better; original coral Get Tody still category winner.
- commit: 2982797
- transitions: toast on Undo / New chore / Plan accept

## r16 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r16-after-contrast.png
- verdict: Later quieter than Due kraft; Due remains the job fold.
- commit: f270963
- transitions: texts-reveal / stagger already on household billboard load

## r17 — bar-gap
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r17-after-bar-gap.png
- verdict: Room tiles stay flat kraft/enamel (no color mesh); original still wins multi-hue room grid.
- commit: 2219d87
- transitions: (none)

## r18 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r18-after-fonts.png
- verdict: Mark size closer to dream-target without abandoning Newsreader identity.
- commit: 13b9df7
- transitions: (none)

## r19 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r19-after-contrast.png
- verdict: Chrome tape/streak contrast holds; success-check still fires beside streak on slap.
- commit: 980c220
- transitions: success-check (.t-success-check) on magnet slap; skeleton-reveal on board load

## r20 — bar-gap
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r20-after-bar-gap.png, gauntlet/shots-r4/r20-bar-todyapp.png
- verdict: Live closer to dream-target density/CTA/type; original still wins colorful room marketing polish. Fridge Magnet Board locked.
- commit: 93b6b18
- transitions: toast + success-check + checkbox-check + number-pop + tabs-sliding + error-shake + panel-reveal on real actions

## r21 — beauty-shadow
- files: src/app/globals.css, gauntlet/workbench-r4.md
- shot: gauntlet/shots-r4/r21-after-beauty-shadow.png
- verdict: Quieter ink offsets kill comic-brutalist loudness; original still smoother marketing polish.
- commit: 6285d1d
- transitions: (none)

## r22 — beauty-magnet
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r22-after-beauty-magnet.png
- verdict: Magnet reads as enamel disc (inset rings, flat fills); closer to dream slap affordance vs bar list checkboxes.
- commit: bfe3ed0
- transitions: (none)

## r23 — beauty-type
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r23-after-beauty-type.png
- verdict: Type less scream-y; chore titles breathe like Tody list craft while mark stays Newsreader.
- commit: 5059867
- transitions: (none)
