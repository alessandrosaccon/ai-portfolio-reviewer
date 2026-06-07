import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Pure client-safe utility — returns a human-readable label and a
 * semantic variant for a 0-100 score value.
 * Kept here (not in server/scoring) so Client Components can import it
 * without bundling server-only modules.
 */
export function getScoreLabel(score: number): {
  label: string
  variant: 'success' | 'warning' | 'destructive'
} {
  if (score >= 75) return { label: 'Strong match', variant: 'success' }
  if (score >= 50) return { label: 'Partial match', variant: 'warning' }
  return { label: 'Weak match', variant: 'destructive' }
}
