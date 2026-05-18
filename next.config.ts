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
      {
        source: "/((?!studio).*)",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
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
