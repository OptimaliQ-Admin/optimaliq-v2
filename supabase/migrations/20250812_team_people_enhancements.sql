-- Team People Enhancements: add department/title, status, unique by org+email
alter table if exists team_people add column if not exists department text;
alter table if exists team_people add column if not exists title text;
alter table if exists team_people add column if not exists status text not null default 'active';

-- Prefer org-scoped uniqueness; keep legacy unique(created_by,email) if present
do $$ begin
  if not exists (
    select 1 from pg_indexes 
    where indexname = 'uq_team_people_org_email'
  ) then
    create unique index uq_team_people_org_email on team_people((coalesce(org_id, gen_random_uuid())), lower(email));
  end if;
end $$;

create index if not exists idx_team_people_org on team_people(org_id);
create index if not exists idx_team_people_status on team_people(status);


