'use client'

import { cn } from '@/lib/utils'
import { getScoreLabel } from '@/server/scoring'
import type { ScoreBreakdown } from '@/types/analysis'

interface ScoreCardProps {
  score: ScoreBreakdown
  jobTitle?: string
  company?: string
}

const dimensionLabels: Record<keyof Omit<ScoreBreakdown, 'overall'>, string> = {
  skills: 'Skills match',
  keywords: 'Keyword density',
  experience: 'Experience fit',
  presentation: 'CV presentation',
}

const dimensionDescriptions: Record<keyof Omit<ScoreBreakdown, 'overall'>, string> = {
  skills: 'How well your technical and soft skills align with requirements',
  keywords: 'Presence of ATS-relevant terms from the job description',
  experience: 'Seniority level and years of experience match',
  presentation: 'Clarity, structure and readability of your CV',
}

export function ScoreCard({ score, jobTitle, company }: ScoreCardProps) {
  const { label, variant } = getScoreLabel(score.overall)

  const variantStyles = {
    success: {
      ring: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      ring: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-500',
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    destructive: {
      ring: 'border-red-500/30',
      bg: 'bg-red-500/10',
      text: 'text-red-500',
      badge: 'bg-red-500/15 text-red-600 dark:text-red-400',
    },
  }[variant]

  const dimensions = Object.entries(dimensionLabels) as [
    keyof Omit<ScoreBreakdown, 'overall'>,
    string,
  ][]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fit Score
          </p>
          {(jobTitle || company) && (
            <p className="text-sm font-medium text-foreground">
              {jobTitle ?? 'Unknown role'}
              {company && (
                <span className="text-muted-foreground"> at {company}</span>
              )}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full border-4',
              variantStyles.ring,
              variantStyles.bg
            )}
          >
            <span className={cn('text-2xl font-bold tabular-nums', variantStyles.text)}>
              {score.overall}
            </span>
          </div>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              variantStyles.badge
            )}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="flex flex-col gap-4">
        {dimensions.map(([key, dimLabel]) => {
          const value = score[key]
          const { variant: dimVariant } = getScoreLabel(value)
          const barColor = {
            success: 'bg-emerald-500',
            warning: 'bg-amber-500',
            destructive: 'bg-red-500',
          }[dimVariant]

          return (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">{dimLabel}</span>
                  <span className="text-xs text-muted-foreground">
                    {dimensionDescriptions[key]}
                  </span>
                </div>
                <span className="ml-4 shrink-0 font-mono text-sm font-semibold text-foreground tabular-nums">
                  {value}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', barColor)}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
