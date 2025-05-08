import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartData, PlatformStats } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformType } from "@shared/schema";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from "react-icons/fa";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [metric, setMetric] = useState("engagement");
  const [platformFilter, setPlatformFilter] = useState<PlatformType | "all">("all");
  
  // Queries for analytics data
  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["/api/analytics/overview", timeRange],
  });
  
  const { data: chartData, isLoading: isLoadingChart } = useQuery<ChartData[]>({
    queryKey: ["/api/analytics/chart-data", timeRange, metric],
  });
  
  const { data: platformData, isLoading: isLoadingPlatforms } = useQuery<PlatformStats[]>({
    queryKey: ["/api/platform-connections"],
  });
  
  // Mock data
  const mockAnalytics = {
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

  const mockChartData: ChartData[] = [
    { name: "Jan", meta: 400, twitter: 240, linkedin: 240, google: 100 },
    { name: "Feb", meta: 300, twitter: 139, linkedin: 250, google: 120 },
    { name: "Mar", meta: 200, twitter: 980, linkedin: 210, google: 140 },
    { name: "Apr", meta: 278, twitter: 390, linkedin: 200, google: 160 },
    { name: "May", meta: 189, twitter: 480, linkedin: 250, google: 180 },
    { name: "Jun", meta: 239, twitter: 380, linkedin: 260, google: 200 },
    { name: "Jul", meta: 349, twitter: 430, linkedin: 280, google: 220 }
  ];

  const mockPlatforms: PlatformStats[] = [
    { platform: "meta", isConnected: true, accountName: "Business Page", followers: 4200 },
    { platform: "twitter", isConnected: true, accountName: "@businessname", followers: 2700 },
    { platform: "linkedin", isConnected: true, accountName: "Company Page", followers: 1500 },
    { platform: "google", isConnected: true, accountName: "Business Profile", followers: 0 }
  ];
  
  // Use mock data for development
  const analytics = overviewData || mockAnalytics;
  const chart = chartData || mockChartData;
  const platforms = platformData || mockPlatforms;
  
  // Platform color mapping
  const platformColors = {
    meta: "#1877F2",
    twitter: "#1DA1F1",
    linkedin: "#0A66C2",
    google: "#EA4335"
  };
  
  // Platform icon mapping
  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case "meta":
        return <FaFacebook className="h-4 w-4 text-facebook" />;
      case "twitter":
        return <FaTwitter className="h-4 w-4 text-twitter" />;
      case "linkedin":
        return <FaLinkedin className="h-4 w-4 text-linkedin" />;
      case "google":
        return <FaGoogle className="h-4 w-4 text-google" />;
      default:
        return null;
    }
  };
  
  // Generate platform distribution data
  const platformDistributionData = [
    { name: "Meta", value: analytics.engagementByPlatform.meta, color: platformColors.meta },
    { name: "Twitter", value: analytics.engagementByPlatform.twitter, color: platformColors.twitter },
    { name: "LinkedIn", value: analytics.engagementByPlatform.linkedin, color: platformColors.linkedin },
    { name: "Google", value: analytics.engagementByPlatform.google, color: platformColors.google }
  ];
  
  // Get data for the selected metric
  const getMetricByPlatform = (metric: string) => {
    switch (metric) {
      case "engagement":
        return analytics.engagementByPlatform;
      case "reach":
        return analytics.reachByPlatform;
      case "clicks":
        return analytics.clicksByPlatform;
      default:
        return analytics.engagementByPlatform;
    }
  };
  
  const metricData = getMetricByPlatform(metric);
  
  return (
    <MainLayout title="Analytics">
      {/* Time Range Filter */}
      <div className="flex justify-end mb-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoadingOverview ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
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
              unit="%"
              change={analytics.clickRateGrowth}
            />
          </>
        )}
      </div>
      
      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          {/* Performance by Platform Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Performance by Platform</CardTitle>
                <div className="flex gap-2">
                  <Select value={metric} onValueChange={setMetric}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="reach">Reach</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingChart ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <Tooltip />
                      <Legend />
                      {platformFilter === "all" || platformFilter === "meta" ? (
                        <Line 
                          type="monotone" 
                          dataKey="meta" 
                          stroke={platformColors.meta} 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ) : null}
                      {platformFilter === "all" || platformFilter === "twitter" ? (
                        <Line 
                          type="monotone" 
                          dataKey="twitter" 
                          stroke={platformColors.twitter}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ) : null}
                      {platformFilter === "all" || platformFilter === "linkedin" ? (
                        <Line 
                          type="monotone" 
                          dataKey="linkedin" 
                          stroke={platformColors.linkedin}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ) : null}
                      {platformFilter === "all" || platformFilter === "google" ? (
                        <Line 
                          type="monotone" 
                          dataKey="google" 
                          stroke={platformColors.google}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ) : null}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Platform Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{metric === "engagement" ? "Engagement" : metric === "reach" ? "Reach" : "Clicks"} by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingChart ? (
                  <Skeleton className="h-60 w-full" />
                ) : (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Meta", value: metricData.meta },
                          { name: "Twitter", value: metricData.twitter },
                          { name: "LinkedIn", value: metricData.linkedin },
                          { name: "Google", value: metricData.google }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" maxBarSize={60}>
                          {platformDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingPlatforms ? (
                    Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))
                  ) : (
                    platforms.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center
                            ${platform.platform === "meta" ? "bg-facebook/10 text-facebook" : ""}
                            ${platform.platform === "twitter" ? "bg-twitter/10 text-twitter" : ""}
                            ${platform.platform === "linkedin" ? "bg-linkedin/10 text-linkedin" : ""}
                            ${platform.platform === "google" ? "bg-google/10 text-google" : ""}
                          `}>
                            {getPlatformIcon(platform.platform)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {platform.platform === "meta" && "Meta"}
                              {platform.platform === "twitter" && "X (Twitter)"}
                              {platform.platform === "linkedin" && "LinkedIn"}
                              {platform.platform === "google" && "Google"}
                            </p>
                            <p className="text-sm text-gray-500">{platform.accountName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {metricData[platform.platform].toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {metric === "engagement" ? "Interactions" : metric === "reach" ? "Impressions" : "Clicks"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-lg font-medium mb-2">Coming Soon</p>
                <p>Audience demographics data will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-lg font-medium mb-2">Coming Soon</p>
                <p>Content performance analysis will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

// For BarChart Cell components
const Cell = props => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};
