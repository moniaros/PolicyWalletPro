import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { policies, notifications, appointments } from "@/lib/mockData";
import PolicyCard from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, ChevronRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import { OnboardingModal } from "@/components/onboarding-modal";
import { RenewalsWidget, BillingWidget, RecommendationsWidget, InsuranceHealthWidget, PaymentRemindersWidget } from "@/components/dashboard-widgets";

export default function Dashboard() {
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Initialize from localStorage to prevent re-showing
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
      {/* Hero / Welcome Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group hover:shadow-primary/40 transition-all duration-300">
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white/95 text-xs font-semibold backdrop-blur-md border border-white/30 hover:bg-white/25 transition-colors">
            <Bell className="h-3.5 w-3.5" />
            <span>{t('dashboard.newUpdates', { count: notifications.length })}</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{t('dashboard.welcomeBack', { name: 'Alex' })}</h1>
            <p className="text-white/85 text-lg leading-relaxed">{t('dashboard.healthScore')} <span className="font-extrabold text-white text-xl">92/100</span>. {t('dashboard.wellCovered')}</p>
          </div>
          <div className="flex gap-3 pt-4 flex-wrap">
            <Button className="bg-white text-primary hover:bg-white/95 shadow-lg shadow-black/20 border-0 font-semibold px-6 h-11 group transition-all hover:scale-105" data-testid="button-add-policy">
              <Plus className="h-4 w-4 mr-2" />
              {t('common.addPolicy')}
            </Button>
            <Link href="/analysis">
              <Button variant="outline" className="bg-white/15 border-white/40 text-white hover:bg-white/25 hover:border-white/60 font-semibold px-6 h-11 backdrop-blur-sm transition-all hover:scale-105">
                {t('dashboard.viewAnalysis')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 md:h-[160%] h-[140%] w-1/2 opacity-30 md:opacity-40 pointer-events-none bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full blur-2xl group-hover:opacity-50 transition-opacity"></div>
      </section>

      {/* Dashboard Widgets Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RenewalsWidget />
        <BillingWidget />
        <RecommendationsWidget />
        <InsuranceHealthWidget />
        <PaymentRemindersWidget />
      </section>

      {/* Upcoming Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{t('dashboard.activePolicies')}</h2>
            <Link href="/policies" className="text-sm text-primary font-medium hover:underline flex items-center" data-testid="link-all-policies">
              {t('common.viewAll')} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {policies.slice(0, 2).map((policy, i) => (
              <PolicyCard key={policy.id} policy={policy} index={i} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold text-foreground">{t('dashboard.upNext')}</h2>
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-muted space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="font-semibold">{t('dashboard.upcomingVisit')}</span>
              </div>
              
              <div>
                <h3 className="font-bold">{upcomingAppointment.type}</h3>
                <p className="text-muted-foreground text-sm">{upcomingAppointment.doctor}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm border-t pt-4 mt-2">
                <div className="text-foreground font-medium">
                  {upcomingAppointment.date}
                </div>
                <div className="bg-secondary px-2 py-1 rounded text-xs font-medium">
                  {upcomingAppointment.time}
                </div>
              </div>

              <Link href="/appointments">
                <Button variant="outline" className="w-full text-xs" data-testid="button-reschedule">{t('dashboard.reschedule')}</Button>
              </Link>
           </div>

           <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-1">{t('dashboard.healthyStreak')}</h3>
              <p className="text-sm text-emerald-700 mb-3">{t('dashboard.noClaimsMessage', { months: 12 })}</p>
              <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[80%] rounded-full"></div>
              </div>
           </div>
        </div>
      </section>
    </div>
    </>
  );
}
