import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * ⚠️ ADMIN CLIENT — SERVICE ROLE KEY ⚠️
 *
 * This client bypasses Row Level Security. It uses the SUPABASE_SERVICE_ROLE_KEY
 * and has full database access regardless of user.
 *
 * STRICT USAGE RULES:
 * - NEVER import this in a Client Component (will error at build time anyway)
 * - NEVER import this in a public route handler without strict input validation
 * - ONLY use for:
 *     - Stripe webhook handlers (server-to-server)
 *     - Scheduled jobs / cron tasks
 *     - System-level audit log writes when user context is unavailable
 *     - One-off migrations or backfills
 *
 * For ALL user-facing data access, use createServerClient() from ./server.ts
 * which enforces RLS as the authenticated user.
 */
export function createServiceRoleClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Service role client cannot be used in the browser.');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
