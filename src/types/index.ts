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

export type VisitorData = {
  id: string;
  visitorId: string;
  firstVisit: number;
  lastVisit: number;
  visitCount: number;
  ip: string;
  city: string;
  state: string;
  country: string;
  isp: string;
  browser: string;
  os: string;
  device: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  timezone: string;
  referrer: string;
};

export type PageView = {
  id: string;
  visitorId: string;
  page: string;
  timestamp: number;
};

export type VisitorEvent = {
  id: string;
  visitorId: string;
  event: string;
  timestamp: number;
};

export type VisitorSummary = {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  thisMonthVisitors: number;
  liveVisitors: number;
};
