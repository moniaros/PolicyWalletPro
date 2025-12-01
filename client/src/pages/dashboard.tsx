import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
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
  Users,
  FileText,
  MessageCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Car,
  Home,
  Dog,
  Briefcase,
  User,
  MapPin
} from "lucide-react";
import { policies } from "@/lib/mockData";

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

export default function Dashboard() {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState("Good morning");

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">{greeting}, Yannis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* HERO: Coverage Health Score */}
        <div className={`bg-gradient-to-br ${getHealthBgColor(coverageScore)} rounded-3xl p-8 border border-border/50`}>
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Coverage Health</p>
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
                {coverageScore >= 70 ? "Excellent coverage" : coverageScore >= 40 ? "Good progress" : "Needs attention"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {coverageScore >= 70 ? "Your insurance portfolio is well-balanced" : "Review gaps to improve your coverage"}
              </p>
            </div>
          </div>
        </div>

        {/* QUICK STATS: 4-Up Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Policies */}
          <Card className="p-4 border border-border/50">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Active Policies</p>
            <p className="text-2xl font-bold text-foreground">{activePolicies}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              All active
            </p>
          </Card>

          {/* Expiring Soon */}
          <Card className="p-4 border border-border/50">
            <div className="flex items-start justify-between mb-2">
              <div className={`h-10 w-10 rounded-lg ${expiringPolicies > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-green-100 dark:bg-green-900/30'} flex items-center justify-center`}>
                <Calendar className={`h-5 w-5 ${expiringPolicies > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Expiring Soon</p>
            <p className="text-2xl font-bold text-foreground">{expiringPolicies}</p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${expiringPolicies > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              <Calendar className="h-3 w-3" />
              {expiringPolicies > 0 ? "Review dates" : "None"}
            </p>
          </Card>

          {/* Monthly Premium */}
          <Card className="p-4 border border-border/50">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Monthly Premium</p>
            <p className="text-2xl font-bold text-foreground">€{monthlyPremium.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">/month</p>
          </Card>

          {/* Coverage Gaps */}
          <Card className="p-4 border border-border/50">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Coverage Gaps</p>
            <p className="text-2xl font-bold text-foreground">{policyGaps.length}</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Action needed
            </p>
          </Card>
        </div>

        {/* YOUR POLICIES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Policies</h2>
              <p className="text-sm text-muted-foreground mt-1">{policies.length} policies under management</p>
            </div>
            <Link href="/policies">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-policies">
                View All <ChevronRight className="h-4 w-4" />
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
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg ${policy.color} flex items-center justify-center flex-shrink-0`}>
                          <PolicyIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{policy.type}</h3>
                          <p className="text-sm text-muted-foreground">{policy.provider}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={policy.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"}
                      >
                        {policy.status}
                      </Badge>
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

        {/* FAMILY COVERAGE */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Family Coverage</h2>
              <p className="text-sm text-muted-foreground mt-1">{sampleFamily.length} family members tracked</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {sampleFamily.map((member) => (
              <Card key={member.id} className="p-4 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.relation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{member.policiesCount} policies</p>
                    {member.gaps > 0 && (
                      <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                        {member.gaps} gap
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* INSIGHTS & GAPS */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Coverage Gaps</h2>
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
                  <Button size="sm" variant="outline" className="ml-2">
                    Fix
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        </section>

        {/* UPCOMING RENEWALS */}
        {upcomingRenewals.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Renewals</h2>
            <div className="space-y-3">
              {upcomingRenewals.map((policy) => (
                <Card key={policy.id} className="p-4 border border-border/50 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{policy.type}</p>
                      <p className="text-sm text-muted-foreground">{policy.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {new Date(policy.expiry).toLocaleDateString("el-GR")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.ceil((new Date(policy.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
