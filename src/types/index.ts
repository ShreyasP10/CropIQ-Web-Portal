export type ApkVersion = {
  id: string;
  versionName: string;
  versionCode: number;
  apkUrl: string;
  releaseDate: string;
  apkSize: string;
  downloads: number;
  minAndroidVersion: string;
  description: string;
  releaseNotes: string[];
  featuresAdded: string[];
  bugFixes: string[];
  securityImprovements: string[];
  isLatest: boolean;
};
export type SupportFormPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  type: string;

  // hidden anti-bot field
  website?: string;
};
export type RealtimeCount = {
  totalDownloads: number;
  todayDownloads: number;
  totalDetections: number;
  activeUsers: number;
  communityPosts: number;
};



export type SupportFeedbackItem = SupportFormPayload & {
  id: string;
  status: "Unread" | "Read" | "Resolved";
  createdAt?: unknown;
};

export type NotificationPayload = {
  title: string;
  description: string;
  type: "new-version-alert" | "announcement" | "maintenance";
  targetAudience: "all-users" | "active-users" | "beta-testers";
};
