'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from './MobileNav'
import type { UserProfile } from '@/types/user'

const pageLabels: Record<string, string> = {
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
    Object.entries(pageLabels).find(([path]) => pathname.startsWith(path))?.[1] ?? 'App'

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav user={user} />
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  )
}
