'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_NAV = [
  { section: 'Workflow', items: [
    { href: '/today', label: 'Today', icon: LayoutDashboard, available: true },
    { href: '/schedule', label: 'Schedule', icon: CalendarDays, available: true },
    { href: '/clients', label: 'Clients', icon: Users, available: true },
    { href: '/leads', label: 'Leads', icon: UserPlus, available: true },
  ]},
  { section: 'Programming', items: [
    { href: '/programs', label: 'Programs', icon: Dumbbell, available: false },
    { href: '/tools', label: 'Tools', icon: Sparkles, available: false },
  ]},
  { section: 'Business', items: [
    { href: '/retention', label: 'Retention', icon: TrendingDown, available: false },
    { href: '/billing', label: 'Billing', icon: CreditCard, available: false },
    { href: '/metrics', label: 'Metrics', icon: BarChart3, available: false },
  ]},
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // Auto-close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Scrim */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={cn(
          'md:hidden sidebar-dark fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[hsl(var(--sidebar-border))]/60">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-semibold text-white">ims</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/50 translate-y-[1px]">
              Platform
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">
          {ALL_NAV.map((group) => (
            <div key={group.section} className="mb-6">
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                {group.section}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  const inner = (
                    <>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                      {!item.available && (
                        <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-white/40 border border-white/15 px-1 py-0.5 rounded">
                          soon
                        </span>
                      )}
                    </>
                  );

                  const className = cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm',
                    active
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/75 hover:bg-white/5 hover:text-white',
                    !item.available && 'opacity-40 pointer-events-none',
                  );

                  return (
                    <li key={item.href}>
                      {item.available ? (
                        <Link href={item.href} className={className}>
                          {inner}
                        </Link>
                      ) : (
                        <div className={className}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-[hsl(var(--sidebar-border))]/60 px-3 py-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/75 hover:text-white hover:bg-white/5"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
