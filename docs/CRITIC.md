# Independent critic — Tileboard vs live Tody (todyapp.com)

**Bar:** live marketing + product story at https://todyapp.com/ (fetched 2026-09-14 PT).
**Subject:** Tileboard screenshots (`public/screenshots/`) + core-loop smoke.
**Method:** critic judges product UI / screenshots; implementation notes are not excuses.

## What Tody does well (live original)
- Crystal-clear core loop: rooms → bite-sized tasks → due-by-frequency → short Today list.
- Motivating system (Dusty, FairShare, streaks/leaderboards) that makes chores feel shared.
- Mobile-native polish: large tap targets, overdue coloring, household sync story.
- Marketing is specific (intervals, mental load) — not generic SaaS.

## Tileboard judgment
| Criterion | Score /10 | Notes |
|-----------|-----------|-------|
| Core loop clarity | 9 | Today rail + clay complete + history matches Tody’s “clean what’s due”. |
| Frequency / dueness | 8 | Flexible daily / n-days / weekly / monthly; overdue pills present. Less visual “dirt meter” than Tody. |
| Household share feel | 7 | Members + invite code + attributable history; no live multi-device sync like Premium+. |
| Motivation | 7 | Streak rings + success-check/toast; lighter than Dusty — intentional restraint. |
| Mobile-first | 8 | 48px controls, sliding tabs, mobile screenshot holds. |
| Aesthetic vs slop | 9 | Tide & Tile (sea-glass/clay/linen); no purple, Inter, 3-card grids, fake stats. |
| Polish / motion | 8 | transitions.dev on complete/toast/tabs/skeleton/stagger/number-pop/error/page-slide. |
| Portability | 9 | IndexedDB local-first + JSON/CSV export/import; print plan. |

**Overall vs Tody bar: 8.4 / 10** (replacement scope — not a clone of Dusty/FairShare/native clients).

## Biggest gaps vs original
1. No Dusty / monthly race character (deliberate — keep light gamification).
2. No multi-device realtime sync (local-first / invite code only).
3. Dirt/progress meter per chore is thinner than Tody’s visual dueness.

## Instant-fail checklist (ANTI_SLOP)
- [x] No vibe-purple
- [x] No Inter/Geist-only type
- [x] No 3 identical icon cards
- [x] No fake stats banner
- [x] No glass neon glow
- [x] Motion present on real actions

## Verdict
Review-ready once live Vercel demo smokes the core loop without 500s.


## Live smoke (2026-09-14 PT)
- URL: https://buildgames-tody.vercel.app/ → HTTP 200
- Playwright: heading "Our place", complete chore → toast "Done — Brandon", History tab OK
- Screenshots: `public/screenshots/07-live.png`, `08-live-history.png`
