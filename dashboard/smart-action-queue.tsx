import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Clock,
  Cake,
  TrendingDown,
  FileWarning,
  UserPlus,
  Star,
  CreditCard,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SmartAction } from '@/types';

const KIND_META: Record<
  SmartAction['kind'],
  { Icon: React.ComponentType<{ className?: string }>; label: string; tint: string }
> = {
  new_lead: { Icon: UserPlus, label: 'New lead', tint: 'text-brand-dark bg-brand-soft' },
  churn_risk: { Icon: TrendingDown, label: 'Churn risk', tint: 'text-destructive bg-destructive/10' },
  review_opportunity: { Icon: Star, label: 'Review request', tint: 'text-warning bg-warning/10' },
  birthday: { Icon: Cake, label: 'Birthday', tint: 'text-foreground bg-muted' },
  program_update: { Icon: FileWarning, label: 'Program update', tint: 'text-brand-dark bg-brand-soft' },
  billing_issue: { Icon: CreditCard, label: 'Billing', tint: 'text-destructive bg-destructive/10' },
  assessment_not_converted: { Icon: AlertCircle, label: 'Assessment', tint: 'text-warning bg-warning/10' },
  missing_session_notes: { Icon: FileWarning, label: 'Missing notes', tint: 'text-muted-foreground bg-muted' },
  follow_up_due: { Icon: Clock, label: 'Follow-up', tint: 'text-brand-dark bg-brand-soft' },
};

const PRIORITY_META: Record<SmartAction['priority'], { label: string; className: string }> = {
  urgent:  { label: 'Urgent', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  high:    { label: 'High',   className: 'bg-warning/10 text-warning border-warning/20' },
  medium:  { label: 'Medium', className: 'bg-muted text-muted-foreground border-border' },
  low:     { label: 'Low',    className: 'bg-muted/50 text-muted-foreground border-transparent' },
};

export function SmartActionQueue({ actions }: { actions: SmartAction[] }) {
  if (!actions.length) {
    return (
      <Card>
        <CardHeader title="Smart Action Queue" subtitle="What needs your attention right now" />
        <div className="py-10 text-center text-sm text-muted-foreground">
          ✓ All clear. No follow-ups, no risks, nothing slipping. Enjoy the calm.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Smart Action Queue"
        subtitle="What needs your attention right now"
        right={
          <span className="text-xs text-muted-foreground tabular">
            {actions.length} {actions.length === 1 ? 'item' : 'items'}
          </span>
        }
      />
      <ul className="divide-y divide-border/60">
        {actions.map((a) => (
          <ActionRow key={a.id} action={a} />
        ))}
      </ul>
    </Card>
  );
}

function ActionRow({ action }: { action: SmartAction }) {
  const kind = KIND_META[action.kind];
  const priority = PRIORITY_META[action.priority];
  const Icon = kind.Icon;

  return (
    <li className="group p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <span className={cn('h-9 w-9 rounded-md flex items-center justify-center shrink-0', kind.tint)}>
          <Icon className="h-4 w-4" />
        </span>

        <div className="flex-1 min-w-0">
          {/* Top row: name + chips */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
            <span className="font-medium text-foreground text-[15px]">{action.personName}</span>
            <span className={cn(
              'inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border',
              priority.className,
            )}>
              {priority.label}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {kind.label}
            </span>
            {action.dueAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Due {formatDistanceToNow(new Date(action.dueAt), { addSuffix: true })}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-2">{action.why}</p>

          {action.suggestedAction && (
            <p className="text-xs text-muted-foreground/80 italic mb-3">
              → {action.suggestedAction}
            </p>
          )}

          <div className="flex items-center gap-2">
            {action.primaryActionHref ? (
              <Button size="sm" asChild className="h-8">
                <Link href={action.primaryActionHref}>
                  {action.primaryActionLabel}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" className="h-8" type="button">
                {action.primaryActionLabel}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Done
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-muted-foreground hover:text-foreground"
              type="button"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

// Local card primitives (kept inline to keep this component self-contained)
function Card({ children }: { children: React.ReactNode }) {
  return <div className="ims-card overflow-hidden">{children}</div>;
}

function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/60">
      <div>
        <h2 className="font-display text-base font-medium text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0 pt-1">{right}</div>}
    </div>
  );
}
