import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  PlusCircle, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  Share2
} from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Share2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Social Media Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar data-testid="avatar-user">
                <AvatarImage src={user?.profileImageUrl || ""} />
                <AvatarFallback>
                  {getInitials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-user-name">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || "User"
                  }
                </p>
                <Badge variant="secondary" data-testid="badge-plan">
                  {user?.planType || "Free"}
                </Badge>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your social media presence from one powerful dashboard.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/create-post">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-create-post">
              <CardHeader className="text-center">
                <PlusCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Create Post</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Create and schedule new social media posts across all platforms.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/scheduled-posts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-scheduled-posts">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  View and manage your upcoming scheduled posts.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-analytics">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Track performance and engagement across all your social platforms.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-dashboard">
              <CardHeader className="text-center">
                <Settings className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Access your full dashboard with all management tools.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Here are some quick steps to get you started with managing your social media presence:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Connect your social platforms</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Go to the dashboard to connect your Facebook, Twitter, LinkedIn, and Google My Business accounts.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Create your first post</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use the create post feature to craft engaging content for all your platforms at once.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Monitor your performance</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Check your analytics regularly to understand what content resonates with your audience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}