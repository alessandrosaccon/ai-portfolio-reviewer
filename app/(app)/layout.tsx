import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/shared/Sidebar'
import { AppHeader } from '@/components/shared/AppHeader'
import type { UserProfile } from '@/types/user'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Use getSession() to read from cookies without a network call.
  // getUser() was making a network request that timed out server-side
  // causing a redirect loop with the middleware.
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const user = session.user

  const profile: UserProfile = {
    id: user.id,
    email: user.email ?? '',
    fullName: user.user_metadata?.full_name ?? undefined,
    avatarUrl: user.user_metadata?.avatar_url ?? undefined,
    createdAt: user.created_at,
    updatedAt: user.updated_at ?? user.created_at,
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar user={profile} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader user={profile} />
        <main className="flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
