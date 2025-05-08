import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { PlatformCard } from "@/components/dashboard/platform-card";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { PostTable } from "@/components/dashboard/post-table";
import { ScheduleCard } from "@/components/dashboard/schedule-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartData, PlatformStats, PostTableItem, ScheduledPost } from "@/lib/types";
import { useState } from "react";

export default function DashboardPage() {
  // Platform connections query
  const { data: platformConnections, isLoading: isLoadingPlatforms } = useQuery<PlatformStats[]>({
    queryKey: ["/api/platform-connections"],
  });

  // Analytics overview query
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/analytics/overview"],
  });

  // Recent posts query
  const { data: recentPosts, isLoading: isLoadingPosts } = useQuery<PostTableItem[]>({
    queryKey: ["/api/posts/recent"],
  });

  // Scheduled posts query
  const { data: scheduledPosts, isLoading: isLoadingSchedule } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/posts/scheduled"],
  });

  // Chart data
  const { data: chartData, isLoading: isLoadingChart } = useQuery<ChartData[]>({
    queryKey: ["/api/analytics/chart-data"],
  });

  // Placeholder data for development
  const mockPlatforms: PlatformStats[] = [
    { platform: "meta", isConnected: true, accountName: "Business Page", followers: 4200 },
    { platform: "twitter", isConnected: true, accountName: "@businessname", followers: 2700 },
    { platform: "linkedin", isConnected: true, accountName: "Company Page", followers: 1500 },
    { platform: "google", isConnected: true, accountName: "Business Profile", followers: 0 }
  ];

  const mockAnalytics = {
    totalPosts: 48,
    totalPostsGrowth: 12.5,
    engagement: 3500,
    engagementGrowth: 8.2,
    reach: 12400,
    reachGrowth: 15.7,
    clickRate: 2.8,
    clickRateGrowth: -2.3
  };

  const mockPosts: PostTableItem[] = [
    {
      id: 1,
      content: "Excited to announce our new product launch! Check out our website for more details.",
      imageUrl: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["meta", "twitter", "linkedin"],
      date: "Mar 10, 2023",
      status: "published",
      engagement: 1400
    },
    {
      id: 2,
      content: "We love hearing from our customers! Here's what Sarah had to say about our services.",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["meta"],
      date: "Mar 8, 2023",
      status: "published",
      engagement: 842
    },
    {
      id: 3,
      content: "New blog post: 10 Tips to Boost Your Productivity. Read more on our website!",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["twitter", "linkedin"],
      date: "Mar 5, 2023",
      status: "published",
      engagement: 620
    },
    {
      id: 4,
      content: "Join us for our upcoming webinar on digital marketing strategies. Register now!",
      imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["meta", "linkedin", "google"],
      date: "Mar 15, 2023",
      status: "scheduled",
      engagement: 0
    }
  ];

  const mockScheduled: ScheduledPost[] = [
    {
      id: 1,
      title: "Product Feature Announcement",
      time: "10:30 AM",
      platforms: ["meta", "twitter", "linkedin"]
    },
    {
      id: 2,
      title: "Customer Success Story",
      time: "2:00 PM",
      platforms: ["meta", "linkedin"]
    },
    {
      id: 3,
      title: "Weekly Industry Tips",
      time: "4:30 PM",
      platforms: ["twitter", "linkedin", "google"]
    }
  ];

  const mockChartData: ChartData[] = [
    { name: "Jan", meta: 400, twitter: 240, linkedin: 240, google: 100 },
    { name: "Feb", meta: 300, twitter: 139, linkedin: 250, google: 120 },
    { name: "Mar", meta: 200, twitter: 980, linkedin: 210, google: 140 },
    { name: "Apr", meta: 278, twitter: 390, linkedin: 200, google: 160 },
    { name: "May", meta: 189, twitter: 480, linkedin: 250, google: 180 },
    { name: "Jun", meta: 239, twitter: 380, linkedin: 260, google: 200 },
    { name: "Jul", meta: 349, twitter: 430, linkedin: 280, google: 220 }
  ];

  const platforms = platformConnections || mockPlatforms;
  const analytics = analyticsData || mockAnalytics;
  const posts = recentPosts || mockPosts;
  const scheduled = scheduledPosts || mockScheduled;
  const chart = chartData || mockChartData;

  return (
    <MainLayout title="Dashboard">
      {/* Connected Platforms Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">Connected Platforms</h2>
          <Button variant="link" className="text-primary text-sm font-medium hover:underline p-0">
            Manage Connections
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingPlatforms ? (
            // Skeleton placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="mt-4">
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
              </div>
            ))
          ) : (
            platforms.map((platform) => (
              <PlatformCard
                key={platform.platform}
                platform={platform.platform}
                isConnected={platform.isConnected}
                accountName={platform.accountName}
                followers={platform.followers}
              />
            ))
          )}
        </div>
      </section>
      
      {/* Analytics Overview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">Analytics Overview</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Last 30 days</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoadingAnalytics ? (
            // Skeleton placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-end">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="ml-2 h-4 w-12" />
                </div>
              </div>
            ))
          ) : (
            <>
              <AnalyticsCard
                title="Total Posts"
                value={analytics.totalPosts}
                unit="posts"
                change={analytics.totalPostsGrowth}
              />
              <AnalyticsCard
                title="Engagement"
                value={analytics.engagement.toLocaleString()}
                unit="interactions"
                change={analytics.engagementGrowth}
              />
              <AnalyticsCard
                title="Reach"
                value={analytics.reach.toLocaleString()}
                unit="impressions"
                change={analytics.reachGrowth}
              />
              <AnalyticsCard
                title="Click Rate"
                value={analytics.clickRate.toFixed(1)}
                unit="average"
                change={analytics.clickRateGrowth}
              />
            </>
          )}
        </div>
        
        {/* Analytics Chart */}
        {isLoadingChart ? (
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <AnalyticsChart data={chart} />
        )}
      </section>
      
      {/* Recent Posts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">Recent Posts</h2>
          <Button variant="link" className="text-primary text-sm font-medium hover:underline p-0">
            View All Posts
          </Button>
        </div>
        
        {isLoadingPosts ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-10 w-10 rounded-md mr-3" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <PostTable posts={posts} />
        )}
      </section>
      
      {/* Upcoming Schedule */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">Upcoming Schedule</h2>
          <Button variant="link" className="text-primary text-sm font-medium hover:underline p-0">
            View Calendar
          </Button>
        </div>
        
        {isLoadingSchedule ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
            
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center p-3 rounded-lg border border-gray-100">
                  <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ScheduleCard scheduledPosts={scheduled} />
        )}
      </section>
    </MainLayout>
  );
}
