import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container flex flex-col items-center gap-8 py-24 text-center md:py-36">
        {/* Pill */}
        <div className="animate-fade-in">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-primary" />
            Powered by GPT-4o
          </Badge>
        </div>

        {/* Headline */}
        <div className="animate-fade-in flex flex-col items-center gap-4" style={{ animationDelay: '60ms' }}>
          <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Know exactly how your CV{' '}
            <span className="gradient-text">fits the job</span>
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Upload your CV, paste a job description, and get an honest AI-powered fit score,
            skill gap analysis, and concrete rewrite suggestions — in seconds.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="animate-fade-in flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: '120ms' }}
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              Analyze my CV
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        {/* Social proof micro */}
        <p
          className="animate-fade-in text-xs text-muted-foreground"
          style={{ animationDelay: '180ms' }}
        >
          No account required to try &middot; Free tier available
        </p>

        {/* Mock score card preview */}
        <div
          className="animate-fade-in mt-8 w-full max-w-2xl"
          style={{ animationDelay: '240ms' }}
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5 text-left">
                <p className="text-xs font-medium text-muted-foreground">ANALYSIS RESULT</p>
                <p className="text-sm font-semibold text-foreground">Senior Frontend Engineer at Acme Corp</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10">
                <span className="text-xl font-bold text-primary">84</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Skills', value: 88 },
                { label: 'Keywords', value: 81 },
                { label: 'Experience', value: 79 },
                { label: 'Presentation', value: 91 },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="success">TypeScript</Badge>
              <Badge variant="success">React</Badge>
              <Badge variant="success">Next.js</Badge>
              <Badge variant="warning">System Design</Badge>
              <Badge variant="destructive">GraphQL</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
