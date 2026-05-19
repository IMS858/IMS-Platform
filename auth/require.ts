import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import type { Role } from '@/types';

/**
 * Returns the authenticated user + profile.
 * Redirects to /login if not authenticated.
 *
 * Use in any Server Component, Server Action, or Route Handler that requires auth.
 */
export async function requireAuth() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, organization_id, totp_enabled')
    .eq('id', user.id)
    .single<{
      id: string;
      role: Role;
      full_name: string;
      organization_id: string;
      totp_enabled: boolean;
    }>();

  if (error || !profile) {
    // No profile = corrupt account state. Sign out and force re-auth.
    await supabase.auth.signOut();
    redirect('/login?error=no_profile');
  }

  return { user, profile, supabase };
}

/**
 * Require one of the specified roles.
 * Redirects to /login if not authenticated; /forbidden if wrong role.
 *
 * This is the workhorse. Call as the FIRST line of any protected server action.
 *
 * @example
 *   export async function archiveClient(clientId: string) {
 *     const { profile } = await requireRole(['owner', 'admin']);
 *     // ... mutation
 *   }
 */
export async function requireRole(allowedRoles: Role[]) {
  const auth = await requireAuth();
  if (!allowedRoles.includes(auth.profile.role)) {
    redirect('/forbidden');
  }
  return auth;
}

/**
 * Shorthand for the owner-only guard (most common case in Phase 1).
 */
export async function requireOwner() {
  return requireRole(['owner']);
}

/**
 * Owner OR admin — useful for most mutation operations.
 */
export async function requireOwnerOrAdmin() {
  return requireRole(['owner', 'admin']);
}
