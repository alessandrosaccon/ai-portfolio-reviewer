import type { Metadata } from 'next'
import { SignupForm } from '@/features/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your AI Portfolio Reviewer account.',
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start analyzing your CV for free. No credit card required.
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
