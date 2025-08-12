-- Org scoping additions
alter table if exists tier2_profiles add column if not exists organization_id uuid;
create index if not exists idx_tier2_profiles_organization on tier2_profiles(organization_id);

-- Ensure campaigns/assignments have org_id for scoping
alter table if exists assessment_campaigns add column if not exists org_id uuid;
create index if not exists idx_assessment_campaigns_org on assessment_campaigns(org_id);
alter table if exists assessment_assignments add column if not exists org_id uuid;
create index if not exists idx_assessment_assignments_org on assessment_assignments(org_id);


