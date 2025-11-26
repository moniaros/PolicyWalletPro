import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, FileText, Calendar, BarChart2, User, Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Chatbot } from "@/components/chatbot";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FileText, label: "Policies", href: "/policies" },
    { icon: Calendar, label: "Visits", href: "/appointments" },
    { icon: BarChart2, label: "Analysis", href: "/analysis" },
    { icon: Users, label: "Agents", href: "/agents" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background/50 backdrop-blur-md fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldIcon className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">PolicyGuard</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ModeToggle />
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-1">Need Help?</h4>
            <p className="text-xs text-muted-foreground mb-3">Contact your agent anytime.</p>
            <Link href="/agents">
              <Button variant="outline" size="sm" className="w-full bg-card hover:bg-card/80 text-xs h-8">
                Contact Agent
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldIcon className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-bold text-lg">PolicyGuard</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 overflow-x-hidden relative">
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      <Chatbot />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t pb-safe pt-2 px-6 z-50 flex justify-between items-center h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                    <item.icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </a>
              </Link>
            );
        })}
      </nav>
    </div>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}
