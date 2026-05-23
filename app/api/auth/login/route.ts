import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createClient()
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

    return NextResponse.json({
      success: true,
      debug: {
        userId: data.user.id,
        email: data.user.email,
        sessionExpires: data.session.expires_at,
      }
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error', debug: { message: String(err) } },
      { status: 500 }
    )
  }
}
