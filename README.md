# CropIQ Website

### Premium production-ready website for the CropIQ Android app (AI crop disease + fruit detection).

## Maintenance Rule

- This `README.md` is updated whenever major features/phases are changed.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + ShadCN UI + Framer Motion
- Firebase Auth + Firestore + Realtime Database + Analytics + FCM-ready architecture
- Recharts for admin analytics

## Routes

- `/`, `/features`, `/download`, `/about`, `/support`
- `/privacy-policy`, `/terms`
- `/admin/login`, `/admin`, `/admin/apk-management`, `/admin/analytics`, `/admin/support`, `/admin/notifications`

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add Firebase web config values.
3. Run:

```bash
npm install
npm run dev
```

## Firebase Data Design

### Firestore

- `users`
- `apk_versions`
- `user-feedback`
- `notifications`
- `analytics`
- `community_stats`

#### `apk_versions` example

```json
{
  "versionName": "v1.0.0",
  "versionCode": 1,
  "apkUrl": "github_release_link",
  "description": "Initial release",
  "releaseDate": "2026",
  "apkSize": "45MB",
  "downloads": 0,
  "minAndroidVersion": "8.0",
  "releaseNotes": [],
  "featuresAdded": [],
  "bugFixes": [],
  "securityImprovements": [],
  "isLatest": true
}
```

### Realtime Database

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

## Implemented Phases

- **Phase 2 (Homepage)**: Premium hero, features, benefits, live statistics (RTDB), screenshot carousel, FAQ.
- **Phase 3 (Download System)**: Structured `apk_versions`, latest + previous versions UI, click tracking for total/today/version-wise.
- **Phase 4 (Support)**: Support form (`name`, `email`, `type`, `message`) with validation and toast feedback, stored in `user-feedback`.
- **Phase 5 (About + Legal)**: `/about`, `/privacy-policy`, `/terms`.
- **Phase 6 (Admin Auth)**: `/admin/login` with Firebase Google auth + whitelist enforcement in service and middleware.
- **Phase 7 (Admin Dashboard)**:
  - `/admin` live cards from Realtime DB
  - `/admin/analytics` line, bar, pie charts (Recharts)
  - `/admin/apk-management` Firestore CRUD
  - `/admin/support` feedback triage (`Unread`/`Read`/`Resolved`)
  - `/admin/notifications` FCM-ready notification queue panel
- **Phase 8 (Security)**:
  - Firestore rules with input constraints
  - Middleware admin route protection
  - Input sanitization utility for user content
  - Client cooldown for download tracking
- **Phase 9 (SEO + Performance)**:
  - Metadata API, OG/Twitter metadata, robots, sitemap
  - Dynamic imports for heavier homepage sections
  - App Router code splitting and image optimization usage

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import into Vercel.
3. Configure production environment variables.
4. Deploy Firestore and Realtime DB security rules.

## Architecture Notes

- Download links are abstracted with `storageProvider.getApkUrl()` so APK hosting can move from GitHub Releases to Cloudflare R2 without major refactor.
- Admin routes are middleware-protected and intended for Firebase-authenticated whitelisted emails.
