import { Header } from '@/components/shared/Header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="app" />
      <main className="flex-1">{children}</main>
    </div>
  )
}
