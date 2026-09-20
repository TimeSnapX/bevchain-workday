# BevChain Work Day

Mobile-first static checklists for TimeSnap (BevChain / Linfox HR driver, Brisbane). Offline-friendly, no backend. Checks and notes persist in `localStorage`.

## Run locally

```bash
cd bevchain-workday
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173/bevchain-workday/`).

```bash
npm run build    # outputs dist/
npm run preview  # preview production build
```

## Edit checklists

**One data file:** `src/data/checklists.json`

(Also mirrored at the project root as `starter-checklists.json` — keep them in sync, or copy root → `src/data/` after edits.)

Structure includes:

- `workDayShape` — wake / start / finish / phases
- `dayBaseline` — shared every-work-day steps (pre-departure, on site, driving hours)
- `sharedEveryJob` — always-do items on every job
- `jobTypes` — EPJ, Hand Unload, Kegs (and any you add)

Kegs stay tagged `status: "not-started"` with a “Still learning” badge until you fill them in with your trainer.

Australian English. Starter drafts — refine with trainer / real sites.

## Deploy to GitHub Pages

Default Vite `base` is `/bevchain-workday/` (project site).

**Project site** (`https://USER.github.io/bevchain-workday/`):

1. Push this folder to a repo named `bevchain-workday` (or set Pages to serve from `dist` / GitHub Actions).
2. Build with the default base:
   ```bash
   npm run build
   ```
3. Publish the `dist/` folder (Settings → Pages → Deploy from branch/`gh-pages`, or upload `dist`).

**User / org site** (root `https://USER.github.io/`):

```bash
VITE_BASE=/ npm run build
```

Or change `base` in `vite.config.ts` to `'/'`.

The app uses `HashRouter`, so routing works on GitHub Pages without a custom 404 rewrite.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Serve `dist/` locally |

## Notes

- Checks key: `bevchain-checks:YYYY-MM-DD:…` (day baseline, every-job, and per job).
- Notes key: `bevchain-notes:<jobId>` (persists across days).
- Use **Reset today's checks** on a page to clear that page’s items for the local date.
