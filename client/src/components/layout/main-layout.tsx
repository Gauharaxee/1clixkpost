import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export function MainLayout({ children, title, className }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        closeMobileMenu={closeMobileMenu} 
      />
      
      <main className="flex-1 overflow-x-hidden">
        <Header 
          title={title}
          onMobileMenuToggle={toggleMobileMenu}
        />
        
        <div className={cn("p-6", className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
