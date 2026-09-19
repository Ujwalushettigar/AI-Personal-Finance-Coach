-- Subscription detection storage for the Supabase/Postgres database.
-- This migration creates only the subscriptions table and its security policies.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  merchant text not null,
  merchant_key text not null,
  cadence text not null check (cadence in ('weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  amount numeric(12, 2) not null default 0 check (amount >= 0),
  average_amount numeric(12, 2) not null default 0 check (average_amount >= 0),
  monthly_cost numeric(12, 2) not null default 0 check (monthly_cost >= 0),
  yearly_cost numeric(12, 2) not null default 0 check (yearly_cost >= 0),
  confidence smallint not null default 0 check (confidence between 0 and 100),
  transaction_count integer not null default 0 check (transaction_count >= 0),
  last_payment date,
  next_expected_payment date,
  average_interval_days numeric(8, 1),
  likely_subscription boolean not null default true,
  rarely_used boolean not null default false,
  transactions jsonb not null default '[]'::jsonb check (jsonb_typeof(transactions) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, merchant_key)
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create index if not exists subscriptions_next_payment_idx
  on public.subscriptions (user_id, next_expected_payment);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can view their own subscriptions" on public.subscriptions;
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own subscriptions" on public.subscriptions;
create policy "Users can create their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own subscriptions" on public.subscriptions;
create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own subscriptions" on public.subscriptions;
create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

create or replace function public.set_subscriptions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_subscriptions_updated_at();
