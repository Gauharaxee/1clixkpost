import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostStatus } from "@shared/schema";

export function usePostForm() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["meta", "x"]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>("https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      // Reset form
      setContent("");
      setScheduledDate(undefined);
      setMediaUrl(undefined);
      
      // Show success message
      toast({
        title: "Success!",
        description: scheduledDate 
          ? "Your post has been scheduled successfully." 
          : "Your post has been published successfully.",
        variant: "default",
      });
      
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${scheduledDate ? "schedule" : "publish"} post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handlePublish = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }
    
    const postData = {
      content,
      platforms: selectedPlatforms,
      status: scheduledDate ? PostStatus.SCHEDULED : PostStatus.PUBLISHED,
      scheduledTime: scheduledDate,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      formattedContent: { html: content },
    };
    
    createPostMutation.mutate(postData);
  };
  
  return {
    content,
    setContent,
    selectedPlatforms,
    setSelectedPlatforms,
    scheduledDate,
    setScheduledDate,
    mediaUrl,
    setMediaUrl,
    handlePublish,
    isSubmitting: createPostMutation.isPending,
  };
}
