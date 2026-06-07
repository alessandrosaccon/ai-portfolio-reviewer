import { createBrowserClient } from '@supabase/ssr'
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

let _client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Returns a singleton Supabase browser client.
 *
 * Calling createBrowserClient() multiple times on the same page is safe but
 * wasteful — this singleton avoids creating redundant instances in React trees
 * that call createClient() from multiple components.
 */
export function createClient() {
  if (_client) return _client
  _client = createBrowserClient<Database>(
    getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )
  return _client
}
