'use client'

import { useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import type { UserProfile } from '@/types/user'

interface UserMenuProps {
  user: UserProfile
}

export function UserMenu({ user }: UserMenuProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    setIsPending(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col gap-1 border-t border-border pt-3">
      <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            {user.fullName ?? 'User'}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <a
        href="/settings"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Settings className="h-3.5 w-3.5" />
        Settings
      </a>
      <a
        href="/settings/profile"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <User className="h-3.5 w-3.5" />
        Profile
      </a>
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <LogOut className="h-3.5 w-3.5" />
        {isPending ? 'Signing out…' : 'Sign out'}
      </button>
    </div>
  )
}
