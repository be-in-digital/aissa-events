import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * Content-Security-Policy pour le site public.
 *
 * Volontairement permissive sur `unsafe-inline` (scripts + styles) : Next.js
 * App Router injecte des chunks RSC inline et Tailwind/styled-components
 * génèrent du CSS inline. Une CSP avec nonce nécessiterait du middleware
 * stateful — à envisager dans une v2.
 *
 * Le studio Sanity (/studio) est exclu : il a besoin de connect/script/img
 * vers de nombreux endpoints Sanity + plugins (cf. config headers ci-dessous).
 */
const publicCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://image.mux.com https://images.unsplash.com",
  "font-src 'self' data:",
  "media-src 'self' https://stream.mux.com",
  "frame-src https://calendly.com https://*.calendly.com https://stream.mux.com",
  "connect-src 'self' https://*.sanity.io https://*.apicdn.sanity.io https://*.upstash.io https://api.hubspot.com https://api.resend.com https://stream.mux.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // Anciennes URLs renommées — 308 permanent pour ne pas casser les liens
      // déjà indexés / partagés et les CTAs Sanity historiques.
      {
        source: "/espace-emerainville",
        destination: "/espace-events",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Headers globaux sur toutes les routes
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Site public : autorise uniquement les iframes same-origin
      // (nécessaire pour la Presentation tool de Sanity qui charge les pages
      // depuis /studio). Bloque toujours les iframes tierces (anti-clickjacking).
      // + Content-Security-Policy strict (hors /studio qui a ses propres besoins).
      {
        source: "/((?!studio).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: publicCsp },
        ],
      },
      // Studio Sanity : autorise les iframes internes (Mux, vision), pas d'indexation
      {
        source: "/studio/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
