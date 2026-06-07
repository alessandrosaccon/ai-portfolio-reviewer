'use client'

interface KeywordSectionProps {
  matchedKeywords: string[]
  missingKeywords: string[]
}

export function KeywordSection({ matchedKeywords, missingKeywords }: KeywordSectionProps) {
  return (
    <div className="animate-in-up delay-100 rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="label-caps">Keyword Analysis</p>
        <span className="text-xs text-muted-foreground">
          {matchedKeywords.length} matched &middot; {missingKeywords.length} missing
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Matched */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Matched
          </p>
          {matchedKeywords.length === 0 ? (
            <p className="text-xs text-muted-foreground">None detected.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-md border border-emerald-500/20 bg-emerald-500/8 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
            Missing
          </p>
          {missingKeywords.length === 0 ? (
            <p className="text-xs text-muted-foreground">Full coverage — great job!</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-md border border-red-500/20 bg-red-500/8 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400"
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
