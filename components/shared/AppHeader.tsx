'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from './MobileNav'
import type { UserProfile } from '@/types/user'

const pageLabels: Record<string, string> = {
  '/dashboard/new': 'New analysis',
  '/dashboard': 'Dashboard',
  '/history': 'History',
  '/settings': 'Settings',
  '/analysis': 'Analysis result',
}

interface AppHeaderProps {
  user: UserProfile
}

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname()
  const label =
    Object.entries(pageLabels).find(([path]) => pathname.startsWith(path))?.[1] ?? ''

  return (
    <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-5">
      <div className="flex items-center gap-3">
        {/* Mobile nav trigger (hidden on md+) */}
        <MobileNav user={user} />
        {label && (
          <p className="text-[13px] font-semibold text-foreground tracking-tight">{label}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
