import type { Metadata } from 'next'
import { AnalysisForm } from '@/features/upload/AnalysisForm'

export const metadata: Metadata = {
  title: 'New Analysis',
}

export default function NewAnalysisPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">New analysis</h1>
        <p className="text-sm text-muted-foreground">
          Upload your CV and paste the job description to get your fit score.
        </p>
      </div>
      <AnalysisForm />
    </div>
  )
}
