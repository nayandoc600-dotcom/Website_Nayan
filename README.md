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

First run downloads ~1 GB of Docker images — takes a few minutes. Subsequent starts are fast.

When it finishes you will see output like this:

```
API URL: http://127.0.0.1:54321
PUBLISHABLE_KEY: sb_publishable_...
SECRET_KEY: sb_secret_...
Studio URL: http://127.0.0.1:54323
```

Copy those values — you need them in the next step.

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
npx supabase db push --local
```

This creates all tables, enables RLS, sets up storage buckets, and inserts sample testimonials + a demo popup notice.

> If prompted `Do you want to push these migrations?` — type `Y` and press Enter.

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
  migrations/         SQL migrations — run with `npx supabase db push --local`
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

## Going to production

1. Create a [Supabase](https://supabase.com) project and push migrations to it.
2. Deploy to [Vercel](https://vercel.com) — connect this GitHub repo.
3. Add all variables from `.env.example` as Vercel Environment Variables (real production values).
4. Replace Cloudflare Turnstile test keys with real keys from [dash.cloudflare.com](https://dash.cloudflare.com).
5. Have a native Japanese speaker review `messages/ja.json` before the Japan page goes live.

---

*Nayan Educational Consultancy · Roshan Kapali & Anuj Bhusal · June 2026*
