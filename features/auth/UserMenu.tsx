'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { UserProfile } from '@/types/user'
import { logout } from './actions'

interface UserMenuProps {
  user: UserProfile
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  function handleLogout() {
    setOpen(false)
    startTransition(async () => {
      const result = await logout()
      if ('redirectTo' in result && result.redirectTo) {
        router.push(result.redirectTo)
      }
    })
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
        disabled={isPending}
        className="flex items-center gap-2"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials}
        </span>
        <span className="hidden text-sm md:block">
          {user.fullName ?? user.email}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-lg border border-border bg-card py-1 shadow-md"
        >
          <div className="px-3 py-2">
            {user.fullName && (
              <p className="text-sm font-medium text-foreground">{user.fullName}</p>
            )}
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="my-1 h-px bg-border" />

          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <Link
            href="/settings/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>

          <div className="my-1 h-px bg-border" />

          <button
            role="menuitem"
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
