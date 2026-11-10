# Swastik Polymers — B2B Manufacturing Website + Admin

Premium B2B website for **Swastik Polymers** (PVC electrical pipes & fittings
manufacturer, garden pipe supplier) with a private admin dashboard for lead
management. Not an e-commerce site — product discovery + inquiry generation only.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
Supabase (Postgres + Auth + Storage + RLS).

---

## 1. Quick start

```bash
bun install          # or npm install
# fill in .env.local (already created — see below)
bun run dev          # http://localhost:3000
```

Public site: `/`  ·  Admin: `/admin`

## 2. Environment (`.env.local`)

Already populated with your project URL + publishable key. Confirm the secret key:

```
NEXT_PUBLIC_SUPABASE_URL=https://gumwfgrjfzsnluwowjvg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...          # SERVER ONLY — never exposed to the browser
```

The code accepts both new key names (PUBLISHABLE / SECRET) and classic ones
(ANON_KEY / SERVICE_ROLE_KEY).

## 3. Database setup (one time)

DDL cannot run over the REST API, so run the SQL once in Supabase:

1. Open **Supabase Dashboard → SQL Editor → New query**.
2. Paste the entire contents of **`supabase/all.sql`** and **Run**.
   (This is `0001_init.sql` + `0002_seed.sql` + `0003_storage.sql` combined:
   tables, RLS policies, triggers, the 12-product seed, settings row, and the
   `product-images` storage bucket.)

That creates: `leads`, `products`, `business_settings`, `lead_activity`,
`profiles` with Row Level Security enabled.

## 4. Create the admin account (no public signup)

Admins are provisioned manually:

- **Supabase Dashboard → Authentication → Users → Add user** → enter email +
  password → create. (A `profiles` row with `role = 'admin'` is created
  automatically by a trigger.)

Then log in at `/admin/login`. Forgot-password uses Supabase's reset email.

## 5. How it fits together

- Public inquiry form → `POST /api/inquiries` (server-side validation, MOQ ≥ 100,
  honeypot + rate limit) → inserts a row into `leads`.
- The lead appears instantly in **/admin** (Overview + Leads), where the admin
  can call / WhatsApp / email the customer, change status, add notes, schedule
  follow-ups, and export.
- Product & settings edits in the admin write to Supabase and the public site
  reads them live (falls back to `src/config/business.ts` if the DB is empty).

## 6. Security (RLS)

- Anonymous users may **insert** a lead but can never read/update/delete leads.
- Only authenticated admins (`profiles.role = 'admin'`) can read/manage leads,
  products, settings, activity.
- Products: public reads only `is_active` rows. Settings: public read-only.
- Secret key is server-only; middleware protects every `/admin` route.

## 7. Centralized config

`src/config/business.ts` is the single source of truth for business info,
the 12 products, MOQ, dropdown options and WhatsApp number. The admin
Settings/Products pages override these at runtime via Supabase.

## 8. Replacing placeholder images

Product/brand images live in `public/products/*.svg` and `public/*.svg`.
Replace with real photos (keep the same filenames) or upload per-product in
**Admin → Products → Edit → Upload** (stored in the `product-images` bucket).

## 9. Deploy

Deploy to Vercel. Add the three env vars in the Vercel project settings.
`next build` is clean.
