import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })

    // Create the Supabase client wired directly to the response object
    // so Set-Cookie headers are written onto the response we return.
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json(
        { error: error.message, debug: { code: error.status, name: error.name } },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session returned after login' },
        { status: 500 }
      )
    }

    // Cookies are now set on `response` via setAll above.
    // Return the same response object so Set-Cookie headers are included.
    const finalResponse = NextResponse.json({
      success: true,
      debug: {
        userId: data.user.id,
        email: data.user.email,
        sessionExpires: data.session.expires_at,
      }
    })

    // Copy cookies from the wired response to the final response
    response.cookies.getAll().forEach(({ name, value, ...rest }) => {
      finalResponse.cookies.set(name, value, rest)
    })

    return finalResponse

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error', debug: { message: String(err) } },
      { status: 500 }
    )
  }
}
