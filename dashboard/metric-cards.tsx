import { CalendarDays, Users, UserPlus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Metrics = {
  todaysSessions: number;
  activeClients: number;
  openLeads: number;
  estimatedMRR: number;
  followUpsDue: number;
};

export function MetricCards({ metrics }: { metrics: Metrics }) {
  const cards = [
    {
      label: "Today's sessions",
      value: metrics.todaysSessions.toString(),
      Icon: CalendarDays,
      tint: 'brand',
    },
    {
      label: 'Active clients',
      value: metrics.activeClients.toString(),
      Icon: Users,
      tint: 'neutral',
    },
    {
      label: 'Open leads',
      value: metrics.openLeads.toString(),
      Icon: UserPlus,
      tint: 'neutral',
    },
    {
      label: 'Follow-ups due',
      value: metrics.followUpsDue.toString(),
      Icon: CheckCircle2,
      tint: metrics.followUpsDue > 0 ? 'warning' : 'neutral',
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  Icon,
  tint,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  tint: 'brand' | 'neutral' | 'success' | 'warning';
}) {
  const tintMap = {
    brand: 'bg-brand-soft text-brand-dark',
    neutral: 'bg-muted text-muted-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="ims-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn('h-7 w-7 rounded-md flex items-center justify-center', tintMap[tint])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="font-display text-2xl font-medium text-foreground tabular">{value}</p>
    </div>
  );
}
