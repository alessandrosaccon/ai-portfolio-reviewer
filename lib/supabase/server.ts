import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/db'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (err) {
            // This is expected only in read-only Server Component context.
            // In Route Handlers and Server Actions cookies() is writable
            // and this block should never execute.
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                '[Supabase Server] Cookie set failed -- read-only Server Component context (safe to ignore):',
                err
              )
            }
          }
        },
      },
    }
  )
}
