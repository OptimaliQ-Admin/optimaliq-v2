-- Team workspace schema additions
create extension if not exists pgcrypto;

create table if not exists assessment_campaigns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid null,
  owner_u_id uuid not null,
  type_slug text not null,
  title text not null,
  starts_at timestamptz null,
  due_at timestamptz null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaigns_owner on assessment_campaigns(owner_u_id);
create index if not exists idx_campaigns_status on assessment_campaigns(status);
create index if not exists idx_campaigns_due_at on assessment_campaigns(due_at);

create table if not exists assessment_assignments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid null,
  campaign_id uuid not null references assessment_campaigns(id) on delete cascade,
  assignee_u_id uuid not null,
  due_at timestamptz null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_assignments_campaign on assessment_assignments(campaign_id);
create index if not exists idx_assignments_assignee on assessment_assignments(assignee_u_id);
create index if not exists idx_assignments_status on assessment_assignments(status);

create table if not exists assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assessment_assignments(id) on delete cascade,
  submitted_by uuid not null,
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create index if not exists idx_submissions_assignment on assessment_submissions(assignment_id);

create table if not exists question_responses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references assessment_submissions(id) on delete cascade,
  question_key text not null,
  value_json jsonb not null,
  confidence numeric null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_responses_submission on question_responses(submission_id);
create index if not exists idx_responses_question on question_responses(question_key);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references assessment_submissions(id) on delete cascade,
  reviewer_u_id uuid not null,
  status text not null default 'pending',
  comments text null,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  parent_type text not null,
  parent_id uuid not null,
  author_u_id uuid not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  parent_type text not null,
  parent_id uuid not null,
  channel text not null,
  schedule text not null,
  status text not null default 'active',
  last_sent_at timestamptz null,
  created_at timestamptz not null default now()
);

-- Progress MV: assignments by status per owner
create materialized view if not exists mv_team_assessment_progress as
select
  c.owner_u_id,
  c.type_slug,
  count(a.*) filter (where a.status='pending') as pending,
  count(a.*) filter (where a.status='in_progress') as in_progress,
  count(a.*) filter (where a.status='submitted') as submitted,
  count(a.*) filter (where a.status='completed') as completed,
  count(a.*) as total
from assessment_campaigns c
join assessment_assignments a on a.campaign_id = c.id
group by 1,2;

-- Capability heatmap: average overall scores per assignee (simplified)
create materialized view if not exists mv_team_capability_heatmap as
select 
  user_id as assignee_u_id,
  'overall'::text as type_slug,
  avg(overall_score) as avg_score,
  count(*) as n
from assessment_scoring_results
group by 1,2;

-- Simple updated_at trigger for campaigns/assignments
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_campaigns_updated on assessment_campaigns;
create trigger trg_campaigns_updated before update on assessment_campaigns
for each row execute procedure set_updated_at();

drop trigger if exists trg_assignments_updated on assessment_assignments;
create trigger trg_assignments_updated before update on assessment_assignments
for each row execute procedure set_updated_at();

