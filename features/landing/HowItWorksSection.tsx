import { Upload, Cpu, BarChart3 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload your CV',
    description:
      'Drop your PDF resume. We extract and normalize the text automatically — no manual copy-pasting needed.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Paste the job description',
    description:
      'Add the JD or just the role title. Our AI reads both documents and compares them across multiple dimensions.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Get your fit report',
    description:
      'Receive a fit score, skill gap breakdown, missing keywords, and concrete rewrite suggestions for every section.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/30">
      <div className="container py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From CV to insights in under 30 seconds
          </h2>
          <p className="max-w-xl text-balance text-muted-foreground">
            Three steps. No setup. No guesswork.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="group relative flex flex-col gap-5">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-1/2 translate-x-1/2 bg-border md:block" />
              )}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-mono text-3xl font-bold text-border">{step.number}</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
