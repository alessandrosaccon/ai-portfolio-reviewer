import type { Metadata } from 'next'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'AI Portfolio Reviewer — Analyze your CV with AI',
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section — Fase 2 */}
        <section className="container flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
          <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Now in early access
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your CV,{' '}
            <span className="gradient-text">analyzed by AI</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Upload your CV, paste a job description, and get an instant fit score,
            skill gap analysis, and concrete rewrite suggestions — powered by GPT-4o.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Start for free
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See how it works
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
