import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTABannerSection() {
  return (
    <section className="border-t border-border">
      <div className="container py-24">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to know your real fit score?
              </h2>
              <p className="max-w-md text-balance text-muted-foreground">
                Upload your CV now — no account needed to run your first analysis.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Free tier includes 3 analyses/month. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
