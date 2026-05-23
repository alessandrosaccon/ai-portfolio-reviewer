import { NextResponse, type NextRequest } from 'next/server'

// TEMP DEBUG: middleware protection disabled to isolate redirect source.
// If /dashboard loads now, the bug is in middleware getSession().
// If /dashboard still redirects, the bug is in AppLayout getSession().
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
