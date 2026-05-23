'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: { email: string; password: string; redirectTo?: string }) {
  const supabase = await createClient()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return {
      error: error.message,
      debug: {
        step: 'FAILED: signInWithPassword error',
        errorCode: error.status,
        errorName: error.name,
        supabaseUrlSet: !!supabaseUrl,
        supabaseKeySet: !!supabaseKey,
        supabaseUrlPrefix: supabaseUrl?.slice(0, 40) ?? 'NOT SET',
      }
    }
  }

  if (!data.session) {
    return {
      error: 'Login OK but no session returned',
      debug: {
        step: 'FAILED: no session after login',
        hasUser: !!data.user,
        userId: data.user?.id ?? 'none',
      }
    }
  }

  // Session exists — calling redirect() now.
  // If the client still sees the spinner after this, it means redirect()
  // is throwing NEXT_REDIRECT (expected) but the client is not navigating.
  const destination = formData.redirectTo || '/dashboard'
  redirect(destination)
}
