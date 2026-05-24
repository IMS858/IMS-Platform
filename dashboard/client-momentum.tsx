import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

type Momentum = {
  recentWins: { id: string; clientName: string; win: string; sessionAgo: number }[];
  slipping: { id: string; clientName: string; detail: string }[];
};

export function ClientMomentum({ data }: { data: Momentum }) {
  return (
    <div className="ims-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60">
        <h2 className="font-display text-base font-medium text-foreground">Client momentum</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recent wins and quiet signals
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {data.recentWins.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent wins
              </span>
            </div>
            <ul className="space-y-2">
              {data.recentWins.map((w) => (
                <li key={w.id} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{w.clientName}</span>
                  <span className="text-xs text-muted-foreground">{w.win}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.slipping.length > 0 && (
          <div className="pt-3 border-t border-border/60">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-3.5 w-3.5 text-warning" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Quiet — needs a touch
              </span>
            </div>
            <ul className="space-y-2">
              {data.slipping.map((s) => (
                <li key={s.id} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{s.clientName}</span>
                  <span className="text-xs text-muted-foreground">{s.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
