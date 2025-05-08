import { PlatformType, PostStatus } from "@shared/schema";

export interface MockPlatformConnection {
  id: number;
  userId: number;
  platform: PlatformType;
  accountName: string;
  accountId: string;
  status: string;
  followers: number;
  metadata?: any;
}

export interface MockPost {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  platforms: PlatformType[];
  engagement: number;
}

export interface MockAnalytics {
  totalPosts: number;
  totalPostsGrowth: number;
  engagement: number;
  engagementGrowth: number;
  reach: number;
  reachGrowth: number;
  clickRate: number;
  clickRateGrowth: number;
  engagementByPlatform: Record<PlatformType, number>;
  reachByPlatform: Record<PlatformType, number>;
  clicksByPlatform: Record<PlatformType, number>;
}

export interface MockChartData {
  name: string;
  meta: number;
  twitter: number;
  linkedin: number;
  google: number;
}

// Mock data for platform connections
export const mockPlatformConnections: MockPlatformConnection[] = [
  {
    id: 1,
    userId: 1,
    platform: "meta",
    accountName: "Business Page",
    accountId: "12345678",
    status: "connected",
    followers: 4200,
    metadata: { pageId: "12345678", pageAccessToken: "mock-token" }
  },
  {
    id: 2,
    userId: 1,
    platform: "twitter",
    accountName: "@businessname",
    accountId: "87654321",
    status: "connected",
    followers: 2700,
    metadata: { screenName: "businessname" }
  },
  {
    id: 3,
    userId: 1,
    platform: "linkedin",
    accountName: "Company Page",
    accountId: "12345",
    status: "connected",
    followers: 1500,
    metadata: { companyId: "12345" }
  },
  {
    id: 4,
    userId: 1,
    platform: "google",
    accountName: "Business Profile",
    accountId: "54321",
    status: "connected",
    followers: 0,
    metadata: { businessId: "54321" }
  }
];

// Mock data for posts
export const mockPosts: MockPost[] = [
  {
    id: 1,
    userId: 1,
    content: "Excited to announce our new product launch! Check out our website for more details.",
    imageUrl: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    status: "published",
    publishedAt: "2023-03-10T14:00:00Z",
    createdAt: "2023-03-10T13:45:00Z",
    platforms: ["meta", "twitter", "linkedin"],
    engagement: 1400
  },
  {
    id: 2,
    userId: 1,
    content: "We love hearing from our customers! Here's what Sarah had to say about our services.",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    status: "published",
    publishedAt: "2023-03-08T10:00:00Z",
    createdAt: "2023-03-08T09:30:00Z",
    platforms: ["meta"],
    engagement: 842
  },
  {
    id: 3,
    userId: 1,
    content: "New blog post: 10 Tips to Boost Your Productivity. Read more on our website!",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    status: "published",
    publishedAt: "2023-03-05T15:30:00Z",
    createdAt: "2023-03-05T14:00:00Z",
    platforms: ["twitter", "linkedin"],
    engagement: 620
  },
  {
    id: 4,
    userId: 1,
    content: "Join us for our upcoming webinar on digital marketing strategies. Register now!",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    status: "scheduled",
    scheduledAt: "2023-03-15T11:00:00Z",
    createdAt: "2023-03-01T16:45:00Z",
    platforms: ["meta", "linkedin", "google"],
    engagement: 0
  },
  {
    id: 5,
    userId: 1,
    content: "Product Feature Announcement: We're excited to introduce our new dashboard with enhanced analytics features!",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    status: "scheduled",
    scheduledAt: "2023-03-15T10:30:00Z",
    createdAt: "2023-03-02T09:15:00Z",
    platforms: ["meta", "twitter", "linkedin"],
    engagement: 0
  },
  {
    id: 6,
    userId: 1,
    content: "Customer Success Story: Learn how Company XYZ increased their productivity by 30% using our solution.",
    status: "scheduled",
    scheduledAt: "2023-03-15T14:00:00Z",
    createdAt: "2023-03-02T13:20:00Z",
    platforms: ["meta", "linkedin"],
    engagement: 0
  },
  {
    id: 7,
    userId: 1,
    content: "Weekly Industry Tips: 5 ways to improve your social media presence and engage with your audience.",
    imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    status: "scheduled",
    scheduledAt: "2023-03-16T16:30:00Z",
    createdAt: "2023-03-03T11:45:00Z",
    platforms: ["twitter", "linkedin", "google"],
    engagement: 0
  }
];

// Mock analytics data
export const mockAnalytics: MockAnalytics = {
  totalPosts: 48,
  totalPostsGrowth: 12.5,
  engagement: 3500,
  engagementGrowth: 8.2,
  reach: 12400,
  reachGrowth: 15.7,
  clickRate: 2.8,
  clickRateGrowth: -2.3,
  engagementByPlatform: {
    meta: 1200,
    twitter: 900,
    linkedin: 800,
    google: 600
  },
  reachByPlatform: {
    meta: 5000,
    twitter: 3200,
    linkedin: 2800,
    google: 1400
  },
  clicksByPlatform: {
    meta: 150,
    twitter: 120,
    linkedin: 95,
    google: 60
  }
};

// Mock chart data
export const mockChartData: MockChartData[] = [
  { name: "Jan", meta: 400, twitter: 240, linkedin: 240, google: 100 },
  { name: "Feb", meta: 300, twitter: 139, linkedin: 250, google: 120 },
  { name: "Mar", meta: 200, twitter: 980, linkedin: 210, google: 140 },
  { name: "Apr", meta: 278, twitter: 390, linkedin: 200, google: 160 },
  { name: "May", meta: 189, twitter: 480, linkedin: 250, google: 180 },
  { name: "Jun", meta: 239, twitter: 380, linkedin: 260, google: 200 },
  { name: "Jul", meta: 349, twitter: 430, linkedin: 280, google: 220 }
];
