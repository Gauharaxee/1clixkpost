import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { ChartData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnalyticsChartProps {
  data: ChartData[];
  className?: string;
}

type ChartMetric = 'engagement' | 'reach' | 'clicks';

export function AnalyticsChart({ data, className }: AnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('engagement');

  const metrics = [
    { id: 'engagement', label: 'Engagement' },
    { id: 'reach', label: 'Reach' },
    { id: 'clicks', label: 'Clicks' }
  ];

  // Sample data simulation - in a real app, you'd filter server data
  const filteredData = data;

  return (
    <div className={cn("bg-white p-5 rounded-xl border border-gray-200 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Performance by Platform</h3>
        <div className="flex gap-2">
          {metrics.map((metric) => (
            <Button
              key={metric.id}
              variant={activeMetric === metric.id ? "secondary" : "ghost"}
              className={cn(
                "px-3 py-1 text-sm h-auto",
                activeMetric === metric.id 
                  ? "bg-blue-50 text-primary hover:bg-blue-100 hover:text-primary"
                  : "text-gray-500"
              )}
              onClick={() => setActiveMetric(metric.id as ChartMetric)}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="meta" 
              stackId="1"
              stroke="#1877F2" 
              fill="#1877F2" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="twitter" 
              stackId="1"
              stroke="#1DA1F1" 
              fill="#1DA1F1" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="linkedin" 
              stackId="1"
              stroke="#0A66C2" 
              fill="#0A66C2" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="google" 
              stackId="1"
              stroke="#EA4335" 
              fill="#EA4335" 
              fillOpacity={0.6}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
