import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PostTable } from "@/components/dashboard/post-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { CalendarIcon, ChevronDown, ChevronUp, Filter, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PostTableItem } from "@/lib/types";
import { PlatformType } from "@shared/schema";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

interface ScheduledPostWithTime extends PostTableItem {
  time: string;
}

export default function ScheduledPostsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  
  // Query for scheduled posts
  const { data: scheduledPosts, isLoading } = useQuery<ScheduledPostWithTime[]>({
    queryKey: ["/api/posts/scheduled", selectedDate, view, filterPlatform],
  });
  
  // Mock data
  const mockScheduledPosts: ScheduledPostWithTime[] = [
    {
      id: 1,
      content: "Product Feature Announcement: We're excited to introduce our new dashboard with enhanced analytics features!",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["meta", "twitter", "linkedin"],
      date: "Mar 15, 2023",
      time: "10:30 AM",
      status: "scheduled",
      engagement: 0
    },
    {
      id: 2,
      content: "Customer Success Story: Learn how Company XYZ increased their productivity by 30% using our solution.",
      platforms: ["meta", "linkedin"],
      date: "Mar 15, 2023",
      time: "2:00 PM",
      status: "scheduled",
      engagement: 0
    },
    {
      id: 3,
      content: "Weekly Industry Tips: 5 ways to improve your social media presence and engage with your audience.",
      imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["twitter", "linkedin", "google"],
      date: "Mar 16, 2023",
      time: "4:30 PM",
      status: "scheduled",
      engagement: 0
    },
    {
      id: 4,
      content: "Webinar Announcement: Join our experts for a live discussion on industry trends and future predictions.",
      imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
      platforms: ["meta", "linkedin", "google"],
      date: "Mar 17, 2023",
      time: "11:00 AM",
      status: "scheduled",
      engagement: 0
    }
  ];
  
  const posts = scheduledPosts || mockScheduledPosts;
  
  // Functions for handling date selection
  const weekDays = selectedDate 
    ? eachDayOfInterval({
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 })
      })
    : [];
  
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
  
  // Filter function based on selected date and platform
  const filteredPosts = posts.filter(post => {
    // If no date selected, show all
    if (!selectedDate) return true;
    
    // Apply date filter
    const postDate = new Date(post.date);
    let dateMatches = false;
    
    if (view === "day") {
      dateMatches = isSameDay(postDate, selectedDate);
    } else if (view === "week") {
      dateMatches = weekDays.some(day => isSameDay(day, postDate));
    } else if (view === "month") {
      dateMatches = postDate.getMonth() === selectedDate.getMonth() && 
                    postDate.getFullYear() === selectedDate.getFullYear();
    }
    
    // Apply platform filter
    const platformMatches = filterPlatform === "all" || 
                            post.platforms.includes(filterPlatform as PlatformType);
    
    return dateMatches && platformMatches;
  }).sort((a, b) => {
    // Sort by date and time
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <MainLayout title="Scheduled Posts">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="day" value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600 flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate && (
                      <>
                        {view === "day" && format(selectedDate, "MMMM d, yyyy")}
                        {view === "week" && (
                          <>
                            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
                          </>
                        )}
                        {view === "month" && format(selectedDate, "MMMM yyyy")}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        if (selectedDate) {
                          if (view === "day") setSelectedDate(addDays(selectedDate, -1));
                          if (view === "week") setSelectedDate(addDays(selectedDate, -7));
                          if (view === "month") {
                            const newDate = new Date(selectedDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setSelectedDate(newDate);
                          }
                        }
                      }}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        if (selectedDate) {
                          if (view === "day") setSelectedDate(addDays(selectedDate, 1));
                          if (view === "week") setSelectedDate(addDays(selectedDate, 7));
                          if (view === "month") {
                            const newDate = new Date(selectedDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setSelectedDate(newDate);
                          }
                        }
                      }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Platform</label>
                  <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="meta">
                        <div className="flex items-center gap-2">
                          <FaFacebook className="text-facebook" />
                          Meta
                        </div>
                      </SelectItem>
                      <SelectItem value="twitter">
                        <div className="flex items-center gap-2">
                          <FaTwitter className="text-twitter" />
                          X (Twitter)
                        </div>
                      </SelectItem>
                      <SelectItem value="linkedin">
                        <div className="flex items-center gap-2">
                          <FaLinkedin className="text-linkedin" />
                          LinkedIn
                        </div>
                      </SelectItem>
                      <SelectItem value="google">
                        <div className="flex items-center gap-2">
                          <FaGoogle className="text-google" />
                          Google
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select defaultValue="scheduled">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Scheduled Posts</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredPosts.length} posts
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4 p-3 border rounded-lg">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-8 rounded-full" />
                        <Skeleton className="h-6 w-8 rounded-full" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <Skeleton className="h-4 w-20" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="flex gap-4 p-4 border rounded-lg hover:border-gray-300 transition-colors">
                    {post.imageUrl ? (
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <CalendarIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex gap-1">
                          {post.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="flex items-center gap-1 py-0 h-6">
                              {getPlatformIcon(platform)}
                            </Badge>
                          ))}
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                          Scheduled
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end">
                      <div className="text-sm text-gray-500">
                        {post.date} · {post.time}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No scheduled posts found</h3>
                <p className="text-gray-500 mb-4">Try changing your filters or create a new post</p>
                <Button onClick={() => window.location.href = '/create-post'}>
                  Create Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
