'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserPlus,
  Dumbbell,
  Sparkles,
  TrendingDown,
  CreditCard,
  BarChart3,
  Settings,
  Clipboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { href: '/today', label: 'Today', icon: LayoutDashboard },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/leads', label: 'Leads', icon: UserPlus },
] as const;

const PROGRAM_NAV = [
  { href: '/programs', label: 'Programs', icon: Dumbbell, disabled: true },
  { href: '/assessments', label: 'Assessments', icon: Clipboard, disabled: true },
  { href: '/tools', label: 'Tools', icon: Sparkles, disabled: true },
] as const;

const BUSINESS_NAV = [
  { href: '/retention', label: 'Retention', icon: TrendingDown, disabled: true },
  { href: '/billing', label: 'Billing', icon: CreditCard, disabled: true },
  { href: '/metrics', label: 'Metrics', icon: BarChart3, disabled: true },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-dark fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-[hsl(var(--sidebar-border))]/60">
        <div className="font-display text-2xl font-semibold tracking-tight text-white">
          ims
        </div>
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--sidebar-fg))]/60 translate-y-[1px]">
          Platform
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5">
        <NavGroup label="Workflow" items={PRIMARY_NAV} pathname={pathname} />
        <NavGroup label="Programming" items={PROGRAM_NAV} pathname={pathname} className="mt-6" />
        <NavGroup label="Business" items={BUSINESS_NAV} pathname={pathname} className="mt-6" />
      </nav>

      {/* Footer slot */}
      <div className="border-t border-[hsl(var(--sidebar-border))]/60 px-3 py-3">
        <NavItem
          href="/settings"
          label="Settings"
          Icon={Settings}
          active={pathname.startsWith('/settings')}
        />
      </div>
    </aside>
  );
}

function NavGroup({
  label,
  items,
  pathname,
  className,
}: {
  label: string;
  items: ReadonlyArray<{
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    disabled?: boolean;
  }>;
  pathname: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--sidebar-fg))]/40">
        {label}
      </div>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <NavItem
              href={item.href}
              label={item.label}
              Icon={item.icon}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              disabled={item.disabled}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavItem({
  href,
  label,
  Icon,
  active,
  disabled,
}: {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  active?: boolean;
  disabled?: boolean;
}) {
  const className = cn(
    'group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
    active
      ? 'bg-white/10 text-white font-medium'
      : 'text-[hsl(var(--sidebar-fg))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-white',
    disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[hsl(var(--sidebar-fg))]',
  );

  if (disabled) {
    return (
      <div className={className} aria-disabled="true">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
        <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-[hsl(var(--sidebar-fg))]/40 border border-[hsl(var(--sidebar-fg))]/20 px-1 py-0.5 rounded">
          soon
        </span>
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
      )}
    </Link>
  );
}
