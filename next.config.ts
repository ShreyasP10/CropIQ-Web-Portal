import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local explicitly – this guarantees that private variables like
// ADMIN_SESSION_SECRET are available even if Next.js doesn't pick them up.
config({ path: resolve(process.cwd(), ".env.local") });

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent source map leakage in production (security vulnerability #20)
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },

  // Add basic security headers to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;