import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, BellIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  onMobileMenuToggle: () => void;
  className?: string;
}

export function Header({ title, onMobileMenuToggle, className }: HeaderProps) {
  return (
    <header className={cn("bg-white border-b border-gray-200 p-4 flex justify-between items-center", className)}>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4 md:hidden" 
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className="font-heading font-bold text-xl">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <BellIcon className="h-6 w-6" />
        </Button>
        <Link href="/create-post">
          <Button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Post
          </Button>
        </Link>
      </div>
    </header>
  );
}
