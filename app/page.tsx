import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Root URL handler.
 *
 * Behavior:
 *   - Logged-in user → redirect to /today
 *   - Anonymous visitor → redirect to /login
 *
 * No UI ever renders here — both branches redirect server-side, which is
 * faster and avoids a flash of unauthenticated content.
 */
export default async function RootPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/today');
  }
  redirect('/login');
}
