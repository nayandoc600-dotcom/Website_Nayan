# Nayan Educational Consultancy — Website

Full-stack marketing site + admin panel for a study-abroad consultancy based in Kathmandu.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Resend · Google Sheets API · Cloudflare Turnstile · Playwright

---

## Prerequisites

Install these before you start:

| Tool | Version | Download |
|---|---|---|
| Node.js | 20 or later | https://nodejs.org |
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |
| Git | Any | https://git-scm.com |

> Docker must be **running** whenever you work on this project (Supabase runs inside it).

> **Windows / PowerShell.** If `npm`/`npx` scripts are blocked with a "running scripts is
> disabled on this system" error, allow local scripts once:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

---

## 1 — Clone the repo

```bash
git clone https://github.com/AnujBhusal/Website_Nayan.git
cd Website_Nayan
```

---

## 2 — Install dependencies

```bash
npm install
```

---

## 3 — Start the local Supabase stack

Supabase runs entirely on your machine via Docker. No cloud account needed for local dev.

```bash
npx supabase start
```

> **Docker must be running** before you run this. The first run downloads ~1 GB of Docker images — takes a few minutes. Subsequent starts are fast.

When it finishes you will see output like this:

```
API URL: http://127.0.0.1:54321
PUBLISHABLE_KEY: sb_publishable_...
SECRET_KEY: sb_secret_...
Studio URL: http://127.0.0.1:54323
```

Copy those values — you need them in the next step.

> **Windows troubleshooting.** If `npx supabase start` fails with a WSL / `tini` /
> container error, fix Docker itself: **Docker Desktop → Settings → Troubleshoot →
> Clean / Purge data**, and ensure the WSL 2 backend is enabled (**Settings → General →
> Use the WSL 2 based engine**). Also keep this project **out of OneDrive** — OneDrive's
> file syncing corrupts Docker/Supabase volume artifacts. Clone it to a plain path like
> `C:\dev\Website_Nayan`.

---

## 4 — Create your `.env.local`

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values from `npx supabase status`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_<your value>
SUPABASE_SERVICE_ROLE_KEY=sb_secret_<your value>

# Leave these as-is for local dev — Turnstile test keys always pass
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
CLOUDFLARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Optional for local dev — set real values before going to production
RESEND_API_KEY=re_placeholder
GOOGLE_SHEETS_CREDENTIALS={}
GOOGLE_SHEETS_SPREADSHEET_ID=placeholder
```

> `.env.local` is gitignored and will never be committed.

---

## 5 — Apply database migrations and seed data

```bash
npx supabase db reset
```

This applies **all** migrations from scratch — including the `fix_service_role_grants`
migration that grants `service_role` full CRUD on the app tables — then runs `seed.sql`
to insert sample testimonials + a demo popup notice. It creates every table, enables RLS,
and sets up the storage buckets.

> ⚠️ `db reset` **wipes your local database**, including any rows you added and **all
> auth users** you created in Studio. Re-create your admin user (step 7) after a reset.

---

## 6 — Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 7 — Create an admin user

The admin panel is at `/admin` — it requires an account.

1. Open **http://127.0.0.1:54323** (Supabase Studio)
2. Click **Authentication** → **Users** → **Add user** → **Create new user**
3. Enter any email and password → **Create User**
4. Go to **http://localhost:3000/login** and sign in

You will land on **http://localhost:3000/admin**.

---

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |
| `npm test` | Run Playwright smoke tests |
| `npm run test:ui` | Playwright UI mode |
| `npm run lighthouse` | Lighthouse audit (requires dev server running) |

### Running Playwright tests

Install the browser once:

```bash
npx playwright install chromium
```

Then (with `npx supabase start` and `npm run dev` running in separate terminals):

```bash
npm test
```

---

## Project structure

```
app/
  (marketing)/        Public-facing pages (home, about, destinations, news, contact)
  (auth)/             Login page
  admin/              Admin panel (protected — redirects to /login if unauthenticated)
  layout.tsx          Root layout with JSON-LD + fonts
  sitemap.ts          Auto-generated sitemap
  robots.ts           robots.txt

components/
  marketing/          Public site components (Header, Footer, Popup, forms …)
  admin/              Admin UI components (AdminNav, SubmitButton)

lib/
  actions/            Server Actions (auth, testimonials, news, popup, visa, materials, contact)
  data/               Typed data layer — components never touch Supabase directly
  integrations/       Turnstile, Resend, Google Sheets helpers
  supabase/           SSR client (server.ts), service-role client (service.ts)
  types.ts            Shared TypeScript types
  destinations.ts     Static destinations data

supabase/
  migrations/         SQL migrations — applied by `npx supabase db reset`
  seed.sql            Sample testimonials + popup notice

messages/
  en.json             English copy for the Japan bilingual page
  ja.json             Japanese copy (needs native speaker review before production)

tests/
  smoke.spec.ts       Playwright smoke tests
```

---

## Key decisions

- **No secrets in client code.** The service-role key and all API keys live only in `.env.local` (local) or Vercel env vars (production). Files that import the service client have `import "server-only"` at the top.
- **RLS on every table.** The `anon` role only gets `SELECT` on public tables and `INSERT` on `contact_submissions`. Everything else requires the service-role key or an authenticated session.
- **Visa approvals expire automatically.** No cron — the query filters `created_at > now() - 7 days`. One upload → standalone image. Two or more → auto-carousel.
- **Contact form is resilient.** Supabase insert is the source of truth. Resend email and Google Sheets run in `Promise.allSettled` — failures are logged but never block the user.

---

## Recent changes

- **Homepage redesign.** Reworked the public landing experience — `Header`, `HeroSection`,
  the new auto-playing `HeroSlider`, `DestinationsPreview`, `Footer`, and `StatsSection`.
  Added imagery under `public/` (hero backgrounds `bg1–bg4.jpg`, destination images, logo).
  Destination image filenames are **lowercase** to stay correct on case-sensitive hosts
  (Linux / Vercel).
- **DB: `service_role` grants fix.** Migration `20260614144430_fix_service_role_grants.sql`
  grants `service_role` `SELECT/INSERT/UPDATE/DELETE` on the app tables (`testimonials`,
  `visa_approvals`, `popup_notice`, `news_posts`, `study_materials`) so the admin panel can
  read and write. RLS still applies as the backstop. Applied automatically by `db reset`.

---

## Going to production

1. Create a [Supabase](https://supabase.com) project and push migrations to it.
2. Deploy to [Vercel](https://vercel.com) — connect this GitHub repo.
3. Add all variables from `.env.example` as Vercel Environment Variables (real production values).
4. Replace Cloudflare Turnstile test keys with real keys from [dash.cloudflare.com](https://dash.cloudflare.com).
5. Have a native Japanese speaker review `messages/ja.json` before the Japan page goes live.

---

*Nayan Educational Consultancy · Roshan Kapali & Anuj Bhusal · June 2026*
