import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal auth header */}
      <header className="flex h-[54px] items-center justify-between border-b border-border px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-75"
        >
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            AI Portfolio
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Split layout: form left + brand right on md+ */}
      <main className="flex flex-1">
        {/* Form side */}
        <div className="flex flex-1 items-center justify-center px-6 py-14">
          <div className="w-full max-w-[360px] animate-in-up">
            {children}
          </div>
        </div>

        {/* Brand side — hidden on mobile */}
        <div className="hidden lg:flex w-[420px] shrink-0 flex-col items-start justify-center border-l border-border bg-card px-12 py-16 gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold tracking-tight text-foreground">
                Know exactly where you stand
              </p>
              <p className="text-[13px] leading-relaxed text-muted-foreground max-w-[280px]">
                Upload your CV, paste a job description, and get a precise fit score with actionable rewrite suggestions in seconds.
              </p>
            </div>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3">
            {[
              'Fit score across 4 dimensions',
              'Matched & missing keywords',
              'Skill gap analysis',
              'AI-powered rewrite suggestions',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground/60">
            Used by professionals before every important application.
          </p>
        </div>
      </main>
    </div>
  )
}
