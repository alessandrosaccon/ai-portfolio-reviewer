'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/history': 'History',
  '/settings': 'Settings',
}

export function AppHeader() {
  const pathname = usePathname()

  const label =
    Object.entries(pageLabels).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? 'App'

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  )
}
