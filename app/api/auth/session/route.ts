import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/auth/session
 * Server-side session check used by LoginForm after signInWithPassword.
 * Because this runs on the server, it reads the sb-* cookies that Supabase
 * just wrote to the browser and confirms whether the session is valid.
 * Returns { authenticated: true, redirectTo } or { authenticated: false }.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, redirectTo })
}
