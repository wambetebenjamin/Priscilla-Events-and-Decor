/**
 * Priscilla Events and Decor
 * Stack locked to the versions stated in the brief: Next.js 15.3.3, React 19.1.0, Node 24.3.0.
 *
 * Notes on parity with the design source (TheEvent / BootstrapMade):
 * - The source ships no image optimisation pipeline and marks up photography with plain <img>
 *   tags. To stay faithful, `images.unoptimized` is on and every photo is authored with explicit
 *   width/height plus loading and decoding hints, so there is no layout shift and no sharp
 *   dependency at build time.
 * - Security headers that are safe in every environment live here. The strict
 *   Content-Security-Policy lives in vercel.json because dev mode needs eval for HMR.
 */
/**
 * Development-time cross-origin allowance.
 *
 * The dev server is reachable from a proxied preview host, and Next.js 15 blocks
 * cross-origin dev requests by default. This only applies to `next dev`; it has no
 * effect on a production build or on Vercel.
 */
const allowedDevOrigins = ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        // Never let an API response or a form post sit in a shared cache.
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/privacy-policy', destination: '/legal/privacy-policy', permanent: true },
      { source: '/terms', destination: '/legal/terms', permanent: true },
      { source: '/cookie-policy', destination: '/legal/cookie-policy', permanent: true },
      { source: '/gallery', destination: '/portfolio', permanent: true },
      { source: '/enquiry', destination: '/enquire', permanent: true },
      { source: '/booking', destination: '/enquire', permanent: true },
    ];
  },
};

export default nextConfig;
