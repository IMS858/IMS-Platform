import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'Schedule' };

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Calendar"
        title="Schedule"
        subtitle="Week view, filters, and session management."
        actions={<Button disabled>Add Session</Button>}
      />

      <div className="ims-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <CalendarDays className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-medium text-foreground mb-1.5">
          Week schedule comes online in Sprint 2
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Week grid, mobile agenda view, filters by room and service, session drawer
          with notes, complete/cancel/no-show flows, and Vagaro sync.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Coming next · Sprint 2
        </div>
      </div>
    </div>
  );
}
