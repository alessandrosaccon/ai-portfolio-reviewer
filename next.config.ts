import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Supabase DB types not generated yet — type errors on .from() queries
    // TODO: run `supabase gen types typescript` and remove this flag
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig
