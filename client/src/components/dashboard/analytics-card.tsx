import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  className?: string;
}

export function AnalyticsCard({ title, value, unit, change, className }: AnalyticsCardProps) {
  const isPositive = typeof change === 'number' ? change >= 0 : true;
  
  return (
    <div className={cn("bg-white rounded-xl p-5 border border-gray-200 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        {typeof change === 'number' && (
          <span 
            className={cn(
              "text-xs font-medium flex items-center",
              isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-end">
        <h3 className="text-2xl font-bold">{value}</h3>
        {unit && <span className="ml-2 text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}
