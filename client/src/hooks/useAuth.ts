import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });

  // Treat 401 errors as "not authenticated" rather than error state
  const isUnauthenticated = error && isUnauthorizedError(error as Error);
  const isAuthenticated = !!user && !isUnauthenticated;

  return {
    user,
    isLoading,
    isAuthenticated,
    error: isUnauthenticated ? null : error,
  };
}