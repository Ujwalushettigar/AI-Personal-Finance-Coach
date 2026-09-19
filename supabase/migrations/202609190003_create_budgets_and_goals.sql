-- FinPilot category budgets and savings goals.

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  amount_limit numeric(12, 2) not null check (amount_limit > 0),
  period text not null default 'monthly' check (period in ('weekly', 'monthly', 'quarterly', 'yearly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category, period)
);
create index if not exists budgets_user_id_idx on public.budgets (user_id);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_amount numeric(12, 2) not null default 0 check (current_amount >= 0),
  target_date date,
  category text not null default 'General',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_amount <= target_amount)
);
create index if not exists savings_goals_user_id_idx on public.savings_goals (user_id);
create index if not exists savings_goals_target_date_idx on public.savings_goals (user_id, target_date);

alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;

drop policy if exists "Users can view their own budgets" on public.budgets;
create policy "Users can view their own budgets" on public.budgets for select using (auth.uid() = user_id);
drop policy if exists "Users can create their own budgets" on public.budgets;
create policy "Users can create their own budgets" on public.budgets for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own budgets" on public.budgets;
create policy "Users can update their own budgets" on public.budgets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own budgets" on public.budgets;
create policy "Users can delete their own budgets" on public.budgets for delete using (auth.uid() = user_id);

drop policy if exists "Users can view their own savings goals" on public.savings_goals;
create policy "Users can view their own savings goals" on public.savings_goals for select using (auth.uid() = user_id);
drop policy if exists "Users can create their own savings goals" on public.savings_goals;
create policy "Users can create their own savings goals" on public.savings_goals for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own savings goals" on public.savings_goals;
create policy "Users can update their own savings goals" on public.savings_goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own savings goals" on public.savings_goals;
create policy "Users can delete their own savings goals" on public.savings_goals for delete using (auth.uid() = user_id);

create or replace function public.set_budget_goal_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists budgets_set_updated_at on public.budgets;
create trigger budgets_set_updated_at before update on public.budgets for each row execute function public.set_budget_goal_updated_at();
drop trigger if exists savings_goals_set_updated_at on public.savings_goals;
create trigger savings_goals_set_updated_at before update on public.savings_goals for each row execute function public.set_budget_goal_updated_at();
