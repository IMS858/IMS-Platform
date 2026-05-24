import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'Leads' };

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        subtitle="Six-stage kanban from New to Converted."
        actions={<Button disabled>Add Lead</Button>}
      />

      <div className="ims-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-medium text-foreground mb-1.5">
          Leads pipeline comes online in Sprint 3
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Six-stage kanban (New · Contacted · Assessment Booked · Showed · Converted · Lost),
          lead drawer with timeline, convert-to-client, and smart flags for stuck leads.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Coming next · Sprint 3
        </div>
      </div>
    </div>
  );
}
