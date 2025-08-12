create extension if not exists pgcrypto;

create table if not exists growth_plan_subtasks (
  id uuid primary key default gen_random_uuid(),
  lever_id uuid references growth_plan_levers(id) on delete cascade,
  title text not null,
  status text not null default 'todo', -- todo|in_progress|done|blocked
  due_date date,
  created_at timestamptz default now()
);

create index if not exists idx_subtasks_lever on growth_plan_subtasks(lever_id, status);

alter table growth_plan_levers add column if not exists effort int default 3;
alter table growth_plan_levers add column if not exists impact int default 3;
alter table growth_plan_levers add column if not exists assignee_u_id uuid;
alter table growth_plan_levers add column if not exists risk_status text;   -- clear|risk|blocked
alter table growth_plan_levers add column if not exists risk_reason text;

-- RLS for subtasks aligned with lever ownership
alter table growth_plan_subtasks enable row level security;

do $$ begin
  perform 1 from pg_policies where schemaname = 'public' and tablename = 'growth_plan_subtasks' and policyname = 'gps_owner_rw';
  if not found then
    create policy "gps_owner_rw" on growth_plan_subtasks
      using (lever_id in (
        select l.id from growth_plan_levers l
        join growth_plans p on p.id = l.plan_id
        where p.user_id = auth.uid()
      ))
      with check (lever_id in (
        select l.id from growth_plan_levers l
        join growth_plans p on p.id = l.plan_id
        where p.user_id = auth.uid()
      ));
  end if;
end $$;


