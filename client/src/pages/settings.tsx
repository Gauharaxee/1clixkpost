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
import { SiFacebook, SiX, SiLinkedin, SiGoogle, SiSlack, SiTelegram } from "react-icons/si";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ApiCredential = {
  id: number;
  platform: string;
  clientId: string | null;
  clientSecret: string | null;
};

type BotCredential = {
  id: number;
  botType: string;
  botToken: string | null;
  signingSecret: string | null;
  isActive: boolean;
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

const botConfig: Record<string, { name: string; icon: any; docsUrl: string; requiresSigningSecret: boolean }> = {
  slack: {
    name: "Slack",
    icon: SiSlack,
    docsUrl: "https://api.slack.com/apps",
    requiresSigningSecret: true,
  },
  telegram: {
    name: "Telegram",
    icon: SiTelegram,
    docsUrl: "https://core.telegram.org/bots#botfather",
    requiresSigningSecret: false,
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, { clientId: string; clientSecret: string }>>({});
  const [botFormData, setBotFormData] = useState<Record<string, { botToken: string; signingSecret: string; isActive: boolean }>>({});

  const { data: credentials, isLoading } = useQuery<ApiCredential[]>({
    queryKey: ["/api/settings/credentials"],
  });

  const { data: bots, isLoading: isLoadingBots } = useQuery<BotCredential[]>({
    queryKey: ["/api/settings/bots"],
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

  const saveBotMutation = useMutation({
    mutationFn: async ({ botType, botToken, signingSecret, isActive }: { botType: string; botToken: string; signingSecret?: string; isActive: boolean }) => {
      const response = await fetch("/api/settings/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ botType, botToken, signingSecret, isActive }),
      });
      if (!response.ok) throw new Error("Failed to save bot credentials");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/bots"] });
      toast({
        title: "Success",
        description: "Bot credentials saved successfully. Your bot is now active!",
      });
      setBotFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save bot credentials",
        variant: "destructive",
      });
    },
  });

  const handleBotSubmit = (botType: string) => {
    const data = botFormData[botType];
    if (!data?.botToken) {
      toast({
        title: "Error",
        description: "Please provide a bot token",
        variant: "destructive",
      });
      return;
    }
    saveBotMutation.mutate({ botType, botToken: data.botToken, signingSecret: data.signingSecret, isActive: data.isActive ?? true });
  };

  const handleBotInputChange = (botType: string, field: "botToken" | "signingSecret" | "isActive", value: string | boolean) => {
    setBotFormData((prev) => ({
      ...prev,
      [botType]: {
        ...prev[botType],
        [field]: value,
      } as any,
    }));
  };

  const getCredentialForPlatform = (platform: string) => {
    return credentials?.find((c) => c.platform === platform);
  };

  const getBotForType = (botType: string) => {
    return bots?.find((b) => b.botType === botType);
  };

  if (isLoading || isLoadingBots) {
    return (
      <MainLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure API credentials and manage your bots
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

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api" data-testid="tab-api-credentials">API Credentials</TabsTrigger>
            <TabsTrigger value="bots" data-testid="tab-bots">Bot Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="mt-6">
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
          </TabsContent>

          <TabsContent value="bots" className="mt-6">
            <div className="grid gap-6">
              {Object.entries(botConfig).map(([key, config]) => {
                const bot = getBotForType(key);
                const Icon = config.icon;
                const formValue = botFormData[key];
                const hasBot = bot && bot.botToken;

                return (
                  <Card key={key} data-testid={`card-bot-${key}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <div>
                          <CardTitle>{config.name} Bot</CardTitle>
                          <CardDescription>
                            Configure your {config.name} bot. Get your bot token from{" "}
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
                      {hasBot && bot.isActive && (
                        <Alert className="bg-green-50 border-green-200">
                          <AlertDescription className="text-green-800">
                            ✓ Bot is active and running
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${key}-bot-token`}>Bot Token</Label>
                          <div className="relative">
                            <Input
                              id={`${key}-bot-token`}
                              type={showSecrets[`${key}-bot`] ? "text" : "password"}
                              placeholder={hasBot ? "••••••••••••••••" : "Enter Bot Token"}
                              value={formValue?.botToken || ""}
                              onChange={(e) => handleBotInputChange(key, "botToken", e.target.value)}
                              className="pr-10"
                              data-testid={`input-bot-token-${key}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowSecrets(prev => ({ ...prev, [`${key}-bot`]: !prev[`${key}-bot`] }))}
                            >
                              {showSecrets[`${key}-bot`] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {config.requiresSigningSecret && (
                          <div className="space-y-2">
                            <Label htmlFor={`${key}-signing-secret`}>Signing Secret (Optional for Slack)</Label>
                            <Input
                              id={`${key}-signing-secret`}
                              type="password"
                              placeholder={hasBot ? "••••••••••••••••" : "Enter Signing Secret"}
                              value={formValue?.signingSecret || ""}
                              onChange={(e) => handleBotInputChange(key, "signingSecret", e.target.value)}
                              data-testid={`input-signing-secret-${key}`}
                            />
                          </div>
                        )}

                        <Button
                          onClick={() => handleBotSubmit(key)}
                          disabled={saveBotMutation.isPending || !formValue?.botToken}
                          className="w-full"
                          data-testid={`button-save-bot-${key}`}
                        >
                          {saveBotMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {hasBot ? "Update Bot" : "Activate Bot"}
                        </Button>
                      </div>

                      {key === "telegram" && (
                        <Alert>
                          <AlertDescription>
                            <strong>Available Commands:</strong><br/>
                            /start - Start the bot<br/>
                            /create &lt;content&gt; - Create a new post<br/>
                            /list - View your recent posts<br/>
                            /connections - Check connected platforms<br/>
                            /help - Show available commands
                          </AlertDescription>
                        </Alert>
                      )}

                      {key === "slack" && (
                        <Alert>
                          <AlertDescription>
                            <strong>Available Commands:</strong><br/>
                            /postmaster-create &lt;content&gt; - Create a new post<br/>
                            /postmaster-list - View your recent posts<br/>
                            /postmaster-connections - Check connected platforms<br/>
                            /postmaster-help - Show available commands
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
