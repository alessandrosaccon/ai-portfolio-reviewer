import { createClient } from '@/lib/supabase/server'

/**
 * Server Component — runs on the server, so it can call createClient() and
 * getUser() directly. Renders a debug panel visible only when
 * NODE_ENV !== 'production' OR when NEXT_PUBLIC_AUTH_DEBUG=true.
 *
 * Remove this file and its usage in login/page.tsx once auth is fixed.
 */
export async function AuthDebugBanner() {
  const showDebug =
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_AUTH_DEBUG === 'true'

  if (!showDebug) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let sessionStatus = 'unknown'
  let userId: string | null = null
  let userEmail: string | null = null
  let errorMessage: string | null = null
  let errorCode: string | null = null

  if (!supabaseUrl || !anonKey) {
    sessionStatus = 'env_missing'
    errorMessage = `Missing env vars: ${
      !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''
    }${
      !anonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''
    }`.trim()
  } else {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        sessionStatus = 'error'
        errorMessage = error.message
        errorCode = error.code ?? null
      } else if (data.user) {
        sessionStatus = 'authenticated'
        userId = data.user.id
        userEmail = data.user.email ?? null
      } else {
        sessionStatus = 'unauthenticated'
      }
    } catch (e: unknown) {
      sessionStatus = 'exception'
      errorMessage = e instanceof Error ? e.message : String(e)
    }
  }

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    {
      label: 'NODE_ENV',
      value: process.env.NODE_ENV ?? '(not set)',
    },
    {
      label: 'SUPABASE_URL',
      value: supabaseUrl
        ? supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1…')
        : '❌ NOT SET',
      highlight: !supabaseUrl,
    },
    {
      label: 'ANON_KEY',
      value: anonKey ? `${anonKey.slice(0, 12)}…` : '❌ NOT SET',
      highlight: !anonKey,
    },
    {
      label: 'Session status',
      value: sessionStatus,
      highlight: sessionStatus !== 'unauthenticated' && sessionStatus !== 'authenticated',
    },
    ...(userId ? [{ label: 'User ID', value: userId }] : []),
    ...(userEmail ? [{ label: 'User email', value: userEmail }] : []),
    ...(errorCode ? [{ label: 'Error code', value: errorCode, highlight: true }] : []),
    ...(errorMessage ? [{ label: 'Error message', value: errorMessage, highlight: true }] : []),
  ]

  return (
    <div
      role="status"
      aria-label="Auth debug info"
      className="mb-6 rounded-lg border border-yellow-400/40 bg-yellow-50 p-3 text-xs dark:border-yellow-400/20 dark:bg-yellow-950/30"
    >
      <p className="mb-2 font-semibold text-yellow-800 dark:text-yellow-300">
        🛠 Auth Debug — Server Component
      </p>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map(({ label, value, highlight }) => (
            <tr key={label} className="align-top">
              <td className="w-36 pb-0.5 pr-2 font-medium text-yellow-700 dark:text-yellow-400">
                {label}
              </td>
              <td
                className={`pb-0.5 font-mono break-all ${
                  highlight
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-yellow-900 dark:text-yellow-200'
                }`}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
