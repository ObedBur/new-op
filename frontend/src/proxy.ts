import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy Next.js — Sécurité (Role-Shield) et Redirection Intelligente
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Récupérer les informations de session
  const role = request.cookies.get('wapibei_role')?.value;
  const isAuthenticated = !!role;

  // 2. PROTECT ROUTES : Si on essaie d'aller sur /dashboard ou /admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {

    // CAS A : Non connecté -> Direction Login avec Callback
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname); // On mémorise où il voulait aller
      return NextResponse.redirect(loginUrl);
    }

    // CAS B : ROLE-SHIELD — Vérification de l'autorisation
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url)); // Pas admin ? Retour à l'accueil
    }

    if (pathname.startsWith('/dashboard') && role !== 'VENDOR') {
      return NextResponse.redirect(new URL('/', request.url)); // Pas vendeur ? Retour à l'accueil
    }
  }

  // 3. AUTH ROUTES : Si déjà connecté et essaie d'aller sur /login ou /register
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    if (role === 'VENDOR') return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
