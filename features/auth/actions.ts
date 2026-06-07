'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Login Server Action.
 *
 * Using a Server Action + redirect() instead of a fetch() to /api/auth/login
 * is the only reliable pattern on Vercel: the Set-Cookie headers and the
 * redirect happen in the same HTTP response, so the browser receives the
 * session cookies *before* it navigates to /dashboard. With the old fetch()
 * approach the cookie write and the window.location.href navigation were two
 * separate round-trips, and the middleware would intercept the second one
 * before the browser had committed the cookies from the first one.
 */
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // redirect() throws internally — must be called outside try/catch.
  // The session cookies are written into this same response before the
  // browser follows the redirect, so the middleware sees them immediately.
  redirect(redirectTo)
}

/**
 * Signup Server Action.
 */
export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

/**
 * Logout Server Action.
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
