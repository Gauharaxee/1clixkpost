import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PostPreviewProps {
  content: string;
  mediaUrl?: string;
  platforms: string[];
}

const PostPreview = ({
  content,
  mediaUrl,
  platforms,
}: PostPreviewProps) => {
  const [activeTab, setActiveTab] = useState(platforms.length > 0 ? platforms[0] : "meta");

  // Get platform specific information
  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case "meta":
        return {
          name: "Meta",
          color: "bg-meta",
          textColor: "text-white",
          containerClass: "max-w-md mx-auto"
        };
      case "x":
        return {
          name: "X",
          color: "bg-twitter",
          textColor: "text-white",
          containerClass: "max-w-md mx-auto"
        };
      case "linkedin":
        return {
          name: "LinkedIn",
          color: "bg-linkedin",
          textColor: "text-white",
          containerClass: "max-w-md mx-auto"
        };
      case "google":
        return {
          name: "Google",
          color: "bg-google",
          textColor: "text-white",
          containerClass: "max-w-md mx-auto"
        };
      default:
        return {
          name: "Meta",
          color: "bg-meta",
          textColor: "text-white",
          containerClass: "max-w-md mx-auto"
        };
    }
  };

  // Only show tabs for platforms that are selected
  const availablePlatforms = platforms.length > 0 ? platforms : ["meta"];
  
  return (
    <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <select
              id="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {availablePlatforms.map(platform => {
                const { name } = getPlatformInfo(platform);
                return (
                  <option key={platform} value={platform}>
                    {name} Preview
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Desktop Tabs */}
          <div className="hidden sm:block">
            <TabsList>
              {availablePlatforms.map(platform => {
                const { name, color, textColor } = getPlatformInfo(platform);
                return (
                  <TabsTrigger 
                    key={platform} 
                    value={platform}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md",
                      activeTab === platform ? `${color} ${textColor}` : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {name} Preview
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          
          {/* Preview Content */}
          {availablePlatforms.map(platform => {
            const { containerClass } = getPlatformInfo(platform);
            
            return (
              <TabsContent key={platform} value={platform} className="mt-4">
                <div className={containerClass}>
                  {platform === "meta" && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="p-3 bg-white">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100" 
                            alt="User profile"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">John Smith</p>
                            <p className="text-xs text-gray-500">Just now · <i className="ri-earth-line"></i></p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: content || "Write something..." }}></p>
                        </div>
                        
                        {mediaUrl && (
                          <div className="mt-3 rounded-md overflow-hidden">
                            <img className="w-full h-auto" src={mediaUrl} alt="Post media" />
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between text-gray-500 text-sm">
                          <div className="flex items-center">
                            <span className="bg-meta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-1">
                              <i className="ri-thumb-up-fill text-[10px]"></i>
                            </span>
                            <span>0</span>
                          </div>
                          <div>
                            <span>0 comments · 0 shares</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-around">
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-thumb-up-line mr-2"></i> Like
                          </button>
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-chat-1-line mr-2"></i> Comment
                          </button>
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-share-forward-line mr-2"></i> Share
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {platform === "x" && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="p-3 bg-white">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100" 
                            alt="User profile"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">John Smith</p>
                              <p className="text-xs text-gray-500 ml-1">@johnsmith · Just now</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: content || "Write something..." }}></p>
                        </div>
                        
                        {mediaUrl && (
                          <div className="mt-3 rounded-md overflow-hidden border border-gray-200">
                            <img className="w-full h-auto" src={mediaUrl} alt="Post media" />
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between text-gray-500 text-sm">
                          <button className="flex items-center hover:text-blue-500">
                            <i className="ri-chat-1-line mr-1"></i>
                            <span>0</span>
                          </button>
                          <button className="flex items-center hover:text-green-500">
                            <i className="ri-repeat-line mr-1"></i>
                            <span>0</span>
                          </button>
                          <button className="flex items-center hover:text-red-500">
                            <i className="ri-heart-line mr-1"></i>
                            <span>0</span>
                          </button>
                          <button className="flex items-center hover:text-blue-500">
                            <i className="ri-bar-chart-line mr-1"></i>
                            <span>0</span>
                          </button>
                          <button className="flex items-center hover:text-blue-500">
                            <i className="ri-upload-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {platform === "linkedin" && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="p-3 bg-white">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100" 
                            alt="User profile"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">John Smith</p>
                            <p className="text-xs text-gray-500">Software Engineer at TechCorp · Just now</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: content || "Write something..." }}></p>
                        </div>
                        
                        {mediaUrl && (
                          <div className="mt-3 rounded-md overflow-hidden">
                            <img className="w-full h-auto" src={mediaUrl} alt="Post media" />
                          </div>
                        )}
                        
                        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-around">
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-thumb-up-line mr-2"></i> Like
                          </button>
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-chat-1-line mr-2"></i> Comment
                          </button>
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-share-forward-line mr-2"></i> Share
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {platform === "google" && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="p-3 bg-white">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100" 
                            alt="User profile"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">John Smith</p>
                            <p className="text-xs text-gray-500">Posted to Google Business Profile · Just now</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: content || "Write something..." }}></p>
                        </div>
                        
                        {mediaUrl && (
                          <div className="mt-3 rounded-md overflow-hidden">
                            <img className="w-full h-auto" src={mediaUrl} alt="Post media" />
                          </div>
                        )}
                        
                        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-around">
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-thumb-up-line mr-2"></i> Like
                          </button>
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-chat-1-line mr-2"></i> Comment
                          </button>
                          <button className="flex-1 py-1 text-gray-500 text-sm font-medium flex items-center justify-center hover:bg-gray-100 rounded">
                            <i className="ri-share-forward-line mr-2"></i> Share
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default PostPreview;
