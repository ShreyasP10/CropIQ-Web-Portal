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

  // Add security headers to every response
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    // Firebase Auth runs its OAuth handler + hidden iframe on the Firebase
    // auth domain and loads Google SDKs (apis.google.com, gstatic) – all of
    // these must be allowed or Google sign-in fails with auth/internal-error.
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "";

    // Static CSP (nonce-free) – the site is fully statically rendered, so
    // nonce-based CSP would block all scripts. See Next.js CSP guide.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://www.google.com${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://github.com https://*.googleusercontent.com https://www.gstatic.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebasedatabase.app wss://*.firebasedatabase.app https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://fcm.googleapis.com https://accounts.google.com https://www.gstatic.com",
      `frame-src https://accounts.google.com https://www.google.com${authDomain ? ` https://${authDomain}` : ""}`,
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;