import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Browser-side Supabase client for use in Client Components.
 * Reads anon key only. RLS policies fully enforced.
 *
 * Use sparingly — server-side rendering is preferred for security and performance.
 * Best uses: real-time subscriptions, optimistic UI, client-only flows like sign-out.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
