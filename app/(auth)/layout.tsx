import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal auth header */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            AI
          </span>
          Portfolio Reviewer
        </Link>
        <ThemeToggle />
      </header>

      {/* Auth content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
