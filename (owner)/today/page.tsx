import { format } from 'date-fns';
import { Suspense } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { MetricCards } from '@/components/dashboard/metric-cards';
import { SmartActionQueue } from '@/components/dashboard/smart-action-queue';
import { StudioFloorToday } from '@/components/dashboard/studio-floor-today';
import { TodaysSchedule } from '@/components/dashboard/todays-schedule';
import { LeadSnapshot } from '@/components/dashboard/lead-snapshot';
import { ClientMomentum } from '@/components/dashboard/client-momentum';
import { RevenueSnapshot } from '@/components/dashboard/revenue-snapshot';
import {
  mockMetrics,
  mockActions,
  mockTodaySessions,
  mockLeadSnapshot,
  mockClientMomentum,
  mockRevenueSnapshot,
  mockStudioFloorToday,
} from '@/lib/seed/mock';

export const metadata = { title: 'Today' };

export default async function TodayPage() {
  const today = new Date();

  // Phase 1: render with mock data. Phase 2 wires these to real Supabase queries.
  const metrics = mockMetrics;
  const actions = mockActions;
  const sessions = mockTodaySessions;
  const leadSnapshot = mockLeadSnapshot;
  const momentum = mockClientMomentum;
  const revenue = mockRevenueSnapshot;
  const studioFloor = mockStudioFloorToday;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={format(today, "EEEE · MMMM d, yyyy")}
        title="Today"
        subtitle="Everything that needs your attention right now."
      />

      {/*
        Compact metric strip — operational counts only.
        MRR is intentionally NOT here; it lives in a smaller bottom card.
      */}
      <Suspense>
        <MetricCards metrics={metrics} />
      </Suspense>

      {/*
        Main grid:
        - Left column (2/3): SmartActionQueue (crown jewel) + TodaysSchedule
        - Right column (1/3): Studio Floor Today + LeadSnapshot + ClientMomentum
      */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SmartActionQueue actions={actions} />
          <TodaysSchedule sessions={sessions} />
        </div>

        <div className="space-y-6">
          <StudioFloorToday items={studioFloor} />
          <LeadSnapshot snapshot={leadSnapshot} />
          <ClientMomentum data={momentum} />
        </div>
      </div>

      {/*
        Revenue snapshot moved to bottom — visible but not premium real estate.
        Jason can see it on a glance but it doesn't crowd the operational view.
      */}
      <RevenueSnapshot data={revenue} />
    </div>
  );
}
