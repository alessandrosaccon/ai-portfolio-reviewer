interface SummaryCardProps {
  summary: string
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="animate-in-up delay-75 rounded-xl border border-border bg-card p-6">
      <p className="label-caps mb-3">Summary</p>
      <p className="text-[13px] leading-relaxed text-foreground">{summary}</p>
    </div>
  )
}
