-- Fix unique constraints for team_people without using non-immutable functions
-- Ensure uniqueness by org+email when org present, else by creator+email

do $$ begin
  if exists (
    select 1 from pg_indexes where indexname = 'uq_team_people_org_email'
  ) then
    -- noop; created by prior migration maybe; else we'll recreate below
    null;
  end if;
end $$;

create unique index if not exists uq_team_people_org_email
  on team_people(org_id, lower(email))
  where org_id is not null;

create unique index if not exists uq_team_people_creator_email
  on team_people(created_by, lower(email))
  where org_id is null;


