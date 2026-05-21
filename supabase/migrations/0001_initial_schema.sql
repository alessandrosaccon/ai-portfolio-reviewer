-- AI Portfolio Reviewer — Initial Schema
-- Run this in your Supabase SQL editor or via `supabase db push`

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ENUM TYPES ───────────────────────────────────────────
create type analysis_status as enum ('pending', 'processing', 'completed', 'failed');

-- ─── PROFILES ───────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── ANALYSES ───────────────────────────────────────────────
create table analyses (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete cascade,
  status           analysis_status not null default 'pending',
  cv_text          text not null,
  job_description  text not null,
  job_title        text,
  company          text,
  result           jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Index for fast user lookups
create index analyses_user_id_idx on analyses(user_id);
create index analyses_created_at_idx on analyses(created_at desc);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger analyses_updated_at
  before update on analyses
  for each row execute procedure update_updated_at_column();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
alter table profiles enable row level security;
alter table analyses enable row level security;

-- Profiles: users can only read/update their own
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Analyses: users can only access their own
create policy "analyses_select_own" on analyses
  for select using (auth.uid() = user_id);

create policy "analyses_insert_own" on analyses
  for insert with check (auth.uid() = user_id);

create policy "analyses_update_own" on analyses
  for update using (auth.uid() = user_id);

create policy "analyses_delete_own" on analyses
  for delete using (auth.uid() = user_id);
