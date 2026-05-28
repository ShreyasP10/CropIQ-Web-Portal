# Phase 3 Download System

## Firestore Collection: `apk_versions`

Example document:

```json
{
  "versionName": "v1.0.0",
  "versionCode": 1,
  "apkUrl": "https://github.com/<org>/<repo>/releases/download/v1.0.0/cropiq.apk",
  "description": "Initial release",
  "releaseDate": "2026-01-01",
  "apkSize": "45MB",
  "downloads": 0,
  "minAndroidVersion": "8.0",
  "releaseNotes": ["Initial launch"],
  "featuresAdded": ["Fruit detection", "Disease detection"],
  "bugFixes": ["Minor performance fixes"],
  "securityImprovements": ["APK signature verification updates"],
  "isLatest": true
}
```

## Realtime Database Tracking

```json
{
  "Count": {
    "totalDownloads": 0,
    "todayDownloads": 0
  },
  "VersionDownloads": {
    "v1.0.0": 0
  }
}
```

## Tracking Behavior

- Increments `Count/totalDownloads`
- Increments `Count/todayDownloads`
- Increments `VersionDownloads/{versionName}`
- Includes client-side cooldown to reduce duplicate clicks
