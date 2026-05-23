import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/features/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your AI Portfolio Reviewer account.',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue.
        </p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
