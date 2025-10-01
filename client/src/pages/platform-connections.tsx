import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, AlertCircle } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiGoogle } from "react-icons/si";

type PlatformConnection = {
  id: number;
  platform: "meta" | "twitter" | "linkedin" | "google";
  accountName: string | null;
  accountId: string | null;
  status: string;
  followers: number | null;
};

const platformConfig = {
  meta: {
    name: "Meta (Facebook)",
    icon: SiFacebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Connect your Facebook pages and profiles",
  },
  twitter: {
    name: "X (Twitter)",
    icon: SiX,
    color: "text-black",
    bgColor: "bg-gray-50",
    description: "Connect your X/Twitter account",
  },
  linkedin: {
    name: "LinkedIn",
    icon: SiLinkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    description: "Connect your LinkedIn profile and pages",
  },
  google: {
    name: "Google Business",
    icon: SiGoogle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Connect your Google Business profile",
  },
};

export default function PlatformConnectionsPage() {
  const { toast } = useToast();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  const { data: connections, isLoading } = useQuery<PlatformConnection[]>({
    queryKey: ["/api/platform-connections"],
  });

  const disconnectMutation = useMutation({
    mutationFn: async (platformId: number) => {
      const response = await fetch(`/api/platform-connections/${platformId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to disconnect");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-connections"] });
      toast({
        title: "Success",
        description: "Platform disconnected successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disconnect platform",
        variant: "destructive",
      });
    },
  });

  const handleConnect = async (platform: string) => {
    setConnectingPlatform(platform);
    window.location.href = `/api/oauth/${platform}`;
  };

  const handleDisconnect = async (platformId: number) => {
    if (confirm("Are you sure you want to disconnect this platform?")) {
      disconnectMutation.mutate(platformId);
    }
  };

  const getConnectionForPlatform = (platform: string) => {
    return connections?.find((c) => c.platform === platform);
  };

  if (isLoading) {
    return (
      <MainLayout title="Platform Connections">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Platform Connections">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Connections</h1>
          <p className="text-muted-foreground mt-2">
            Connect your social media accounts to start managing your posts
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(platformConfig).map(([key, config]) => {
            const connection = getConnectionForPlatform(key);
            const Icon = config.icon;
            const isConnected = !!connection && connection.status === "connected";

            return (
              <Card key={key} data-testid={`card-platform-${key}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </div>
                      <div>
                        <CardTitle>{config.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {config.description}
                        </CardDescription>
                      </div>
                    </div>
                    {isConnected ? (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isConnected && connection ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Account:</span>
                          <span className="font-medium" data-testid={`text-account-${key}`}>
                            {connection.accountName || "Connected Account"}
                          </span>
                        </div>
                        {connection.followers !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Followers:</span>
                            <span className="font-medium" data-testid={`text-followers-${key}`}>
                              {connection.followers.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDisconnect(connection.id)}
                        disabled={disconnectMutation.isPending}
                        data-testid={`button-disconnect-${key}`}
                      >
                        {disconnectMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-900">
                          Connect your {config.name} account to start posting and managing content
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleConnect(key)}
                        disabled={connectingPlatform === key}
                        data-testid={`button-connect-${key}`}
                      >
                        {connectingPlatform === key ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Connect {config.name}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
