import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import CreatePostPage from "@/pages/create-post";
import ScheduledPostsPage from "@/pages/scheduled-posts";
import AnalyticsPage from "@/pages/analytics";
import HelpPage from "@/pages/help";
import LandingPage from "@/pages/landing";
import HomePage from "@/pages/home";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={isAuthenticated ? HomePage : LandingPage} />
      
      {/* Protected routes - always declared but protected */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/create-post">
        <ProtectedRoute>
          <CreatePostPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/scheduled-posts">
        <ProtectedRoute>
          <ScheduledPostsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/analytics">
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/help">
        <ProtectedRoute>
          <HelpPage />
        </ProtectedRoute>
      </Route>
      
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
