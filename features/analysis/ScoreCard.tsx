'use client'

import { useEffect, useRef, useState } from 'react'
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
  skills: 'Technical and soft skills vs requirements',
  keywords: 'ATS-relevant terms from the job description',
  experience: 'Seniority level and years of experience',
  presentation: 'Clarity, structure and readability',
}

// Animated count-up hook
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

// SVG arc ring
function ScoreRing({ value, variant }: { value: number; variant: 'success' | 'warning' | 'destructive' }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const size = 96
  const strokeWidth = 5
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const progress = mounted ? (value / 100) * circumference : 0

  const ringColor = {
    success: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    destructive: 'stroke-red-500',
  }[variant]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-border"
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        className={cn(ringColor, 'transition-all duration-700 ease-out')}
      />
    </svg>
  )
}

function DimensionBar({
  label,
  description,
  value,
  barColor,
  delay = 0,
}: {
  label: string
  description: string
  value: number
  barColor: string
  delay?: number
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <span className="shrink-0 font-mono text-[13px] font-semibold tabular-nums text-foreground">
          {value}
        </span>
      </div>
      <div className="h-[5px] w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', barColor)}
          style={{ width: mounted ? `${value}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export function ScoreCard({ score, jobTitle, company }: ScoreCardProps) {
  const { label, variant } = getScoreLabel(score.overall)
  const displayScore = useCountUp(score.overall)

  const scoreTextColor = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    destructive: 'text-red-500',
  }[variant]

  const scoreBadgeStyle = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    destructive: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }[variant]

  const barColor = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    destructive: 'bg-red-500',
  }

  const dimensions = (Object.keys(dimensionLabels) as Array<keyof Omit<ScoreBreakdown, 'overall'>>)

  return (
    <div className="animate-in-up rounded-xl border border-border bg-card p-6 shadow-sm">

      {/* Header row: title + ring */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 pt-1">
          <p className="label-caps">Fit Score</p>
          {(jobTitle || company) && (
            <p className="mt-1 text-[13px] font-medium text-foreground">
              {jobTitle ?? 'Unknown role'}
              {company && (
                <span className="font-normal text-muted-foreground"> at {company}</span>
              )}
            </p>
          )}
          <span className={cn('mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold', scoreBadgeStyle)}>
            {label}
          </span>
        </div>

        {/* Animated ring */}
        <div className="relative shrink-0">
          <ScoreRing value={score.overall} variant={variant} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-mono text-xl font-bold tabular-nums leading-none', scoreTextColor)}>
              {displayScore}
            </span>
            <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="flex flex-col gap-4">
        {dimensions.map((key, i) => {
          const dimValue = score[key]
          const { variant: dimVariant } = getScoreLabel(dimValue)
          return (
            <DimensionBar
              key={key}
              label={dimensionLabels[key]}
              description={dimensionDescriptions[key]}
              value={dimValue}
              barColor={barColor[dimVariant]}
              delay={200 + i * 80}
            />
          )
        })}
      </div>
    </div>
  )
}
