import type { Role } from '@/types';

/**
 * Permission predicates — used both server-side (for authorization) and
 * client-side (for UI hiding). Server-side is always source of truth;
 * client-side hiding is cosmetic only.
 */

export const permissions = {
  // Top-level access
  accessOwnerWorkspace: (role: Role) =>
    role === 'owner' || role === 'admin' || role === 'trainer',

  // Client data
  viewAllClients: (role: Role) => role === 'owner' || role === 'admin',
  createClient: (role: Role) => role === 'owner' || role === 'admin',
  editClient: (role: Role) => role === 'owner' || role === 'admin',
  archiveClient: (role: Role) => role === 'owner' || role === 'admin',

  // Leads
  viewLeads: (role: Role) => role === 'owner' || role === 'admin',
  manageLeads: (role: Role) => role === 'owner' || role === 'admin',

  // Programs
  generateProgram: (role: Role) => role === 'owner' || role === 'admin' || role === 'trainer',
  approveProgram: (role: Role) => role === 'owner' || role === 'admin',
  editProgram: (role: Role) => role === 'owner' || role === 'admin',

  // Billing
  viewBilling: (role: Role) => role === 'owner' || role === 'admin',
  editBilling: (role: Role) => role === 'owner',

  // Settings
  editBusinessSettings: (role: Role) => role === 'owner',
  manageUsers: (role: Role) => role === 'owner',
  manageIntegrations: (role: Role) => role === 'owner',

  // AI tools — drafts allowed; only owner can approve
  generateAIDraft: (role: Role) =>
    role === 'owner' || role === 'admin' || role === 'trainer',
  approveAIDraft: (role: Role) => role === 'owner' || role === 'admin',

  // Audit logs
  viewAuditLogs: (role: Role) => role === 'owner',
} as const;

export type Permission = keyof typeof permissions;

export function can(permission: Permission, role: Role): boolean {
  return permissions[permission](role);
}
