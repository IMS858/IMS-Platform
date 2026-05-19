-- ============================================================================
-- IMS Platform — Initial Schema
-- ============================================================================
-- Run in Supabase SQL Editor. Idempotent where possible.
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
do $$ begin
  create type user_role as enum ('owner', 'admin', 'trainer', 'client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type client_status as enum ('active', 'paused', 'inactive', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type risk_level as enum ('low', 'medium', 'high');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum (
    'movement_assessment', 'coaching_session', 'recovery_room', 'consultation'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type session_status as enum (
    'scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_source as enum (
    'website', 'referral', 'google', 'instagram', 'walk_in', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_stage as enum (
    'new', 'contacted', 'assessment_booked', 'showed', 'converted', 'lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type program_state as enum ('draft', 'active', 'completed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type program_type as enum (
    'strength', 'mobility', 'hybrid', 'body_composition',
    'return_to_training', 'posterior_chain', 'joint_specific'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type billing_state as enum (
    'active', 'past_due', 'cancelled', 'paused', 'manual', 'none'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('low', 'medium', 'high', 'urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('open', 'in_progress', 'completed', 'dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ai_generation_kind as enum (
    'program_draft', 'bod_pod_interpretation', 'follow_up_message',
    'review_request', 'assessment_summary'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type ai_generation_status as enum ('draft', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Organizations (single-tenant now, future-proof)
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles — one per auth user
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete restrict,
  role user_role not null default 'client',
  full_name text not null,
  phone text,
  totp_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_org_idx on profiles(organization_id);

-- Clients
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  dob date,
  status client_status not null default 'active',
  risk_level risk_level not null default 'low',
  primary_goal text,
  tags text[] not null default array[]::text[],
  stripe_customer_id text,
  joined_at timestamptz,
  created_by uuid references profiles(id),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clients_org_idx on clients(organization_id);
create index if not exists clients_status_idx on clients(organization_id, status) where archived_at is null;
create index if not exists clients_risk_idx on clients(organization_id, risk_level) where archived_at is null;

-- Rooms
create table if not exists rooms (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  capacity int not null default 1,
  service_types service_type[] not null default array[]::service_type[],
  created_at timestamptz not null default now()
);

-- Sessions
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  trainer_id uuid references profiles(id),
  service_type service_type not null,
  room_id uuid references rooms(id),
  starts_at timestamptz not null,
  duration_min int not null default 60 check (duration_min between 5 and 480),
  status session_status not null default 'scheduled',
  coach_notes text,
  client_notes text,
  completed_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sessions_starts_at_idx on sessions(organization_id, starts_at);
create index if not exists sessions_client_idx on sessions(client_id, starts_at desc);
create index if not exists sessions_status_idx on sessions(organization_id, status, starts_at);

-- Leads
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  source lead_source not null default 'website',
  stage lead_stage not null default 'new',
  interest text,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  converted_client_id uuid references clients(id),
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_stage_idx on leads(organization_id, stage);
create index if not exists leads_follow_up_idx on leads(organization_id, next_follow_up_at)
  where stage not in ('converted', 'lost');

-- Programs
create table if not exists programs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  type program_type not null,
  frequency int not null check (frequency between 1 and 7),
  state program_state not null default 'draft',
  blocks jsonb not null default '[]'::jsonb,
  start_date date,
  coach_review_required boolean not null default true,
  ai_generation_id uuid,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  created_by uuid references profiles(id),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists programs_client_idx on programs(client_id, state);

-- Assessments
create table if not exists assessments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  type text not null,
  findings jsonb not null default '{}'::jsonb,
  goals jsonb not null default '{}'::jsonb,
  recommendations text,
  assessed_by uuid references profiles(id),
  assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists assessments_client_idx on assessments(client_id, assessed_at desc);

-- Body composition
create table if not exists body_comp (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  method text not null default 'bod_pod',
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,2),
  fat_mass_kg numeric(5,2),
  lean_mass_kg numeric(5,2),
  measured_at timestamptz not null default now(),
  interpretation text,
  created_at timestamptz not null default now()
);
create index if not exists body_comp_client_idx on body_comp(client_id, measured_at desc);

-- Notes
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  author_id uuid references profiles(id),
  body text not null,
  client_visible boolean not null default false,
  pinned boolean not null default false,
  tags text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_client_idx on notes(client_id, pinned desc, created_at desc);

-- Tasks (follow-ups)
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  subject_client_id uuid references clients(id) on delete cascade,
  subject_lead_id uuid references leads(id) on delete cascade,
  title text not null,
  body text,
  due_at timestamptz,
  priority task_priority not null default 'medium',
  status task_status not null default 'open',
  assigned_to uuid references profiles(id),
  created_by uuid references profiles(id),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((subject_client_id is not null) or (subject_lead_id is not null))
);
create index if not exists tasks_status_idx on tasks(organization_id, status, due_at);
create index if not exists tasks_client_idx on tasks(subject_client_id, status);

-- Billing records (manual + Stripe-synced)
create table if not exists billing_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  plan_name text not null,
  monthly_value_cents int not null default 0,
  state billing_state not null default 'manual',
  stripe_subscription_id text,
  next_invoice_at timestamptz,
  manual_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists billing_client_idx on billing_records(client_id, state);

-- AI generations (audit + drafts)
create table if not exists ai_generations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  kind ai_generation_kind not null,
  prompt jsonb not null default '{}'::jsonb,
  output_text text not null,
  output_data jsonb,
  status ai_generation_status not null default 'draft',
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists ai_gen_client_idx on ai_generations(client_id, created_at desc);
create index if not exists ai_gen_status_idx on ai_generations(organization_id, status);

-- Tags (reusable)
create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  color text not null default '#A89F8E',
  category text,
  created_at timestamptz not null default now(),
  unique(organization_id, name)
);

-- Settings (org-level k/v)
create table if not exists settings (
  organization_id uuid not null references organizations(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id),
  primary key (organization_id, key)
);

-- Audit logs (append-only)
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists audit_actor_idx on audit_logs(actor_user_id, created_at desc);
create index if not exists audit_resource_idx on audit_logs(resource_type, resource_id);
create index if not exists audit_org_idx on audit_logs(organization_id, created_at desc);

-- ============================================================================
-- TRIGGERS — auto-update updated_at
-- ============================================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in
    select unnest(array[
      'organizations','profiles','clients','sessions','leads','programs',
      'notes','tasks','billing_records'
    ])
  loop
    execute format(
      'drop trigger if exists set_updated_at on %I;
       create trigger set_updated_at before update on %I
       for each row execute function set_updated_at();',
      t, t
    );
  end loop;
end $$;

-- ============================================================================
-- HELPER FUNCTIONS — used by RLS policies
-- ============================================================================
create or replace function current_org()
returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from profiles where id = auth.uid();
$$;

create or replace function is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'owner' from profiles where id = auth.uid()), false);
$$;

create or replace function is_admin_or_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('owner','admin') from profiles where id = auth.uid()),
    false
  );
$$;

create or replace function is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('owner','admin','trainer') from profiles where id = auth.uid()),
    false
  );
$$;
