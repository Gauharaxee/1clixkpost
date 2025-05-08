import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Pencil } from "lucide-react";
import { ScheduledPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlatformType } from "@shared/schema";

interface ScheduleCardProps {
  scheduledPosts: ScheduledPost[];
  className?: string;
}

export function ScheduleCard({ scheduledPosts, className }: ScheduleCardProps) {
  const [dateView, setDateView] = useState(new Date());
  
  const handlePrevDate = () => {
    const newDate = new Date(dateView);
    newDate.setDate(newDate.getDate() - 1);
    setDateView(newDate);
  };
  
  const handleNextDate = () => {
    const newDate = new Date(dateView);
    newDate.setDate(newDate.getDate() + 1);
    setDateView(newDate);
  };

  const resetToToday = () => {
    setDateView(new Date());
  };

  const getPlatformColor = (platform: PlatformType) => {
    switch(platform) {
      case 'meta': return 'bg-facebook';
      case 'twitter': return 'bg-twitter';
      case 'linkedin': return 'bg-linkedin';
      case 'google': return 'bg-google';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm p-5", className)}>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 h-8 bg-blue-50 text-primary rounded-full font-medium border-blue-100 hover:bg-blue-100"
          onClick={resetToToday}
        >
          Today
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1 h-8 text-gray-500 hover:bg-gray-50 rounded-full"
        >
          Week
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1 h-8 text-gray-500 hover:bg-gray-50 rounded-full"
        >
          Month
        </Button>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-1 hover:bg-gray-100 rounded"
            onClick={handlePrevDate}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(dateView, 'MMMM d, yyyy')}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-1 hover:bg-gray-100 rounded"
            onClick={handleNextDate}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {scheduledPosts.length > 0 ? (
          scheduledPosts.map((post) => (
            <div 
              key={post.id}
              className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-white"
            >
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{post.title}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.time}
                  </span>
                  <span className="mx-2">•</span>
                  <div className="flex space-x-1">
                    {post.platforms.map((platform) => (
                      <span key={platform} className={cn("w-3 h-3 rounded-full", getPlatformColor(platform))}></span>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-gray-600 h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No scheduled posts for this day</p>
            <Button 
              variant="link" 
              className="text-primary mt-2"
              onClick={() => window.location.href = '/create-post'}
            >
              Create a new post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
