'use client'

import Link from 'next/link'
import { PlusCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { getScoreLabel } from '@/server/scoring'
import type { Database } from '@/types/db'

type AnalysisRow = Database['public']['Tables']['analyses']['Row']

interface DashboardShellProps {
  analyses: Partial<AnalysisRow>[]
}

export function DashboardShell({ analyses }: DashboardShellProps) {
  const hasAnalyses = analyses.length > 0

  return (
    <div className="container max-w-4xl py-10">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {hasAnalyses
              ? `${analyses.length} recent ${analyses.length === 1 ? 'analysis' : 'analyses'}`
              : 'Start by uploading your CV.'}
          </p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/dashboard/new">
            <PlusCircle className="h-4 w-4" />
            New analysis
          </Link>
        </Button>
      </div>

      {/* Content */}
      {!hasAnalyses ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {analyses.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
          <div className="mt-2 flex justify-end">
            <Link
              href="/history"
              className="flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
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

function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted">
          <PlusCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">No analyses yet</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Upload your CV and paste a job description to run your first analysis.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/dashboard/new">
            <PlusCircle className="h-4 w-4" />
            Start analysis
          </Link>
        </Button>
      </div>
    </div>
  )
}

function AnalysisCard({ analysis }: { analysis: Partial<AnalysisRow> }) {
  const result = analysis.result as Record<string, unknown> | null
  const overallScore =
    result && typeof result === 'object' && 'score' in result
      ? (result.score as Record<string, number>)?.overall
      : null

  const scoreInfo = overallScore != null ? getScoreLabel(overallScore) : null

  return (
    <Link href={`/analysis/${analysis.id}`}>
      <Card className="cursor-pointer transition-colors hover:border-border/80 hover:bg-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-sm">
                {analysis.job_title ?? 'Untitled role'}
              </CardTitle>
              <CardDescription className="text-xs">
                {analysis.company ?? 'No company'} &middot;{' '}
                {analysis.created_at ? formatDate(analysis.created_at) : '—'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {scoreInfo && (
                <Badge variant={scoreInfo.variant === 'destructive' ? 'destructive' : scoreInfo.variant as 'success' | 'warning'}>
                  {scoreInfo.label}
                </Badge>
              )}
              {overallScore != null && (
                <span className="font-mono text-sm font-bold text-foreground">
                  {overallScore}
                </span>
              )}
              <StatusBadge status={analysis.status} />
            </div>
          </div>
        </CardHeader>
      </Card>
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
