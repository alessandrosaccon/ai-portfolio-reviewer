import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SkillGapItem } from '@/types/analysis'

interface SkillGapListProps {
  skillGap: SkillGapItem[]
}

const importanceOrder = { required: 0, preferred: 1, 'nice-to-have': 2 }

const importanceBadge: Record<SkillGapItem['importance'], string> = {
  required: 'bg-red-500/10 text-red-600 dark:text-red-400',
  preferred: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'nice-to-have': 'bg-muted text-muted-foreground',
}

export function SkillGapList({ skillGap }: SkillGapListProps) {
  if (skillGap.length === 0) return null

  const sorted = [...skillGap].sort(
    (a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]
  )

  const missing = sorted.filter((s) => !s.found)
  const present = sorted.filter((s) => s.found)

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-5 text-sm font-semibold text-foreground">Skill Gap</h3>

      {missing.length > 0 && (
        <div className="mb-5 flex flex-col gap-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Missing ({missing.length})
          </p>
          {missing.map((skill) => (
            <SkillRow key={skill.skill} skill={skill} />
          ))}
        </div>
      )}

      {present.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Present ({present.length})
          </p>
          {present.map((skill) => (
            <SkillRow key={skill.skill} skill={skill} />
          ))}
        </div>
      )}
    </div>
  )
}

function SkillRow({ skill }: { skill: SkillGapItem }) {
  const Icon = skill.found ? CheckCircle2 : skill.importance === 'required' ? XCircle : MinusCircle
  const iconColor = skill.found
    ? 'text-emerald-500'
    : skill.importance === 'required'
      ? 'text-red-500'
      : 'text-amber-500'

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-colors',
        skill.found ? 'border-border bg-muted/30' : 'border-border bg-card'
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconColor)} />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{skill.skill}</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                importanceBadge[skill.importance]
              )}
            >
              {skill.importance}
            </span>
          </div>
          {skill.suggestion && (
            <p className="text-xs leading-relaxed text-muted-foreground">{skill.suggestion}</p>
          )}
        </div>
      </div>
    </div>
  )
}
