# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo currently contains a single project: `str-compliance-checker/`. All commands below assume that directory as the working directory.

## Commands

```bash
npm run dev            # runs API (tsx watch, :3001) and Vite client (:5173) concurrently, with /api proxied to the API
npm run dev:server     # API only
npm run dev:client     # Vite client only
npm run build           # tsc -b && vite build -> dist/ (frontend)
npm run build:server    # tsc -p server/tsconfig.json -> dist/server (backend)
npm run start           # node dist/server/index.js (serves API + built frontend from dist/, production mode)
npm run lint             # eslint .
npm run preview          # vite preview (serve built frontend only)
npm run db:seed          # tsx server/db/seed.ts — (re)seed the SQLite DB with the hardcoded city/rule data
npm run db:scrape        # tsx server/scrapers/runner.ts — seed then run all city scrapers once, standalone
```

There is no test suite in this repo currently.

To reset local data, delete `data/str.db*` (WAL files included) and re-run `npm run dev` or `npm run db:seed`.

## Architecture

This is a single full-stack TypeScript app: an Express API backed by SQLite (better-sqlite3), and a React 19 + Vite + Tailwind v4 frontend. It answers one question — "can I legally run a short-term rental at this address?" — by combining hardcoded/scraped per-city regulation data with a small rules engine.

### Request flow

`AddressStep` (geocode an address via `/api/geocode`, which calls the Census geocoder and matches it to a city in the DB) → `QuestionStep` (dynamic questionnaire built per-city by `src/data/questions.ts`) → `POST /api/compliance` runs `server/compliance/engine.ts` → `ResultsStep` renders the `ComplianceResult`.

`src/App.tsx` is a single-page step machine (`'address' | 'questions' | 'results'`) with no router; `react-router-dom` is a dependency but unused so far.

### Server (`server/`)

- `index.ts` — real Node entrypoint (used by `npm run dev:server` / `npm start`). Ensures `data/` exists, inits + seeds the DB, builds the app, serves `dist/` statically in production, and kicks off a scraper run 2s after boot (`SCRAPE_ON_STARTUP`, default on).
- `app.ts` — `createApp()` builds the Express app: cors, compression, JSON body parsing, a rate limiter on all `/api` routes (200 req/15min), and mounts the routers. Exported separately from `index.ts` so it can be reused by the Vercel serverless entrypoint without the Node-only bootstrap (listen, signal handlers, static file serving).
- `db/index.ts` — `getDb()` is a lazy singleton around better-sqlite3. DB path: `:memory:` when `process.env.VERCEL` is set (serverless — no persistent disk, so the DB is reseeded fresh on every cold start), else `DB_PATH` env var or `data/str.db`. Applies `server/db/schema.sql` on every open (`CREATE TABLE IF NOT EXISTS`, so it's idempotent). `rowToCity()` is the one place that maps a raw SQLite row (JSON-encoded array columns, 0/1 booleans) into the camelCase API shape — always go through it rather than hand-rolling row → API conversions.
- `db/seed.ts` — hardcoded source of truth for all 12 supported cities and their regulation rules (`CITIES` / `RULES` arrays). Upserting a city preserves any scraped fields (`WHERE cities.scrape_status = 'seeded'` guard) — seeding never clobbers live-scraped data.
- `db/schema.sql` — `cities`, `regulation_rules` (FK → cities, cascade delete), `scrape_log`, `users`.
- `compliance/engine.ts` — `runComplianceEngine(cityRow, ruleRows, answers)` is the core business logic: a straight-line sequence of independent rule checks (primary residence, renters, host presence, day limits, guest/bedroom caps, insurance, permit, plus several city-specific special cases like Miami/Nashville zoning, NYC door locks, Seattle's 2-unit cap, DC's 30-night cap) that each push a `ComplianceRule` and tally `pass`/`warning`/`fail`. Score and `overallStatus` are derived at the end from those tallies. When adding a new rule or city-specific check, follow this same pattern — an isolated `if` block appending to `rules[]`, not a new abstraction.
- `scrapers/` — `BaseScraper` is the abstract base (fetch with timeout/UA, HTML/JSON fetch helpers, keyword-proximity fee/day-limit extraction regexes). One scraper class per city in `scrapers/cities/`, each returning a `ScrapeResult` with a `status` (`success | partial | failed | unchanged`) and any `update` fields; a field name prefixed with `!` in `fieldsUpdated` (e.g. `!host_presence_language_missing`) is a "flag for human review", not an actual field update — `runner.ts` filters those out (along with `open_data*`) before deciding whether real changes occurred. `runScrapers()` runs all scrapers via `Promise.allSettled`, upserts `cities` only for real changes, always writes a `scrape_log` row, and sets `scrape_status` to `live` (real change), `scraped` (ran, no change), or `scrape_failed`.
- `routes/` — one router per resource, mounted under `/api/*` in `app.ts`. `auth.ts` implements JWT-based register/login/me with bcrypt password hashing and a free-tier monthly check limit (`FREE_MONTHLY_LIMIT = 3`), but note this is **not currently wired into the frontend** — `AuthContext`/`LoginModal`/`SignupModal` exist under `src/` but `App.tsx` never mounts `AuthProvider` or the modals.

### Frontend (`src/`)

- Step components (`AddressStep`, `QuestionStep`, `ResultsStep`) are orchestrated by `App.tsx`, which owns all state (no state management library, no router in active use).
- `src/data/questions.ts` — `getQuestionsForCity(city)` builds the questionnaire dynamically: some questions (zoning, insurance) are only added conditionally per city, and some questions declare `dependsOn` another question's answer for conditional rendering in `QuestionStep`.
- `src/api/client.ts` — thin fetch wrapper (`api.getCities`, `api.getCity`, `api.checkCompliance`, `api.geocode`, `api.getScrapeStatus`); all requests go through the Vite dev proxy (`/api` → `:3001`) in dev, or same-origin in production/Vercel.
- `src/types/index.ts` — the frontend's own copy of the API shapes (`CityData`, `ComplianceResult`, `Answers`, etc.); kept in sync by hand with `server/compliance/engine.ts` and `server/db/index.ts` types since there's no shared package between client and server.
- Styling is Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 is CSS-first, configured in `src/index.css`).

### Deployment targets

The app is designed to run three ways, all from the same source:
1. **Docker** (`Dockerfile` + `docker-compose.yml`) — multi-stage build, file-based SQLite on a named volume at `/data`, seeded once at image build time.
2. **Node/VM** (`npm run build && npm run build:server && npm start`) — file-based SQLite under `data/`.
3. **Vercel serverless** (`api/index.ts`, `vercel.json`) — a separate entrypoint (not `server/index.ts`) that inits + seeds an in-memory DB synchronously on every cold start, since serverless has no persistent disk; rewrites route `/api/*` to this function and everything else to the static SPA.

When changing server bootstrap/init logic, keep `server/index.ts` (Node) and `api/index.ts` (Vercel) in sync — they duplicate the "init DB, seed, createApp()" sequence deliberately, since production Node also handles static file serving, startup scraping, and graceful shutdown that serverless doesn't need.

### Adding a new city

Requires touching four places in lockstep: a `CITIES`/`RULES` entry in `server/db/seed.ts`, a scraper class in `server/scrapers/cities/` registered in `scrapers/runner.ts`'s `ALL_SCRAPERS`, any city-specific rule branches in `compliance/engine.ts` (keyed off `city.id`), and any city-specific question branches in `src/data/questions.ts` (also keyed off `city.id`).
