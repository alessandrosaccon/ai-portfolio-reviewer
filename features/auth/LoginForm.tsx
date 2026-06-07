'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

type LogEntry = { ok: boolean; msg: string }

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  function log(ok: boolean, msg: string) {
    setLogs((prev) => [...prev, { ok, msg }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLogs([])
    setLoading(true)

    try {
      const supabase = createClient()
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
      // Extract project ref from URL: https://<ref>.supabase.co
      const projectRef = url.replace('https://', '').split('.')[0]
      log(true, `[1] project ref from URL: "${projectRef}"`)

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        log(false, `[2] signInWithPassword ERROR: ${error.message}`)
        setLoading(false)
        return
      }

      log(true, `[2] signInWithPassword OK — user: ${data.user?.id}`)
      log(true, `[3] access_token present: ${!!data.session?.access_token}`)

      // Log ALL cookies, not just sb-*
      const allCookies = document.cookie.split(';').map((c) => c.trim().split('=')[0])
      log(true, `[4] ALL cookie names (${allCookies.length}): ${allCookies.join(' | ')}`)

      const sbCookies = allCookies.filter((n) => n.startsWith('sb-'))
      log(
        sbCookies.length > 0,
        `[5] sb-* cookies (${sbCookies.length}): ${sbCookies.length > 0 ? sbCookies.join(' | ') : 'NONE'}`
      )

      const expectedCookie = `sb-${projectRef}-auth-token`
      const exactMatch = sbCookies.includes(expectedCookie)
      log(exactMatch, `[6] expected cookie "${expectedCookie}" found: ${exactMatch}`)

      if (!exactMatch && sbCookies.length > 0) {
        log(false, `[6b] MISMATCH — expected: "${expectedCookie}" got: "${sbCookies[0]}"`)
      }

      // After writing cookies, immediately re-read the session
      const { data: sessionCheck } = await supabase.auth.getSession()
      log(
        !!sessionCheck.session,
        `[7] getSession() after login: ${sessionCheck.session ? 'HAS SESSION' : 'NO SESSION'}`
      )

      log(true, `[8] navigating to ${redirectTo} in 2s…`)
      setLoading(false)
      await new Promise((r) => setTimeout(r, 2000))
      window.location.href = redirectTo
    } catch (err: unknown) {
      log(false, `[!] Exception: ${err instanceof Error ? err.message : String(err)}`)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in\u2026</>
            : 'Sign in'
          }
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </form>

      {logs.length > 0 && (
        <div className="mt-2 rounded-lg border border-yellow-400/40 bg-yellow-50 p-3 dark:border-yellow-400/20 dark:bg-yellow-950/30">
          <p className="mb-2 text-xs font-semibold text-yellow-800 dark:text-yellow-300">
            \ud83d\udd0d Login trace
          </p>
          <ul className="flex flex-col gap-1">
            {logs.map((entry, i) => (
              <li
                key={i}
                className={`font-mono text-xs break-all ${
                  entry.ok
                    ? 'text-yellow-900 dark:text-yellow-200'
                    : 'font-bold text-red-600 dark:text-red-400'
                }`}
              >
                {entry.ok ? '\u2713' : '\u2717'} {entry.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
