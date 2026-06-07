import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/db'

/**
 * Creates a Supabase client suitable for use inside Next.js middleware.
 *
 * Unlike the server client (which uses next/headers), this client reads cookies
 * from the incoming NextRequest and writes refreshed session cookies onto the
 * NextResponse. It must be used together with a mutable `supabaseResponse` so
 * the Set-Cookie headers reach the browser.
 *
 * Usage pattern (see /middleware.ts for the canonical implementation):
 *
 *   let supabaseResponse = NextResponse.next({ request })
 *   const { supabase, response } = createMiddlewareClient(request, supabaseResponse)
 *   // After auth checks, always return `response` — never a new NextResponse.next()
 */
export function createMiddlewareClient(
  request: NextRequest,
  supabaseResponse: NextResponse
) {
  let response = supabaseResponse

  const supabase = createServerClient<Database>(
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
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response }
}
