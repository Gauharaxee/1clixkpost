import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from "react-icons/fa";
import { PlatformType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PostPreviewProps {
  content: string;
  imageUrl?: string;
  selectedPlatforms: PlatformType[];
  className?: string;
}

export function PostPreview({ content, imageUrl, selectedPlatforms, className }: PostPreviewProps) {
  const [activeTab, setActiveTab] = useState<PlatformType | null>(
    selectedPlatforms.length > 0 ? selectedPlatforms[0] : null
  );

  // Update active tab when selected platforms change
  if (selectedPlatforms.length > 0 && (!activeTab || !selectedPlatforms.includes(activeTab))) {
    setActiveTab(selectedPlatforms[0]);
  }

  const formatContent = (text: string, platform: PlatformType) => {
    // Simple conversion of markdown-like syntax to HTML
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')
      .replace(/\n/g, '<br />');
    
    return { __html: formattedText };
  };

  // Platform-specific configuration
  const platformConfig = {
    meta: {
      name: "Meta",
      icon: FaFacebook,
      color: "text-facebook", 
      bgColor: "bg-facebook/10",
      profileName: "Business Page"
    },
    twitter: {
      name: "X (Twitter)",
      icon: FaTwitter,
      color: "text-twitter", 
      bgColor: "bg-twitter/10",
      profileName: "@businessname"
    },
    linkedin: {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "text-linkedin", 
      bgColor: "bg-linkedin/10",
      profileName: "Company Page"
    },
    google: {
      name: "Google",
      icon: FaGoogle,
      color: "text-google", 
      bgColor: "bg-google/10",
      profileName: "Business Profile"
    }
  };

  return (
    <Card className={cn("border-gray-200", className)}>
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {selectedPlatforms.length > 0 ? (
          <>
            <Tabs value={activeTab || undefined} onValueChange={(value) => setActiveTab(value as PlatformType)}>
              <TabsList className="mb-4 w-full justify-start">
                {selectedPlatforms.map((platform) => {
                  const config = platformConfig[platform];
                  const Icon = config.icon;
                  return (
                    <TabsTrigger 
                      key={platform} 
                      value={platform}
                      className={cn(
                        "flex items-center gap-2",
                        activeTab === platform && config.color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {config.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {selectedPlatforms.map((platform) => {
                const config = platformConfig[platform];
                return (
                  <TabsContent key={platform} value={platform} className="mt-0">
                    <div className={cn("rounded-lg border p-4", platform === "twitter" ? "bg-gray-50" : "bg-white")}>
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256" />
                          <AvatarFallback>BP</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">Business Page</span>
                            <span className="text-xs text-gray-500">• Now</span>
                          </div>
                          <span className="text-xs text-gray-500">{config.profileName}</span>
                          
                          <div className="mt-2 text-sm">
                            <div dangerouslySetInnerHTML={formatContent(content, platform)} />
                          </div>
                          
                          {imageUrl && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={imageUrl} 
                                alt="Post media" 
                                className="w-full h-auto" 
                              />
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
                            <button className="flex items-center gap-1 hover:text-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              <span>Like</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              <span>Comment</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <p>Select at least one platform to preview your post</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
