'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Plus,
  UserPlus,
  CalendarPlus,
  ClipboardList,
  Dumbbell,
  StickyNote,
  Activity,
  CheckCircle2,
} from 'lucide-react';

const ITEMS = [
  { href: '/clients?new=1', label: 'Add Client', icon: UserPlus, available: true },
  { href: '/leads?new=1', label: 'Add Lead', icon: UserPlus, available: true },
  { href: '/schedule?new=1', label: 'Add Session', icon: CalendarPlus, available: true },
  { href: '/assessments?new=1', label: 'Add Assessment', icon: ClipboardList, available: false },
  { href: '/programs?new=1', label: 'Add Program', icon: Dumbbell, available: false },
  { href: '/tools/bod-pod?new=1', label: 'Log BOD POD', icon: Activity, available: false },
  { href: '/today?new_task=1', label: 'Add Follow-up', icon: CheckCircle2, available: false },
  { href: '/today?new_note=1', label: 'Quick Note', icon: StickyNote, available: false },
];

export function QuickAddMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="h-9 gap-1.5 font-medium shadow-sm bg-brand hover:bg-brand-dark text-white"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Create</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ITEMS.map((item) => {
          const Icon = item.icon;
          if (!item.available) {
            return (
              <DropdownMenuItem key={item.href} disabled className="opacity-40">
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
                <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Soon
                </span>
              </DropdownMenuItem>
            );
          }
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
