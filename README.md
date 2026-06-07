# Yuno

A free, **open-source** library of **wallpapers, ringtones and notification
sounds** — browse, preview and download, no paywalls. Built and maintained by
**Belkis Aslani**.

## Tech stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — cinematic scroll animations
- **Supabase** — Auth, Postgres, Storage (file uploads)
- **Vercel** — hosting

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your real keys
npm run dev                  # http://localhost:3000
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `assets` table, the `wallpapers` + `audio` storage buckets,
   and the access rules (public read, admin-only write).
3. Copy your project URL + keys into `.env.local` (see `.env.example`).

## Environment variables

See [`.env.example`](./.env.example). **Never commit real keys** — `.env.local`
is gitignored.

## Project structure

```
src/
  app/            # routes: /, /wallpapers, /ringtones, /notifications, /admin
  components/     # logo, header, footer, hero, grids
  lib/
    supabase/     # browser + server clients
    types.ts      # Asset model
supabase/
  schema.sql      # database + storage setup
```

## License

Open source. License to be added.
