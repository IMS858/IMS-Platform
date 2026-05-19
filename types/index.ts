/**
 * Core IMS domain types — used across server and client code.
 */

export type Role = 'owner' | 'admin' | 'trainer' | 'client';

export type ClientStatus = 'active' | 'paused' | 'inactive' | 'archived';

export type RiskLevel = 'low' | 'medium' | 'high';

export type ServiceType =
  | 'movement_assessment'
  | 'coaching_session'
  | 'recovery_room'
  | 'consultation';

export type SessionStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'assessment_booked'
  | 'showed'
  | 'converted'
  | 'lost';

export type LeadSource =
  | 'website'
  | 'referral'
  | 'google'
  | 'instagram'
  | 'walk_in'
  | 'other';

export type ProgramState = 'draft' | 'active' | 'completed' | 'archived';

export type ProgramType =
  | 'strength'
  | 'mobility'
  | 'hybrid'
  | 'body_composition'
  | 'return_to_training'
  | 'posterior_chain'
  | 'joint_specific';

export type BillingState =
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'paused'
  | 'manual'
  | 'none';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'dismissed';

export type AIGenerationKind =
  | 'program_draft'
  | 'bod_pod_interpretation'
  | 'follow_up_message'
  | 'review_request'
  | 'assessment_summary';

export type AIGenerationStatus = 'draft' | 'approved' | 'rejected';

// --- Smart Action Queue types (Phase 1) ---

export type ActionKind =
  | 'new_lead'
  | 'churn_risk'
  | 'review_opportunity'
  | 'birthday'
  | 'program_update'
  | 'billing_issue'
  | 'assessment_not_converted'
  | 'missing_session_notes'
  | 'follow_up_due';

export interface SmartAction {
  id: string;
  kind: ActionKind;
  personName: string;
  personId?: string;
  why: string;
  suggestedAction: string;
  primaryActionLabel: string;
  primaryActionHref?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueAt?: string; // ISO
}

// --- Profile / User ---

export interface Profile {
  id: string;
  role: Role;
  full_name: string;
  organization_id: string;
  totp_enabled: boolean;
}
