'use client';

import { useState } from 'react';
import { Search, Plus, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickAddMenu } from './quick-add-menu';
import { UserMenu } from './user-menu';
import { MobileMenu } from './mobile-menu';

export function Topbar({ user }: { user: { name: string; email: string } }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="flex items-center gap-3 px-4 md:px-8 h-14">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden -ml-2 p-2 rounded-md hover:bg-muted text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search — desktop only for now */}
          <div className="hidden md:flex items-center gap-2 max-w-md w-full px-3 h-9 rounded-md bg-muted/60 border border-transparent hover:border-border focus-within:border-border focus-within:bg-background transition">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search clients, sessions, leads…"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 outline-none"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded">
              ⌘K
            </kbd>
          </div>

          <div className="flex-1 md:flex-none" />

          {/* Right cluster */}
          <div className="flex items-center gap-1.5">
            <QuickAddMenu />

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <UserMenu name={user.name} email={user.email} />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
