import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  PenTool,
  Calendar,
  BarChart2,
  HelpCircle,
  ChevronDown,
  LogOut,
  Settings,
  Link2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Fragment, useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  className?: string;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export function Sidebar({ className, isMobileMenuOpen, closeMobileMenu }: SidebarProps) {
  const [location] = useLocation();

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/create-post",
      label: "Create Post",
      icon: PenTool,
    },
    {
      href: "/scheduled-posts",
      label: "Schedule",
      icon: Calendar,
    },
    {
      href: "/platform-connections",
      label: "Platforms",
      icon: Link2,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart2,
    },
    {
      href: "/help",
      label: "Help & Support",
      icon: HelpCircle,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={cn(
          "w-full md:w-64 bg-white md:min-h-screen border-r border-gray-200 flex-shrink-0 flex flex-col",
          "fixed top-0 left-0 z-50 h-full md:static transition-all duration-300 transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-heading font-bold text-xl text-primary">PostMaster</h1>
        </div>
        <nav className="p-2 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg font-medium",
                        isActive
                          ? "bg-blue-50 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                      onClick={handleLinkClick}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full px-2 justify-start font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256" alt="User profile" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium text-sm">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Premium Plan</p>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto text-gray-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Manage Team</span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
