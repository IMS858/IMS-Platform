/**
 * Phase 1 Mock Data
 *
 * Used while the UI is being built before Supabase is wired into the data layer.
 * Realistic and IMS-branded. Replace with real Supabase queries in Phase 2.
 */

import type { SmartAction } from '@/types';

export const mockMetrics = {
  todaysSessions: 6,
  activeClients: 24,
  openLeads: 7,
  estimatedMRR: 1842000, // $18,420 stored as cents
  followUpsDue: 4,
};

export const mockActions: SmartAction[] = [
  {
    id: 'a1',
    kind: 'new_lead',
    personName: 'Erin Walsh',
    personId: 'l_101',
    why: 'Booked a free assessment 2 days ago. Not contacted yet.',
    suggestedAction: 'Text Erin to confirm tomorrow at 9 AM.',
    primaryActionLabel: 'Draft a text',
    primaryActionHref: '/tools/follow-up?leadId=l_101',
    priority: 'urgent',
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'a2',
    kind: 'churn_risk',
    personName: 'Marcus Aliotti',
    personId: 'c_201',
    why: 'No session in 17 days. No future session booked. Still active member.',
    suggestedAction: 'Check in and re-book this week.',
    primaryActionLabel: 'Send a check-in',
    primaryActionHref: '/clients/c_201',
    priority: 'high',
  },
  {
    id: 'a3',
    kind: 'review_opportunity',
    personName: 'Sarah Chen',
    personId: 'c_202',
    why: 'Just hit her 5th session. Reported the deadlift PR was "the best her back has felt in years".',
    suggestedAction: 'Ask for a Google review.',
    primaryActionLabel: 'Draft review request',
    primaryActionHref: '/tools/review-request?clientId=c_202',
    priority: 'medium',
  },
  {
    id: 'a4',
    kind: 'program_update',
    personName: 'David Reyes',
    personId: 'c_203',
    why: 'Program hits 12-week mark on Friday. Ready for a new phase.',
    suggestedAction: 'Generate a new strength block.',
    primaryActionLabel: 'Build program',
    primaryActionHref: '/programs/new?clientId=c_203',
    priority: 'medium',
  },
  {
    id: 'a5',
    kind: 'birthday',
    personName: 'Linda Pham',
    personId: 'c_204',
    why: 'Birthday tomorrow.',
    suggestedAction: 'Send a quick text from Jason.',
    primaryActionLabel: 'Draft a note',
    primaryActionHref: '/tools/follow-up?clientId=c_204',
    priority: 'low',
  },
  {
    id: 'a6',
    kind: 'missing_session_notes',
    personName: 'James Wilson',
    personId: 'c_205',
    why: 'Session completed yesterday — no coach notes logged.',
    suggestedAction: 'Add notes before they get foggy.',
    primaryActionLabel: 'Log notes',
    primaryActionHref: '/clients/c_205',
    priority: 'medium',
  },
];

export const mockTodaySessions = [
  {
    id: 's1',
    time: '7:00 AM',
    clientName: 'Marcus Aliotti',
    serviceType: 'Coaching Session',
    room: 'Strength Floor',
    status: 'scheduled' as const,
  },
  {
    id: 's2',
    time: '8:30 AM',
    clientName: 'Sarah Chen',
    serviceType: 'Coaching Session',
    room: 'Strength Floor',
    status: 'completed' as const,
  },
  {
    id: 's3',
    time: '10:00 AM',
    clientName: 'Erin Walsh',
    serviceType: 'Movement Assessment',
    room: 'Mobility / Mat Space',
    status: 'scheduled' as const,
  },
  {
    id: 's4',
    time: '12:00 PM',
    clientName: 'David Reyes',
    serviceType: 'Coaching Session',
    room: 'Strength Floor',
    status: 'scheduled' as const,
  },
  {
    id: 's5',
    time: '3:30 PM',
    clientName: 'Linda Pham',
    serviceType: 'Coaching Session',
    room: 'Strength Floor',
    status: 'scheduled' as const,
  },
  {
    id: 's6',
    time: '5:00 PM',
    clientName: 'James Wilson',
    serviceType: 'Coaching Session',
    room: 'Strength Floor',
    status: 'scheduled' as const,
  },
];

export const mockLeadSnapshot = {
  newUncontacted: [
    { id: 'l_101', name: 'Erin Walsh', source: 'Website', daysOld: 2 },
    { id: 'l_102', name: 'Tomas Reyes', source: 'Instagram', daysOld: 1 },
  ],
  assessmentBooked: [
    { id: 'l_103', name: 'Priya Iyengar', source: 'Referral', scheduledFor: 'Thu 10 AM' },
  ],
  stuck: [
    { id: 'l_104', name: 'Chris Bauer', source: 'Google', daysStuck: 9, lastStage: 'Showed' },
  ],
};

export const mockClientMomentum = {
  recentWins: [
    {
      id: 'm1',
      clientName: 'Sarah Chen',
      win: 'Deadlift PR · 185 lb × 5 (up from 165)',
      sessionAgo: 1,
    },
    {
      id: 'm2',
      clientName: 'David Reyes',
      win: 'BOD POD: −2.4% body fat in 8 weeks',
      sessionAgo: 0,
    },
    { id: 'm3', clientName: 'Marcus Aliotti', win: '14 sessions completed this month', sessionAgo: 0 },
  ],
  slipping: [
    { id: 's1', clientName: 'James Wilson', detail: '2 no-shows in 3 weeks' },
    { id: 's2', clientName: 'Marcus Aliotti', detail: 'No session booked in 17 days' },
  ],
};

export const mockRevenueSnapshot = {
  estimatedMRR: 18420_00, // cents
  sessionsThisWeek: 31,
  activeSubscriptions: 17,
  manualBillingClients: 7,
  pastDue: 1,
  revenueByService: [
    { service: 'Coaching', cents: 13280_00 },
    { service: 'Recovery Room', cents: 2140_00 },
    { service: 'Memberships', cents: 3000_00 },
  ],
};

// Aliases for consistent naming with dashboard components
export const mockMomentum = mockClientMomentum;
