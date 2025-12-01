import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/circular-progress";
import { 
  Shield, 
  ChevronRight, 
  Plus,
  Heart,
  DollarSign,
  Calendar,
  FileText,
  Car,
  Home,
  Dog,
  Briefcase,
  Wallet,
  BookOpen,
  Coins,
  Loader2
} from "lucide-react";
import type { Policy } from "@shared/schema";

const FIRST_TIME_USER_KEY = "policywallet_first_time_completed";

export const markFirstTimeSetupComplete = () => {
  localStorage.setItem(FIRST_TIME_USER_KEY, "true");
};

export const resetFirstTimeSetup = () => {
  localStorage.removeItem(FIRST_TIME_USER_KEY);
};

const calculateCoverageHealth = (policies: Policy[]) => {
  const activePoliciesCount = policies.filter(p => p.status === "active").length;
  
  if (activePoliciesCount === 0) return 20;
  
  let score = 40;
  if (activePoliciesCount > 0) score += 15;
  if (activePoliciesCount >= 2) score += 15;
  if (activePoliciesCount >= 3) score += 15;
  if (activePoliciesCount >= 4) score += 15;
  
  return Math.min(score, 100);
};

const getHealthColor = (score: number) => {
  if (score < 40) return "text-red-600";
  if (score < 70) return "text-amber-600";
  return "text-emerald-600";
};

const getHealthBgColor = (score: number) => {
  if (score < 40) return "from-red-500/20 to-red-500/10";
  if (score < 70) return "from-amber-500/20 to-amber-500/10";
  return "from-emerald-500/20 to-emerald-500/10";
};

const getPolicyIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "auto": return Car;
    case "health": return Heart;
    case "home": return Home;
    case "life": return Briefcase;
    case "pet": return Dog;
    default: return FileText;
  }
};

const getPolicyColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "auto": return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    case "health": return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
    case "home": return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    case "life": return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
    case "pet": return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    default: return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
  }
};

const getPolicyTypeLabel = (type: string, t: any) => {
  const labels: Record<string, string> = {
    health: t("policyTypes.health"),
    auto: t("policyTypes.auto"),
    home: t("policyTypes.home"),
    life: t("policyTypes.life"),
    travel: t("policyTypes.travel"),
    pet: t("policyTypes.pet"),
    business: t("policyTypes.business"),
  };
  return labels[type.toLowerCase()] || type;
};

const formatPremium = (premium: string | number) => {
  const amount = typeof premium === "string" ? parseFloat(premium) : premium;
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

function FirstTimeUserDashboard() {
  const { t } = useTranslation();
  const userBalance = 100;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="bg-slate-900 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">{t("firstTimeDashboard.title")}</h1>
          <Link href="/add-policy">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white border border-slate-600 rounded-full"
              data-testid="button-add-policy-header"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 px-4 pb-4">
        <Link href="/add-policy">
          <div className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer" data-testid="link-up-next">
            <span className="text-slate-400">{t("firstTimeDashboard.upNext")}:</span>
            <span className="font-medium text-white">{t("firstTimeDashboard.addFirstPolicy")}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>
        <div className="flex gap-1 mt-3">
          <div className="h-1 flex-1 bg-orange-500 rounded-full" />
          <div className="h-1 flex-1 bg-orange-500 rounded-full" />
          <div className="h-1 flex-1 bg-slate-700 rounded-full" />
          <div className="h-1 flex-1 bg-slate-700 rounded-full" />
        </div>
      </div>

      <div className="bg-slate-900 px-4 pb-4">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-slate-400" />
              <span className="text-slate-300">{t("firstTimeDashboard.yourBalance")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-lg">{userBalance}</span>
              <Coins className="h-5 w-5 text-amber-400" />
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 bg-background rounded-t-3xl px-4 py-8 space-y-6">
        <Card className="p-6 border border-border/50 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <div className="relative">
                <Wallet className="h-8 w-8 text-orange-500" />
                <Plus className="h-4 w-4 text-orange-500 absolute -top-1 -right-1" />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {t("firstTimeDashboard.addFirstPolicyTitle")}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {t("firstTimeDashboard.addFirstPolicyDescription")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/add-policy">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6" data-testid="button-add-policy-main">
                <Plus className="h-4 w-4 mr-2" />
                {t("firstTimeDashboard.addPolicy")}
              </Button>
            </Link>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium">{t("firstTimeDashboard.earn")}</span>
              <span className="font-bold text-foreground">+300</span>
              <Coins className="h-4 w-4 text-amber-400" />
            </div>
          </div>
        </Card>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t("firstTimeDashboard.learnSomethingNew")}</h2>
          </div>
          <div className="space-y-3">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{t("firstTimeDashboard.tipTitle1")}</p>
                  <p className="text-xs text-muted-foreground">{t("firstTimeDashboard.tipDescription1")}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{t("firstTimeDashboard.tipTitle2")}</p>
                  <p className="text-xs text-muted-foreground">{t("firstTimeDashboard.tipDescription2")}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function RegularDashboard({ policies }: { policies: Policy[] }) {
  const { t } = useTranslation();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.goodMorning");
    if (hour < 18) return t("dashboard.goodAfternoon");
    return t("dashboard.goodEvening");
  };

  const coverageScore = useMemo(() => calculateCoverageHealth(policies), [policies]);
  const activePolicies = policies.filter(p => p.status === "active").length;
  const expiringPolicies = policies.filter(p => {
    const expiry = new Date(p.endDate);
    const inThirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiry < inThirtyDays && p.status === "active";
  }).length;
  
  const monthlyPremium = policies
    .filter(p => p.status === "active")
    .reduce((sum, p) => {
      const premium = typeof p.premium === "string" ? parseFloat(p.premium) : p.premium;
      const frequency = p.premiumFrequency;
      if (frequency === "monthly") return sum + premium;
      if (frequency === "quarterly") return sum + (premium / 3);
      return sum + (premium / 12);
    }, 0);

  const upcomingRenewals = policies
    .filter(p => {
      const expiry = new Date(p.endDate);
      const inSixMonths = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
      return expiry > new Date() && expiry < inSixMonths && p.status === "active";
    })
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getGreeting()}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <Link href="/add-policy">
            <Button size="icon" variant="outline" className="rounded-full" data-testid="button-add-policy-header">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        <div className={`bg-gradient-to-br ${getHealthBgColor(coverageScore)} rounded-3xl p-8 border border-border/50`}>
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t("dashboard.coverageHealth")}</p>
            <div className="relative w-48 h-48">
              <CircularProgress 
                value={coverageScore} 
                max={100}
                strokeWidth={8}
                className={getHealthColor(coverageScore)}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-bold ${getHealthColor(coverageScore)}`}>
                  {coverageScore}
                </div>
                <div className="text-sm text-muted-foreground">/100</div>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {coverageScore >= 70 ? t("dashboard.excellentCoverage") : coverageScore >= 40 ? t("dashboard.goodProgress") : t("dashboard.needsAttention")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {coverageScore >= 70 ? t("dashboard.portfolioBalanced") : t("dashboard.reviewGapsToImprove")}
              </p>
            </div>
            <Link href="/gap-analysis">
              <Button variant="outline" className="mt-2" data-testid="button-review-gaps">
                <Shield className="h-4 w-4 mr-2" />
                {t("dashboard.reviewProtection")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/policies">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid="stat-active-policies">
              <div className="flex items-start justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t("dashboard.activePolicies")}</p>
              <p className="text-2xl font-bold text-foreground">{activePolicies}</p>
            </Card>
          </Link>

          <Link href="/renewals">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid="stat-expiring-soon">
              <div className="flex items-start justify-between mb-2">
                <div className={`h-10 w-10 rounded-lg ${expiringPolicies > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-green-100 dark:bg-green-900/30'} flex items-center justify-center`}>
                  <Calendar className={`h-5 w-5 ${expiringPolicies > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t("dashboard.expiringSoon")}</p>
              <p className="text-2xl font-bold text-foreground">{expiringPolicies}</p>
            </Card>
          </Link>

          <Link href="/billing">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid="stat-monthly-premium">
              <div className="flex items-start justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t("dashboard.monthlyPremium")}</p>
              <p className="text-2xl font-bold text-foreground">{formatPremium(monthlyPremium)}</p>
            </Card>
          </Link>

          <Link href="/gap-analysis">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid="stat-coverage-gaps">
              <div className="flex items-start justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t("dashboard.totalPolicies")}</p>
              <p className="text-2xl font-bold text-foreground">{policies.length}</p>
            </Card>
          </Link>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{t("dashboard.yourPolicies")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{policies.length} {t("dashboard.policiesUnderManagement")}</p>
            </div>
            <Link href="/policies">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-policies">
                {t("dashboard.viewAll")} <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {policies.slice(0, 4).map((policy) => {
              const PolicyIcon = getPolicyIcon(policy.policyType);
              
              return (
                <Link key={policy.id} href={`/policies/${policy.id}`}>
                  <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid={`card-policy-${policy.id}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`h-10 w-10 rounded-lg ${getPolicyColor(policy.policyType)} flex items-center justify-center flex-shrink-0`}>
                          <PolicyIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              {getPolicyTypeLabel(policy.policyType, t)}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={policy.status === "active" ? "text-xs px-2 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "text-xs px-2 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"}
                            >
                              {t(`common.${policy.status}`)}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mt-1 text-sm leading-tight truncate">
                            {policy.policyName || policy.policyNumber}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">{policy.holderName}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-semibold">{formatPremium(policy.premium)}</span>
                      <span className="text-muted-foreground">
                        {t("policies.expires")}: {new Date(policy.endDate).toLocaleDateString("el-GR", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {upcomingRenewals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{t("dashboard.upcomingRenewals")}</h2>
              <Link href="/renewals">
                <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-renewals">
                  {t("dashboard.viewAll")} <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingRenewals.map((policy) => (
                <Link key={policy.id} href="/renewals">
                  <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid={`card-renewal-${policy.id}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{getPolicyTypeLabel(policy.policyType, t)}</p>
                        <p className="text-sm text-muted-foreground">{policy.policyName || policy.policyNumber}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {new Date(policy.endDate).toLocaleDateString("el-GR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.ceil((new Date(policy.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {t("dashboard.days")}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: policies = [], isLoading, error } = useQuery<Policy[]>({
    queryKey: ["/api/policies"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("401")) {
        setLocation("/login");
      }
    }
  }, [error, setLocation]);
  
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }
  
  if (policies.length === 0) {
    return <FirstTimeUserDashboard />;
  }
  
  return <RegularDashboard policies={policies} />;
}
