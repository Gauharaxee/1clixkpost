import { cn } from "@/lib/utils";

interface PlatformCardProps {
  name: string;
  icon: string;
  color: string;
  followers: number;
  engagementRate: number;
  posts: number;
}

const PlatformCard = ({
  name,
  icon,
  color,
  followers,
  engagementRate,
  posts,
}: PlatformCardProps) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className={cn(
        "p-4 border-b border-opacity-20",
        `bg-${color} bg-opacity-10 border-${color}`
      )}>
        <div className="flex items-center">
          <i className={`${icon} text-2xl text-${color}`}></i>
          <h3 className="ml-2 text-lg font-medium text-gray-900">{name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Followers</span>
          <span className="text-sm font-medium text-gray-900">
            {followers.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Engagement Rate</span>
          <span className="text-sm font-medium text-gray-900">{engagementRate}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Posts</span>
          <span className="text-sm font-medium text-gray-900">{posts}</span>
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;
