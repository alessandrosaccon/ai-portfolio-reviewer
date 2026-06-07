'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Login Server Action.
 *
 * IMPORTANT — Next.js 15 + @supabase/ssr known issue:
 * Calling redirect() inside a Server Action that also writes cookies via
 * cookieStore.set() causes a race condition: the redirect throws before
 * the Set-Cookie headers are flushed to the response, so the browser
 * navigates to /dashboard without the session cookies → middleware
 * sees no session → redirects back to /login → infinite loop.
 *
 * Fix: return { redirectTo } and let the client component call router.push().
 * By the time the Server Action resolves on the client, the browser has
 * already committed all Set-Cookie headers from the response, so the
 * subsequent navigation carries the session cookies correctly.
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

  return { redirectTo }
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
    options: { data: { full_name: fullName } },
  })

  if (error) {
    return { error: error.message }
  }

  return { redirectTo: '/dashboard' }
}

/**
 * Logout Server Action.
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { redirectTo: '/login' }
}
