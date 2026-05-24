import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-[420px]">
        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
              ims
            </span>
            <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground translate-y-[-1px]">
              Platform
            </span>
          </div>
          <h1 className="font-display text-2xl font-medium text-foreground mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your IMS workspace
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Secure access for IMS staff and members. All activity is logged.
        </p>
      </div>
    </main>
  );
}
