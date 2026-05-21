import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for AI Portfolio Reviewer.',
}

const plans = [
  {
    name: 'Free',
    price: '0',
    period: '/month',
    description: 'Perfect for trying it out.',
    badge: null,
    features: [
      '3 analyses per month',
      'Fit score & skill gap',
      'Missing keyword detection',
      '7-day history',
    ],
    cta: 'Get started',
    href: '/dashboard',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '12',
    period: '/month',
    description: 'For active job seekers.',
    badge: 'Most popular',
    features: [
      'Unlimited analyses',
      'Fit score & skill gap',
      'Missing keyword detection',
      'Section rewrite suggestions',
      'Full analysis history',
      'Priority processing',
    ],
    cta: 'Start Pro',
    href: '/dashboard',
    highlight: true,
  },
  {
    name: 'Team',
    price: '49',
    period: '/month',
    description: 'For career coaches and recruiters.',
    badge: null,
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Shared history & export',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact us',
    href: 'mailto:hello@aiportfolioreviewer.com',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="marketing" />
      <main className="flex-1">
        <section className="container py-24">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="max-w-md text-balance text-muted-foreground">
              Start for free. Upgrade when you\'re ready. No hidden fees.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'relative flex flex-col',
                  plan.highlight && 'border-primary/50 shadow-lg shadow-primary/5'
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-0.5 text-xs">{plan.badge}</Badge>
                  </div>
                )}
                <CardHeader className="gap-3">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      €{plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                    variant={plan.highlight ? 'default' : 'outline'}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            All prices in EUR. Cancel anytime. Questions?{' '}
            <a
              href="mailto:hello@aiportfolioreviewer.com"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Get in touch.
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
