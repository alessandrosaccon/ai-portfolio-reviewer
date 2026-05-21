import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AI Portfolio Reviewer. Built by{' '}
          <a
            href="https://github.com/alessandrosaccon"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Alessandro Saccon
          </a>
          .
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <a
            href="https://github.com/alessandrosaccon/ai-portfolio-reviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
