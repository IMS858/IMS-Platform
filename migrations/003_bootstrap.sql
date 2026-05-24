-- ============================================================================
-- IMS Platform — Bootstrap
-- ============================================================================
-- Creates the IMS organization and a helper trigger to auto-create a profile
-- for each new auth user. The first user signed up becomes an owner; subsequent
-- users default to 'client' until manually promoted.
-- ============================================================================

insert into organizations (id, name, slug, settings)
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Innovative Movement Solutions',
  'ims',
  jsonb_build_object(
    'address', '10625 Scripps Ranch Blvd, Suite D, San Diego, CA 92131',
    'phone', '(619) 937-1434',
    'email', 'admin@imsfitnesscenter.com',
    'website', 'https://imsmethod.com'
  )
)
on conflict (id) do nothing;

-- Default rooms
insert into rooms (organization_id, name, capacity, service_types)
values
  ('00000000-0000-0000-0000-000000000001', 'Strength Floor', 1,
   array['coaching_session','movement_assessment','consultation']::service_type[]),
  ('00000000-0000-0000-0000-000000000001', 'Recovery Room', 4,
   array['recovery_room']::service_type[]),
  ('00000000-0000-0000-0000-000000000001', 'Mobility / Mat Space', 1,
   array['coaching_session','movement_assessment']::service_type[])
on conflict do nothing;

-- ============================================================================
-- Auto-create profile on signup
-- ============================================================================
-- First user in the org becomes 'owner'. All later signups default to 'client'.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  org_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  is_first_user boolean;
  new_role user_role;
begin
  select count(*) = 0 into is_first_user from profiles where organization_id = org_id;
  new_role := case when is_first_user then 'owner'::user_role else 'client'::user_role end;

  insert into profiles (id, organization_id, role, full_name)
  values (
    new.id,
    org_id,
    new_role,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
