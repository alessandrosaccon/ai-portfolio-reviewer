// Marketing layout — wraps public-facing pages (pricing, about, etc.)
// The root landing page (app/page.tsx) renders its own Header/Footer directly.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
