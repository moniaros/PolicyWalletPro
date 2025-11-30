import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { policies, notifications, appointments } from "@/lib/mockData";
import PolicyCard from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, ChevronRight, Calendar, FileText, DollarSign, Heart, MessageCircle, TrendingUp, Shield, Clock, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { OnboardingModal } from "@/components/onboarding-modal";
import { AgentHeroSection, PriorityLayer } from "@/components/priority-layer";
import { AgentSidebar, AgentFloatingBadge, AgentRecommendationPill } from "@/components/agent-sidebar";
import { RenewalsWidget, BillingWidget, RecommendationsWidget, InsuranceHealthWidget, PaymentRemindersWidget } from "@/components/dashboard-widgets";

type UserState = {
  policyCount: number;
  expiringPoliciesCount: number;
  openClaimsCount: number;
  daysSinceLastVisit: number;
  hasUrgentRenewals: boolean;
  hasOpenClaims: boolean;
  isNewUser: boolean;
};

function calculateUserState(): UserState {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const expiringPolicies = policies.filter(p => {
    const expiryDate = new Date(p.expiry);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
  });
  
  const openClaims = policies.reduce((count, p) => {
    const claims = p.details?.claims || [];
    return count + claims.filter((c: any) => c.status !== "Paid").length;
  }, 0);
  
  const lastVisit = localStorage.getItem("last_dashboard_visit");
  const daysSinceLastVisit = lastVisit 
    ? Math.floor((now.getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  
  localStorage.setItem("last_dashboard_visit", now.toISOString());
  
  return {
    policyCount: policies.length,
    expiringPoliciesCount: expiringPolicies.length,
    openClaimsCount: openClaims,
    daysSinceLastVisit,
    hasUrgentRenewals: expiringPolicies.length > 0,
    hasOpenClaims: openClaims > 0,
    isNewUser: policies.length === 0
  };
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("onboarding_dismissed");
  });
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);
  
  const userState = useMemo(() => calculateUserState(), []);
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboarding_dismissed", "true");
  };

  const upcomingAppointment = appointments[0];

  return (
    <>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      
      <div className="space-y-6">
        {/* iOS-Style Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-primary/25">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t('dashboard.welcomeTitle', { name: 'User' })}
              </h1>
              <p className="text-white/90 text-base md:text-lg">
                {t('dashboard.welcomeSubtitle')}
              </p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-xs font-medium mb-1">{t('dashboard.totalPolicies')}</p>
              <p className="text-2xl font-bold">{userState.policyCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-xs font-medium mb-1">{t('dashboard.activePolicies')}</p>
              <p className="text-2xl font-bold">{policies.filter(p => p.status === "Active").length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-xs font-medium mb-1">{t('dashboard.expiringSoon')}</p>
              <p className="text-2xl font-bold">{userState.expiringPoliciesCount}</p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex gap-3">
            <Link href="/policies">
              <Button 
                className="bg-white text-primary hover:bg-white/95 shadow-xl shadow-black/20 border-0 font-semibold px-6 h-12 rounded-xl transition-all hover:scale-105 active:scale-95"
                data-testid="button-view-policies"
              >
                <Shield className="h-4 w-4 mr-2" />
                {t('dashboard.viewPolicies')}
              </Button>
            </Link>
            <Link href="/insurance-health">
              <Button 
                variant="outline" 
                className="bg-white/15 border-white/40 text-white hover:bg-white/25 font-semibold px-6 h-12 rounded-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
              >
                {t('dashboard.insuranceHealth')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Agent Recommendation Pill - Only show if not dismissed */}
          {showRecommendation && (
            <AgentRecommendationPill 
              recommendation={t('dashboard.agentRecommendation', { amount: '€300' })}
              onDismiss={() => setShowRecommendation(false)}
            />
          )}

          {/* Priority Layer - Above all widgets */}
          <PriorityLayer />

          {/* Agent Recommendation Pill - Only show if not dismissed */}
          {showRecommendation && (
            <AgentRecommendationPill 
              recommendation={t('dashboard.agentRecommendation', { amount: '€300' })}
              onDismiss={() => setShowRecommendation(false)}
            />
          )}

          {/* Priority Layer - Above all widgets */}
          <PriorityLayer />

          {/* Quick Actions - Outcome-focused Carousel */}
          <section data-testid="quick-actions-section">
            <h2 className="text-xl font-bold mb-4">{t('common.quickActions')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { 
                  id: 'file-claim',
                  titleKey: 'quickActionsNew.fileClaim', 
                  subtitleKey: 'quickActionsNew.successRate',
                  icon: FileText, 
                  color: 'from-blue-500 to-blue-600',
                  href: '/claims' 
                },
                { 
                  id: 'get-savings',
                  titleKey: 'quickActionsNew.getSavings', 
                  subtitleKey: 'quickActionsNew.typicalSavings',
                  icon: DollarSign, 
                  color: 'from-emerald-500 to-emerald-600',
                  href: '/recommendations' 
                },
                { 
                  id: 'chat-maria',
                  titleKey: 'quickActionsNew.chatMaria', 
                  subtitleKey: 'quickActionsNew.onlineNow',
                  icon: MessageCircle, 
                  color: 'from-purple-500 to-purple-600',
                  href: '#',
                  isAgent: true
                },
                { 
                  id: 'understand-gaps',
                  titleKey: 'quickActionsNew.understandGaps', 
                  subtitleKey: 'quickActionsNew.gapsIdentified',
                  icon: Shield, 
                  color: 'from-orange-500 to-orange-600',
                  href: '/gap-analysis' 
                },
                { 
                  id: 'health-checkup',
                  titleKey: 'quickActionsNew.healthCheckup', 
                  subtitleKey: 'quickActionsNew.preventiveCare',
                  icon: Heart, 
                  color: 'from-pink-500 to-pink-600',
                  href: '/health-wellness' 
                },
              ].map((action) => (
                <Link key={action.id} href={action.href} data-testid={`quick-action-${action.id}`}>
                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group border-0 bg-gradient-to-br from-slate-50 to-white hover:scale-[1.02]">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{t(action.titleKey)}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {action.isAgent && <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                      {t(action.subtitleKey)}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Smart Dashboard Widgets Section - Personalized based on user state */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{t('dashboard.insuranceOverview')}</h2>
                {userState.isNewUser && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('dashboard.welcomeMessage')}
                  </p>
                )}
                {userState.daysSinceLastVisit > 30 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('dashboard.welcomeBack', { days: userState.daysSinceLastVisit })}
                  </p>
                )}
              </div>
              {(userState.hasUrgentRenewals || userState.hasOpenClaims) && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {userState.expiringPoliciesCount > 0 
                    ? t('dashboard.urgentRenewals', { count: userState.expiringPoliciesCount })
                    : t('dashboard.openClaims', { count: userState.openClaimsCount })
                  }
                </Badge>
              )}
            </div>
            
            {/* Personalized Widget Grid - Show 3 most relevant widgets based on user state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Priority 1: Show renewals if urgent, otherwise insurance health */}
              {userState.hasUrgentRenewals ? (
                <div className="relative">
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-ping" />
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full" />
                  <RenewalsWidget />
                </div>
              ) : userState.isNewUser ? (
                <InsuranceHealthWidget />
              ) : (
                <InsuranceHealthWidget />
              )}
              
              {/* Priority 2: Show billing if no open claims, otherwise payment reminders (which highlights issues) */}
              {userState.hasOpenClaims ? (
                <div className="relative">
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-amber-500 rounded-full animate-ping" />
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-amber-500 rounded-full" />
                  <PaymentRemindersWidget />
                </div>
              ) : (
                <BillingWidget />
              )}
              
              {/* Priority 3: Show recommendations (AI-powered savings) - Always show for engagement */}
              <RecommendationsWidget />
            </div>
          </section>

          {/* Active Policies Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
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

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">{t('dashboard.upNext')}</h2>
              
              {/* Upcoming Appointment */}
              <Card className="p-5 bg-gradient-to-br from-white to-blue-50/50 border-blue-100">
                <div className="flex items-center gap-3 text-primary mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{t('dashboard.upcomingVisit')}</span>
                </div>
                
                <div className="mb-3">
                  <h3 className="font-bold">{upcomingAppointment.type}</h3>
                  <p className="text-muted-foreground text-sm">{upcomingAppointment.doctor}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm border-t pt-3">
                  <div className="text-foreground font-medium">
                    {upcomingAppointment.date}
                  </div>
                  <Badge variant="secondary">
                    {upcomingAppointment.time}
                  </Badge>
                </div>

                <Link href="/appointments">
                  <Button variant="outline" className="w-full mt-3 text-xs" data-testid="button-reschedule">
                    {t('dashboard.reschedule')}
                  </Button>
                </Link>
              </Card>

              {/* Healthy Streak */}
              <Card className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50">
                <h3 className="font-bold text-emerald-900 mb-2">{t('dashboard.healthyStreak')}</h3>
                <p className="text-sm text-emerald-700 mb-4">{t('dashboard.noClaimsMessage', { months: 12 })}</p>
                <div className="h-2.5 bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-4/5 rounded-full"></div>
                </div>
                <p className="text-xs text-emerald-600 mt-2">{t('dashboard.premiumDecrease')}</p>
              </Card>

              {/* Agent Quick Access (Mobile-friendly) */}
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200/50 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-lg font-bold text-white">
                      M
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{t('dashboard.mariaOnline')}</p>
                    <p className="text-xs text-muted-foreground">{t('dashboard.insuranceSpecialist')}</p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </section>
          </div>

        {/* Agent Sidebar - Desktop Only */}
        <div className="hidden xl:block w-72 flex-shrink-0">
          <div className="sticky top-4">
            <AgentSidebar />
          </div>
        </div>
        </div>
      </div>

      {/* Floating Agent Badge - Mobile/Tablet */}
      <div className="xl:hidden">
        <AgentFloatingBadge onClick={() => setShowAgentPanel(true)} />
      </div>
    </>
  );
}
