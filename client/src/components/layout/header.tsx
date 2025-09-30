import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, BellIcon, Plus, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  onMobileMenuToggle: () => void;
  className?: string;
}

export function Header({ title, onMobileMenuToggle, className }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className={cn("bg-white border-b border-gray-200 p-4 flex justify-between items-center", className)}>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4 md:hidden" 
          onClick={onMobileMenuToggle}
          data-testid="button-mobile-menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className="font-heading font-bold text-xl">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700" data-testid="button-notifications">
          <BellIcon className="h-6 w-6" />
        </Button>
        <Link href="/create-post">
          <Button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2" data-testid="button-create-post">
            <Plus className="h-5 w-5" />
            Create Post
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.email || "User"} style={{ objectFit: 'cover' }} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.firstName && (
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                )}
                {user?.email && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => window.location.href = "/api/logout"}
              data-testid="menuitem-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
