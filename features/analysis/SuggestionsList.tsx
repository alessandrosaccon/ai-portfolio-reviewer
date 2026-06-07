'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SuggestionItem } from '@/types/analysis'

interface SuggestionsListProps {
  suggestions: SuggestionItem[]
}

const sectionLabels: Record<SuggestionItem['section'], string> = {
  summary: 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  general: 'General',
}

const priorityConfig: Record<SuggestionItem['priority'], { label: string; dot: string; badge: string }> = {
  high:   { label: 'High',   dot: 'bg-red-500',   badge: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  medium: { label: 'Medium', dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  low:    { label: 'Low',    dot: 'bg-muted-foreground', badge: 'bg-muted text-muted-foreground' },
}

const priorityOrder = { high: 0, medium: 1, low: 2 }

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (suggestions.length === 0) return null

  const sorted = [...suggestions].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  )

  return (
    <div className="animate-in-up delay-200 rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="label-caps">Improvement Suggestions</p>
        <span className="text-xs text-muted-foreground">{suggestions.length} items</span>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {sorted.map((suggestion, i) => (
          <SuggestionRow key={i} suggestion={suggestion} index={i} />
        ))}
      </div>
    </div>
  )
}

function SuggestionRow({ suggestion, index }: { suggestion: SuggestionItem; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasRewrite = !!suggestion.original || !!suggestion.rewrite
  const config = priorityConfig[suggestion.priority]

  return (
    <div className={cn('py-4 first:pt-0 last:pb-0', expanded && 'pb-5')}>
      <div className="flex items-start gap-3">
        {/* Index number */}
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
          {index + 1}
        </span>

        <div className="flex flex-1 flex-col gap-2">
          {/* Tags row */}
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {sectionLabels[suggestion.section]}
            </span>
            <span className={cn('flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold', config.badge)}>
              <span className={cn('h-1 w-1 rounded-full', config.dot)} />
              {config.label}
            </span>
          </div>

          {/* Rationale */}
          <p className="text-[13px] leading-relaxed text-foreground">{suggestion.rationale}</p>

          {/* Rewrite toggle */}
          {hasRewrite && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex w-fit items-center gap-1 text-[12px] font-medium text-primary transition-opacity hover:opacity-70"
            >
              {expanded ? 'Hide rewrite' : 'See rewrite suggestion'}
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded rewrite */}
      {expanded && hasRewrite && (
        <div className="mt-4 ml-8 grid gap-3 sm:grid-cols-2">
          {suggestion.original && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Original</p>
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">{suggestion.original}</p>
              </div>
            </div>
          )}
          {suggestion.rewrite && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Suggested</p>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs leading-relaxed text-foreground">{suggestion.rewrite}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
