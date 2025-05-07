import { useState } from "react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/rich-text-editor";
import PlatformSelector from "@/components/post/platform-selector";
import { CalendarIcon, XIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  scheduledDate?: Date;
  onScheduledDateChange: (date?: Date) => void;
  mediaUrl?: string;
  onMediaUrlChange: (url?: string) => void;
  onPublish: () => void;
}

const ContentEditor = ({
  content,
  onContentChange,
  selectedPlatforms,
  onPlatformsChange,
  scheduledDate,
  onScheduledDateChange,
  mediaUrl,
  onMediaUrlChange,
  onPublish,
}: ContentEditorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <RichTextEditor 
          value={content} 
          onChange={onContentChange}
          placeholder="What would you like to share?"
        />
      </div>
      
      {mediaUrl && (
        <div className="p-4 pt-0">
          <div className="mt-4 relative rounded-lg bg-gray-100 overflow-hidden">
            <img 
              className="w-full h-auto" 
              src={mediaUrl} 
              alt="Post media"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              onClick={() => onMediaUrlChange(undefined)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full shadow-sm bg-gray-100 hover:bg-gray-200",
                    scheduledDate && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : "Schedule"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={(date) => {
                    onScheduledDateChange(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Post to:</span>
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms} 
                onChange={onPlatformsChange}
              />
            </div>
          </div>
          
          <Button
            onClick={onPublish}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none"
          >
            {scheduledDate ? "Schedule Post" : "Publish Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
