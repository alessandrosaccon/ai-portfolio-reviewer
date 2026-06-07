import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { HistoryList } from '@/features/history/HistoryList'

export const metadata: Metadata = { title: 'History' }

// Always fetch fresh data — never serve a cached version after a new analysis.
export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const supabase = await createClient()

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, status, job_title, company, result, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">
          All your past analyses in one place.
        </p>
      </div>
      <HistoryList analyses={analyses ?? []} />
    </div>
  )
}
