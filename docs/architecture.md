# CropIQ Website Architecture

## Folder Structure

```txt
src
|- app
|- components
|  |- layout
|  |- shared
|  |- sections
|  |- admin
|- lib
|  |- firebase
|  |- services
|  |- utils
|- hooks
|- store
|- types
|- providers
|- constants
```

## Firestore Collections

- `users`
- `apk_versions`
- `user-feedback`
- `notifications`
- `analytics`
- `community_stats`

## Realtime Database

```json
{
  "Count": {
    "totalDownloads": 0,
    "todayDownloads": 0,
    "totalDetections": 0,
    "activeUsers": 0,
    "communityPosts": 0
  }
}
```

## Key Abstractions

- `storageProvider.getApkUrl()` allows switching from GitHub Releases to Cloudflare R2 later.
- `download-tracker.service.ts` handles total, daily, and version-wise counters.
- `admin-auth.service.ts` centralizes whitelist admin auth logic.

## Deployment

1. Set environment variables in Vercel.
2. Connect GitHub repository and enable auto deploy.
3. Add Firebase domain in Auth settings.
4. Deploy Firestore/Realtime rules before production launch.
