import {
  Target,
  Zap,
  FileSearch,
  PenLine,
  History,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Target,
    title: 'Fit Score',
    description:
      'A weighted 0–100 score across skills, keywords, experience, and presentation. Honest, not inflated.',
    highlight: true,
  },
  {
    icon: FileSearch,
    title: 'Skill Gap Analysis',
    description:
      'Every required and preferred skill checked against your CV. Missing items flagged with actionable suggestions.',
    highlight: false,
  },
  {
    icon: Zap,
    title: 'Keyword Detection',
    description:
      'ATS-relevant keywords matched and missing ones listed. Know exactly what a recruiter system won\'t find.',
    highlight: false,
  },
  {
    icon: PenLine,
    title: 'Rewrite Suggestions',
    description:
      'Section-by-section rewrites for your summary, experience bullets, and skills. Original vs improved, side by side.',
    highlight: true,
  },
  {
    icon: History,
    title: 'Analysis History',
    description:
      'Every analysis saved. Compare your progress across applications and roles over time.',
    highlight: false,
  },
  {
    icon: ShieldCheck,
    title: 'Privacy first',
    description:
      'Your CV data is processed securely and never used for training. You control what you share.',
    highlight: false,
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border">
      <div className="container py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to land the role
          </h2>
          <p className="max-w-xl text-balance text-muted-foreground">
            Not just a score — a full picture of where you stand and what to fix.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={cn(
                'group relative flex flex-col gap-4 rounded-xl border p-6 transition-colors',
                feature.highlight
                  ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                  : 'border-border bg-card hover:border-border/80 hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  feature.highlight
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:text-foreground'
                )}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
