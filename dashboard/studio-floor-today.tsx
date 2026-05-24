import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type FloorStatus = 'in_session' | 'recovery' | 'arriving' | 'finishing';

type StudioFloorItem = {
  id: string;
  clientName: string;
  status: FloorStatus;
  asset: string; // e.g. "Strength Floor", "Sunlighten Sauna", "Normatec Compression"
  startedAt?: string; // "9:00 AM"
  endsAt?: string; // "10:00 AM"
  arrivingAt?: string; // for status === 'arriving'
};

const STATUS_META: Record<
  FloorStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  in_session: {
    label: 'In session',
    dotClass: 'bg-success animate-pulse',
    textClass: 'text-success',
  },
  recovery: {
    label: 'Recovery',
    dotClass: 'bg-brand animate-pulse',
    textClass: 'text-brand-dark',
  },
  finishing: {
    label: 'Finishing',
    dotClass: 'bg-warning',
    textClass: 'text-warning',
  },
  arriving: {
    label: 'Arriving',
    dotClass: 'bg-muted-foreground',
    textClass: 'text-muted-foreground',
  },
};

export function StudioFloorToday({ items }: { items: StudioFloorItem[] }) {
  const onFloor = items.filter((i) => i.status !== 'arriving');
  const arriving = items.filter((i) => i.status === 'arriving');

  return (
    <div className="ims-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <h2 className="font-display text-base font-medium text-foreground">
              Studio floor right now
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-4">
            {onFloor.length} {onFloor.length === 1 ? 'person' : 'people'} on the floor
            {arriving.length > 0 && ` · ${arriving.length} arriving`}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          The studio is empty right now.
        </div>
      ) : (
        <>
          {/* On the floor now */}
          {onFloor.length > 0 && (
            <ul className="divide-y divide-border/60">
              {onFloor.map((item) => (
                <FloorRow key={item.id} item={item} />
              ))}
            </ul>
          )}

          {/* Arriving next */}
          {arriving.length > 0 && (
            <div className="border-t border-border/60 bg-muted/30 px-5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Arriving next
              </p>
              <ul className="space-y-1.5">
                {arriving.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground">{item.clientName}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular">
                      <Clock className="h-3 w-3" />
                      {item.arrivingAt}
                      <ArrowRight className="h-3 w-3 mx-0.5 opacity-50" />
                      {item.asset}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FloorRow({ item }: { item: StudioFloorItem }) {
  const status = STATUS_META[item.status];
  return (
    <li className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
      <span
        className={cn('h-2 w-2 rounded-full shrink-0', status.dotClass)}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.clientName}</p>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{item.asset}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className={cn('text-[11px] font-semibold uppercase tracking-wider', status.textClass)}>
          {status.label}
        </p>
        {item.endsAt && (
          <p className="text-[11px] text-muted-foreground tabular mt-0.5">
            until {item.endsAt}
          </p>
        )}
      </div>
    </li>
  );
}
