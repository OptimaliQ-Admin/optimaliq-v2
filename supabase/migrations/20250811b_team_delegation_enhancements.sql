-- Team Delegation Enhancements (Phase 1B)
create extension if not exists pgcrypto;

-- Managed contacts for delegation
create table if not exists team_people (
  id uuid primary key default gen_random_uuid(),
  org_id uuid null,
  created_by uuid not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  role text null,
  created_at timestamptz not null default now(),
  unique (created_by, email)
);
create index if not exists idx_team_people_creator on team_people(created_by);

-- Invite tokens for anonymous access
create table if not exists assessment_invites (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references assessment_campaigns(id) on delete cascade,
  assignment_id uuid not null references assessment_assignments(id) on delete cascade,
  invite_email text not null,
  invite_name text null,
  token text not null,
  expires_at timestamptz not null,
  first_opened_at timestamptz null,
  last_opened_at timestamptz null,
  status text not null default 'sent',
  created_at timestamptz not null default now(),
  unique(token)
);
create index if not exists idx_invites_assignment on assessment_invites(assignment_id);
create index if not exists idx_invites_status on assessment_invites(status);
create index if not exists idx_invites_expires on assessment_invites(expires_at);

-- Frozen config per campaign (AI-generated or stock)
create table if not exists assessment_campaign_configs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references assessment_campaigns(id) on delete cascade,
  config jsonb not null,
  created_at timestamptz not null default now(),
  unique (campaign_id)
);

-- Link scoring results to assignments; add short insights
alter table assessment_scoring_results add column if not exists assignment_id uuid null;
create index if not exists idx_scoring_assignment on assessment_scoring_results(assignment_id);
alter table assessment_scoring_results add column if not exists short_insights jsonb null;

-- RPC: get submissions for owner's campaigns
create or replace function get_team_submissions(owner_id uuid)
returns table (
  submission_id uuid,
  assignment_id uuid,
  campaign_id uuid,
  assignee_u_id uuid,
  submitted_at timestamptz,
  status text,
  title text,
  type_slug text,
  overall_score numeric
)
language sql as $$
  select s.id as submission_id,
         a.id as assignment_id,
         c.id as campaign_id,
         a.assignee_u_id,
         s.submitted_at,
         s.status,
         c.title,
         c.type_slug,
         scr.overall_score
  from assessment_campaigns c
  join assessment_assignments a on a.campaign_id = c.id
  left join assessment_submissions s on s.assignment_id = a.id
  left join assessment_scoring_results scr on scr.assignment_id = a.id
  where c.owner_u_id = owner_id
  order by s.submitted_at desc nulls last;
$$;

-- RLS enablement (policies should align with app server using service role)
alter table if exists team_people enable row level security;
alter table if exists assessment_invites enable row level security;
alter table if exists assessment_campaign_configs enable row level security;

-- Basic owner policy for team_people (created_by)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'team_people' and policyname = 'team_people_owner_rw'
  ) then
    create policy team_people_owner_rw on team_people
      for all
      using (created_by = auth.uid())
      with check (created_by = auth.uid());
  end if;
end $$;

-- Restrictive policies for invites/configs (app accesses via service role)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assessment_invites' and policyname = 'assessment_invites_no_public'
  ) then
    create policy assessment_invites_no_public on assessment_invites for select to authenticated using (false);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assessment_campaign_configs' and policyname = 'assessment_campaign_configs_no_public'
  ) then
    create policy assessment_campaign_configs_no_public on assessment_campaign_configs for select to authenticated using (false);
  end if;
end $$;

-- RPCs for rollup/expire and MV refresh
create or replace function expire_old_invites()
returns void language plpgsql as $$
begin
  update assessment_invites set status='expired'
  where status in ('sent','opened') and expires_at < now();
  update assessment_assignments set status='expired'
  where status in ('pending','in_progress') and id in (
    select assignment_id from assessment_invites where status='expired'
  );
end; $$;

create or replace function refresh_team_materialized_views()
returns void language plpgsql as $$
begin
  refresh materialized view concurrently mv_team_assessment_progress;
  -- heatmap refresh will be added once assignment-linked scoring is populated reliably
end; $$;


