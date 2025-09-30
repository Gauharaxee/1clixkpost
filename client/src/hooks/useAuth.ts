// Referenced from blueprint:javascript_log_in_with_replit
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      // Treat 401 as "not authenticated" (null user) instead of an error
      if (response.status === 401) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
