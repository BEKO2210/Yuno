-- ============================================================
-- Yuno — Supabase Schema (source of truth)
-- Already applied to the live project. Re-runnable on a fresh project:
-- Supabase → SQL Editor → paste & run.
-- ============================================================

-- 1) Assets table -------------------------------------------------
create table if not exists public.assets (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  kind           text not null check (kind in ('wallpaper', 'ringtone', 'notification')),
  title          text not null,
  file_path      text not null,            -- path inside the storage bucket
  preview_path   text,                     -- optional cover/preview image
  tags           text[] not null default '{}',
  download_count integer not null default 0,
  width          integer,
  height         integer,
  duration       numeric                    -- seconds, for audio
);

create index if not exists assets_kind_idx on public.assets (kind);
create index if not exists assets_created_idx on public.assets (created_at desc);

-- 2) Admin check --------------------------------------------------
-- Only this account may write. Extend later to an `admins` table if needed.
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'belkis.aslani@gmail.com'
$$;

-- 3) Row Level Security on assets --------------------------------
alter table public.assets enable row level security;

-- Anyone may read (public download library).
create policy "assets are public to read"
  on public.assets for select using (true);

-- Only the admin may write.
create policy "admin can insert assets"
  on public.assets for insert to authenticated with check (public.is_admin());

create policy "admin can update assets"
  on public.assets for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete assets"
  on public.assets for delete to authenticated using (public.is_admin());

-- 4) Storage buckets ---------------------------------------------
-- Public buckets: files are served via public object URLs.
-- (No broad SELECT policy on storage.objects — public URLs don't need it,
--  and it would let clients list every file.)
insert into storage.buckets (id, name, public)
values ('wallpapers', 'wallpapers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;

-- Only the admin may upload / modify / delete files.
create policy "admin write storage"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('wallpapers', 'audio') and public.is_admin());

create policy "admin update storage"
  on storage.objects for update to authenticated
  using (bucket_id in ('wallpapers', 'audio') and public.is_admin());

create policy "admin delete storage"
  on storage.objects for delete to authenticated
  using (bucket_id in ('wallpapers', 'audio') and public.is_admin());
