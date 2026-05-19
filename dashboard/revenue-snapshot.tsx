type Revenue = {
  estimatedMRR: number;
  sessionsThisWeek: number;
  activeSubscriptions: number;
  manualBillingClients: number;
  pastDue: number;
  revenueByService: { service: string; cents: number }[];
};

function dollars(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function RevenueSnapshot({ data }: { data: Revenue }) {
  const total = data.revenueByService.reduce((sum, r) => sum + r.cents, 0);

  return (
    <div className="ims-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60">
        <h2 className="font-display text-base font-medium text-foreground">Revenue snapshot</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Estimate · connect Stripe for live data
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Stat label="Est. MRR" value={dollars(data.estimatedMRR)} />
          <Stat label="Sessions this week" value={data.sessionsThisWeek.toString()} />
          <Stat label="Active subs" value={data.activeSubscriptions.toString()} />
          <Stat
            label="Past due"
            value={data.pastDue.toString()}
            tone={data.pastDue > 0 ? 'warning' : 'neutral'}
          />
        </div>

        <div className="pt-4 border-t border-border/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            By service
          </p>
          <ul className="space-y-2">
            {data.revenueByService.map((row) => {
              const pct = total === 0 ? 0 : Math.round((row.cents / total) * 100);
              return (
                <li key={row.service}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{row.service}</span>
                    <span className="text-foreground font-medium tabular">{dollars(row.cents)}</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'warning';
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`font-display text-xl font-medium tabular mt-0.5 ${
          tone === 'warning' ? 'text-warning' : 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
