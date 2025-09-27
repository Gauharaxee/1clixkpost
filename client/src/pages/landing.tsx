import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, TrendingUp, Clock, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Social Media Manager
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your social media presence with powerful scheduling, analytics, and multi-platform posting.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="px-8 py-3 text-lg"
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Share2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Multi-Platform Posting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Post to Facebook, Twitter, LinkedIn, and Google My Business from one dashboard.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule posts in advance and let our system optimize posting times for maximum engagement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track performance across all platforms with comprehensive insights and engagement metrics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Growth Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your social media growth and optimize your strategy based on data-driven insights.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to elevate your social media game?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of businesses already using our platform to grow their online presence.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="px-8 py-3 text-lg"
            data-testid="button-login-cta"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}