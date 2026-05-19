import Link from 'next/link';
import { Circle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Session = {
  id: string;
  time: string;
  clientName: string;
  serviceType: string;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
};

const STATUS_META = {
  scheduled: { Icon: Circle, color: 'text-muted-foreground', label: 'Scheduled' },
  completed: { Icon: CheckCircle2, color: 'text-success', label: 'Completed' },
  cancelled: { Icon: AlertCircle, color: 'text-destructive', label: 'Cancelled' },
  no_show:   { Icon: AlertCircle, color: 'text-warning', label: 'No-show' },
};

export function TodaysSchedule({ sessions }: { sessions: Session[] }) {
  return (
    <div className="ims-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div>
          <h2 className="font-display text-base font-medium text-foreground">Today's schedule</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sessions.length} session{sessions.length === 1 ? '' : 's'} today
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="h-8">
          <Link href="/schedule">
            Week view
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No sessions scheduled today.
          <Link href="/schedule?new=1" className="ml-1 text-brand hover:underline">
            Add a session
          </Link>
          .
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {sessions.map((s) => {
            const status = STATUS_META[s.status];
            const StatusIcon = status.Icon;
            return (
              <li key={s.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="w-16 shrink-0">
                  <p className="text-sm font-medium text-foreground tabular">{s.time}</p>
                </div>

                <StatusIcon className={cn('h-4 w-4 shrink-0', status.color)} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.clientName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.serviceType} · {s.room}
                  </p>
                </div>

                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                  Open
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
