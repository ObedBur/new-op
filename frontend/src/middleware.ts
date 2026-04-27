import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Next.js — protection des routes sensibles.
 * 
 * Note: Les tokens sont stockés côté client (localStorage),
 * L'authentification fine se fait via AuthGuard côté client.

 * Si vous migrez vers des cookies HttpOnly pour le refresh token,
 * décommentez la vérification ci-dessous.
 */
export function middleware(request: NextRequest) {
  // Exemple avec cookie HttpOnly (à activer quand le backend le supporte) :
  const refreshToken = request.cookies.get('wapibei_refresh_token');
  if (!refreshToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
