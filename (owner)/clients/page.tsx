import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'Clients' };

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Roster"
        title="Clients"
        subtitle="Active and past clients. Profiles, programs, and history."
        actions={
          <Button disabled>
            Add Client
          </Button>
        }
      />

      <div className="ims-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-medium text-foreground mb-1.5">
          Client roster comes online in Sprint 2
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Add client modal, profile pages with 8 tabs (Overview · Schedule · Program ·
          Assessments · Body Comp · Notes · Billing · Files), filters, and search.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Coming next · Sprint 2
        </div>
      </div>
    </div>
  );
}
