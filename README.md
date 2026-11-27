# Revival Church International (RCI) — Full-Stack Portal

A complete React + Vite frontend with an Express JSON API. The site serves church content (campuses, ministries, sermons, events, testimonies) from a single source of truth and records form submissions on the server.

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- npm 10+

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. The dev script starts two processes with `concurrently`:

| Process | Command | URL |
| --- | --- | --- |
| API | `npm run dev:server` | http://localhost:3001/api |
| Web | `npm run dev:web` | http://localhost:5173 |

Vite proxies `/api` to the API server, so the browser only talks to port 5173. If the API runs elsewhere, set `API_PROXY_TARGET`.

## Production

```bash
npm run build     # typecheck + vite build -> dist/
npm start         # Express serves dist/ and the /api routes on PORT (default 3001)
```

`npm test` runs the API integration tests (Node's built-in test runner + `tsx`). `npm run lint` runs a strict TypeScript check over `src/`, `server/`, and `vite.config.ts`.

## GitHub Pages

`.github/workflows/deploy.yml` builds and publishes the static frontend on every push to `main`. Enable **Settings → Pages → Source: GitHub Actions** in the repository. The site will be available at:

**https://cashmindx.github.io/revivalchurchinternational/**

The workflow sets `VITE_BASE_PATH=/revivalchurchinternational/` so bundled asset URLs use the subpath, and public images are referenced with relative paths so they work at both `/` and the Pages subpath.

GitHub Pages hosts static files only. Content pages fall back to `src/data/churchData.ts`, but forms need the Express API. Deploy `server/` to a Node host and add a repository variable named `VITE_API_URL` (for example `https://rci-api.onrender.com/api`) to make submissions work on Pages. Without it, forms show an inline error.

## Environment

Copy `.env.example` to `.env` and adjust if needed:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | API / production server port |
| `NODE_ENV` | `development` | `production` enables static serving and stricter CORS |
| `DATA_DIR` | `server/data` | Directory for form submission JSON files |
| `VITE_API_URL` | `/api` | Frontend API base URL |
| `VITE_BASE_PATH` | `/` | Vite base path; the Pages workflow sets `/revivalchurchinternational/` |
| `API_PROXY_TARGET` | `http://localhost:3001` | Vite dev/preview proxy target |
| `APP_URL` | — | Public site URL (informational) |
| `GEMINI_API_KEY` | — | Reserved for future AI features; not required to run |

## Architecture

```
src/
  App.tsx                 hash router + modal wiring
  main.tsx                providers + root render
  data/churchData.ts      single static content source (shared with the API)
  context/ContentContext.tsx  fetches /api/site, falls back to local data
  lib/api.ts              typed API client + helpers
  components/             pages, sections, modals, toast notifications
server/
  index.ts                Express app factory, static SPA serving, error handler
  routes.ts               API endpoints
  validation.ts           Zod request schemas
  store.ts                atomic JSON-file persistence with per-collection queues
  rateLimit.ts            in-memory sliding-window form spam limiter
  api.test.ts             integration tests
vite.config.ts            /api proxy, JFIF MIME middleware
```

Every form calls the API and displays either a success state or an inline error plus a toast. If the API is unreachable, content pages still render from `src/data/churchData.ts`; submissions require the API.

## API endpoints

Base path: `/api`. Responses have the shape `{ ok: true, data?, message? }` or `{ ok: false, error }`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Service health and uptime |
| GET | `/site` | All site content in one response |
| GET | `/content/:key` | One content collection (`campuses`, `ministries`, `pathway`, `sermons`, `events`, `testimonies`, `statement-of-faith`, `banking-details`) |
| GET | `/campuses`, `/ministries`, `/sermons`, `/events`, `/testimonies` | Individual collections |
| GET | `/stats` | Record counts per collection |
| POST | `/prayer-requests` | Store a prayer request |
| POST | `/visits` | Book a campus visit |
| POST | `/giving` | Record a giving pledge and return a reference number |
| POST | `/contact` | Store connect/enrolment/volunteer/testimony/event messages |
| POST | `/newsletter` | Subscribe an email (case-insensitive deduplication) |

All POST routes are validated with Zod and rate-limited to 8 requests per minute per IP.

Submissions are stored as JSON arrays in `server/data/`:

- `prayerRequests.json`
- `visits.json`
- `giving.json`
- `contacts.json`
- `newsletter.json`

Writes are serialized per collection and use a temp file + rename, so concurrent form posts cannot corrupt a file. Delete these files (or point `DATA_DIR` elsewhere) to reset the data.

## Notes on payments and media

- The site does **not** collect card numbers or process payments. Giving forms record a pledge and return a reference; the banking details come from `churchData.ts` for EFT completion. Digital giving is described as an upcoming app feature.
- The live player is a presentation UI with local chat; no external streaming service is configured.
- `SERMONS[].youtubeId` is intentionally empty until real video IDs are supplied.
- The standalone HTML and duplicate image/source archives were removed. Static images live in `public/images` and `public/assets/aistudio`.
