import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/main-layout";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PlatformSelector } from "@/components/create-post/platform-selector";
import { ImageUpload } from "@/components/create-post/image-upload";
import { PostPreview } from "@/components/create-post/post-preview";
import { SchedulePicker } from "@/components/create-post/schedule-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CreatePostRequest, PlatformType, PostStatus } from "@shared/schema";
import { useLocation } from "wouter";

export default function CreatePostPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Form state
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(undefined);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState<string | undefined>(undefined);
  
  // Form validation
  const [contentError, setContentError] = useState("");
  const [platformError, setPlatformError] = useState("");
  
  // Handle image upload
  const handleImageChange = (file: File | undefined) => {
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(undefined);
    }
  };
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      // First, upload the image if there is one
      let imageUrl: string | undefined = undefined;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }
        
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }
      
      // Then create the post
      const res = await apiRequest("POST", "/api/posts", {
        ...data,
        imageUrl,
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your post has been created successfully.",
        duration: 5000,
      });
      
      // Clear form
      setContent("");
      setImageFile(undefined);
      setImagePreviewUrl(undefined);
      setSelectedPlatforms([]);
      setScheduleDate(undefined);
      setScheduleTime(undefined);
      
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      
      // Navigate to dashboard
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!content.trim()) {
      setContentError("Please enter some content for your post");
      isValid = false;
    } else {
      setContentError("");
    }
    
    if (selectedPlatforms.length === 0) {
      setPlatformError("Please select at least one platform");
      isValid = false;
    } else {
      setPlatformError("");
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (status: PostStatus) => {
    if (!validateForm()) {
      return;
    }
    
    let scheduledAt: string | undefined = undefined;
    
    if (status === "scheduled" && scheduleDate && scheduleTime) {
      const [hours, minutes] = scheduleTime.split(":").map(Number);
      const scheduledDate = new Date(scheduleDate);
      scheduledDate.setHours(hours, minutes, 0, 0);
      scheduledAt = scheduledDate.toISOString();
    }
    
    const postData: CreatePostRequest = {
      content,
      platforms: selectedPlatforms,
      status,
      scheduledAt,
    };
    
    createPostMutation.mutate(postData);
  };
  
  return (
    <MainLayout title="Create Post">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Content editor and platform selector */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Create Your Post</h3>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  error={contentError}
                  onImageRequest={() => document.getElementById("image-upload-input")?.click()}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onChange={setSelectedPlatforms}
              />
              
              <ImageUpload
                onChange={handleImageChange}
                value={imageFile}
              />
            </div>
            
            <SchedulePicker
              date={scheduleDate}
              onDateChange={setScheduleDate}
              time={scheduleTime}
              onTimeChange={setScheduleTime}
            />
          </div>
          
          {/* Right column: Preview and publish buttons */}
          <div className="space-y-6">
            <PostPreview
              content={content}
              imageUrl={imagePreviewUrl}
              selectedPlatforms={selectedPlatforms}
            />
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
                
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubmit("published")}
                    disabled={createPostMutation.isPending}
                  >
                    {createPostMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Publish Now
                      </>
                    )}
                  </Button>
                  
                  <Separator />
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubmit("scheduled")}
                    disabled={createPostMutation.isPending || !scheduleDate || !scheduleTime}
                  >
                    {scheduleDate && scheduleTime ? "Schedule Post" : "Set a date to schedule"}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubmit("draft")}
                    disabled={createPostMutation.isPending}
                  >
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
