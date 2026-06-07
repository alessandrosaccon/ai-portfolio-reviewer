'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, PlusCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/features/auth/UserMenu'
import type { UserProfile } from '@/types/user'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'History',   href: '/history',   icon: History },
]

interface SidebarProps {
  user: UserProfile
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">

      {/* Logo */}
      <div className="flex h-[54px] items-center border-b border-border px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-75"
        >
          {/* Wordmark logo — no colored box */}
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            AI Portfolio
          </span>
        </Link>
      </div>

      {/* New analysis CTA */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/dashboard/new"
          className="group flex w-full items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
        >
          <PlusCircle className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
          New analysis
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors duration-150',
                isActive
                  ? 'bg-primary/8 font-medium text-primary dark:bg-primary/10'
                  : 'font-normal text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {/* Active dot indicator */}
              <span className={cn(
                'flex h-3.5 w-3.5 shrink-0 items-center justify-center',
              )}>
                <item.icon
                  className={cn(
                    'h-3.5 w-3.5 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Separator */}
      <div className="mx-3 mb-3 h-px bg-border" />

      {/* User section */}
      <div className="px-2 pb-3">
        <UserMenu user={user} />
      </div>
    </aside>
  )
}
