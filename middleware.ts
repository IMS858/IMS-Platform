import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/login', '/reset-password', '/auth/callback', '/forbidden', '/api/health'];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh Supabase session on every request — this writes refreshed cookies
  // back to the response. Without this, expired access tokens cause silent
  // logouts in Server Components.
  const { supabaseResponse, user } = await updateSession(request);

  // Public routes: just pass the refreshed response through
  if (isPublic(pathname)) {
    // If a signed-in user hits /login, send them to /today
    if (user && (pathname === '/login' || pathname === '/')) {
      const url = request.nextUrl.clone();
      url.pathname = '/today';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Root → redirect based on auth state
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = user ? '/today' : '/login';
    return NextResponse.redirect(url);
  }

  // Protected: require auth
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // Match all routes EXCEPT static files + Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
