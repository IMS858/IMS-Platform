-- ============================================================================
-- IMS Platform — Row Level Security Policies
-- ============================================================================
-- Run AFTER 001_init.sql. Enables RLS on every table and writes least-privilege
-- policies. Every row access happens within the user's organization_id.
-- ============================================================================

-- Enable RLS on every business table
alter table organizations    enable row level security;
alter table profiles         enable row level security;
alter table clients          enable row level security;
alter table rooms            enable row level security;
alter table sessions         enable row level security;
alter table leads            enable row level security;
alter table programs         enable row level security;
alter table assessments      enable row level security;
alter table body_comp        enable row level security;
alter table notes            enable row level security;
alter table tasks            enable row level security;
alter table billing_records  enable row level security;
alter table ai_generations   enable row level security;
alter table tags             enable row level security;
alter table settings         enable row level security;
alter table audit_logs       enable row level security;

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================
drop policy if exists "org_read_own" on organizations;
create policy "org_read_own" on organizations
  for select using (id = current_org());

drop policy if exists "org_owner_update" on organizations;
create policy "org_owner_update" on organizations
  for update using (id = current_org() and is_owner());

-- ============================================================================
-- PROFILES
-- ============================================================================
drop policy if exists "profile_read_self" on profiles;
create policy "profile_read_self" on profiles
  for select using (id = auth.uid());

drop policy if exists "profile_read_org_staff" on profiles;
create policy "profile_read_org_staff" on profiles
  for select using (organization_id = current_org() and is_staff());

drop policy if exists "profile_update_self" on profiles;
create policy "profile_update_self" on profiles
  for update using (id = auth.uid());

drop policy if exists "profile_owner_manage" on profiles;
create policy "profile_owner_manage" on profiles
  for all using (organization_id = current_org() and is_owner())
  with check (organization_id = current_org() and is_owner());

-- ============================================================================
-- CLIENTS
-- ============================================================================
drop policy if exists "clients_staff_read" on clients;
create policy "clients_staff_read" on clients
  for select using (organization_id = current_org() and is_staff());

drop policy if exists "clients_admin_write" on clients;
create policy "clients_admin_write" on clients
  for all using (organization_id = current_org() and is_admin_or_owner())
  with check (organization_id = current_org() and is_admin_or_owner());

-- (Phase 7) Client self-read
drop policy if exists "clients_self_read" on clients;
create policy "clients_self_read" on clients
  for select using (
    organization_id = current_org()
    and email = (select email from auth.users where id = auth.uid())
  );

-- ============================================================================
-- ROOMS — staff read, owner write
-- ============================================================================
drop policy if exists "rooms_staff_read" on rooms;
create policy "rooms_staff_read" on rooms
  for select using (organization_id = current_org() and is_staff());

drop policy if exists "rooms_owner_write" on rooms;
create policy "rooms_owner_write" on rooms
  for all using (organization_id = current_org() and is_owner())
  with check (organization_id = current_org() and is_owner());

-- ============================================================================
-- SESSIONS
-- ============================================================================
drop policy if exists "sessions_staff_read" on sessions;
create policy "sessions_staff_read" on sessions
  for select using (organization_id = current_org() and is_staff());

drop policy if exists "sessions_staff_write" on sessions;
create policy "sessions_staff_write" on sessions
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

-- ============================================================================
-- LEADS
-- ============================================================================
drop policy if exists "leads_admin_all" on leads;
create policy "leads_admin_all" on leads
  for all using (organization_id = current_org() and is_admin_or_owner())
  with check (organization_id = current_org() and is_admin_or_owner());

-- ============================================================================
-- PROGRAMS
-- ============================================================================
drop policy if exists "programs_staff_read" on programs;
create policy "programs_staff_read" on programs
  for select using (organization_id = current_org() and is_staff());

drop policy if exists "programs_staff_write" on programs;
create policy "programs_staff_write" on programs
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

-- ============================================================================
-- ASSESSMENTS / BODY_COMP / NOTES / TASKS
-- ============================================================================
drop policy if exists "assessments_staff_all" on assessments;
create policy "assessments_staff_all" on assessments
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

drop policy if exists "body_comp_staff_all" on body_comp;
create policy "body_comp_staff_all" on body_comp
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

drop policy if exists "notes_staff_all" on notes;
create policy "notes_staff_all" on notes
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

drop policy if exists "tasks_staff_all" on tasks;
create policy "tasks_staff_all" on tasks
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

-- ============================================================================
-- BILLING — owner/admin only
-- ============================================================================
drop policy if exists "billing_admin_all" on billing_records;
create policy "billing_admin_all" on billing_records
  for all using (organization_id = current_org() and is_admin_or_owner())
  with check (organization_id = current_org() and is_admin_or_owner());

-- ============================================================================
-- AI GENERATIONS
-- ============================================================================
drop policy if exists "ai_gen_staff_all" on ai_generations;
create policy "ai_gen_staff_all" on ai_generations
  for all using (organization_id = current_org() and is_staff())
  with check (organization_id = current_org() and is_staff());

-- ============================================================================
-- TAGS / SETTINGS
-- ============================================================================
drop policy if exists "tags_staff_read" on tags;
create policy "tags_staff_read" on tags
  for select using (organization_id = current_org() and is_staff());

drop policy if exists "tags_admin_write" on tags;
create policy "tags_admin_write" on tags
  for all using (organization_id = current_org() and is_admin_or_owner())
  with check (organization_id = current_org() and is_admin_or_owner());

drop policy if exists "settings_owner_all" on settings;
create policy "settings_owner_all" on settings
  for all using (organization_id = current_org() and is_owner())
  with check (organization_id = current_org() and is_owner());

drop policy if exists "settings_staff_read" on settings;
create policy "settings_staff_read" on settings
  for select using (organization_id = current_org() and is_staff());

-- ============================================================================
-- AUDIT LOGS — append-only, owner read
-- ============================================================================
drop policy if exists "audit_owner_read" on audit_logs;
create policy "audit_owner_read" on audit_logs
  for select using (organization_id = current_org() and is_owner());

drop policy if exists "audit_authenticated_insert" on audit_logs;
create policy "audit_authenticated_insert" on audit_logs
  for insert with check (
    auth.uid() is not null
    and actor_user_id = auth.uid()
    and (organization_id is null or organization_id = current_org())
  );

-- NO update, NO delete policies on audit_logs — they are append-only.
