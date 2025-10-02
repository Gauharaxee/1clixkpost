import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SiFacebook, SiX, SiLinkedin, SiGoogle } from "react-icons/si";

type ApiCredential = {
  id: number;
  platform: string;
  clientId: string | null;
  clientSecret: string | null;
};

const platformConfig: Record<string, { name: string; icon: any; docsUrl: string }> = {
  meta: {
    name: "Meta/Facebook",
    icon: SiFacebook,
    docsUrl: "https://developers.facebook.com/apps",
  },
  twitter: {
    name: "X/Twitter",
    icon: SiX,
    docsUrl: "https://developer.twitter.com/en/portal/dashboard",
  },
  linkedin: {
    name: "LinkedIn",
    icon: SiLinkedin,
    docsUrl: "https://www.linkedin.com/developers/apps",
  },
  google: {
    name: "Google",
    icon: SiGoogle,
    docsUrl: "https://console.cloud.google.com/apis/credentials",
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, { clientId: string; clientSecret: string }>>({});

  const { data: credentials, isLoading } = useQuery<ApiCredential[]>({
    queryKey: ["/api/settings/credentials"],
  });

  const saveMutation = useMutation({
    mutationFn: async ({ platform, clientId, clientSecret }: { platform: string; clientId: string; clientSecret: string }) => {
      const response = await fetch("/api/settings/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ platform, clientId, clientSecret }),
      });
      if (!response.ok) throw new Error("Failed to save credentials");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/credentials"] });
      toast({
        title: "Success",
        description: "API credentials saved successfully",
      });
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (platform: string) => {
    const data = formData[platform];
    if (!data?.clientId || !data?.clientSecret) {
      toast({
        title: "Error",
        description: "Please fill in both Client ID and Client Secret",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({ platform, ...data });
  };

  const handleInputChange = (platform: string, field: "clientId" | "clientSecret", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const toggleShowSecret = (platform: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const getCredentialForPlatform = (platform: string) => {
    return credentials?.find((c) => c.platform === platform);
  };

  if (isLoading) {
    return (
      <MainLayout title="API Settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="API Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure API credentials for social media platforms
          </p>
        </div>

        <Alert variant="default" className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-900">Security Notice</AlertTitle>
          <AlertDescription className="text-yellow-800">
            These credentials will be stored in your database. For better security in production,
            use Replit's secret management system instead.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {Object.entries(platformConfig).map(([key, config]) => {
            const credential = getCredentialForPlatform(key);
            const Icon = config.icon;
            const formValue = formData[key];
            const hasCredentials = credential && credential.clientId && credential.clientSecret;

            return (
              <Card key={key} data-testid={`card-settings-${key}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <div>
                      <CardTitle>{config.name} API Credentials</CardTitle>
                      <CardDescription>
                        Get your credentials from{" "}
                        <a
                          href={config.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {config.name} Developer Portal
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasCredentials && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">
                        ✓ Credentials configured for this platform
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${key}-client-id`}>Client ID</Label>
                      <Input
                        id={`${key}-client-id`}
                        placeholder={hasCredentials ? "••••••••••••••••" : "Enter Client ID"}
                        value={formValue?.clientId || ""}
                        onChange={(e) => handleInputChange(key, "clientId", e.target.value)}
                        data-testid={`input-client-id-${key}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${key}-client-secret`}>Client Secret</Label>
                      <div className="relative">
                        <Input
                          id={`${key}-client-secret`}
                          type={showSecrets[key] ? "text" : "password"}
                          placeholder={hasCredentials ? "••••••••••••••••" : "Enter Client Secret"}
                          value={formValue?.clientSecret || ""}
                          onChange={(e) => handleInputChange(key, "clientSecret", e.target.value)}
                          className="pr-10"
                          data-testid={`input-client-secret-${key}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toggleShowSecret(key)}
                        >
                          {showSecrets[key] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSubmit(key)}
                      disabled={saveMutation.isPending || (!formValue?.clientId && !formValue?.clientSecret)}
                      className="w-full"
                      data-testid={`button-save-${key}`}
                    >
                      {saveMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {hasCredentials ? "Update Credentials" : "Save Credentials"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
