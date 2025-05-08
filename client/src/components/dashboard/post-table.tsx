import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PostTableItem } from "@/lib/types";
import { Link } from "wouter";
import { PlatformType, PostStatus } from "@shared/schema";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from "react-icons/fa";

interface PostTableProps {
  posts: PostTableItem[];
  className?: string;
}

export function PostTable({ posts, className }: PostTableProps) {
  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case "meta":
        return <FaFacebook className="text-facebook" />;
      case "twitter":
        return <FaTwitter className="text-twitter" />;
      case "linkedin":
        return <FaLinkedin className="text-linkedin" />;
      case "google":
        return <FaGoogle className="text-google" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case "published":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Scheduled</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40%]">Content</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex items-center">
                    {post.imageUrl && (
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 mr-3 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt="Post media" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {post.content}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {post.platforms.map((platform) => (
                      <Tooltip key={platform}>
                        <TooltipTrigger asChild>
                          <span className={cn(
                            "px-2 py-1 text-xs rounded-full flex items-center gap-1",
                            platform === "meta" && "bg-facebook/10 text-facebook",
                            platform === "twitter" && "bg-twitter/10 text-twitter",
                            platform === "linkedin" && "bg-linkedin/10 text-linkedin",
                            platform === "google" && "bg-google/10 text-google"
                          )}>
                            {getPlatformIcon(platform)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {platform === "meta" && "Meta"}
                          {platform === "twitter" && "X (Twitter)"}
                          {platform === "linkedin" && "LinkedIn"}
                          {platform === "google" && "Google"}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{post.date}</TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {post.status === "published" ? post.engagement.toLocaleString() : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No posts yet. <Link href="/create-post" className="text-primary font-medium hover:underline">Create your first post</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
