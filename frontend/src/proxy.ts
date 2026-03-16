import { NextResponse } from 'next/server';

export default function proxy() {
  // Note: Since tokens are stored in localStorage (as per requirements), 
  // the server-side middleware cannot access them directly to verify authentication.
  // Authentication checks must be performed client-side (e.g. in AuthContext or a Guard component).
  
  // If you switch to HttpOnly cookies for the refresh token, you can check for the cookie here:
  // const refreshToken = request.cookies.get('wapibei_refresh_token');
  // if (!refreshToken && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
