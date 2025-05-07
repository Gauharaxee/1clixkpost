import { format, parseISO, formatDistanceToNow, isFuture } from "date-fns";

export const formatDate = (
  date: Date | string | null | undefined,
  formatStr: string = "MMM d, yyyy"
): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatRelative = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "";
  }
};

export const isScheduled = (
  date: Date | string | null | undefined
): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isFuture(dateObj);
  } catch (error) {
    console.error("Error checking if date is in future:", error);
    return false;
  }
};
