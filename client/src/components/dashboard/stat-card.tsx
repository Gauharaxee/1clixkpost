import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  percentChange?: number;
}

const StatCard = ({ title, value, icon, color, percentChange }: StatCardProps) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", `bg-${color} bg-opacity-10`)}>
            <i className={`${icon} text-${color} text-xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {percentChange !== undefined && (
                  <div className={cn(
                    "ml-2 flex items-baseline text-sm font-semibold",
                    percentChange >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    <i className={percentChange >= 0 ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill"}></i>
                    <span className="sr-only">{percentChange >= 0 ? "Increased by" : "Decreased by"}</span>
                    {Math.abs(percentChange)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
