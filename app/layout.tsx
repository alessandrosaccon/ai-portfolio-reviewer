import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Portfolio Reviewer',
    template: '%s | AI Portfolio Reviewer',
  },
  description:
    'Analyze your CV and portfolio against any job description. Get AI-powered fit scores, skill gap insights, and concrete rewrite suggestions.',
  keywords: ['CV analysis', 'resume review', 'AI', 'job fit', 'portfolio', 'career'],
  authors: [{ name: 'Alessandro Saccon' }],
  creator: 'Alessandro Saccon',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'AI Portfolio Reviewer',
    description:
      'Analyze your CV and portfolio against any job description. Get AI-powered fit scores, skill gap insights, and concrete rewrite suggestions.',
    siteName: 'AI Portfolio Reviewer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Portfolio Reviewer',
    description:
      'Analyze your CV and portfolio against any job description. Get AI-powered fit scores, skill gap insights, and concrete rewrite suggestions.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0e1a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
