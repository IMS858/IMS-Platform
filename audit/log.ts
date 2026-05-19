import { createServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export type AuditAction =
  | 'client.created'
  | 'client.updated'
  | 'client.archived'
  | 'client.restored'
  | 'session.created'
  | 'session.completed'
  | 'session.cancelled'
  | 'session.no_show'
  | 'session.notes_updated'
  | 'lead.created'
  | 'lead.updated'
  | 'lead.converted'
  | 'lead.lost'
  | 'lead.archived'
  | 'program.draft_generated'
  | 'program.approved'
  | 'program.activated'
  | 'program.archived'
  | 'billing.status_changed'
  | 'billing.plan_changed'
  | 'ai.draft_generated'
  | 'ai.draft_approved'
  | 'ai.draft_rejected'
  | 'user.login'
  | 'user.logout'
  | 'user.password_reset'
  | 'settings.changed';

export type AuditResource =
  | 'client'
  | 'session'
  | 'lead'
  | 'program'
  | 'assessment'
  | 'billing_record'
  | 'ai_generation'
  | 'user'
  | 'settings';

interface AuditPayload {
  action: AuditAction;
  resourceType: AuditResource;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Append an entry to the audit log.
 *
 * Call this AFTER your mutation succeeds, before returning from the
 * Server Action / Route Handler. It uses the user-scoped client so the
 * actor is captured automatically via RLS.
 *
 * Failures here are logged but do NOT throw — we never want a failed audit
 * write to break the user-facing operation. (Tradeoff: if audit log is
 * critical for compliance, run it inside an explicit transaction with the
 * mutation, which Supabase doesn't natively support yet — use RPC.)
 */
export async function logAudit(payload: AuditPayload): Promise<void> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn('[audit] No user context, skipping log:', payload.action);
      return;
    }

    const hdrs = await headers();
    const ipAddress =
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || hdrs.get('x-real-ip') || null;
    const userAgent = hdrs.get('user-agent') || null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single<{ organization_id: string }>();

    await supabase.from('audit_logs').insert({
      organization_id: profile?.organization_id ?? null,
      actor_user_id: user.id,
      action: payload.action,
      resource_type: payload.resourceType,
      resource_id: payload.resourceId ?? null,
      metadata: payload.metadata ?? {},
      ip_address: ipAddress,
      user_agent: userAgent,
    } as never);
  } catch (err) {
    // Never throw from audit log
    console.error('[audit] Failed to write log:', err);
  }
}
