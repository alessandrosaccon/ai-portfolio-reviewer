'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: { email: string; password: string; redirectTo?: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: error.message }
  }

  // Cookies are written server-side by createClient (Next.js cookie store).
  // redirect() here triggers a 303 response with Set-Cookie headers already
  // attached — the browser receives both the cookies and the redirect in one
  // response, so the middleware sees the session on the very next request.
  redirect(formData.redirectTo || '/dashboard')
}
