import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Profile section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-foreground">Profile</h2>
            <p className="text-xs text-muted-foreground">Your account details.</p>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <p className="text-sm text-foreground">{user?.email ?? '—'}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground">Name</p>
              <p className="text-sm text-foreground">
                {user?.user_metadata?.full_name ?? '—'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground">Member since</p>
              <p className="text-sm text-foreground">
                {user?.created_at
                  ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
                      new Date(user.created_at)
                    )
                  : '—'}
              </p>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
            <p className="text-xs text-muted-foreground">Irreversible actions.</p>
          </div>
          <Separator />
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">Delete account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button
                disabled
                className="shrink-0 rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive opacity-50 transition-opacity hover:opacity-100 disabled:cursor-not-allowed"
              >
                Delete account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
