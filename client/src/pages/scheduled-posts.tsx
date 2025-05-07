import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, Play, Pencil, Trash } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { PostStatus } from "@shared/schema";

export default function ScheduledPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts", { status: PostStatus.SCHEDULED }],
    queryFn: async () => {
      const response = await fetch(`/api/posts?status=${PostStatus.SCHEDULED}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return getMockScheduledPosts();
        }
        throw new Error(`Failed to fetch scheduled posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.length ? data : getMockScheduledPosts();
    },
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  
  if (isLoading) {
    return <ScheduledPostsSkeleton />;
  }
  
  // Get platforms for a post
  const getPlatformIcons = (platforms: string[]) => {
    return platforms.map(platform => {
      switch (platform) {
        case "meta":
          return <i key="meta" className="ri-facebook-fill text-meta mr-1"></i>;
        case "x":
          return <i key="x" className="ri-twitter-x-fill text-twitter mr-1"></i>;
        case "linkedin":
          return <i key="linkedin" className="ri-linkedin-fill text-linkedin mr-1"></i>;
        case "google":
          return <i key="google" className="ri-google-fill text-google mr-1"></i>;
        default:
          return null;
      }
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Scheduled Posts</h1>
          <Link href="/create">
            <Button>
              Create New Post
            </Button>
          </Link>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Posts</CardTitle>
            <CardDescription>
              Manage your scheduled posts across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No scheduled posts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new post.
                </p>
                <div className="mt-6">
                  <Link href="/create">
                    <Button>
                      Create New Post
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="max-w-[300px]">
                            <div className="truncate font-medium">
                              {post.content.replace(/<[^>]*>/g, '').substring(0, 60)}
                              {post.content.length > 60 ? "..." : ""}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex">
                              {getPlatformIcons(post.platforms)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(post.scheduledTime, "PPpp")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  <span>Publish Now</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit Post</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading skeleton for the scheduled posts page
const ScheduledPostsSkeleton = () => (
  <div className="py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Mock data for development
function getMockScheduledPosts() {
  return [
    {
      id: 1,
      content: "Join us for our upcoming webinar on social media strategies...",
      platforms: ["linkedin", "meta"],
      scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: PostStatus.SCHEDULED,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      content: "Excited to share our new features launching next week! #ProductAnnouncement",
      platforms: ["meta", "x", "linkedin"],
      scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: PostStatus.SCHEDULED,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      content: "How our team is working to improve customer satisfaction. Read our latest blog post!",
      platforms: ["linkedin", "google"],
      scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: PostStatus.SCHEDULED,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}
