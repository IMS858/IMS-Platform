/**
 * Server Action Security Wrappers
 *
 * Why: It's easy to forget to call requireOwner() at the top of every server
 * action. A single forgotten check could expose the service-role client to
 * unauthenticated callers. These wrappers make the auth check unforgettable —
 * the action body literally cannot execute without it.
 *
 * Usage:
 *
 *   // Before (easy to forget):
 *   export async function archiveClient(clientId: string) {
 *     await requireOwner();  // ← if you forget this, anyone can call it
 *     // mutation...
 *   }
 *
 *   // After (impossible to forget):
 *   export const archiveClient = withOwnerAuth(async ({ supabase, profile }, clientId: string) => {
 *     // The wrapper has already verified the caller is an owner.
 *     // `supabase` is the RLS-scoped client; `profile` is the verified profile.
 *     // mutation...
 *   });
 */

import { requireOwner, requireOwnerOrAdmin, requireAuth } from '@/lib/auth/require';
import { logAudit } from '@/lib/audit/log';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Role } from '@/types';

/**
 * The verified auth context passed to your action body.
 * `supabase` is the RLS-scoped server client (NOT service-role).
 */
export type AuthContext = {
  supabase: SupabaseClient<Database>;
  profile: {
    id: string;
    role: Role;
    full_name: string;
    organization_id: string;
    totp_enabled: boolean;
  };
  user: { id: string; email?: string | null };
};

/**
 * Wrap a server action so it only runs for the owner role.
 *
 * The wrapped function receives auth context as its first argument, then
 * whatever original arguments you defined.
 */
export function withOwnerAuth<TArgs extends unknown[], TResult>(
  action: (ctx: AuthContext, ...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const ctx = (await requireOwner()) as unknown as AuthContext;
    return action(ctx, ...args);
  };
}

/**
 * Wrap a server action so it runs for owner OR admin.
 */
export function withOwnerOrAdminAuth<TArgs extends unknown[], TResult>(
  action: (ctx: AuthContext, ...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const ctx = (await requireOwnerOrAdmin()) as unknown as AuthContext;
    return action(ctx, ...args);
  };
}

/**
 * Wrap with custom role allowlist.
 */
export function withRoleAuth<TArgs extends unknown[], TResult>(
  allowedRoles: Role[],
  action: (ctx: AuthContext, ...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const ctx = (await requireAuth()) as unknown as AuthContext;
    if (!allowedRoles.includes(ctx.profile.role)) {
      throw new Error('FORBIDDEN: insufficient role');
    }
    return action(ctx, ...args);
  };
}

/**
 * For sensitive mutations: wraps with owner auth AND auto-logs to audit_logs.
 *
 * @example
 *   export const archiveClient = withAudit('client.archive', 'client',
 *     async (ctx, clientId: string) => {
 *       await ctx.supabase.from('clients').update({ archived_at: 'now()' }).eq('id', clientId);
 *       return clientId;  // return value becomes the audited resourceId
 *     }
 *   );
 */
export function withAudit<TArgs extends unknown[], TResourceId extends string>(
  action: string,
  resourceType: string,
  body: (ctx: AuthContext, ...args: TArgs) => Promise<TResourceId>,
): (...args: TArgs) => Promise<TResourceId> {
  return withOwnerOrAdminAuth(async (ctx, ...args) => {
    const resourceId = await body(ctx, ...args);
    await logAudit({
      action: action as never, // typed enum is enforced in lib/audit/log.ts at runtime
      resourceType: resourceType as never,
      resourceId,
      metadata: { args: safeArgsForAudit(args) },
    });
    return resourceId;
  });
}

/**
 * Strip large/sensitive args before logging to audit_logs.
 * Truncates strings; replaces objects with shallow keys.
 */
function safeArgsForAudit(args: unknown[]): unknown[] {
  return args.map((arg) => {
    if (typeof arg === 'string') return arg.slice(0, 200);
    if (arg === null || typeof arg !== 'object') return arg;
    return Object.keys(arg as Record<string, unknown>);
  });
}
