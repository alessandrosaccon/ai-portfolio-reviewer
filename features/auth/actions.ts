'use server'

import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: {
  email: string
  password: string
  redirectTo?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { success: false as const, error: error.message }
  }

  if (!data.session) {
    return { success: false as const, error: 'Login succeeded but no session was created. Please try again.' }
  }

  // Return success — cookies are written server-side by createClient.
  // The client will navigate with window.location.href so the browser
  // sends the new sb-* cookies on the next request to /dashboard.
  return {
    success: true as const,
    redirectTo: formData.redirectTo || '/dashboard',
  }
}
