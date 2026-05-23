import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/shared/Sidebar'
import { AppHeader } from '@/components/shared/AppHeader'
import type { UserProfile } from '@/types/user'

// TEMP DEBUG: redirect removed to check if AppLayout can read the session at all.
// If dashboard loads as guest, getSession() is returning null server-side.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Fallback profile for debug — real auth guard will be restored after diagnosis
  const user = session?.user
  const profile: UserProfile = {
    id: user?.id ?? 'guest',
    email: user?.email ?? 'guest@debug.local',
    fullName: user?.user_metadata?.full_name ?? 'Guest',
    avatarUrl: user?.user_metadata?.avatar_url ?? undefined,
    createdAt: user?.created_at ?? new Date().toISOString(),
    updatedAt: user?.updated_at ?? new Date().toISOString(),
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar user={profile} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader user={profile} />
        <main className="flex-1 overflow-y-auto" id="main-content">
          {/* DEBUG: session={JSON.stringify(!!session)} user={user?.email} */}
          {children}
        </main>
      </div>
    </div>
  )
}
