import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/app-shell/sidebar';
import { Topbar } from '@/components/app-shell/topbar';
import { MobileNav } from '@/components/app-shell/mobile-nav';

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get role from profiles table — block clients/trainers if they end up here
  // In Phase 1 we just check existence and use email for display
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle<{ id: string; role: string; full_name: string | null; avatar_url: string | null }>();

  // If a non-owner/admin somehow lands on /, send them away
  if (profile && profile.role && !['owner', 'admin'].includes(profile.role)) {
    redirect('/forbidden');
  }

  const displayName = profile?.full_name || user.email || 'Coach';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Workspace */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[260px]">
        <Topbar user={{ name: displayName, email: user.email || '' }} />
        <main className="flex-1 pb-20 md:pb-8">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
