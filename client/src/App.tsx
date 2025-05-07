import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CreatePost from "@/pages/create-post";
import ScheduledPosts from "@/pages/scheduled-posts";
import PublishedPosts from "@/pages/published-posts";
import Analytics from "@/pages/analytics";
import Sidebar from "@/components/layout/sidebar";
import TopNavigation from "@/components/layout/top-navigation";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/create" component={CreatePost} />
      <Route path="/scheduled" component={ScheduledPosts} />
      <Route path="/published" component={PublishedPosts} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <TopNavigation onMenuClick={() => setMobileMenuOpen(true)} />
            
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
