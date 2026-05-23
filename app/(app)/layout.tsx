import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/shared/Sidebar'
import { AppHeader } from '@/components/shared/AppHeader'
import type { UserProfile } from '@/types/user'

function getSessionFromCookieStore(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const cookieName = cookieStore.getAll()
    .map((c) => c.name)
    .find((name) => name.startsWith('sb-') && name.endsWith('-auth-token'))

  if (!cookieName) return null

  try {
    const raw = cookieStore.get(cookieName)?.value
    if (!raw) return null
    const decoded = decodeURIComponent(raw)
    const parsed = JSON.parse(decoded)
    const accessToken = parsed?.access_token
    if (!accessToken) return null

    const payloadB64 = accessToken.split('.')[1]
    if (!payloadB64) return null
    const payload = JSON.parse(atob(payloadB64))
    if (!payload?.exp || Date.now() / 1000 >= payload.exp) return null

    return {
      user: parsed.user ?? null,
      access_token: accessToken,
    }
  } catch {
    return null
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = getSessionFromCookieStore(cookieStore)

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
