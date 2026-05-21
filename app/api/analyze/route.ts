import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai, OPENAI_MODEL } from '@/lib/openai'
import { extractTextFromPDF, truncateCVText } from '@/lib/pdf-parser'
import { buildAnalysisPrompt } from '@/server/prompts/analysis'
import { computeOverallScore } from '@/server/scoring'
import type { AnalysisResult } from '@/types/analysis'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse multipart form
    const formData = await request.formData()
    const cvFile = formData.get('cv') as File | null
    const jobDescription = formData.get('jobDescription') as string | null
    const jobTitle = formData.get('jobTitle') as string | null
    const company = formData.get('company') as string | null

    if (!cvFile || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: cv and jobDescription' },
        { status: 400 }
      )
    }

    // 3. Validate file
    if (cvFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be under 5MB' },
        { status: 400 }
      )
    }

    // 4. Extract PDF text
    const arrayBuffer = await cvFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    let cvText: string

    try {
      cvText = await extractTextFromPDF(buffer)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Failed to parse PDF' },
        { status: 422 }
      )
    }

    cvText = truncateCVText(cvText)

    // 5. Create pending analysis record
    const { data: analysis, error: insertError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        status: 'processing',
        cv_text: cvText,
        job_description: jobDescription.slice(0, 10000),
        job_title: jobTitle?.trim() || null,
        company: company?.trim() || null,
      })
      .select('id')
      .single()

    if (insertError || !analysis) {
      return NextResponse.json(
        { error: 'Failed to create analysis record' },
        { status: 500 }
      )
    }

    // 6. Build prompt and call OpenAI
    const prompt = buildAnalysisPrompt({
      cvText,
      jobDescription: jobDescription.slice(0, 10000),
      jobTitle: jobTitle ?? undefined,
      company: company ?? undefined,
    })

    let rawResult: AnalysisResult['score'] & {
      summary: string
      matchedKeywords: string[]
      missingKeywords: string[]
      skillGap: AnalysisResult['skillGap']
      suggestions: AnalysisResult['suggestions']
    }

    try {
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('Empty response from OpenAI')

      rawResult = JSON.parse(content)
    } catch (err) {
      // Mark as failed and return error
      await supabase
        .from('analyses')
        .update({ status: 'failed' })
        .eq('id', analysis.id)

      return NextResponse.json(
        { error: 'AI analysis failed. Please try again.' },
        { status: 500 }
      )
    }

    // 7. Compute weighted overall score
    const overall = computeOverallScore({
      skills: rawResult.score?.skills ?? rawResult.skills ?? 50,
      keywords: rawResult.score?.keywords ?? rawResult.keywords ?? 50,
      experience: rawResult.score?.experience ?? rawResult.experience ?? 50,
      presentation: rawResult.score?.presentation ?? rawResult.presentation ?? 50,
    })

    const finalResult = {
      score: {
        overall,
        skills: rawResult.score?.skills ?? rawResult.skills ?? 50,
        keywords: rawResult.score?.keywords ?? rawResult.keywords ?? 50,
        experience: rawResult.score?.experience ?? rawResult.experience ?? 50,
        presentation: rawResult.score?.presentation ?? rawResult.presentation ?? 50,
      },
      summary: rawResult.summary ?? '',
      matchedKeywords: rawResult.matchedKeywords ?? [],
      missingKeywords: rawResult.missingKeywords ?? [],
      skillGap: rawResult.skillGap ?? [],
      suggestions: rawResult.suggestions ?? [],
    }

    // 8. Save completed result
    await supabase
      .from('analyses')
      .update({ status: 'completed', result: finalResult })
      .eq('id', analysis.id)

    return NextResponse.json({ id: analysis.id, result: finalResult })
  } catch (err) {
    console.error('[/api/analyze]', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
