import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// GET /middleware-debug
// Returns a JSON snapshot of what the middleware sees:
// - all cookie names on the request
// - getSession() result
// This route is excluded from middleware protection (starts with /api equiv).
export async function GET(request: NextRequest) {
  const allCookieNames = request.cookies.getAll().map((c) => c.name)
  const sbCookies = allCookieNames.filter((n) => n.startsWith('sb-'))

  let sessionUserId: string | null = null
  let sessionError: string | null = null
  let hasSession = false

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )
    const { data, error } = await supabase.auth.getSession()
    hasSession = !!data.session
    sessionUserId = data.session?.user?.id ?? null
    sessionError = error?.message ?? null
  } catch (e: unknown) {
    sessionError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    allCookieNames,
    sbCookies,
    hasSession,
    sessionUserId,
    sessionError,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}
