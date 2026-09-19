-- FinPilot application user profiles.
-- Authentication is owned by Supabase auth.users; this table stores app-facing profile data.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_email_lower_idx on public.users (lower(email));
alter table public.users enable row level security;

drop policy if exists "Users can view their own profile" on public.users;
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
drop policy if exists "Users can create their own profile" on public.users;
create policy "Users can create their own profile" on public.users for insert with check (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.set_users_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users for each row execute function public.set_users_updated_at();

create or replace function public.handle_new_auth_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();
