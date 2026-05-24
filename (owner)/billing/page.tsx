import { CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'Billing' };

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="Revenue and subscriptions." />

      <div className="ims-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <CreditCard className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-medium text-foreground mb-1.5">
          Coming in Sprint 6
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Stripe-powered overview, plan and subscription tracking, past-due alerts, MRR over time.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Coming · Sprint 6
        </div>
      </div>
    </div>
  );
}
