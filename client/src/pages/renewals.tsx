import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Bell, 
  ArrowRight, 
  RefreshCw, 
  Shield, 
  TrendingUp,
  ChevronRight,
  Zap,
  CalendarDays,
  Timer,
  Sparkles,
  Car,
  Home,
  Heart,
  Briefcase,
  Euro,
  AlertTriangle,
  Settings,
  PiggyBank,
  BarChart3,
  CalendarClock
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface Renewal {
  id: number;
  policyNumber: string;
  provider: string;
  type: "health" | "auto" | "home" | "life";
  productName: string;
  expiryDate: string;
  premiumAmount: number;
  premiumPeriod: "monthly" | "quarterly" | "annual";
  daysUntilRenewal: number;
  autoRenew: boolean;
  paymentMethod: string;
  lastRenewed: string;
  potentialSavings?: number;
}

const renewalsData: Renewal[] = [
  {
    id: 1,
    policyNumber: "NN-ORANGE-992",
    provider: "NN Hellas",
    type: "health",
    productName: "NN Orange Health Premium",
    expiryDate: "2025-01-15",
    premiumAmount: 145,
    premiumPeriod: "monthly",
    daysUntilRenewal: 14,
    autoRenew: true,
    paymentMethod: "Credit Card",
    lastRenewed: "2024-01-15",
    potentialSavings: 180
  },
  {
    id: 2,
    policyNumber: "GEN-SPEED-882",
    provider: "Generali",
    type: "auto",
    productName: "Generali Speed Auto Plus",
    expiryDate: "2025-01-28",
    premiumAmount: 320,
    premiumPeriod: "quarterly",
    daysUntilRenewal: 27,
    autoRenew: false,
    paymentMethod: "Direct Debit",
    lastRenewed: "2024-06-15"
  },
  {
    id: 3,
    policyNumber: "ERG-HOME-445",
    provider: "Ergo",
    type: "home",
    productName: "Ergo Home Protect",
    expiryDate: "2025-03-20",
    premiumAmount: 180,
    premiumPeriod: "annual",
    daysUntilRenewal: 78,
    autoRenew: true,
    paymentMethod: "Bank Transfer",
    lastRenewed: "2024-03-20"
  },
  {
    id: 4,
    policyNumber: "INT-LIFE-223",
    provider: "Interamerican",
    type: "life",
    productName: "Interamerican Life Shield",
    expiryDate: "2025-06-01",
    premiumAmount: 85,
    premiumPeriod: "monthly",
    daysUntilRenewal: 152,
    autoRenew: true,
    paymentMethod: "Credit Card",
    lastRenewed: "2024-06-01"
  }
];

const typeConfig = {
  health: { icon: Heart, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/40" },
  auto: { icon: Car, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  home: { icon: Home, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  life: { icon: Briefcase, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
};

const getUrgencyConfig = (days: number) => {
  if (days <= 14) return { label: "Urgent", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", border: "border-red-500" };
  if (days <= 30) return { label: "Due Soon", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-500" };
  if (days <= 90) return { label: "Upcoming", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-500" };
  return { label: "On Track", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", border: "border-emerald-500" };
};

export default function RenewalsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "urgent" | "soon" | "upcoming">("all");
  const [renewals, setRenewals] = useState(renewalsData);

  // Calculate stats
  const urgentCount = renewals.filter(r => r.daysUntilRenewal <= 14).length;
  const soonCount = renewals.filter(r => r.daysUntilRenewal <= 30).length;
  const autoRenewCount = renewals.filter(r => r.autoRenew).length;
  const nextRenewal = renewals.reduce((min, r) => r.daysUntilRenewal < min.daysUntilRenewal ? r : min, renewals[0]);
  
  // Calculate annual cost
  const annualCost = renewals.reduce((total, r) => {
    const multiplier = r.premiumPeriod === "monthly" ? 12 : r.premiumPeriod === "quarterly" ? 4 : 1;
    return total + (r.premiumAmount * multiplier);
  }, 0);

  // Calculate potential savings
  const totalSavings = renewals.reduce((sum, r) => sum + (r.potentialSavings || 0), 0);

  // Renewal Health Score
  const renewalHealthScore = Math.round(
    ((autoRenewCount / renewals.length) * 40) +
    ((renewals.filter(r => r.daysUntilRenewal > 30).length / renewals.length) * 40) +
    ((renewals.filter(r => r.paymentMethod !== "").length / renewals.length) * 20)
  );

  const filteredRenewals = renewals.filter(r => {
    if (activeFilter === "all") return true;
    if (activeFilter === "urgent") return r.daysUntilRenewal <= 14;
    if (activeFilter === "soon") return r.daysUntilRenewal <= 30 && r.daysUntilRenewal > 14;
    if (activeFilter === "upcoming") return r.daysUntilRenewal > 30;
    return true;
  }).sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

  const handleToggleAutoRenew = (id: number) => {
    setRenewals(renewals.map(r => 
      r.id === id ? { ...r, autoRenew: !r.autoRenew } : r
    ));
    toast.success("Auto-renewal preference updated");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Renewals</h1>
                <p className="text-xs text-muted-foreground">{renewals.length} policies to manage</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="gap-2" data-testid="button-set-reminders">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Reminders</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Renewal Health Score - Hero Widget */}
        <Card className="p-5 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-5">
            {/* Circular Progress */}
            <div className="relative h-24 w-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted/20"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#renewalGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${renewalHealthScore}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="renewalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary">{renewalHealthScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            
            {/* Health Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">Renewal Health</h2>
                {renewalHealthScore >= 80 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {renewalHealthScore >= 80 
                  ? "Great! Your renewals are well managed." 
                  : renewalHealthScore >= 60 
                    ? "Good progress. Consider enabling auto-renewal."
                    : "Review your renewal settings for better coverage."}
              </p>
              <div className="flex items-center gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-muted-foreground">{autoRenewCount}/{renewals.length} Auto-renew</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-muted-foreground">Next: {nextRenewal.daysUntilRenewal} days</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <Timer className="h-5 w-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{nextRenewal.daysUntilRenewal}</p>
              <p className="text-xs text-muted-foreground">Days Next</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentCount}</p>
              <p className="text-xs text-muted-foreground">Urgent</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{autoRenewCount}</p>
              <p className="text-xs text-muted-foreground">Auto</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <Euro className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">€{(annualCost/1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground">/year</p>
            </div>
          </Card>
        </div>

        {/* Urgent Alert */}
        {urgentCount > 0 && (
          <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-red-800 dark:text-red-200">Action Required</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                  {urgentCount} polic{urgentCount > 1 ? "ies" : "y"} expiring within 14 days. Review and renew to avoid coverage gaps.
                </p>
              </div>
              <Button size="sm" variant="outline" className="flex-shrink-0 border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                Review Now
              </Button>
            </div>
          </Card>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {[
            { key: "all", label: "All", count: renewals.length },
            { key: "urgent", label: "Urgent", count: urgentCount, color: "text-red-600" },
            { key: "soon", label: "Due Soon", count: soonCount - urgentCount, color: "text-amber-600" },
            { key: "upcoming", label: "Upcoming", count: renewals.length - soonCount, color: "text-emerald-600" },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 gap-1.5"
              onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
              data-testid={`filter-${filter.key}`}
            >
              {filter.label}
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Renewal Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Renewal Timeline</h2>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredRenewals.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No renewals in this category</h3>
                <p className="text-sm text-muted-foreground">
                  All caught up! Check other categories for upcoming renewals.
                </p>
              </Card>
            ) : (
              filteredRenewals.map((renewal) => {
                const typeConf = typeConfig[renewal.type];
                const urgencyConf = getUrgencyConfig(renewal.daysUntilRenewal);
                const TypeIcon = typeConf.icon;
                const progressPercent = Math.max(5, Math.min(95, ((180 - renewal.daysUntilRenewal) / 180) * 100));
                
                return (
                  <Card 
                    key={renewal.id} 
                    className={`border overflow-hidden ${renewal.daysUntilRenewal <= 14 ? "border-red-200 dark:border-red-800" : "border-border/50"}`}
                    data-testid={`renewal-${renewal.id}`}
                  >
                    {/* Urgency Bar */}
                    <div className={`h-1 ${
                      renewal.daysUntilRenewal <= 14 ? "bg-red-500" :
                      renewal.daysUntilRenewal <= 30 ? "bg-amber-500" :
                      renewal.daysUntilRenewal <= 90 ? "bg-blue-500" : "bg-emerald-500"
                    }`} />
                    
                    <div className="p-4">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`h-12 w-12 rounded-xl ${typeConf.bg} flex items-center justify-center flex-shrink-0`}>
                            <TypeIcon className={`h-6 w-6 ${typeConf.color}`} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">{renewal.productName}</h3>
                            <p className="text-xs text-muted-foreground">{renewal.provider}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">{renewal.policyNumber}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${urgencyConf.color}`}>
                          {urgencyConf.label}
                        </Badge>
                      </div>
                      
                      {/* Countdown */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Expires {formatDate(renewal.expiryDate)}</span>
                          <span className={`text-lg font-bold ${urgencyConf.color}`}>
                            {renewal.daysUntilRenewal} days
                          </span>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                              renewal.daysUntilRenewal <= 14 ? "bg-red-500" :
                              renewal.daysUntilRenewal <= 30 ? "bg-amber-500" :
                              renewal.daysUntilRenewal <= 90 ? "bg-blue-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Details Row */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-0.5">Premium</p>
                          <p className="font-semibold text-foreground">€{renewal.premiumAmount}</p>
                          <p className="text-xs text-muted-foreground">/{renewal.premiumPeriod}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-0.5">Payment</p>
                          <p className="font-semibold text-foreground text-sm">{renewal.paymentMethod}</p>
                        </div>
                      </div>
                      
                      {/* Auto-renew Toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 mb-4">
                        <div className="flex items-center gap-2">
                          <RefreshCw className={`h-4 w-4 ${renewal.autoRenew ? "text-emerald-500" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">Auto-renewal</span>
                        </div>
                        <Switch
                          checked={renewal.autoRenew}
                          onCheckedChange={() => handleToggleAutoRenew(renewal.id)}
                          data-testid={`toggle-autorenew-${renewal.id}`}
                        />
                      </div>
                      
                      {/* Potential Savings */}
                      {renewal.potentialSavings && (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-4">
                          <div className="flex items-center gap-2">
                            <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">
                              Save up to <strong>€{renewal.potentialSavings}</strong> by comparing quotes
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/policies/${renewal.id}`} className="flex-1">
                          <Button variant="outline" className="w-full" data-testid={`button-view-${renewal.id}`}>
                            View Policy
                          </Button>
                        </Link>
                        <Button className="flex-1 gap-2" data-testid={`button-renew-${renewal.id}`}>
                          Renew Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Savings Opportunity Widget */}
        {totalSavings > 0 && (
          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-100 mb-1">Savings Opportunity</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  You could save up to <strong>€{totalSavings}</strong> by bundling policies or comparing providers.
                </p>
              </div>
              <Button size="sm" className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700">
                Compare Quotes
              </Button>
            </div>
          </Card>
        )}

        {/* Annual Cost Breakdown */}
        <Card className="p-4 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Annual Cost Breakdown</h3>
            </div>
            <span className="text-lg font-bold text-foreground">€{annualCost.toLocaleString()}/year</span>
          </div>
          <div className="space-y-3">
            {renewals.map((renewal) => {
              const typeConf = typeConfig[renewal.type];
              const TypeIcon = typeConf.icon;
              const multiplier = renewal.premiumPeriod === "monthly" ? 12 : renewal.premiumPeriod === "quarterly" ? 4 : 1;
              const yearlyAmount = renewal.premiumAmount * multiplier;
              const percentage = (yearlyAmount / annualCost) * 100;
              
              return (
                <div key={renewal.id} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg ${typeConf.bg} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className={`h-4 w-4 ${typeConf.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{renewal.productName}</span>
                      <span className="text-sm font-medium text-foreground">€{yearlyAmount.toLocaleString()}</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pro Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Renewal Tips</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-foreground">Enable Auto-Renew</p>
                  <p className="text-xs text-muted-foreground">Never miss a renewal</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-foreground">Review Coverage</p>
                  <p className="text-xs text-muted-foreground">Before each renewal</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
