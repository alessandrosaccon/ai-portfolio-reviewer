import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })

  // Delete all sb- cookies
  request.cookies.getAll()
    .filter((c) => c.name.startsWith('sb-'))
    .forEach((c) => {
      response.cookies.set(c.name, '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })
    })

  return response
}
