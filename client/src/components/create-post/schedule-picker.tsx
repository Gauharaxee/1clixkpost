import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SchedulePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string | undefined;
  onTimeChange: (time: string | undefined) => void;
  className?: string;
}

export function SchedulePicker({ date, onDateChange, time, onTimeChange, className }: SchedulePickerProps) {
  const [isScheduled, setIsScheduled] = useState(!!date);

  const handleScheduleToggle = (enabled: boolean) => {
    setIsScheduled(enabled);
    if (!enabled) {
      onDateChange(undefined);
      onTimeChange(undefined);
    } else if (!date) {
      // Default to tomorrow if no date is set
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      onDateChange(tomorrow);
      onTimeChange("10:00");
    }
  };

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const h = hour.toString().padStart(2, "0");
        const m = minutes.toString().padStart(2, "0");
        options.push(`${h}:${m}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();

  return (
    <Card className={cn("border-gray-200", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Schedule Post</h3>
          <div className="flex items-center space-x-2">
            <Switch 
              id="schedule-switch"
              checked={isScheduled}
              onCheckedChange={handleScheduleToggle}
            />
            <Label htmlFor="schedule-switch">
              {isScheduled ? "Scheduled" : "Publish Now"}
            </Label>
          </div>
        </div>
        
        {isScheduled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-date" className="text-sm mb-1 block">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="schedule-date"
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={onDateChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="schedule-time" className="text-sm mb-1 block">
                  Time
                </Label>
                <Select
                  value={time}
                  onValueChange={onTimeChange}
                >
                  <SelectTrigger id="schedule-time" className="w-full">
                    <SelectValue placeholder="Select time">
                      {time ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </div>
                      ) : (
                        "Select time"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((timeOption) => (
                      <SelectItem key={timeOption} value={timeOption}>
                        {timeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Your post will be published on{" "}
              <span className="font-medium">
                {date && time
                  ? format(date, "MMMM d, yyyy") + " at " + time
                  : "the selected date and time"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
