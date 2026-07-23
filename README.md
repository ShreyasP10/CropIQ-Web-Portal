<div align="center">
  <img src="public/logo.png" alt="CropIQ Logo" width="120" height="120" />
  <h1 align="center">CropIQ Website</h1>
  <p align="center">
    Premium production-ready web portal for the CropIQ Android app
    <br />
    AI-powered crop disease detection & fruit quality analysis
  </p>
  <p align="center">
    <a href="https://cropiq.vercel.app"><strong>Visit Website »</strong></a>
    <br /><br />
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase" alt="Firebase" />
    <img src="https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel" alt="Vercel" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  </p>
</div>

---

## Overview

CropIQ is an **AI-driven mobile application** that helps farmers and agricultural professionals detect crop diseases and assess fruit quality using computer vision. This repository contains the **official web portal** — a high-performance Next.js application providing:

- Product landing & feature showcase
- APK download system with version management
- Support & feedback hub
- **Admin dashboard** with analytics, user management, and content control

---

## Features

### Public Website
| Feature | Description |
|---------|-------------|
| **Landing Page** | Premium hero section, animated feature cards, live statistics from Realtime DB |
| **Download Center** | Latest & previous APK versions with download tracking |
| **Support System** | Contact form with validation, stored in Firestore |
| **About & Legal** | About page, privacy policy, terms of service |
| **SEO Optimized** | Metadata API, OG/Twitter cards, robots.txt, sitemap.xml |

### Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Secure Auth** | Firebase Google authentication with email whitelist |
| **Live Stats** | Real-time dashboard cards from Realtime Database |
| **Analytics** | Line, bar, and pie charts powered by Recharts |
| **APK Management** | Full CRUD for APK versions in Firestore |
| **Support Triage** | Feedback queue with Unread / Read / Resolved states |
| **Notifications** | FCM-ready notification composition panel |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + ShadCN UI |
| **Animation** | Framer Motion |
| **Backend** | Firebase (Auth, Firestore, Realtime DB, Analytics, FCM) |
| **Charts** | Recharts |
| **Hosting** | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore & Realtime Database enabled

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/ShreyasP10/CropIQ-Web-Portal.git
cd cropiq-website

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your Firebase web app config values

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing routes
│   │   ├── page.tsx       # Homepage
│   │   ├── features/
│   │   ├── download/
│   │   ├── about/
│   │   └── support/
│   └── admin/             # Admin dashboard routes
│       ├── login/
│       ├── page.tsx       # Dashboard
│       ├── analytics/
│       ├── apk-management/
│       ├── support/
│       └── notifications/
├── components/
│   ├── shared/            # Reusable UI components
│   └── admin/             # Admin-specific components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── firebase/          # Firebase config & admin SDK
│   └── utils/             # Utilities (sanitization, etc.)
└── types/                 # TypeScript type definitions
```

---

## Firebase Data Design

### Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | Whitelisted admin users |
| `apk_versions` | APK release metadata |
| `user-feedback` | Support form submissions |
| `notifications` | FCM notification queue |
| `analytics` | Aggregated analytics data |
| `community_stats` | Community statistics |

#### `apk_versions` Document Schema

```json
{
  "versionName": "v1.0.0",
  "versionCode": 1,
  "apkUrl": "https://github.com/.../release.apk",
  "description": "Initial release",
  "releaseDate": "2026-01-01",
  "apkSize": "45 MB",
  "downloads": 0,
  "minAndroidVersion": "8.0",
  "isLatest": true,
  "releaseNotes": ["Bug fixes"],
  "featuresAdded": ["Disease detection"],
  "bugFixes": [],
  "securityImprovements": []
}
```

### Realtime Database Structure

```json
{
  "Count": {
    "totalDownloads": 0,
    "todayDownloads": 0,
    "totalDetections": 0,
    "activeUsers": 0,
    "communityPosts": 0
  },
  "VersionDownloads": {
    "v1.0.0": 0
  }
}
```

---

## Architecture Highlights

- **Storage Abstraction**: `storageProvider.getApkUrl()` decouples APK hosting — migrate from GitHub Releases to Cloudflare R2 without refactoring.
- **Admin Protection**: Middleware guards all `/admin/*` routes; Firebase Auth + email whitelist enforcement.
- **Security**: Firestore rules with input constraints, sanitization utility for user content, client-side cooldown for download tracking.
- **Performance**: Dynamic imports for heavy sections, App Router code splitting, image optimization.

---

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FShreyasP10%2FCropIQ-Web-Portal)

1. Push this repository to GitHub.
2. Import into Vercel.
3. Configure production environment variables (Firebase config).
4. Deploy Firestore & Realtime Database security rules.

---

## Roadmap

| Phase | Status |
|-------|--------|
| Homepage & Landing | ✅ Complete |
| Download System | ✅ Complete |
| Support & Feedback | ✅ Complete |
| About & Legal Pages | ✅ Complete |
| Admin Authentication | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Security Hardening | ✅ Complete |
| SEO & Performance | ✅ Complete |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<div align="center">
  <p>
    Built with ❤️ by <a href="https://github.com/ShreyasP10">ShreyasP10</a>
  </p>
  <p>
    <a href="https://github.com/ShreyasP10/CropIQ-Web-Portal/issues">Report Bug</a>
    ·
    <a href="https://github.com/ShreyasP10/CropIQ-Web-Portal/issues">Request Feature</a>
  </p>
</div>
