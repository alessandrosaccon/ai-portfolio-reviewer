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
        step: 'signInWithPassword failed',
        errorCode: error.status,
        errorName: error.name,
        supabaseUrlSet: !!supabaseUrl,
        supabaseKeySet: !!supabaseKey,
        supabaseUrlPrefix: supabaseUrl?.slice(0, 30) ?? 'NOT SET',
      }
    }
  }

  if (!data.session) {
    return {
      error: 'signInWithPassword succeeded but no session returned',
      debug: {
        step: 'no session after login',
        hasUser: !!data.user,
        userId: data.user?.id ?? 'none',
        supabaseUrlSet: !!supabaseUrl,
        supabaseKeySet: !!supabaseKey,
      }
    }
  }

  return {
    debug: {
      step: 'login OK — about to redirect',
      userId: data.user?.id,
      email: data.user?.email,
      sessionExpires: data.session.expires_at,
      redirectTo: formData.redirectTo || '/dashboard',
    }
  }

  redirect(formData.redirectTo || '/dashboard')
}
