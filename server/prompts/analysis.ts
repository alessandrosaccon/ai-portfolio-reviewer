// Server-only: never import this file in client components
import type { AnalysisResult } from '@/types/analysis'

export interface AnalysisPromptInput {
  cvText: string
  jobDescription: string
  jobTitle?: string
  company?: string
}

export function buildAnalysisPrompt(input: AnalysisPromptInput): string {
  const { cvText, jobDescription, jobTitle, company } = input

  return `You are an expert career coach and technical recruiter. Analyze the provided CV against the job description and return a structured JSON response.

## Job Target
${jobTitle ? `Role: ${jobTitle}` : ''}
${company ? `Company: ${company}` : ''}

## Job Description
${jobDescription}

## Candidate CV
${cvText}

## Instructions
Return a valid JSON object matching this exact structure:
{
  "score": {
    "overall": <0-100>,
    "skills": <0-100>,
    "experience": <0-100>,
    "keywords": <0-100>,
    "presentation": <0-100>
  },
  "summary": "<2-3 sentence honest assessment of the fit>",
  "matchedKeywords": ["<keyword>", ...],
  "missingKeywords": ["<keyword>", ...],
  "skillGap": [
    {
      "skill": "<skill name>",
      "found": <true|false>,
      "importance": "<required|preferred|nice-to-have>",
      "suggestion": "<optional: how to address this gap>"
    }
  ],
  "suggestions": [
    {
      "section": "<summary|experience|skills|education|general>",
      "original": "<optional: original text>",
      "rewrite": "<optional: improved version>",
      "rationale": "<why this change matters>",
      "priority": "<high|medium|low>"
    }
  ]
}

Be honest, specific, and actionable. Do not invent skills the candidate doesn't have. Focus on the most impactful improvements. Return only valid JSON, no markdown code blocks.`
}
