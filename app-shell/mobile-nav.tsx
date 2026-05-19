'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/today', label: 'Today', Icon: LayoutDashboard },
  { href: '/schedule', label: 'Schedule', Icon: CalendarDays },
  { href: '/clients', label: 'Clients', Icon: Users },
  { href: '/leads', label: 'Leads', Icon: UserPlus },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <ul className="grid grid-cols-4 h-16">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-full px-1 transition',
                  active ? 'text-brand' : 'text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 bg-brand rounded-full" aria-hidden="true" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
