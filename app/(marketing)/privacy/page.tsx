import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AI Portfolio Reviewer collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl py-16">
      <Link
        href="/"
        className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h2>1. Data we collect</h2>
        <p>
          We collect the email address and name you provide at signup. When you run an analysis, we
          temporarily process the text extracted from your CV and the job description you submit.
        </p>

        <h2>2. How we use your data</h2>
        <p>
          CV text and job descriptions are sent to OpenAI\'s API to generate your analysis. We store
          the analysis result (not the raw PDF) in your account history so you can review it later.
        </p>

        <h2>3. Data retention</h2>
        <p>
          Analysis results are retained until you delete them or close your account. You can delete
          your account and all associated data at any time from Settings.
        </p>

        <h2>4. Third-party services</h2>
        <p>
          We use Supabase for authentication and database storage, and OpenAI for AI analysis.
          Both services operate under their own privacy policies.
        </p>

        <h2>5. Contact</h2>
        <p>
          For privacy-related questions, reach out via the contact information in the repository.
        </p>
      </div>
    </div>
  )
}
