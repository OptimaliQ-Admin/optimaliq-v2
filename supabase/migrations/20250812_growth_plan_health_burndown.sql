create extension if not exists pgcrypto;

-- completed_at when status transitions to done
alter table growth_plan_levers add column if not exists completed_at timestamptz;
create or replace function set_completed_at() returns trigger as $$
begin
  if new.status='done' and (old.status is distinct from 'done') then
    new.completed_at := now();
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_lever_done_ts on growth_plan_levers;
create trigger trg_lever_done_ts before update on growth_plan_levers
for each row execute function set_completed_at();

-- blocked_at when status transitions to blocked
alter table growth_plan_levers add column if not exists blocked_at timestamptz;
create or replace function set_blocked_at() returns trigger as $$
begin
  if new.status='blocked' and (old.status is distinct from 'blocked') then
    new.blocked_at := now();
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_lever_blocked_ts on growth_plan_levers;
create trigger trg_lever_blocked_ts before update on growth_plan_levers
for each row execute function set_blocked_at();

-- Health view
create or replace view growth_plan_health_v as
select p.id as plan_id,
       count(l.*)                            as total,
       count(*) filter (where l.status='done')::float / nullif(count(*),0) as completion_ratio,
       count(*) filter (where l.status='blocked')                           as blocked_count,
       round(avg(nullif(l.impact,0)),2)                                      as avg_impact,
       round(avg(nullif(l.effort,0)),2)                                      as avg_effort
from growth_plans p
left join growth_plan_levers l on l.plan_id = p.id
group by p.id;

-- Burndown view
create or replace view growth_plan_burndown_v as
select p.id as plan_id, dd::date as day,
       sum( case when l.status='done' and coalesce(l.completed_at, l.due_date, p.period_end) <= dd then 0 else 1 end ) as open_levers
from growth_plans p
cross join lateral generate_series(p.period_start, p.period_end, interval '1 day') as g(dd)
left join growth_plan_levers l on l.plan_id = p.id
group by p.id, day
order by plan_id, day;

-- Guardrail: clamp lever due_date to plan window
create or replace function clamp_lever_due_date() returns trigger as $$
declare ps date; pe date;
begin
  select period_start, period_end into ps, pe from growth_plans where id=new.plan_id;
  if new.due_date is not null then
    if new.due_date < ps then new.due_date := ps; end if;
    if new.due_date > pe then new.due_date := pe; end if;
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_lever_due_clamp on growth_plan_levers;
create trigger trg_lever_due_clamp before insert or update on growth_plan_levers
for each row execute function clamp_lever_due_date();

-- KPIs per lever
create table if not exists growth_plan_kpis (
  id uuid primary key default gen_random_uuid(),
  lever_id uuid references growth_plan_levers(id) on delete cascade,
  name text not null,
  unit text,
  baseline numeric,
  target numeric,
  current numeric,
  last_updated timestamptz default now()
);

create index if not exists idx_kpis_lever on growth_plan_kpis(lever_id);

-- RLS for KPIs
alter table growth_plan_kpis enable row level security;
do $$ begin
  perform 1 from pg_policies where schemaname = 'public' and tablename = 'growth_plan_kpis' and policyname = 'gpk_owner_rw';
  if not found then
    create policy "gpk_owner_rw" on growth_plan_kpis
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


