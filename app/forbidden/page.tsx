import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const metadata = { title: 'Access denied' };

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-medium text-foreground mb-2">
          You don't have access to this area
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This part of the platform is for IMS staff. If you think this is a mistake,
          contact Jason at (619) 937-1434.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-dark"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
