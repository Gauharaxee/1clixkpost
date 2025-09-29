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

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/create-post" component={CreatePostPage} />
      <Route path="/scheduled-posts" component={ScheduledPostsPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/help" component={HelpPage} />
      {/* Fallback to 404 */}
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
