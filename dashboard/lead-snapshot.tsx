import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Snapshot = {
  newUncontacted: { id: string; name: string; source: string; daysOld: number }[];
  assessmentBooked: { id: string; name: string; source: string; scheduledFor: string }[];
  stuck: { id: string; name: string; source: string; daysStuck: number; lastStage: string }[];
};

export function LeadSnapshot({ snapshot }: { snapshot: Snapshot }) {
  const total =
    snapshot.newUncontacted.length +
    snapshot.assessmentBooked.length +
    snapshot.stuck.length;

  return (
    <div className="ims-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div>
          <h2 className="font-display text-base font-medium text-foreground">Lead snapshot</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total} active {total === 1 ? 'lead' : 'leads'} in the pipeline
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="h-8 text-muted-foreground">
          <Link href="/leads">
            View all
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="px-5 py-4 space-y-4">
        {snapshot.newUncontacted.length > 0 && (
          <Group label="Needs first contact" tone="urgent">
            {snapshot.newUncontacted.map((l) => (
              <Row
                key={l.id}
                href={`/leads/${l.id}`}
                name={l.name}
                meta={`${l.source} · ${l.daysOld}d ago`}
              />
            ))}
          </Group>
        )}

        {snapshot.assessmentBooked.length > 0 && (
          <Group label="Assessment booked" tone="neutral">
            {snapshot.assessmentBooked.map((l) => (
              <Row
                key={l.id}
                href={`/leads/${l.id}`}
                name={l.name}
                meta={`${l.source} · ${l.scheduledFor}`}
              />
            ))}
          </Group>
        )}

        {snapshot.stuck.length > 0 && (
          <Group label="Stuck" tone="warning">
            {snapshot.stuck.map((l) => (
              <Row
                key={l.id}
                href={`/leads/${l.id}`}
                name={l.name}
                meta={`${l.lastStage} · ${l.daysStuck}d stuck`}
              />
            ))}
          </Group>
        )}

        {total === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No open leads.
          </div>
        )}
      </div>
    </div>
  );
}

function Group({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'urgent' | 'warning' | 'neutral';
  children: React.ReactNode;
}) {
  const dotColor = {
    urgent: 'bg-destructive',
    warning: 'bg-warning',
    neutral: 'bg-brand',
  }[tone];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function Row({ href, name, meta }: { href: string; name: string; meta: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between gap-3 -mx-2 px-2 py-1.5 rounded hover:bg-muted/40 transition-colors group"
      >
        <span className="text-sm font-medium text-foreground truncate">{name}</span>
        <span className="text-[11px] text-muted-foreground tabular truncate group-hover:text-foreground transition-colors">
          {meta}
        </span>
      </Link>
    </li>
  );
}
