'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password is too short'),
});

export async function signInAction(formData: FormData): Promise<{ error?: string }> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid credentials' };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Don't leak which factor failed (email vs password) — generic message
    return { error: 'Invalid email or password.' };
  }

  return {};
}

export async function signOutAction(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
}
