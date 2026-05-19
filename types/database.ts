/**
 * Database type definitions.
 *
 * In production you would generate these with `supabase gen types typescript --local`.
 * This file is a hand-written minimum surface for Phase 1 — accurate enough to
 * type-check Server Components against tables that exist in db/migrations/001_init.sql.
 *
 * Regenerate after every migration once Supabase CLI is connected.
 */

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          role: 'owner' | 'admin' | 'trainer' | 'client';
          full_name: string;
          phone: string | null;
          totp_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      clients: {
        Row: {
          id: string;
          organization_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          dob: string | null;
          status: 'active' | 'paused' | 'inactive' | 'archived';
          risk_level: 'low' | 'medium' | 'high';
          primary_goal: string | null;
          tags: string[];
          stripe_customer_id: string | null;
          joined_at: string | null;
          created_by: string | null;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['clients']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & { id?: string };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          source: 'website' | 'referral' | 'google' | 'instagram' | 'walk_in' | 'other';
          stage: 'new' | 'contacted' | 'assessment_booked' | 'showed' | 'converted' | 'lost';
          interest: string | null;
          last_contacted_at: string | null;
          next_follow_up_at: string | null;
          converted_client_id: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          organization_id: string;
          client_id: string;
          trainer_id: string | null;
          service_type: 'movement_assessment' | 'coaching_session' | 'recovery_room' | 'consultation';
          room_id: string | null;
          starts_at: string;
          duration_min: number;
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
          coach_notes: string | null;
          client_notes: string | null;
          completed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string | null;
          actor_user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'> & {
          id?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_owner: { Args: Record<string, never>; Returns: boolean };
      is_admin_or_owner: { Args: Record<string, never>; Returns: boolean };
      current_org: { Args: Record<string, never>; Returns: string };
    };
    Enums: {
      user_role: 'owner' | 'admin' | 'trainer' | 'client';
    };
  };
}
