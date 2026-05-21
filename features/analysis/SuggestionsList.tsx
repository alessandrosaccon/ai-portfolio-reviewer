'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react'
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

const priorityStyles: Record<SuggestionItem['priority'], string> = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'bg-muted text-muted-foreground',
}

const priorityOrder = { high: 0, medium: 1, low: 2 }

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (suggestions.length === 0) return null

  const sorted = [...suggestions].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-5 text-sm font-semibold text-foreground">
        Improvement Suggestions
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          ({suggestions.length})
        </span>
      </h3>
      <div className="flex flex-col gap-3">
        {sorted.map((suggestion, i) => (
          <SuggestionCard key={i} suggestion={suggestion} />
        ))}
      </div>
    </div>
  )
}

function SuggestionCard({ suggestion }: { suggestion: SuggestionItem }) {
  const [expanded, setExpanded] = useState(false)
  const hasRewrite = !!suggestion.original || !!suggestion.rewrite

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {sectionLabels[suggestion.section]}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                priorityStyles[suggestion.priority]
              )}
            >
              {suggestion.priority} priority
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{suggestion.rationale}</p>
        </div>

        {hasRewrite && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            {expanded ? 'Hide' : 'Rewrite'}
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {expanded && hasRewrite && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {suggestion.original && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Original
              </p>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {suggestion.original}
                </p>
              </div>
            </div>
          )}
          {suggestion.rewrite && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Suggested rewrite
              </p>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-xs leading-relaxed text-foreground">{suggestion.rewrite}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
