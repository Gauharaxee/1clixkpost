import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from "react-icons/fa";
import { PlatformType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatforms: PlatformType[];
  onChange: (platforms: PlatformType[]) => void;
  className?: string;
}

export function PlatformSelector({ selectedPlatforms, onChange, className }: PlatformSelectorProps) {
  const platforms = [
    { id: "meta" as PlatformType, name: "Meta (Facebook)", icon: FaFacebook, color: "text-facebook", bgColor: "bg-facebook/10" },
    { id: "twitter" as PlatformType, name: "X (Twitter)", icon: FaTwitter, color: "text-twitter", bgColor: "bg-twitter/10" },
    { id: "linkedin" as PlatformType, name: "LinkedIn", icon: FaLinkedin, color: "text-linkedin", bgColor: "bg-linkedin/10" },
    { id: "google" as PlatformType, name: "Google", icon: FaGoogle, color: "text-google", bgColor: "bg-google/10" },
  ];

  const handlePlatformToggle = (platform: PlatformType) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <Card className={cn("border-gray-200", className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Select platforms</h3>
        <div className="space-y-3">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            
            return (
              <div 
                key={platform.id}
                className={cn(
                  "flex items-center space-x-3 rounded-lg p-3 cursor-pointer transition-colors",
                  isSelected ? platform.bgColor : "hover:bg-gray-50"
                )}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <Checkbox 
                  id={`platform-${platform.id}`}
                  checked={isSelected}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className={isSelected ? platform.color : ""}
                />
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className={cn("h-5 w-5", platform.color)} />
                  <Label 
                    htmlFor={`platform-${platform.id}`}
                    className="cursor-pointer font-medium"
                  >
                    {platform.name}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedPlatforms.length === 0 && (
          <p className="text-sm text-red-500 mt-2">Please select at least one platform</p>
        )}
      </CardContent>
    </Card>
  );
}
