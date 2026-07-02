-- Phase 4a — posts table, RLS, storage bucket for image uploads.
-- Run in the Supabase SQL editor (or via supabase CLI).

create extension if not exists "uuid-ossp";

-- ─── posts ──────────────────────────────────────────────────────────────

create table if not exists posts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  body          text not null,
  thumbnail_url text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published     boolean not null default true,
  author_id     uuid not null references auth.users(id) on delete cascade
);

create index if not exists posts_created_at_idx on posts (created_at desc);
create index if not exists posts_published_idx  on posts (published);

alter table posts enable row level security;

drop policy if exists "public reads published posts" on posts;
create policy "public reads published posts"
  on posts for select using (published = true);

drop policy if exists "owner reads own" on posts;
create policy "owner reads own"
  on posts for select using (auth.uid() = author_id);

drop policy if exists "owner inserts" on posts;
create policy "owner inserts"
  on posts for insert with check (auth.uid() = author_id);

drop policy if exists "owner updates own" on posts;
create policy "owner updates own"
  on posts for update using (auth.uid() = author_id);

drop policy if exists "owner deletes own" on posts;
create policy "owner deletes own"
  on posts for delete using (auth.uid() = author_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ─── storage bucket: post-images (public read, authed write) ──────────

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "anyone reads post-images" on storage.objects;
create policy "anyone reads post-images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "authed writes post-images" on storage.objects;
create policy "authed writes post-images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "authed updates post-images" on storage.objects;
create policy "authed updates post-images"
  on storage.objects for update
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "authed deletes post-images" on storage.objects;
create policy "authed deletes post-images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');
