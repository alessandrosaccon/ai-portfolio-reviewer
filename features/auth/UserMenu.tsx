'use client'

import { useEffect, useRef, useState } from 'react'
import { LogOut, Settings, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types/user'

interface UserMenuProps {
  user: UserProfile
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open])

  async function handleLogout() {
    setOpen(false)
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
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
        disabled={loading}
        className="flex w-full items-center gap-2"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials}
        </span>
        <span className="flex-1 truncate text-left text-sm">
          {user.fullName ?? user.email}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-1.5 w-56 rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {/* User info */}
          <div className="px-3 py-2">
            {user.fullName && (
              <p className="text-sm font-medium text-foreground">{user.fullName}</p>
            )}
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="my-1 h-px bg-border" />

          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </Link>

          <div className="my-1 h-px bg-border" />

          <button
            role="menuitem"
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {loading ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
