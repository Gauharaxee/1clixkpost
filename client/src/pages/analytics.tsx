import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Cell 
} from "recharts";
import { usePlatformConnections, type PlatformConnectionType } from "@/hooks/use-platform-connections";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [platform, setPlatform] = useState("all");

  // Fetch platform connections to show available platforms
  const { connections, isLoading: isLoadingConnections } = usePlatformConnections();
  
  // Mock data for analytics charts
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/analytics", timeRange, platform],
    queryFn: () => {
      // In a real app, this would call your API with the selected filters
      return getMockAnalyticsData(timeRange, platform);
    }
  });
  
  const isLoading = isLoadingConnections || isLoadingAnalytics;
  
  const getPlatformMetrics = (platformType: string, connections: PlatformConnectionType[]) => {
    const platform = connections.find(c => c.platformType === platformType);
    return {
      platformType,
      name: getPlatformName(platformType),
      icon: getPlatformIcon(platformType),
      color: getPlatformColor(platformType),
      followers: platform?.followerCount || 0,
      engagementRate: getRandomEngagementRate(platformType),
      posts: getRandomPostCount(platformType)
    };
  };
  
  const getPlatformName = (platformType: string) => {
    switch (platformType) {
      case "meta": return "Meta";
      case "x": return "X";
      case "linkedin": return "LinkedIn";
      case "google": return "Google";
      default: return platformType.charAt(0).toUpperCase() + platformType.slice(1);
    }
  };
  
  const getPlatformIcon = (platformType: string) => {
    switch (platformType) {
      case "meta": return "ri-facebook-fill";
      case "x": return "ri-twitter-x-fill";
      case "linkedin": return "ri-linkedin-fill";
      case "google": return "ri-google-fill";
      default: return "ri-question-fill";
    }
  };
  
  const getPlatformColor = (platformType: string) => {
    switch (platformType) {
      case "meta": return "#1877f2";
      case "x": return "#000000";
      case "linkedin": return "#0a66c2";
      case "google": return "#ea4335";
      default: return "#6b7280";
    }
  };
  
  const getRandomEngagementRate = (platformType: string) => {
    // Range between 1.0 and 6.0
    const base = Math.random() * 5 + 1;
    return parseFloat(base.toFixed(1));
  };
  
  const getRandomPostCount = (platformType: string) => {
    // Range between 10 and 60
    return Math.floor(Math.random() * 50) + 10;
  };
  
  if (isLoading) {
    return <AnalyticsSkeleton />;
  }
  
  const platformData = ["meta", "x", "linkedin", "google"].map(platformType => 
    getPlatformMetrics(platformType, connections)
  );
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {connections.map(conn => (
                  <SelectItem key={conn.id} value={conn.platformType}>{getPlatformName(conn.platformType)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{analyticsData.totalPosts}</div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{analyticsData.totalImpressions.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Impressions</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{analyticsData.totalEngagements.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Engagements</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{analyticsData.avgEngagementRate}%</div>
                <div className="text-sm text-gray-500">Avg. Engagement Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Analytics Content */}
        <div className="mt-8">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platform">By Platform</TabsTrigger>
              <TabsTrigger value="content">Content Performance</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Over Time</CardTitle>
                    <CardDescription>Tracking engagement across all platforms</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.dailyMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="engagements" stroke="#3b82f6" name="Engagements" strokeWidth={2} />
                          <Line type="monotone" dataKey="impressions" stroke="#10b981" name="Impressions" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Distribution</CardTitle>
                    <CardDescription>Engagement breakdown by platform</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.platformDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {analyticsData.platformDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Post Performance Comparison</CardTitle>
                    <CardDescription>Engagement rate by post and platform</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.postComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="postTitle" />
                          <YAxis label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="meta" name="Meta" fill="#1877f2" />
                          <Bar dataKey="x" name="X" fill="#000000" />
                          <Bar dataKey="linkedin" name="LinkedIn" fill="#0a66c2" />
                          <Bar dataKey="google" name="Google" fill="#ea4335" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="platform">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {platformData.map((platform, index) => (
                  <Card key={index}>
                    <CardHeader className={`bg-opacity-10 border-b border-opacity-20`} style={{ backgroundColor: `${platform.color}20`, borderColor: platform.color }}>
                      <div className="flex items-center">
                        <i className={`${platform.icon} text-2xl`} style={{ color: platform.color }}></i>
                        <CardTitle className="ml-2">{platform.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Followers</span>
                          <span className="text-sm font-medium">{platform.followers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Engagement Rate</span>
                          <span className="text-sm font-medium">{platform.engagementRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Posts</span>
                          <span className="text-sm font-medium">{platform.posts}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance Comparison</CardTitle>
                  <CardDescription>Engagement metrics across all connected platforms</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.platformMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="engagements" name="Engagements" fill="#3b82f6" />
                        <Bar yAxisId="right" dataKey="impressions" name="Impressions" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Posts with the highest engagement rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topPosts.map((post, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{post.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{post.excerpt}</p>
                            <div className="flex items-center mt-2">
                              {post.platforms.map((plt, i) => (
                                <i key={i} className={`${getPlatformIcon(plt)} mr-1`} style={{ color: getPlatformColor(plt) }}></i>
                              ))}
                              <span className="text-xs text-gray-500 ml-2">{post.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-primary">{post.engagementRate}%</div>
                            <div className="text-xs text-gray-500">Engagement Rate</div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <div className="text-sm font-medium">{post.impressions.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Impressions</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <div className="text-sm font-medium">{post.engagements.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Engagements</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <div className="text-sm font-medium">{post.clicks.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Clicks</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="audience">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                    <CardDescription>Age and gender distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.demographics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="male" name="Male" fill="#3b82f6" />
                          <Bar dataKey="female" name="Female" fill="#8b5cf6" />
                          <Bar dataKey="other" name="Other" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Locations</CardTitle>
                    <CardDescription>Top countries by audience size</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={analyticsData.locations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="country" type="category" width={100} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="followers" name="Followers" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for the analytics page
const AnalyticsSkeleton = () => (
  <div className="py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <Skeleton className="h-10 w-96 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

// Mock data for the analytics page
function getMockAnalyticsData(timeRange: string, platform: string) {
  // Total metrics
  const totalPosts = 128;
  const totalImpressions = 24500;
  const totalEngagements = 4200;
  const avgEngagementRate = 4.3;
  
  // Generate date labels based on time range
  const getDates = (range: string) => {
    const dates = [];
    let days;
    
    switch (range) {
      case "7d": days = 7; break;
      case "30d": days = 30; break;
      case "90d": days = 90; break;
      case "1y": days = 365; break;
      default: days = 7;
    }
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    }
    
    return dates;
  };
  
  // Daily metrics
  const dates = getDates(timeRange);
  const dailyMetrics = dates.map(date => {
    const impressions = Math.floor(Math.random() * 2000) + 500;
    const engagements = Math.floor(impressions * (Math.random() * 0.3 + 0.1));
    return {
      date,
      impressions,
      engagements,
      engagementRate: ((engagements / impressions) * 100).toFixed(1)
    };
  });
  
  // Platform distribution
  const platformDistribution = [
    { name: "Meta", value: 40, color: "#1877f2" },
    { name: "X", value: 30, color: "#000000" },
    { name: "LinkedIn", value: 20, color: "#0a66c2" },
    { name: "Google", value: 10, color: "#ea4335" }
  ];
  
  // Platform metrics
  const platformMetrics = [
    { name: "Meta", engagements: 1800, impressions: 9500 },
    { name: "X", engagements: 1200, impressions: 8000 },
    { name: "LinkedIn", engagements: 900, impressions: 5000 },
    { name: "Google", engagements: 300, impressions: 2000 }
  ];
  
  // Post comparison
  const postComparison = [
    { 
      postTitle: "Product Launch", 
      meta: 6.2, 
      x: 4.8, 
      linkedin: 5.5, 
      google: 3.1 
    },
    { 
      postTitle: "Case Study", 
      meta: 3.9, 
      x: 2.7, 
      linkedin: 7.2, 
      google: 2.5 
    },
    { 
      postTitle: "Industry News", 
      meta: 4.5, 
      x: 5.3, 
      linkedin: 4.2, 
      google: 3.8 
    },
    { 
      postTitle: "Company Update", 
      meta: 5.1, 
      x: 3.6, 
      linkedin: 6.4, 
      google: 2.9 
    }
  ];
  
  // Top performing posts
  const topPosts = [
    {
      title: "Announcing Our New Feature Set!",
      excerpt: "We're excited to share our latest product updates designed to streamline your workflow...",
      platforms: ["meta", "x", "linkedin"],
      date: "Jun 15, 2023",
      impressions: 5280,
      engagements: 425,
      clicks: 186,
      engagementRate: 8.1
    },
    {
      title: "Join Our Upcoming Webinar on Social Media Strategy",
      excerpt: "Learn from industry experts how to maximize your social media presence...",
      platforms: ["linkedin", "meta"],
      date: "May 28, 2023",
      impressions: 3850,
      engagements: 312,
      clicks: 143,
      engagementRate: 7.8
    },
    {
      title: "Case Study: How Company X Increased Engagement by 200%",
      excerpt: "Discover the strategies that helped our client triple their social media engagement...",
      platforms: ["linkedin", "x"],
      date: "May 12, 2023",
      impressions: 2960,
      engagements: 215,
      clicks: 98,
      engagementRate: 7.3
    }
  ];
  
  // Demographics
  const demographics = [
    { age: "18-24", male: 15, female: 18, other: 2 },
    { age: "25-34", male: 25, female: 22, other: 3 },
    { age: "35-44", male: 20, female: 18, other: 1 },
    { age: "45-54", male: 12, female: 14, other: 1 },
    { age: "55+", male: 8, female: 10, other: 1 }
  ];
  
  // Locations
  const locations = [
    { country: "United States", followers: 5200 },
    { country: "United Kingdom", followers: 2100 },
    { country: "Canada", followers: 1800 },
    { country: "Australia", followers: 950 },
    { country: "Germany", followers: 780 },
    { country: "France", followers: 650 },
    { country: "India", followers: 520 }
  ];
  
  return {
    totalPosts,
    totalImpressions,
    totalEngagements,
    avgEngagementRate,
    dailyMetrics,
    platformDistribution,
    platformMetrics,
    postComparison,
    topPosts,
    demographics,
    locations
  };
}
