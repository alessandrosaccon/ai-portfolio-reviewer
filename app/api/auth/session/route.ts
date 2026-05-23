export const dynamic = 'force-dynamic'

// This route is no longer used. Kept as empty stub to avoid 404s
// from any cached references. Safe to delete in a future cleanup.
export async function GET() {
  return new Response(null, { status: 204 })
}
