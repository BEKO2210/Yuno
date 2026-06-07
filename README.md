# Yuno

A free, **open-source** library of **wallpapers, ringtones and notification
sounds** — browse, preview and download, no paywalls. Built and maintained by
**Belkis Aslani**.

🌐 **Live:** https://yuno-liard.vercel.app

![Yuno](public/brand/logo-mark.png)

## Features

- **Cinematic landing page** — AI-generated animated logo, full-screen aurora
  video backgrounds with scroll parallax and soft transitions between sections.
- **Gallery** — wallpapers in a masonry grid; ringtones & notification sounds as
  cards with an inline audio player. Every item has a one-tap **download** (with
  a friendly filename) and a **download counter**.
- **Admin area** — passwordless **magic-link** login (owner only) with
  **drag-&-drop upload** for images and audio, automatic image dimensions /
  audio duration, tagging, and a library view with delete.
- **Secure by default** — public read, **owner-only writes** enforced by
  Supabase Row Level Security.

## Tech stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — cinematic scroll animations
- **Supabase** — Auth, Postgres, Storage
- **Vercel** — hosting + auto-deploy from GitHub
- Brand visuals generated with **Higgsfield** (logo, videos, example images)

## Getting started (local)

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev                  # http://localhost:3000
```

### Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm run start` | Run the production build locally     |
| `npm run lint`  | Lint with ESLint                     |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `assets` table, the `wallpapers` + `audio` storage buckets,
   the access rules (public read, admin-only write), and the public
   `increment_download` counter function.
3. In **Authentication → URL Configuration**, set **Site URL** to your domain
   and add `<your-domain>/**` under **Redirect URLs** (required for magic-link
   login). For local dev, `http://localhost:3000` is allowed by default.
4. Copy your project URL + anon/publishable key into `.env.local`
   (see `.env.example`).

> **Admin access** is restricted to a single email defined in two places that
> must match: `ADMIN_EMAIL` in [`src/lib/admin.ts`](./src/lib/admin.ts) and the
> `is_admin()` function in `supabase/schema.sql`. Change both to your own email.

## Environment variables

See [`.env.example`](./.env.example).

| Variable                         | Where        | Secret? |
| -------------------------------- | ------------ | ------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | client + svr | no (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | client + svr | no (public, RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY`      | server only  | **yes — never commit** |
| `NEXT_PUBLIC_SITE_URL`           | optional     | no (used for SEO/OG metadata) |

The two `NEXT_PUBLIC_*` values are public by design (shipped to the browser) and
live in the committed `.env.production`. Real secrets stay in `.env.local`, which
is gitignored.

## Deployment

The repo is connected to Vercel: **every push to `main` auto-deploys**. Pull
requests get a preview URL. No env setup is needed on Vercel for the public
build (it reads `.env.production`); add `SUPABASE_SERVICE_ROLE_KEY` in the Vercel
dashboard only if/when server-side privileged actions are added.

## Project structure

```
src/
  app/
    page.tsx                 # cinematic landing page
    wallpapers|ringtones|notifications/   # gallery pages (dynamic)
    admin/                   # login + owner dashboard
    auth/                    # magic-link callback + signout
    icon.png, apple-icon.png # favicons (transparent)
  components/
    hero, feature-section, category-grid, video-background, yuno-logo …
    gallery/                 # wallpaper grid + sound list
    admin/admin-dashboard    # drag-&-drop upload + manage
    download-button          # download + counter
  lib/
    supabase/                # browser, server & middleware clients
    queries.ts               # asset fetching
    assets.ts                # storage paths, public/download URLs
    admin.ts                 # ADMIN_EMAIL
    types.ts                 # Asset model
  middleware.ts              # refreshes the Supabase session
supabase/
  schema.sql                 # tables, RLS, buckets, RPC (source of truth)
public/
  brand/                     # logo + example images
  video/                     # background loops + posters
```

## How content flows

1. Owner signs in at `/admin` (magic link) and uploads files (drag & drop).
2. Files go to Supabase Storage; metadata rows go to the `assets` table.
3. Gallery pages read `assets` (public) and serve files via public storage URLs.
4. Visitors download; `increment_download` bumps the counter.

## License

Open source. License to be added.
