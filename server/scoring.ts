// Server-only: scoring utilities
import type { ScoreBreakdown } from '@/types/analysis'

export function normalizeScore(raw: number): number {
  return Math.max(0, Math.min(100, Math.round(raw)))
}

export function getScoreLabel(score: number): {
  label: string
  variant: 'success' | 'warning' | 'destructive'
} {
  if (score >= 75) return { label: 'Strong match', variant: 'success' }
  if (score >= 50) return { label: 'Partial match', variant: 'warning' }
  return { label: 'Weak match', variant: 'destructive' }
}

export function computeOverallScore(breakdown: Omit<ScoreBreakdown, 'overall'>): number {
  const weights = {
    skills: 0.35,
    keywords: 0.25,
    experience: 0.25,
    presentation: 0.15,
  }

  const weighted =
    breakdown.skills * weights.skills +
    breakdown.keywords * weights.keywords +
    breakdown.experience * weights.experience +
    breakdown.presentation * weights.presentation

  return normalizeScore(weighted)
}
