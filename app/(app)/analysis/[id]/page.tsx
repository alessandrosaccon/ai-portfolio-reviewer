import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ScoreCard } from '@/features/analysis/ScoreCard'
import { SummaryCard } from '@/features/analysis/SummaryCard'
import { KeywordSection } from '@/features/analysis/KeywordSection'
import { SkillGapList } from '@/features/analysis/SkillGapList'
import { SuggestionsList } from '@/features/analysis/SuggestionsList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {formatDate(analysis.created_at)}
          </p>
          <Badge variant="success">Completed</Badge>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {analysis.job_title ?? 'Analysis result'}
          {analysis.company && (
            <span className="font-normal text-muted-foreground"> at {analysis.company}</span>
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s how your CV matches the job description.
        </p>
      </div>

      <div className="flex flex-col gap-6">
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

        <div className="flex items-center justify-between border-t border-border pt-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/new">Run new analysis</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/history">View history</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProcessingState({ id }: { id: string }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">Analysis in progress</p>
          <p className="text-sm text-muted-foreground">
            This usually takes 10–30 seconds. Refresh the page to check the result.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/analysis/${id}`}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Link>
        </Button>
      </div>
    </div>
  )
}

function FailedState() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/10">
          <span className="text-2xl">&#x2715;</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">Analysis failed</p>
          <p className="text-sm text-muted-foreground">
            Something went wrong while analyzing your CV. Please try again.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/new">Try again</Link>
        </Button>
      </div>
    </div>
  )
}
