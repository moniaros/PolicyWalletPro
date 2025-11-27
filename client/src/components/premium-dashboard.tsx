import { useState } from "react";
import { useTranslation } from "react-i18next";
import { policies, notifications, appointments } from "@/lib/mockData";
import PolicyCard from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, ChevronRight, Calendar, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Link } from "wouter";
import { OnboardingModal } from "@/components/onboarding-modal";
import { RenewalsWidget, BillingWidget, RecommendationsWidget, InsuranceHealthWidget } from "@/components/dashboard-widgets";
import { QuickActions } from "@/components/quick-actions";

export default function PremiumDashboard() {
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("onboarding_dismissed");
  });

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboarding_dismissed", "true");
  };

  const today = new Date();
  const upcomingAppointment = appointments[0];

  return (
    <>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <div className="space-y-8">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 opacity-95"></div>
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
          
          <div className="relative z-10 px-6 sm:px-8 md:px-12 py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-6 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t('dashboard.newUpdates', { count: notifications.length })}</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                    {t('dashboard.welcomeBack', { name: 'Alex' })}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-400/20 backdrop-blur-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-300" />
                      <span className="text-emerald-100 text-sm font-medium">92/100</span>
                    </div>
                    <p className="text-white/90 text-lg">{t('dashboard.wellCovered')}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2 flex-wrap">
                  <Button 
                    className="bg-white text-blue-600 hover:bg-white/95 shadow-xl shadow-black/30 border-0 font-semibold px-6 h-12 rounded-xl transition-all hover:scale-105 active:scale-95"
                    data-testid="button-add-policy"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('common.addPolicy')}
                  </Button>
                  <Link href="/analysis">
                    <Button 
                      variant="outline" 
                      className="bg-white/15 border-white/40 text-white hover:bg-white/25 font-semibold px-6 h-12 rounded-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                    >
                      {t('dashboard.viewAnalysis')} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block w-1/3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full blur-2xl"></div>
                  <div className="relative h-48 w-48 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                    <Shield className="h-24 w-24 text-white/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <QuickActions />
        </section>

        {/* Dashboard Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RenewalsWidget />
          <BillingWidget />
          <RecommendationsWidget />
          <InsuranceHealthWidget />
        </section>

        {/* Policies & Upcoming */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{t('dashboard.activePolicies')}</h2>
              <Link href="/policies" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1" data-testid="link-all-policies">
                {t('common.viewAll')} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {policies.slice(0, 2).map((policy, i) => (
                <PolicyCard key={policy.id} policy={policy} index={i} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{t('dashboard.upNext')}</h2>
            
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/80 rounded-2xl p-6 shadow-sm border border-border/50 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-primary">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="font-semibold">{t('dashboard.upcomingVisit')}</span>
              </div>
              
              <div className="pt-2">
                <h3 className="font-bold text-lg">{upcomingAppointment.type}</h3>
                <p className="text-muted-foreground text-sm mt-1">{upcomingAppointment.doctor}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm border-t pt-4 mt-2">
                <div className="text-foreground font-semibold">{upcomingAppointment.date}</div>
                <div className="bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary">{upcomingAppointment.time}</div>
              </div>

              <Link href="/appointments" className="w-full">
                <Button variant="outline" className="w-full text-sm" data-testid="button-reschedule">
                  {t('dashboard.reschedule')}
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">{t('dashboard.healthyStreak')}</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-200 mb-4">{t('dashboard.noClaimsMessage', { months: 12 })}</p>
              <div className="h-2.5 bg-emerald-200 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-4/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
