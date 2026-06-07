import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ScoreCard } from '@/features/analysis/ScoreCard'
import { SummaryCard } from '@/features/analysis/SummaryCard'
import { KeywordSection } from '@/features/analysis/KeywordSection'
import { SkillGapList } from '@/features/analysis/SkillGapList'
import { SuggestionsList } from '@/features/analysis/SuggestionsList'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { AnalysisResult } from '@/types/analysis'

interface PageProps {
  params: Promise<{ id: string }>
}

interface AnalysisRow {
  id: string
  status: string
  job_title: string | null
  company: string | null
  created_at: string
  result: unknown
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('analyses')
    .select('job_title, company')
    .eq('id', id)
    .single()

  const row = data as Pick<AnalysisRow, 'job_title' | 'company'> | null
  if (!row) return { title: 'Analysis' }
  return {
    title: row.job_title
      ? `${row.job_title}${row.company ? ` at ${row.company}` : ''}`
      : 'Analysis Result',
  }
}

export default async function AnalysisPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single()

  const analysis = data as AnalysisRow | null

  if (error || !analysis) notFound()

  if (analysis.status === 'pending' || analysis.status === 'processing') {
    return <ProcessingState id={id} />
  }

  if (analysis.status === 'failed') {
    return <FailedState />
  }

  const result = analysis.result as AnalysisResult | null
  if (!result?.score) notFound()

  return (
    <div className="container max-w-2xl py-8">

      {/* Breadcrumb + meta */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{formatDate(analysis.created_at)}</span>
          <Badge variant="success">Completed</Badge>
        </div>
      </div>

      {/* Title */}
      <div className="mb-7 flex flex-col gap-1">
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {analysis.job_title ?? 'Analysis result'}
          {analysis.company && (
            <span className="font-normal text-muted-foreground"> at {analysis.company}</span>
          )}
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Here&apos;s how your CV matches this role.
        </p>
      </div>

      {/* Result sections */}
      <div className="flex flex-col gap-4">
        <ScoreCard
          score={result.score}
          jobTitle={analysis.job_title ?? undefined}
          company={analysis.company ?? undefined}
        />

        {result.summary && <SummaryCard summary={result.summary} />}

        <KeywordSection
          matchedKeywords={result.matchedKeywords ?? []}
          missingKeywords={result.missingKeywords ?? []}
        />

        {result.skillGap?.length > 0 && (
          <SkillGapList skillGap={result.skillGap} />
        )}

        {result.suggestions?.length > 0 && (
          <SuggestionsList suggestions={result.suggestions} />
        )}

        {/* Sticky-ish action bar */}
        <div className="mt-2 flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
          <Link
            href="/dashboard/new"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Run new analysis
          </Link>
          <Link
            href="/history"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View history
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProcessingState({ id }: { id: string }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">Analyzing your CV…</p>
          <p className="text-[13px] text-muted-foreground">
            Usually takes 10–30 seconds.
          </p>
        </div>
        <Link
          href={`/analysis/${id}`}
          className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Link>
      </div>
    </div>
  )
}

function FailedState() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card">
          <span className="text-lg text-muted-foreground">✕</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">Analysis failed</p>
          <p className="text-[13px] text-muted-foreground">
            Something went wrong. Please try again.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <RotateCcw className="h-3 w-3" />
          Try again
        </Link>
      </div>
    </div>
  )
}
