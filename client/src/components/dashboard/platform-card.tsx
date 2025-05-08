import { cn } from "@/lib/utils";
import { PlatformType } from "@shared/schema";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from "react-icons/fa";

interface PlatformCardProps {
  platform: PlatformType;
  isConnected: boolean;
  accountName: string;
  followers?: number;
  className?: string;
  onClick?: () => void;
}

export function PlatformCard({
  platform,
  isConnected,
  accountName,
  followers,
  className,
  onClick,
}: PlatformCardProps) {
  const platformConfig = {
    meta: {
      name: "Meta",
      icon: FaFacebook,
      bgColor: "bg-facebook/10",
      textColor: "text-facebook",
      labelForAccount: "Page",
    },
    twitter: {
      name: "X (Twitter)",
      icon: FaTwitter,
      bgColor: "bg-twitter/10",
      textColor: "text-twitter",
      labelForAccount: "Account",
    },
    linkedin: {
      name: "LinkedIn",
      icon: FaLinkedin,
      bgColor: "bg-linkedin/10",
      textColor: "text-linkedin",
      labelForAccount: "Profile",
    },
    google: {
      name: "Google",
      icon: FaGoogle,
      bgColor: "bg-google/10",
      textColor: "text-google",
      labelForAccount: "Account",
    },
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition-all platform-hover",
        className,
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", config.bgColor, config.textColor)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="font-semibold">{config.name}</h3>
          <p className={cn("text-sm", isConnected ? "text-green-600" : "text-yellow-600")}>
            {isConnected ? "Connected" : "Not Connected"}
          </p>
        </div>
      </div>
      {isConnected && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">{config.labelForAccount}</span>
              <span className="text-xs text-gray-500">Followers</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{accountName}</span>
              <span className="text-sm font-semibold">{followers?.toLocaleString() || "—"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
