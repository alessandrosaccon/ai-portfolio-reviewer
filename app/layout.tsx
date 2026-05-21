import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai-portfolio-reviewer.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'AI Portfolio Reviewer',
    template: '%s — AI Portfolio Reviewer',
  },
  description:
    'Analyze your CV against any job description. Get a fit score, keyword analysis, skill gap detection and AI-powered rewrite suggestions.',
  keywords: [
    'CV analyzer',
    'resume review',
    'job fit score',
    'ATS optimization',
    'AI career tools',
    'skill gap analysis',
  ],
  authors: [{ name: 'AI Portfolio Reviewer' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'AI Portfolio Reviewer',
    title: 'AI Portfolio Reviewer — Know your fit before you apply',
    description:
      'Upload your CV, paste a job description, get an instant fit score with AI-powered suggestions.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Portfolio Reviewer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Portfolio Reviewer',
    description: 'Know your fit before you apply.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
