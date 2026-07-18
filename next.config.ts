import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    // Lint is run separately via `npm run lint`. Production builds in this
    // environment skip lint because the Prisma client cannot be generated
    // offline, which requires intentional `any` usage in DB-touching files.
    ignoreDuringBuilds: true,
  },
  // No remotePatterns: the app never renders next/image with an external
  // URL. A wildcard hostname here would let anyone make the server fetch
  // arbitrary URLs via the built-in /_next/image?url= endpoint (SSRF).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
