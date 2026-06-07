import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/db'

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `[Supabase] Missing environment variable: ${key}\n` +
        `Make sure it is defined in your .env.local file and — if deploying — ` +
        `in your hosting provider's environment settings.`
    )
  }
  return value
}

/**
 * Creates a Supabase server client for use in:
 * - Server Components (read-only: cookie writes are silently ignored)
 * - Route Handlers (read + write: cookies() is writable here)
 * - Server Actions (read + write: cookies() is writable here)
 *
 * Always await this function — Next.js cookies() is async.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
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
          } catch {
            // Expected when called from a read-only Server Component context.
            // Route Handlers and Server Actions are writable — this block
            // should never execute in those contexts.
          }
        },
      },
    }
  )
}
