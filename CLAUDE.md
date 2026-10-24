# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, next core-web-vitals + typescript)
```

No test suite exists in this repo.

Required env vars (in `.env.local`, gitignored): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 + Supabase. All UI text is Portuguese (pt-BR); keep it that way.

Two distinct halves:

**Public site** — [app/page.tsx](app/page.tsx) is a single, large `"use client"` landing page for Mari Campos (yoga/meditation), with hardcoded content, an ambient-audio toggle, and scroll-driven header styling. GA is injected in [app/layout.tsx](app/layout.tsx).

**Panel (`/panel`)** — an authenticated CMS for three sites: `mari-campos` (placeholder only), `silencie`, and `naya` (both have full editors). Each panel page is a Server Component that calls `supabase.auth.getUser()` and `redirect("/panel/login")`, then renders `<Sidebar>` plus a `"use client"` editor.

### Supabase clients — pick the right one

Three wrappers under [lib/supabase/](lib/supabase/), not interchangeable:
- [client.ts](lib/supabase/client.ts) — browser (`createBrowserClient`), for client components and all CMS reads/writes.
- [server.ts](lib/supabase/server.ts) — Server Components / route handlers, cookie-backed.
- [middleware.ts](lib/supabase/middleware.ts) — session refresh + the `/panel` auth gate, invoked by root [middleware.ts](middleware.ts) (matcher `/panel/:path*`, with `/panel/login` and `/panel/auth` exempt).

Auth gating is enforced twice on purpose: in middleware and again per-page via `getUser()`. Keep both when adding panel routes.

### CMS content model

Everything editable lives in one Supabase table, `site_content (site, key, value jsonb)`, unique on `(site, key)`. Schema, RLS policies and seed data are in [supabase/naya-content.sql](supabase/naya-content.sql) (table + naya seed) and [supabase/silencie-content.sql](supabase/silencie-content.sql) (silencie seed, depends on the former). These are applied manually — there is no migration tooling.

Later scripts in `supabase/` are one-off imports rather than part of the base seed, and unlike the seeds they overwrite (`on conflict … do update`), so read the header comment before running one.

RLS: `anon` can read (so the public sites can fetch), `authenticated` can read/insert/update. Because `anon` has no write policy, content can only be changed through the logged-in panel or by running SQL as `postgres` — tooling holding just the anon key cannot seed or migrate content.

Image uploads (the Silencie testimonial photos) go to the public Storage bucket `images`, created by [supabase/storage-images-bucket.sql](supabase/storage-images-bucket.sql). That bucket is not part of the original seed and was missing in production, which made every upload fail with "Bucket not found"; apply that script before relying on the uploader.

[lib/supabase/content.ts](lib/supabase/content.ts) is the only access layer: `getContent(site, key)`, `getAllContent(site)` (returns `{key: value}`), `saveContent(site, key, value)` (upsert on `site,key`, returns a boolean — errors are swallowed, not thrown).

### Editor pattern

[app/panel/naya/editor.tsx](app/panel/naya/editor.tsx) and [app/panel/silencie/editor.tsx](app/panel/silencie/editor.tsx) share one shape: a `tabs` array where each tab id **is** the `site_content.key`; `getAllContent(site)` loads everything once into a `data` record; each tab is a sub-component holding local form state seeded from `data[key]`, saved back with its own save button. Adding a content section = add a tab entry, a typed sub-component, and a matching row in the seed SQL. Naya's editor is the richer reference.

### Auth flows

Password sign-in on [app/panel/login/page.tsx](app/panel/login/page.tsx), plus `resetPasswordForEmail` → [app/panel/auth/reset-callback/route.ts](app/panel/auth/reset-callback/route.ts) → `/panel/change-password`. [app/panel/auth/callback/route.ts](app/panel/auth/callback/route.ts) handles the generic code exchange → `/panel`. There is no sign-up path; users are created in Supabase directly.

## Styling

Tailwind v4 via `@import "tailwindcss"` in [app/globals.css](app/globals.css); no tailwind.config file. The brand palette is CSS custom properties on `:root` exposed through `@theme inline` — use the semantic classes (`bg-sage`, `text-sage-dark`, `bg-cream`, `border-sand`, `text-text-muted`, `bg-background`, `text-foreground`) rather than raw hex or stock Tailwind colors. Note `sage` is actually a deep blue (`#1B4965`). Font is Inter via `next/font`.
