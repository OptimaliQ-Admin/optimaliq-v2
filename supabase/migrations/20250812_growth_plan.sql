-- 20250812_growth_plan.sql
create extension if not exists pgcrypto;

create table if not exists growth_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  org_id uuid,
  created_at timestamptz not null default now(),
  period_start date not null default (now()::date),
  period_end date not null default ((now() + interval '30 days')::date),
  status text not null default 'active', -- active|completed|archived
  cohort_snapshot jsonb
);

create index if not exists idx_growth_plans_user on growth_plans(user_id, period_start desc);

create table if not exists growth_plan_levers (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references growth_plans(id) on delete cascade,
  title text not null,
  description text,
  priority int not null,                              -- 1..5
  success_metric text not null,                       -- e.g. "Reduce sales cycle"
  target_value text,                                  -- keep text for flexibility
  current_value text,
  due_date date,
  owner text,                                         -- "Sales Lead", etc.
  status text not null default 'todo',                -- todo|in_progress|done|blocked
  ai_reasoning text,
  tags text[]
);

create index if not exists idx_levers_plan_priority on growth_plan_levers(plan_id, priority);

create table if not exists growth_plan_nudges (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references growth_plans(id) on delete cascade,
  user_id uuid not null,
  send_at timestamptz not null,
  type text not null,                                 -- day7|day21
  sent boolean not null default false,
  payload jsonb
);

create index if not exists idx_nudges_due on growth_plan_nudges(sent, send_at);

create table if not exists growth_plan_feedback (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references growth_plans(id) on delete cascade,
  lever_id uuid references growth_plan_levers(id) on delete set null,
  user_id uuid not null,
  submitted_at timestamptz not null default now(),
  outcome_score int check (outcome_score between 1 and 5),
  outcome_notes text,
  actual_value text
);

-- RLS
alter table growth_plans enable row level security;
alter table growth_plan_levers enable row level security;
alter table growth_plan_nudges enable row level security;
alter table growth_plan_feedback enable row level security;

-- Users can see/update their own data
create policy "gp_owner_rw" on growth_plans
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "gpl_owner_rw" on growth_plan_levers
  using (plan_id in (select id from growth_plans where user_id = auth.uid()))
  with check (plan_id in (select id from growth_plans where user_id = auth.uid()));

create policy "gpn_owner_r" on growth_plan_nudges
  for select using (auth.uid() = user_id);

create policy "gpf_owner_rw" on growth_plan_feedback
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


