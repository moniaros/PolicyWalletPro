import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Home,
  FileText,
  Calendar,
  BarChart2,
  User,
  Bell,
  Users,
  FolderOpen,
  ShieldAlert,
  PhoneCall,
  Heart,
  LogOut,
  Settings,
  TrendingUp,
  Zap,
  RefreshCw,
  CreditCard,
  Sparkles,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Chatbot } from "@/components/chatbot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = localStorage.getItem("user_role") === "admin";

  const navItems = [
    { icon: Home, label: t('nav.dashboard'), href: "/" },
    { icon: FileText, label: t('nav.policies'), href: "/policies" },
    { icon: RefreshCw, label: t('nav.renewals'), href: "/renewals" },
    { icon: CreditCard, label: t('nav.billing'), href: "/billing" },
    { icon: Sparkles, label: t('nav.recommendations'), href: "/recommendations" },
    { icon: Bell, label: t('nav.notifications'), href: "/notifications" },
    { icon: Heart, label: t('nav.wellness'), href: "/health-wellness" },
    { icon: ShieldAlert, label: t('nav.claims'), href: "/claims" },
    { icon: FolderOpen, label: t('nav.documents'), href: "/documents" },
    { icon: Calendar, label: t('nav.appointments'), href: "/appointments" },
    { icon: BarChart2, label: t('nav.analysis'), href: "/analysis" },
    { icon: Users, label: t('nav.agents'), href: "/agents" },
    { icon: Settings, label: t('nav.settings'), href: "/settings" },
    ...(isAdmin ? [{ icon: Settings, label: t('nav.admin'), href: "/admin" }] : []),
  ];

  const mobileNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-background/60 backdrop-blur-xl fixed h-full z-20 shadow-lg shadow-black/5">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldIcon className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">{t('brand.name')}</span>
        </div>

        <ScrollableNav navItems={navItems} location={location} />

        <div className="p-4 border-t border-border/50 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t('settings.theme')}
            </span>
            <ModeToggle />
          </div>

          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('auth.logout')}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full font-bold shadow-lg shadow-red-500/20 animate-pulse"
                data-testid="button-emergency-sos"
              >
                <PhoneCall className="h-4 w-4 mr-2" /> {t('emergency.sos')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] border-red-200 bg-red-50" aria-describedby="emergency-dialog-description">
              <DialogHeader>
                <DialogTitle className="text-red-700 flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6" /> {t('emergency.title')}
                </DialogTitle>
              </DialogHeader>
              <p id="emergency-dialog-description" className="sr-only">{t('emergency.title')}</p>
              <div className="space-y-3 py-4">
                <button onClick={() => window.location.href = "tel:112"} className="w-full bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer" data-testid="button-emergency-medical">
                  <div className="text-left">
                    <p className="font-bold text-lg">{t('emergency.medicalEmergency')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('emergency.ambulanceFirstAid')}
                    </p>
                  </div>
                  <div className="bg-red-600 text-white rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-6 w-6" />
                  </div>
                </button>
                <button onClick={() => window.location.href = "tel:18118"} className="w-full bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer" data-testid="button-emergency-roadside">
                  <div className="text-left">
                    <p className="font-bold text-lg">{t('emergency.roadsideAssist')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('emergency.roadsideExpress')}
                    </p>
                  </div>
                  <div className="bg-red-600 text-white rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-6 w-6" />
                  </div>
                </button>
                <button onClick={() => window.location.href = "tel:100"} className="w-full bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer" data-testid="button-emergency-police">
                  <div className="text-left">
                    <p className="font-bold text-lg">{t('emergency.police')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('emergency.emergencyServices')}
                    </p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-6 w-6" />
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldIcon className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-bold text-lg">{t('brand.name')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full h-8 w-8"
              >
                <ShieldAlert className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] border-red-200 bg-red-50" aria-describedby="mobile-emergency-dialog-description">
              <DialogHeader>
                <DialogTitle className="text-red-700 flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6" /> {t('emergency.sosShort')}
                </DialogTitle>
              </DialogHeader>
              <p id="mobile-emergency-dialog-description" className="sr-only">{t('emergency.title')}</p>
              <div className="space-y-3 py-4">
                <button onClick={() => window.location.href = "tel:112"} className="w-full bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer" data-testid="button-mobile-emergency-general">
                  <div className="text-left">
                    <p className="font-bold text-lg">{t('emergency.generalEmergency')}</p>
                    <p className="text-sm text-muted-foreground">{t('emergency.call112')}</p>
                  </div>
                  <div className="bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                </button>
                <button onClick={() => window.location.href = "tel:18118"} className="w-full bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer" data-testid="button-mobile-emergency-roadside">
                  <div className="text-left">
                    <p className="font-bold text-lg">{t('emergency.roadsideAssist')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('emergency.roadsideExpress')}
                    </p>
                  </div>
                  <div className="bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 overflow-x-hidden relative">
        <div className="max-w-full sm:max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      <Chatbot />

      {/* Mobile Bottom Nav - Optimized with 4 primary items + More menu */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t pb-safe pt-2 px-6 z-50 flex justify-between items-center h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 min-w-[56px] min-h-[44px] justify-center transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"} bg-transparent border-0 cursor-pointer p-0`} data-testid={`nav-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div
                className={`p-2 rounded-full ${isActive ? "bg-primary/10" : ""}`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`}
                />
              </div>
              <span className="text-[10px] font-medium truncate max-w-[56px]">{item.label}</span>
            </Link>
          );
        })}
        
        {/* More Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button 
              className={`flex flex-col items-center gap-1 min-w-[56px] min-h-[44px] justify-center transition-colors duration-200 ${moreNavItems.some(item => location === item.href) ? "text-primary" : "text-muted-foreground"} bg-transparent border-0 cursor-pointer p-0`}
              data-testid="nav-mobile-more"
            >
              <div className={`p-2 rounded-full ${moreNavItems.some(item => location === item.href) ? "bg-primary/10" : ""}`}>
                <Menu className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{t('nav.more')}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
            <SheetHeader className="pb-4">
              <SheetTitle>{t('nav.menu')}</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-4 pb-8">
              {moreNavItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl min-h-[80px] justify-center transition-all ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
                    data-testid={`nav-sheet-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium text-center">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-muted-foreground">{t('settings.theme')}</span>
                <ModeToggle />
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground"
                onClick={handleLogout}
                data-testid="button-mobile-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth.logout')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

// Separate component to handle scroll if needed
function ScrollableNav({
  navItems,
  location,
}: {
  navItems: any[];
  location: string;
}) {
  return (
    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group bg-transparent border-0 text-left cursor-pointer ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`} data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <item.icon
              className={`h-5 w-5 flex-shrink-0 ${isActive ? "animate-pulse" : ""}`}
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
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
  );
}
