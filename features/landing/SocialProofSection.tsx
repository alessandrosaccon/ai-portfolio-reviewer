import { cn } from '@/lib/utils'

const testimonials = [
  {
    quote:
      'I applied to 20 roles with the same CV and heard nothing. After one analysis, I rewrote my summary and got three interviews in a week.',
    name: 'Marco R.',
    role: 'Frontend Developer',
    score: 91,
  },
  {
    quote:
      'The keyword detection is scarily accurate. I had no idea I was missing half the terms the JD mentioned. My ATS pass rate jumped overnight.',
    name: 'Sara L.',
    role: 'Product Manager',
    score: 78,
  },
  {
    quote:
      'As a career switcher, the skill gap breakdown told me exactly what to learn and what to emphasize. It cut months of guessing.',
    name: 'James T.',
    role: 'Data Analyst → ML Engineer',
    score: 85,
  },
]

const stats = [
  { value: '94%', label: 'of users improved their score on second analysis' },
  { value: '<30s', label: 'average time to generate a full report' },
  { value: '4.2×', label: 'more interview callbacks reported after rewrite' },
]

export function SocialProofSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="container py-24">
        {/* Stats */}
        <div className="grid gap-px rounded-2xl border border-border bg-border sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-card px-6 py-8 text-center first:rounded-l-2xl last:rounded-r-2xl"
            >
              <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={cn(
                'flex flex-col gap-4 rounded-xl border border-border bg-card p-6',
                i === 1 && 'md:scale-105 md:shadow-lg md:shadow-black/5'
              )}
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
                  <span className="text-xs font-bold text-primary">{t.score}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
