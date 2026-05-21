'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { UploadZone } from './UploadZone'

const schema = z.object({
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  jobDescription: z
    .string()
    .min(50, 'Job description must be at least 50 characters')
    .max(10000, 'Job description is too long'),
})

type FormFields = z.infer<typeof schema>

export function AnalysisForm() {
  const router = useRouter()
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormFields) {
    if (!cvFile) {
      setFileError('Please upload your CV before running the analysis.')
      return
    }
    setFileError(null)
    setServerError(null)

    startTransition(async () => {
      const fd = new FormData()
      fd.set('cv', cvFile)
      fd.set('jobDescription', data.jobDescription)
      if (data.jobTitle) fd.set('jobTitle', data.jobTitle)
      if (data.company) fd.set('company', data.company)

      const res = await fetch('/api/analyze', { method: 'POST', body: fd })
      const json = await res.json()

      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Something went wrong. Please try again.')
        return
      }

      router.push(`/analysis/${json.id}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      {/* CV Upload */}
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold text-foreground">Your CV</legend>
        <UploadZone
          onFileSelect={(f) => { setCvFile(f); setFileError(null) }}
          selectedFile={cvFile}
          onClear={() => setCvFile(null)}
          disabled={isPending}
        />
        {fileError && (
          <p className="text-xs text-destructive">{fileError}</p>
        )}
      </fieldset>

      {/* Job details */}
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-semibold text-foreground">Job details</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="jobTitle">
              Job title{' '}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Senior Frontend Engineer"
              disabled={isPending}
              {...register('jobTitle')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">
              Company{' '}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="company"
              placeholder="e.g. Stripe"
              disabled={isPending}
              {...register('company')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="jobDescription">Job description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here…"
            rows={10}
            disabled={isPending}
            aria-invalid={!!errors.jobDescription}
            {...register('jobDescription')}
          />
          {errors.jobDescription && (
            <p className="text-xs text-destructive">{errors.jobDescription.message}</p>
          )}
        </div>
      </fieldset>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          Analysis takes 10–30 seconds.
        </p>
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Run analysis
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
