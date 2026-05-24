import { TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'Retention' };

export default function RetentionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Retention" subtitle="Churn risk and follow-ups." />

      <div className="ims-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <TrendingDown className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-medium text-foreground mb-1.5">
          Coming in Sprint 4
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Risk scoring, draft outreach messages, follow-up task system.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Coming · Sprint 4
        </div>
      </div>
    </div>
  );
}
