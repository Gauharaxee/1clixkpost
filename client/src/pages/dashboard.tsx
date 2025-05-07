import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/stat-card";
import PlatformCard from "@/components/dashboard/platform-card";
import ActivityItem from "@/components/dashboard/activity-item";
import ContentEditor from "@/components/post/content-editor";
import PostPreview from "@/components/post/post-preview";
import { usePostForm } from "@/hooks/use-post-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostStatus } from "@shared/schema";

const Dashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      // For demo, if API doesn't return data yet
      const response = await fetch("/api/dashboard", {
        credentials: "include",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return getMockDashboardData();
        }
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Object.keys(data).length ? data : getMockDashboardData();
    }
  });
  
  const {
    content,
    setContent,
    selectedPlatforms,
    setSelectedPlatforms,
    scheduledDate,
    setScheduledDate,
    mediaUrl,
    setMediaUrl,
    handlePublish,
    isSubmitting,
  } = usePostForm();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Posts Published"
            value={dashboardData.postsPublished}
            icon="ri-send-plane-fill"
            color="primary"
            percentChange={12}
          />
          <StatCard
            title="Total Impressions"
            value={`${(dashboardData.impressions / 1000).toFixed(1)}K`}
            icon="ri-eye-line"
            color="secondary"
            percentChange={8}
          />
          <StatCard
            title="Scheduled Posts"
            value={dashboardData.scheduledPosts}
            icon="ri-calendar-check-line"
            color="accent"
          />
          <StatCard
            title="Engagement Rate"
            value={`${dashboardData.engagementRate}%`}
            icon="ri-user-follow-line"
            color="meta"
            percentChange={2}
          />
        </div>
        
        {/* Content Creation Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Content Creation</h2>
            <Link href="/create">
              <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none">
                <i className="ri-add-line mr-2"></i> New Post
              </Button>
            </Link>
          </div>
          
          {/* Content Editor */}
          <ContentEditor
            content={content}
            onContentChange={setContent}
            selectedPlatforms={selectedPlatforms}
            onPlatformsChange={setSelectedPlatforms}
            scheduledDate={scheduledDate}
            onScheduledDateChange={setScheduledDate}
            mediaUrl={mediaUrl}
            onMediaUrlChange={setMediaUrl}
            onPublish={handlePublish}
          />
          
          {/* Preview */}
          <PostPreview
            content={content}
            mediaUrl={mediaUrl}
            platforms={selectedPlatforms}
          />
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <Link href="/published" className="text-sm font-medium text-primary hover:text-blue-600">
              View all
            </Link>
          </div>
          
          <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentPosts.map((post: any) => {
                let type: "published" | "scheduled" | "draft";
                let title = "";
                
                switch (post.status) {
                  case PostStatus.PUBLISHED:
                    type = "published";
                    title = "Post published to Meta and X";
                    break;
                  case PostStatus.SCHEDULED:
                    type = "scheduled";
                    title = "Post scheduled for LinkedIn";
                    break;
                  default:
                    type = "draft";
                    title = "Draft saved";
                }
                
                return (
                  <ActivityItem
                    key={post.id}
                    type={type}
                    title={title}
                    excerpt={post.content.substring(0, 60) + "..."}
                    timestamp={new Date(post.createdAt)}
                    platforms={[
                      { icon: "ri-facebook-fill", color: "text-meta" },
                      { icon: "ri-twitter-x-fill", color: "text-twitter" },
                    ]}
                  />
                );
              })}
            </ul>
          </div>
        </div>
        
        {/* Performance Overview */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="active:bg-gray-100">
                Last 7 days
              </Button>
              <Button variant="outline" size="sm">
                Last 30 days
              </Button>
              <Button variant="outline" size="sm">
                All time
              </Button>
            </div>
          </div>
          
          {/* Performance Graph */}
          <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-800">4.2K</span>
                  <span className="text-sm text-gray-500">Engagements</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-800">24.5K</span>
                  <span className="text-sm text-gray-500">Impressions</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-800">128</span>
                  <span className="text-sm text-gray-500">Link Clicks</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-800">32</span>
                  <span className="text-sm text-gray-500">Shares</span>
                </div>
              </div>
              
              {/* Graph Placeholder */}
              <div className="mt-6 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <svg
                  className="h-48 w-auto"
                  viewBox="0 0 400 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 0,100 C 100,80 200,120 300,50 L 300,200 L 0,200 Z"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M 0,100 C 100,80 200,120 300,50"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M 0,150 C 100,130 200,170 300,100 L 300,200 L 0,200 Z"
                    fill="#10b981"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M 0,150 C 100,130 200,170 300,100"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Platform Performance */}
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-medium text-gray-900">Platform Performance</h2>
          
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <PlatformCard
              name="Meta"
              icon="ri-facebook-fill"
              color="meta"
              followers={3240}
              engagementRate={5.8}
              posts={42}
            />
            <PlatformCard
              name="X"
              icon="ri-twitter-x-fill"
              color="twitter"
              followers={2750}
              engagementRate={3.2}
              posts={56}
            />
            <PlatformCard
              name="LinkedIn"
              icon="ri-linkedin-fill"
              color="linkedin"
              followers={1890}
              engagementRate={4.1}
              posts={24}
            />
            <PlatformCard
              name="Google"
              icon="ri-google-fill"
              color="google"
              followers={1120}
              engagementRate={2.9}
              posts={18}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton for the dashboard
const DashboardSkeleton = () => (
  <div className="py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="ml-5 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Skeleton className="h-6 w-40 mb-4" />
      <Skeleton className="h-64 w-full mb-8" />
      
      <Skeleton className="h-6 w-40 mb-4" />
      <Card className="mb-8">
        <CardContent className="p-0">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-4 space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

// Mock data for development
function getMockDashboardData() {
  return {
    postsPublished: 128,
    impressions: 24500,
    engagementRate: 4.3,
    scheduledPosts: 16,
    recentPosts: [
      {
        id: 1,
        content: "Post published to Meta and X announcing our latest product features...",
        status: PostStatus.PUBLISHED,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        platforms: ["meta", "x"],
      },
      {
        id: 2,
        content: "Join us for our upcoming webinar on social media strategies...",
        status: PostStatus.SCHEDULED,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        platforms: ["linkedin"],
      },
      {
        id: 3,
        content: "We're excited to share some behind-the-scenes...",
        status: PostStatus.DRAFT,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        platforms: [],
      },
    ],
    platforms: [
      {
        id: 1,
        platformType: "meta",
        isConnected: true,
        accountName: "John Smith",
        followerCount: 3240,
      },
      {
        id: 2,
        platformType: "x",
        isConnected: true,
        accountName: "@johnsmith",
        followerCount: 2750,
      },
      {
        id: 3,
        platformType: "linkedin",
        isConnected: true,
        accountName: "John Smith",
        followerCount: 1890,
      },
      {
        id: 4,
        platformType: "google",
        isConnected: true,
        accountName: "Tech Solutions",
        followerCount: 1120,
      },
    ],
  };
}

export default Dashboard;
