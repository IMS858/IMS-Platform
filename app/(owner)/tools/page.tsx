import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = { title: 'Tools' };

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tools" subtitle="Coaching tools and AI utilities." />

      <div className="ims-card p-12 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-medium text-foreground mb-1.5">
          Coming in Sprint 5
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          BOD POD interpreter, exercise library, prompt builder, message and review request drafting.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          Coming · Sprint 5
        </div>
      </div>
    </div>
  );
}
