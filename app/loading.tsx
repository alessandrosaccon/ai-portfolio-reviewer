export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="text-xs text-muted-foreground">Loading&hellip;</p>
      </div>
    </div>
  )
}
