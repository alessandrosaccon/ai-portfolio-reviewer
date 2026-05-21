export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ScoreBreakdown {
  overall: number          // 0–100
  skills: number           // technical skill match
  experience: number       // seniority / years match
  keywords: number         // keyword density match
  presentation: number     // CV clarity and structure
}

export interface SkillGapItem {
  skill: string
  found: boolean
  importance: 'required' | 'preferred' | 'nice-to-have'
  suggestion?: string
}

export interface SuggestionItem {
  section: 'summary' | 'experience' | 'skills' | 'education' | 'general'
  original?: string
  rewrite?: string
  rationale: string
  priority: 'high' | 'medium' | 'low'
}

export interface AnalysisResult {
  id: string
  userId: string
  createdAt: string
  status: AnalysisStatus

  // Input
  cvText: string
  jobDescription: string
  jobTitle?: string
  company?: string

  // Output
  score: ScoreBreakdown
  skillGap: SkillGapItem[]
  suggestions: SuggestionItem[]
  summary: string           // 2–3 sentence AI summary of the fit
  missingKeywords: string[]
  matchedKeywords: string[]
}

export type AnalysisPreview = Pick<
  AnalysisResult,
  'id' | 'createdAt' | 'status' | 'jobTitle' | 'company' | 'score'
>
