import { CheckCircle2, AlertCircle, Plug } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Settings' };

type Status = 'connected' | 'available' | 'not_configured' | 'planned';

const INTEGRATIONS: { name: string; description: string; status: Status }[] = [
  {
    name: 'Supabase',
    description: 'Database, authentication, and real-time updates',
    status: 'connected',
  },
  {
    name: 'Anthropic Claude',
    description: 'AI program generation, BOD POD interpretation, message drafting',
    status: 'available',
  },
  {
    name: 'Stripe',
    description: 'Subscriptions, billing portal, payment management',
    status: 'not_configured',
  },
  {
    name: 'Vagaro',
    description: 'Sync sessions and bookings from the booking platform',
    status: 'planned',
  },
  {
    name: 'Google Calendar',
    description: 'Two-way calendar sync for sessions and assessments',
    status: 'planned',
  },
  {
    name: 'Email & SMS',
    description: 'Transactional notifications and reminders',
    status: 'planned',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        subtitle="Business profile, integrations, and security."
      />

      <section>
        <h2 className="font-display text-base font-medium text-foreground mb-3">
          Integrations
        </h2>
        <div className="ims-card divide-y divide-border/60">
          {INTEGRATIONS.map((integration) => (
            <IntegrationRow key={integration.name} {...integration} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-foreground mb-3">
          More settings · Coming soon
        </h2>
        <div className="ims-card p-6 text-sm text-muted-foreground">
          <p>Business profile · Services · Rooms & resources · Team · Tags · AI settings · Security & 2FA</p>
        </div>
      </section>
    </div>
  );
}

function IntegrationRow({
  name,
  description,
  status,
}: {
  name: string;
  description: string;
  status: Status;
}) {
  const meta = {
    connected: {
      Icon: CheckCircle2,
      tint: 'text-success bg-success/10 border-success/20',
      label: 'Connected',
    },
    available: {
      Icon: CheckCircle2,
      tint: 'text-brand-dark bg-brand-soft border-brand/20',
      label: 'Available',
    },
    not_configured: {
      Icon: AlertCircle,
      tint: 'text-warning bg-warning/10 border-warning/20',
      label: 'Not connected',
    },
    planned: {
      Icon: Plug,
      tint: 'text-muted-foreground bg-muted border-border',
      label: 'Planned',
    },
  }[status];

  const StatusIcon = meta.Icon;

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
          meta.tint,
        )}
      >
        <StatusIcon className="h-3 w-3" />
        {meta.label}
      </span>
    </div>
  );
}
