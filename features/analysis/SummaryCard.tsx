import { MessageSquare } from 'lucide-react'

interface SummaryCardProps {
  summary: string
}

export function SummaryCard({ summary }: SummaryCardProps) {
  if (!summary) return null

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-muted/40 p-5">
      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm leading-relaxed text-foreground">{summary}</p>
    </div>
  )
}
