'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

const ResetSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export async function resetPasswordAction(formData: FormData): Promise<{ error?: string }> {
  const parsed = ResetSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid email' };
  }

  const supabase = await createServerClient();
  const headersList = await headers();
  const origin = headersList.get('origin') || 'https://portal.imsmethod.com';

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/today`,
  });

  // Don't reveal whether the email exists — same response either way
  if (error) {
    console.error('[reset-password]', error.message);
  }

  return {};
}
