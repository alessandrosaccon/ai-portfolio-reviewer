import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/analyze', '/history']
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getSession() instead of getUser() for routing decisions.
  // getSession() decodes the JWT from cookies locally — no network call,
  // no risk of timeout on Vercel edge. getUser() makes a network request
  // to Supabase on every middleware invocation which can fail/timeout.
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
