import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ContentEditor from "@/components/post/content-editor";
import PostPreview from "@/components/post/post-preview";
import { usePostForm } from "@/hooks/use-post-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
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
  
  const [activeTab, setActiveTab] = useState("compose");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create object URL for the image
    const imageUrl = URL.createObjectURL(file);
    setMediaUrl(imageUrl);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Create Post</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="text-gray-600"
          >
            Cancel
          </Button>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>New Social Media Post</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="targeting">Targeting</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compose">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="post-content">Post Content</Label>
                      <div className="mt-2">
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
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="media">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="image-upload">Upload Image</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="mt-2"
                      />
                      
                      {mediaUrl && (
                        <div className="mt-4">
                          <Label>Current Image</Label>
                          <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={mediaUrl} 
                              alt="Post media preview" 
                              className="w-full h-auto max-h-[300px] object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setMediaUrl(undefined)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="alt-text">Alternative Text</Label>
                      <Textarea
                        id="alt-text"
                        placeholder="Describe your image for visually impaired users"
                        className="mt-2 resize-none"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Good alt text improves accessibility and SEO.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="targeting">
                  <div className="space-y-6">
                    <div>
                      <Label>Select Platforms</Label>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                          variant={selectedPlatforms.includes("meta") ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => {
                            if (selectedPlatforms.includes("meta")) {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== "meta"));
                            } else {
                              setSelectedPlatforms([...selectedPlatforms, "meta"]);
                            }
                          }}
                        >
                          <i className="ri-facebook-circle-fill text-meta text-xl mr-2"></i>
                          Meta
                        </Button>
                        
                        <Button
                          variant={selectedPlatforms.includes("x") ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => {
                            if (selectedPlatforms.includes("x")) {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== "x"));
                            } else {
                              setSelectedPlatforms([...selectedPlatforms, "x"]);
                            }
                          }}
                        >
                          <i className="ri-twitter-x-fill text-twitter text-xl mr-2"></i>
                          X
                        </Button>
                        
                        <Button
                          variant={selectedPlatforms.includes("linkedin") ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => {
                            if (selectedPlatforms.includes("linkedin")) {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== "linkedin"));
                            } else {
                              setSelectedPlatforms([...selectedPlatforms, "linkedin"]);
                            }
                          }}
                        >
                          <i className="ri-linkedin-box-fill text-linkedin text-xl mr-2"></i>
                          LinkedIn
                        </Button>
                        
                        <Button
                          variant={selectedPlatforms.includes("google") ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => {
                            if (selectedPlatforms.includes("google")) {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== "google"));
                            } else {
                              setSelectedPlatforms([...selectedPlatforms, "google"]);
                            }
                          }}
                        >
                          <i className="ri-google-fill text-google text-xl mr-2"></i>
                          Google
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="space-y-6">
                    <div>
                      <Label>Post Preview</Label>
                      <div className="mt-2">
                        <PostPreview
                          content={content}
                          mediaUrl={mediaUrl}
                          platforms={selectedPlatforms}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6 space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Save as draft
                    toast({
                      title: "Draft Saved",
                      description: "Your post has been saved as a draft.",
                    });
                  }}
                >
                  Save as Draft
                </Button>
                <Button 
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-blue-700"
                >
                  {isSubmitting ? "Publishing..." : (scheduledDate ? "Schedule Post" : "Publish Now")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
