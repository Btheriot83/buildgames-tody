# Tileboard — Tody replacement (Build Games)

Personal replacement for **Tody**: schedule household chores by flexible frequency, show a neutral shared history, share/print a plan, keep data portable and owner-controlled.

**Aesthetic:** *Tide & Tile* — ceramic bathhouse chore board; sea-glass `#3d7a7a` + clay `#c45c3a` on linen; Fraunces + Source Sans 3 + IBM Plex Mono; WebGL water ripple; streak rings; transitions.dev motion on real actions.

## Stack

- Next.js 15 + TypeScript + Tailwind
- **IndexedDB-first** core loop (`src/lib/local-board.ts`) — works on Vercel with zero native deps
- SQLite via **sql.js** optional server APIs (wasm in `public/` + tracing + CDN fallback); optional `better-sqlite3` locally
- Drizzle schema (`src/lib/schema.ts`) mirrored by migrate SQL
- PWA manifest; export/import JSON + CSV
- [transitions.dev](https://transitions.dev) free recipes wired into UX

## One command

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm test` | Unit tests (frequency + household) |
| `npm run test:e2e` | Playwright core loop |
| `npm run build` / `npm start` | Production |
| `npm run db:reset` | Delete local SQLite files |

## Architecture

- `src/lib/frequency.ts` — due dates, urgency sort, streaks (tested)
- `src/lib/household.ts` — seed, board snapshot, complete/undo, export
- `src/lib/db.ts` — sql.js on `VERCEL=1`; better-sqlite3 optional locally
- `src/components/BoardApp.tsx` — mobile-first board UI + transitions
- `src/app/print` — printable plan
- API routes under `src/app/api/*`

## Permissions / privacy

- No accounts, billing, telemetry, or hosted control plane
- Secrets only in `.env` (see `.env.example`)
- Every completion attributable; undo supported
- Private chores visible to creator/assignee

## Data location & backup

- Local DB: `./data/tileboard.db` (or `/tmp/tileboard.db` on Vercel)
- Browser: IndexedDB snapshot (`tileboard-idb`) for offline
- **Export** JSON household backup or CSV chore list from the board
- **Import** JSON to restore
- Photos: size-capped attachments supported in schema (`MAX_PHOTO_BYTES` ~1.5MB)

## Core loop

1. Open board (sample household seeds on first run)
2. Act as a member → tap clay ✓ on a due chore
3. Streak updates; toast + success check confirm
4. History tab shows neutral shared log
5. Print plan / Export JSON for portability

## Deliberately left out

- Retailer ordering / product catalogs
- Broad smart-home integrations
- Large public recipe libraries / native mobile clients

## Design notes (Lenny / Anshu)

Discover seed → Define *Tide & Tile* → Deliver polish + critic vs live Tody. See `docs/CRITIC.md`, `docs/LENNY.md`. Anti-slop: no vibe-purple, Inter, 3-card grids, or fake stats.
