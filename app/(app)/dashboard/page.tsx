import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/features/dashboard/DashboardShell'

export const metadata: Metadata = { title: 'Dashboard' }

// Always fresh — the dashboard shows the latest analyses.
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, status, job_title, company, result, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return <DashboardShell analyses={analyses ?? []} />
}
