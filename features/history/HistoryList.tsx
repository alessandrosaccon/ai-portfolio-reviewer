'use client'

import Link from 'next/link'
import { FileX } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { getScoreLabel } from '@/server/scoring'
import type { Database } from '@/types/db'

type AnalysisRow = Database['public']['Tables']['analyses']['Row']

interface HistoryListProps {
  analyses: Partial<AnalysisRow>[]
}

export function HistoryList({ analyses }: HistoryListProps) {
  if (analyses.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border">
        <div className="flex flex-col items-center gap-3 text-center">
          <FileX className="h-8 w-8 text-muted-foreground/50" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">No history yet</p>
            <p className="text-xs text-muted-foreground">Your analyses will appear here after you run them.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {analyses.map((analysis) => {
        const result = analysis.result as Record<string, unknown> | null
        const overallScore =
          result && 'score' in result
            ? (result.score as Record<string, number>)?.overall
            : null
        const scoreInfo = overallScore != null ? getScoreLabel(overallScore) : null

        return (
          <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/30">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between gap-4">
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
                      <span className="font-mono text-sm font-bold text-foreground">{overallScore}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
