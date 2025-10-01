import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import CreatePostPage from "@/pages/create-post";
import ScheduledPostsPage from "@/pages/scheduled-posts";
import AnalyticsPage from "@/pages/analytics";
import HelpPage from "@/pages/help";
import PlatformConnectionsPage from "@/pages/platform-connections";
import LandingPage from "@/pages/landing";
import { useAuth } from "@/hooks/useAuth";

// Referenced from blueprint:javascript_log_in_with_replit
function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          <Route path="/" component={DashboardPage} />
          <Route path="/create-post" component={CreatePostPage} />
          <Route path="/scheduled-posts" component={ScheduledPostsPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/platform-connections" component={PlatformConnectionsPage} />
          <Route path="/help" component={HelpPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
