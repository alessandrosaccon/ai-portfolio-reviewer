'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from './actions'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFields = z.infer<typeof schema>

export function LoginForm() {
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null)
  const [isPending, setIsPending] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: LoginFields) {
    setServerError(null)
    setDebugInfo(null)
    setIsPending(true)

    try {
      const result = await loginAction({
        email: data.email,
        password: data.password,
        redirectTo: searchParams.get('redirectTo') || '/dashboard',
      })

      if (result?.debug) {
        setDebugInfo(result.debug)
      }

      if (result?.error) {
        setServerError(result.error)
        setIsPending(false)
        return
      }

      // If we reach here it means redirect() was called server-side
      // but the client received a result object instead (should not happen).
      // Show debug anyway.
      setDebugInfo((prev) => ({
        ...prev,
        clientNote: 'Server action returned without error and without redirecting — this is unexpected',
      }))
      setIsPending(false)

    } catch (err: unknown) {
      // NEXT_REDIRECT is thrown by redirect() — it\'s not a real error.
      // If we catch it, it means redirect() fired but something swallowed it.
      const isRedirect = err instanceof Error && err.message === 'NEXT_REDIRECT'
      if (isRedirect) {
        setDebugInfo({ clientNote: 'NEXT_REDIRECT caught on client — redirect() fired server-side but navigation did not happen. This means the Server Action redirect is being blocked.' })
      } else {
        setDebugInfo({ clientNote: String(err) })
        setServerError('Unexpected client error. See debug panel.')
      }
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
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
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          {serverError}
        </div>
      )}

      {/* DEBUG PANEL — remove before going live */}
      {debugInfo && (
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3">
          <p className="mb-1.5 text-xs font-semibold text-yellow-400">DEBUG</p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs text-yellow-300">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
        ) : (
          'Sign in'
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}
