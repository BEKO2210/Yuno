-- ============================================================
-- Yuno — Supabase Schema
-- In Supabase: SQL Editor → paste & run.
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

-- 2) Row Level Security ------------------------------------------
alter table public.assets enable row level security;

-- Anyone may read assets (public download library).
create policy "assets are public to read"
  on public.assets for select
  using (true);

-- Only authenticated users (the admin) may insert / update / delete.
create policy "authenticated can insert assets"
  on public.assets for insert
  to authenticated
  with check (true);

create policy "authenticated can update assets"
  on public.assets for update
  to authenticated
  using (true);

create policy "authenticated can delete assets"
  on public.assets for delete
  to authenticated
  using (true);

-- 3) Storage buckets ---------------------------------------------
-- Public buckets so files can be downloaded directly.
insert into storage.buckets (id, name, public)
values ('wallpapers', 'wallpapers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;

-- Public read for both buckets.
create policy "public read wallpapers"
  on storage.objects for select
  using (bucket_id = 'wallpapers');

create policy "public read audio"
  on storage.objects for select
  using (bucket_id = 'audio');

-- Only authenticated users may upload / modify / delete files.
create policy "authenticated write wallpapers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'wallpapers');

create policy "authenticated write audio"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'audio');

create policy "authenticated update storage"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('wallpapers', 'audio'));

create policy "authenticated delete storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('wallpapers', 'audio'));
