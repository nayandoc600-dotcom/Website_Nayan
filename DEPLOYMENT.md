# Deployment Guide — Vercel + Supabase Pro

This deploys the Next.js app to **Vercel** and points it at your **cloud Supabase Pro**
project. Do the steps in order.

---

## 1 — Push the database schema to Supabase Pro

Your cloud project starts empty. Apply all migrations to it (this creates every
table, RLS policy, and the storage buckets: `visa-approvals`, `study-materials`,
`popup-media`, `team`, `gallery`).

```bash
# One-time: log in and link the local repo to your cloud project
npx supabase login
npx supabase link --project-ref <YOUR-PROJECT-REF>   # ref is in the project URL / dashboard

# Apply all migrations to the cloud database
npx supabase db push
```

> `db push` applies **migrations only** — it does **not** run `seed.sql` on the cloud.
> If you want the sample testimonials + demo popup, open the Supabase **SQL Editor**
> and paste the contents of `supabase/seed.sql`. (Optional — you'll add real content
> from the admin panel anyway.)

## 2 — Create the admin user

Supabase Dashboard → **Authentication → Users → Add user → Create new user**.
Set the email + password the consultancy will log in with. (This is the only way to
create admin accounts — there's no public signup.)

## 3 — Grab your cloud keys

Supabase Dashboard → **Project Settings → API**. You'll need:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## 4 — Deploy to Vercel

1. Push this repo to GitHub (already done).
2. On **vercel.com** → **Add New → Project** → import `Website_Nayan`.
3. Framework preset auto-detects **Next.js**. Leave build settings default.
4. Add the **Environment Variables** below (Production + Preview), then **Deploy**.

### Required environment variables

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your cloud project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cloud anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | cloud service_role/secret key |
| `RESEND_API_KEY` | your Resend API key |
| `RESEND_FROM` | `Nayan Educational <noreply@nayanedu.com>` (verified domain) |
| `RESEND_TO` | `info@nayanedu.com` (where enquiries land) |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | your real Turnstile **site key** (`0x4A…`) |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | your real Turnstile **secret key** (`0x4A…`) — keep secret |

> **Google Sheets is optional** and intentionally omitted — contact submissions are
> stored in the database and viewable in **Admin → Queries**.
>
> **Turnstile:** use your real Cloudflare keys (from dash.cloudflare.com). Make sure
> `nayanedu.com` and `www.nayanedu.com` are added to that Turnstile widget's allowed
> hostnames. Keep the **test** keys for local development (real keys only render on
> their configured domains, not `localhost`).

## 5 — Point the domain

Vercel → Project → **Settings → Domains** → add `nayanedu.com` and `www.nayanedu.com`.
Follow Vercel's DNS instructions (A / CNAME records). The app already uses
`https://www.nayanedu.com` for canonical URLs, sitemap, and JSON-LD.

## 6 — Post-deploy smoke test

- [ ] Home, /about, /destinations, /team, /gallery, /news, /study-materials load
- [ ] `/login` → sign in with the admin user → lands on `/admin`
- [ ] Submit the **contact form** → success + email arrives at `RESEND_TO` + shows in **Admin → Queries**
- [ ] Upload a **visa approval / team / gallery / study material** in admin → appears on the public site
- [ ] Download a study material → lead form → file downloads → lead shows in **Admin → Material Leads**
- [ ] Popup shows (first visit), CSV/XLSX export works

## Notes

- **Images:** production optimizes images from `*.supabase.co` automatically (allowed in
  `next.config.ts`). No action needed.
- **Migrations later:** when you add new migrations, run `npx supabase db push` again to
  apply them to the cloud project, then redeploy.
- **`npm run lint`** is currently broken (config issue) but does **not** affect Vercel
  builds — Next.js 16 doesn't run lint during `next build`.
