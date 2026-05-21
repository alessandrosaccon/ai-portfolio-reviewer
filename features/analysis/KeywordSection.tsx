import { CheckCircle2, XCircle } from 'lucide-react'

interface KeywordSectionProps {
  matchedKeywords: string[]
  missingKeywords: string[]
}

export function KeywordSection({ matchedKeywords, missingKeywords }: KeywordSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-5 text-sm font-semibold text-foreground">Keyword Analysis</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Matched */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="text-xs font-semibold text-foreground">
              Matched ({matchedKeywords.length})
            </p>
          </div>
          {matchedKeywords.length === 0 ? (
            <p className="text-xs text-muted-foreground">No matched keywords detected.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs font-semibold text-foreground">
              Missing ({missingKeywords.length})
            </p>
          </div>
          {missingKeywords.length === 0 ? (
            <p className="text-xs text-muted-foreground">No missing keywords — great coverage!</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
