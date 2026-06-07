'use client'

import Link from 'next/link'
import { PlusCircle, ArrowRight, FileSearch, TrendingUp, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { getScoreLabel } from '@/server/scoring'
import type { Database } from '@/types/db'

type AnalysisRow = Database['public']['Tables']['analyses']['Row']

interface DashboardShellProps {
  analyses: Partial<AnalysisRow>[]
}

// Compute stats from analyses list
function computeStats(analyses: Partial<AnalysisRow>[]) {
  const completed = analyses.filter((a) => a.status === 'completed')
  const scores = completed
    .map((a) => {
      const r = a.result as Record<string, unknown> | null
      return r && typeof r === 'object' && 'score' in r
        ? (r.score as Record<string, number>)?.overall
        : null
    })
    .filter((s): s is number => s != null)

  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const best = scores.length > 0 ? Math.max(...scores) : null

  return { total: analyses.length, avg, best }
}

export function DashboardShell({ analyses }: DashboardShellProps) {
  const hasAnalyses = analyses.length > 0
  const stats = computeStats(analyses)

  return (
    <div className="container max-w-4xl py-8">

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-[13px] text-muted-foreground">
            {hasAnalyses
              ? `${stats.total} ${stats.total === 1 ? 'analysis' : 'analyses'} completed`
              : 'Upload your CV to get started.'}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New analysis
        </Link>
      </div>

      {/* Stats strip — only when data exists */}
      {hasAnalyses && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <StatCard
            icon={FileSearch}
            label="Total analyses"
            value={String(stats.total)}
          />
          <StatCard
            icon={TrendingUp}
            label="Average score"
            value={stats.avg != null ? String(stats.avg) : '—'}
          />
          <StatCard
            icon={Clock}
            label="Last analysis"
            value={
              analyses[0]?.created_at
                ? formatDate(analyses[0].created_at)
                : '—'
            }
          />
        </div>
      )}

      {/* Content */}
      {!hasAnalyses ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="mb-1 label-caps">Recent analyses</p>
          {analyses.map((analysis) => (
            <AnalysisRow key={analysis.id} analysis={analysis} />
          ))}
          <div className="mt-3 flex justify-end">
            <Link
              href="/history"
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View full history
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="animate-in-up rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-primary/8 dark:bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
      </div>
      <p className="font-mono text-base font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="animate-in-up flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border px-8 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
        <FileSearch className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-foreground">No analyses yet</p>
      <p className="mt-1.5 max-w-[260px] text-[13px] text-muted-foreground">
        Upload your CV and paste a job description to see how well you match.
      </p>
      <Link
        href="/dashboard/new"
        className="mt-5 flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        Start first analysis
      </Link>
    </div>
  )
}

function AnalysisRow({ analysis }: { analysis: Partial<AnalysisRow> }) {
  const result = analysis.result as Record<string, unknown> | null
  const overallScore =
    result && typeof result === 'object' && 'score' in result
      ? (result.score as Record<string, number>)?.overall
      : null

  const scoreInfo = overallScore != null ? getScoreLabel(overallScore) : null

  const scoreBarColor = scoreInfo
    ? {
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        destructive: 'bg-red-500',
      }[scoreInfo.variant]
    : 'bg-muted'

  return (
    <Link href={`/analysis/${analysis.id}`} className="group">
      <div className="card-hover relative overflow-hidden rounded-xl border border-border bg-card px-4 py-3.5">
        {/* Score bar — hairline at top */}
        {overallScore != null && (
          <div
            className={`absolute top-0 left-0 h-[2px] rounded-full transition-all duration-500 ${scoreBarColor}`}
            style={{ width: `${overallScore}%` }}
          />
        )}

        <div className="flex items-center gap-4">
          {/* Role info */}
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">
              {analysis.job_title ?? 'Untitled role'}
            </p>
            <p className="text-xs text-muted-foreground">
              {analysis.company ?? 'No company'}
              {analysis.created_at && (
                <span className="before:mx-1.5 before:content-[\u00B7]">
                  {formatDate(analysis.created_at)}
                </span>
              )}
            </p>
          </div>

          {/* Right: score + badge */}
          <div className="flex shrink-0 items-center gap-3">
            {scoreInfo && (
              <span className="text-[11px] font-medium text-muted-foreground">
                {scoreInfo.label}
              </span>
            )}
            {overallScore != null && (
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {overallScore}
              </span>
            )}
            <StatusBadge status={analysis.status} />
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  if (status === 'completed') return null
  const map: Record<string, { label: string; variant: 'warning' | 'info' | 'destructive' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    processing: { label: 'Processing', variant: 'info' },
    failed: { label: 'Failed', variant: 'destructive' },
  }
  const entry = map[status ?? '']
  if (!entry) return null
  return <Badge variant={entry.variant}>{entry.label}</Badge>
}
