'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Return serializable error — Server Actions cannot throw to the client directly
    return { error: error.message }
  }

  // Cookies are now written server-side. redirect() throws internally (Next.js)
  // so it must be called outside try/catch.
  redirect(redirectTo)
}
