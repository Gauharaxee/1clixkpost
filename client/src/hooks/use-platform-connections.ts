import { useQuery } from "@tanstack/react-query";

export type PlatformConnectionType = {
  id: number;
  userId: number;
  platformType: string;
  isConnected: boolean;
  accountName: string;
  accountId: string;
  followerCount: number;
};

export const usePlatformConnections = () => {
  const { data: connections, isLoading, error } = useQuery({
    queryKey: ["/api/platforms"],
    queryFn: async () => {
      // For demo, returning mock data if API doesn't return results
      const response = await fetch("/api/platforms", {
        credentials: "include",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return getMockPlatformConnections();
        }
        throw new Error(`Failed to fetch platform connections: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.length ? data : getMockPlatformConnections();
    },
  });

  return {
    connections: connections || [],
    isLoading,
    error,
  };
};

// Mock data to use if backend isn't returning data yet
function getMockPlatformConnections(): PlatformConnectionType[] {
  return [
    {
      id: 1,
      userId: 1,
      platformType: "meta",
      isConnected: true,
      accountName: "John Smith",
      accountId: "123456789",
      followerCount: 3240,
    },
    {
      id: 2,
      userId: 1,
      platformType: "x",
      isConnected: true,
      accountName: "@johnsmith",
      accountId: "987654321",
      followerCount: 2750,
    },
    {
      id: 3,
      userId: 1,
      platformType: "linkedin",
      isConnected: true,
      accountName: "John Smith",
      accountId: "linkedin12345",
      followerCount: 1890,
    },
    {
      id: 4,
      userId: 1,
      platformType: "google",
      isConnected: true,
      accountName: "Tech Solutions",
      accountId: "google12345",
      followerCount: 1120,
    },
  ];
}
