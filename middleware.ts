import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/analyze', '/history', '/settings']
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']

function getSessionFromCookies(request: NextRequest): boolean {
  // @supabase/ssr expects chunked cookies (sb-...auth-token.0, .1 etc)
  // but createBrowserClient writes a single URL-encoded JSON cookie.
  // We support both formats here.
  const cookieName = Object.keys(
    Object.fromEntries(request.cookies.getAll().map((c) => [c.name, c.value]))
  ).find((name) => name.startsWith('sb-') && name.endsWith('-auth-token'))

  if (!cookieName) return false

  try {
    const raw = request.cookies.get(cookieName)?.value
    if (!raw) return false
    const decoded = decodeURIComponent(raw)
    const parsed = JSON.parse(decoded)
    const accessToken = parsed?.access_token
    if (!accessToken) return false

    // Check JWT expiry from payload
    const payloadB64 = accessToken.split('.')[1]
    if (!payloadB64) return false
    const payload = JSON.parse(atob(payloadB64))
    const exp = payload?.exp
    if (!exp) return false
    return Date.now() / 1000 < exp
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  const hasValidSession = getSessionFromCookies(request)

  if (isProtected && !hasValidSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && hasValidSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
