import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircularProgress } from "@/components/circular-progress";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
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
  User,
  MapPin,
  Wallet,
  BookOpen,
  Coins
} from "lucide-react";
import { policies } from "@/lib/mockData";

const FIRST_TIME_USER_KEY = "policywallet_first_time_completed";

// Check if user has completed first-time setup
const hasCompletedFirstTimeSetup = (): boolean => {
  return localStorage.getItem(FIRST_TIME_USER_KEY) === "true";
};

// Mark first-time setup as completed
export const markFirstTimeSetupComplete = () => {
  localStorage.setItem(FIRST_TIME_USER_KEY, "true");
};

// Reset first-time setup (for demo purposes)
export const resetFirstTimeSetup = () => {
  localStorage.removeItem(FIRST_TIME_USER_KEY);
};

// Sample data structure
const sampleFamily = [
  { id: 1, name: "Maria", relation: "Spouse", policiesCount: 2, gaps: 1, status: "active" },
  { id: 2, name: "Nikos", relation: "Son", policiesCount: 1, gaps: 0, status: "active" },
];

const calculateCoverageHealth = () => {
  const activePoliciesCount = policies.filter(p => p.status === "Active").length;
  const hasFamily = sampleFamily.length > 0;
  const criticalGaps = 2 as number;
  
  let score = 40;
  if (activePoliciesCount > 0) score += 10;
  if (hasFamily) score += 20;
  if (criticalGaps === 0) score += 20;
  score += 10;
  
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
  switch (type) {
    case "Auto": return Car;
    case "Health": return Heart;
    case "Home & Liability": return Home;
    case "Investment Life": return Briefcase;
    case "Pet Insurance": return Dog;
    default: return FileText;
  }
};

const getPolicyKeyInfo = (policy: any) => {
  const meta = policy.quickViewMetadata;
  if (!meta) return null;

  switch (policy.type) {
    case "Auto":
      return {
        icon: Car,
        label: "License Plate",
        value: meta.licensePlate || policy.vehicleReg || "N/A",
        secondary: meta.carModel || null
      };
    case "Health":
      return {
        icon: User,
        label: "Insured",
        value: meta.insuredPerson || "Primary",
        secondary: meta.hospitalClass ? `Class: ${meta.hospitalClass.split(" ")[0]}` : null
      };
    case "Home & Liability":
      return {
        icon: MapPin,
        label: "Property",
        value: meta.propertyAddress ? meta.propertyAddress.split(",")[0] : "N/A",
        secondary: meta.sumInsured ? `Insured: ${meta.sumInsured}` : null
      };
    case "Investment Life":
      return {
        icon: TrendingUp,
        label: "Fund Value",
        value: meta.fundValue || "N/A",
        secondary: meta.ytdGrowth ? `YTD: ${meta.ytdGrowth}` : null
      };
    case "Pet Insurance":
      return {
        icon: Dog,
        label: "Pet",
        value: meta.petName || "N/A",
        secondary: meta.petType || null
      };
    default:
      return null;
  }
};

// First-Time User Dashboard Component
function FirstTimeUserDashboard() {
  const { t } = useTranslation();
  const userBalance = 100; // Starting balance for new users

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Dark Navy Header */}
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

      {/* Up Next Progress Section */}
      <div className="bg-slate-900 px-4 pb-4">
        <Link href="/add-policy">
          <div className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer" data-testid="link-up-next">
            <span className="text-slate-400">{t("firstTimeDashboard.upNext")}:</span>
            <span className="font-medium text-white">{t("firstTimeDashboard.addFirstPolicy")}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>
        {/* Progress bar segments */}
        <div className="flex gap-1 mt-3">
          <div className="h-1 flex-1 bg-orange-500 rounded-full" />
          <div className="h-1 flex-1 bg-orange-500 rounded-full" />
          <div className="h-1 flex-1 bg-slate-700 rounded-full" />
          <div className="h-1 flex-1 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Balance Card */}
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

      {/* Main Content - White Background */}
      <div className="flex-1 bg-background rounded-t-3xl px-4 py-8 space-y-6">
        {/* Add First Policy Card */}
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

        {/* Learn Something New Section */}
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

// Regular Dashboard for users with policies
function RegularDashboard() {
  const { t } = useTranslation();
  const [greeting] = useState("Good morning");

  const coverageScore = useMemo(() => calculateCoverageHealth(), []);
  const activePolicies = policies.filter(p => p.status === "Active").length;
  const expiringPolicies = policies.filter(p => {
    const expiry = new Date(p.expiry);
    const inThirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiry < inThirtyDays && p.status === "Active";
  }).length;
  const monthlyPremium = policies
    .filter(p => p.status === "Active")
    .reduce((sum, p) => sum + parseFloat(p.premium.replace("€", "")), 0);

  const policyGaps = [
    { type: "Life Insurance", severity: "high", reason: "No coverage detected" },
    { type: "Disability Insurance", severity: "medium", reason: "Limited coverage" },
  ];

  const upcomingRenewals = policies
    .filter(p => {
      const expiry = new Date(p.expiry);
      const inSixMonths = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
      return expiry > new Date() && expiry < inSixMonths;
    })
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header with Greeting */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{greeting}, Yannis</h1>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* HERO: Coverage Health Score */}
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

        {/* QUICK STATS: 4-Up Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Policies */}
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

          {/* Expiring Soon */}
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

          {/* Monthly Premium */}
          <Link href="/billing">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid="stat-monthly-premium">
              <div className="flex items-start justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t("dashboard.monthlyPremium")}</p>
              <p className="text-2xl font-bold text-foreground">€{monthlyPremium.toFixed(0)}</p>
            </Card>
          </Link>

          {/* Coverage Gaps */}
          <Link href="/gap-analysis">
            <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer" data-testid="stat-coverage-gaps">
              <div className="flex items-start justify-between mb-2">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t("dashboard.coverageGapsTitle")}</p>
              <p className="text-2xl font-bold text-foreground">{policyGaps.length}</p>
            </Card>
          </Link>
        </div>

        {/* YOUR POLICIES */}
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
              const PolicyIcon = getPolicyIcon(policy.type);
              const keyInfo = getPolicyKeyInfo(policy);
              
              return (
                <Link key={policy.id} href={`/policies/${policy.id}`}>
                  <Card className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`h-10 w-10 rounded-lg ${policy.color} flex items-center justify-center flex-shrink-0`}>
                          <PolicyIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              {policy.type}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={policy.status === "Active" ? "text-xs px-2 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "text-xs px-2 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"}
                            >
                              {policy.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mt-1 text-sm leading-tight">{policy.productName}</h3>
                          <p className="text-xs text-muted-foreground">{policy.provider}</p>
                        </div>
                      </div>
                    </div>
                    
                    {keyInfo && (
                      <div className="mb-3 p-2.5 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <keyInfo.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground">{keyInfo.label}:</span>
                              <span className="font-semibold text-sm text-foreground truncate">{keyInfo.value}</span>
                            </div>
                            {keyInfo.secondary && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{keyInfo.secondary}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-semibold">{policy.premium}/mo</span>
                      <span className="text-muted-foreground">Exp: {new Date(policy.expiry).toLocaleDateString("el-GR", { month: "short", year: "numeric" })}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* INSIGHTS & GAPS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t("dashboard.coverageGaps")}</h2>
            <Link href="/gap-analysis">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-gap-analysis">
                {t("dashboard.viewAnalysis")} <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {policyGaps.map((gap, idx) => (
              <Alert 
                key={idx} 
                className={gap.severity === "high" ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${gap.severity === "high" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`} />
                  <div className="flex-1">
                    <AlertDescription className="font-semibold text-foreground">{gap.type}</AlertDescription>
                    <AlertDescription className="text-muted-foreground mt-1">{gap.reason}</AlertDescription>
                  </div>
                  <Link href="/gap-analysis">
                    <Button size="sm" variant="outline" className="ml-2" data-testid={`button-fix-gap-${idx}`}>
                      {t("dashboard.fix")}
                    </Button>
                  </Link>
                </div>
              </Alert>
            ))}
          </div>
        </section>

        {/* UPCOMING RENEWALS */}
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
                        <p className="font-semibold text-foreground">{policy.type}</p>
                        <p className="text-sm text-muted-foreground">{policy.provider}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {new Date(policy.expiry).toLocaleDateString("el-GR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.ceil((new Date(policy.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {t("dashboard.days")}
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

// Main Dashboard Component - decides which view to show
export default function Dashboard() {
  const [isFirstTime, setIsFirstTime] = useState(() => !hasCompletedFirstTimeSetup());
  
  // Listen for storage changes (e.g., after adding a policy)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsFirstTime(!hasCompletedFirstTimeSetup());
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  if (isFirstTime) {
    return <FirstTimeUserDashboard />;
  }
  
  return <RegularDashboard />;
}
