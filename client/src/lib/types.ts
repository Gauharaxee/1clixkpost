import { PlatformType, PostStatus } from "@shared/schema";

export interface AnalyticsOverview {
  totalPosts: number;
  totalPostsGrowth: number;
  engagement: number;
  engagementGrowth: number;
  reach: number;
  reachGrowth: number;
  clickRate: number;
  clickRateGrowth: number;
}

export interface PlatformStats {
  platform: PlatformType;
  followers: number;
  accountName: string;
  accountType?: string;
  isConnected: boolean;
}

export interface ScheduledPost {
  id: number;
  title: string;
  time: string;
  platforms: PlatformType[];
}

export interface PostTableItem {
  id: number;
  content: string;
  imageUrl?: string;
  platforms: PlatformType[];
  date: string;
  status: PostStatus;
  engagement: number;
}

export interface ChartData {
  name: string;
  meta: number;
  twitter: number;
  linkedin: number;
  google: number;
}

export interface PostFormData {
  content: string;
  image?: File;
  selectedPlatforms: PlatformType[];
  scheduleDate?: Date;
  scheduleTime?: string;
  status: PostStatus;
}
