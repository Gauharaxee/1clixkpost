import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
    { name: "Create Post", path: "/create", icon: "ri-quill-pen-line" },
    { name: "Scheduled", path: "/scheduled", icon: "ri-calendar-line" },
    { name: "Published", path: "/published", icon: "ri-history-line" },
    { name: "Analytics", path: "/analytics", icon: "ri-bar-chart-line" },
  ];

  const platforms = [
    { name: "Meta", icon: "ri-facebook-circle-fill", color: "text-meta" },
    { name: "X", icon: "ri-twitter-x-fill", color: "text-twitter" },
    { name: "Google", icon: "ri-google-fill", color: "text-google" },
    { name: "LinkedIn", icon: "ri-linkedin-box-fill", color: "text-linkedin" },
  ];

  const navLinkClass = (path: string) => 
    cn("flex items-center px-4 py-3 text-sm font-medium rounded-md", {
      "text-white bg-primary": location === path,
      "text-gray-600 hover:bg-gray-100": location !== path,
    });

  const sidebarClasses = cn(
    "flex flex-col w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
    {
      "fixed inset-y-0 left-0 z-50": open,
      "hidden": !open && typeof window !== 'undefined' && window.innerWidth < 768,
      "md:flex": true,
    }
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
          <h1 className="text-xl font-semibold text-primary">SocialPoster</h1>
          <button 
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {navigation.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={navLinkClass(item.path)}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    onClose();
                  }
                }}
              >
                <i className={`${item.icon} mr-3 text-lg`}></i>
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Connected Accounts
            </h3>
            <div className="mt-2 space-y-2">
              {platforms.map(platform => (
                <Link
                  key={platform.name}
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <i className={`${platform.icon} mr-3 text-lg ${platform.color}`}></i>
                  {platform.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center px-4 py-3 text-sm font-medium text-gray-600">
              <img 
                className="h-8 w-8 rounded-full mr-3" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100" 
                alt="User profile"
              />
              <span>John Smith</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
