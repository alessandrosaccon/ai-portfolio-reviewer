import type { Metadata } from 'next'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/features/landing/HeroSection'
import { HowItWorksSection } from '@/features/landing/HowItWorksSection'
import { FeaturesSection } from '@/features/landing/FeaturesSection'
import { SocialProofSection } from '@/features/landing/SocialProofSection'
import { CTABannerSection } from '@/features/landing/CTABannerSection'

export const metadata: Metadata = {
  title: 'AI Portfolio Reviewer — Analyze your CV with AI',
  description:
    'Upload your CV, paste a job description, and get an AI-powered fit score, skill gap analysis, and concrete rewrite suggestions in seconds.',
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="marketing" />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SocialProofSection />
        <CTABannerSection />
      </main>
      <Footer />
    </div>
  )
}
