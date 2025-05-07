import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type ActivityType = "published" | "scheduled" | "draft";

interface PlatformIcon {
  icon: string;
  color: string;
}

interface ActivityItemProps {
  type: ActivityType;
  title: string;
  excerpt: string;
  timestamp: Date;
  platforms?: PlatformIcon[];
}

const ActivityItem = ({
  type,
  title,
  excerpt,
  timestamp,
  platforms = [],
}: ActivityItemProps) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "published":
        return {
          icon: "ri-send-plane-fill",
          bgColor: "bg-primary",
          textColor: "text-primary",
        };
      case "scheduled":
        return {
          icon: "ri-calendar-check-line",
          bgColor: "bg-secondary",
          textColor: "text-secondary",
        };
      case "draft":
        return {
          icon: "ri-draft-line",
          bgColor: "bg-google",
          textColor: "text-google",
        };
    }
  };

  const { icon, bgColor, textColor } = getActivityIcon(type);

  return (
    <li className="p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <span className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            bgColor, "bg-opacity-10", textColor
          )}>
            <i className={icon}></i>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {title}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {excerpt}
          </p>
        </div>
        <div>
          {platforms.length > 0 && (
            <div className="inline-flex items-center">
              {platforms.map((platform, index) => (
                <i 
                  key={index} 
                  className={cn(platform.icon, platform.color, index > 0 ? "ml-1" : "")}
                ></i>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
        <div>
          <button className="text-gray-400 hover:text-gray-500">
            <i className="ri-more-2-fill"></i>
          </button>
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;
