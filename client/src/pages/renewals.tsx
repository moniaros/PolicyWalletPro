import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Info,
  CalendarDays,
  Timer,
  Sparkles,
  Car,
  Home,
  Heart,
  Plane
} from "lucide-react";

const renewalData = [
  {
    id: 1,
    policyNumber: "NN-ORANGE-992",
    provider: "NN Hellas",
    typeKey: "health",
    currentExpiry: new Date(2025, 11, 31),
    renewalDate: new Date(2025, 11, 31),
    premiumAmount: 145,
    premiumPeriodKey: "monthly",
    statusKey: "dueSoon",
    daysUntilRenewal: 35,
    lastRenewed: "2024-12-31",
    autoRenew: true,
    paymentMethodKey: "creditCard"
  },
  {
    id: 2,
    policyNumber: "GEN-SPEED-882",
    provider: "Generali",
    typeKey: "auto",
    currentExpiry: new Date(2025, 11, 15),
    renewalDate: new Date(2025, 11, 15),
    premiumAmount: 320,
    premiumPeriodKey: "semiAnnual",
    statusKey: "urgent",
    daysUntilRenewal: 18,
    lastRenewed: "2024-06-15",
    autoRenew: true,
    paymentMethodKey: "directDebit"
  },
  {
    id: 3,
    policyNumber: "ERG-HOME-445",
    provider: "Ergo",
    typeKey: "home",
    currentExpiry: new Date(2026, 2, 20),
    renewalDate: new Date(2026, 2, 20),
    premiumAmount: 180,
    premiumPeriodKey: "annual",
    statusKey: "upcoming",
    daysUntilRenewal: 115,
    lastRenewed: "2024-03-20",
    autoRenew: true,
    paymentMethodKey: "creditCard"
  },
  {
    id: 4,
    policyNumber: "ETH-LIFE-223",
    provider: "Ethniki",
    typeKey: "life",
    currentExpiry: new Date(2026, 5, 1),
    renewalDate: new Date(2026, 5, 1),
    premiumAmount: 85,
    premiumPeriodKey: "monthly",
    statusKey: "upcoming",
    daysUntilRenewal: 185,
    lastRenewed: "2024-06-01",
    autoRenew: false,
    paymentMethodKey: "bankTransfer"
  }
];

export default function RenewalsPage() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<"all" | "urgent" | "thisMonth" | "upcoming">("all");

  const formatLocalizedDate = (date: Date) => {
    const locale = i18n.language === 'el' ? 'el-GR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatShortDate = (date: Date) => {
    const locale = i18n.language === 'el' ? 'el-GR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    const locale = i18n.language === 'el' ? 'el-GR' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (statusKey: string) => {
    switch (statusKey) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "dueSoon": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "upcoming": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      default: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    }
  };

  const getStatusIcon = (statusKey: string) => {
    switch (statusKey) {
      case "urgent":
        return <AlertCircle className="h-4 w-4" aria-hidden="true" />;
      case "dueSoon":
        return <Clock className="h-4 w-4" aria-hidden="true" />;
      case "upcoming":
        return <CalendarDays className="h-4 w-4" aria-hidden="true" />;
      default:
        return <CheckCircle2 className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getPolicyIcon = (typeKey: string) => {
    switch (typeKey) {
      case "health": return <Heart className="h-5 w-5" aria-hidden="true" />;
      case "auto": return <Car className="h-5 w-5" aria-hidden="true" />;
      case "home": return <Home className="h-5 w-5" aria-hidden="true" />;
      case "travel": return <Plane className="h-5 w-5" aria-hidden="true" />;
      default: return <Shield className="h-5 w-5" aria-hidden="true" />;
    }
  };

  const getProgressColor = (daysUntilRenewal: number) => {
    if (daysUntilRenewal <= 14) return "bg-red-500 dark:bg-red-600";
    if (daysUntilRenewal <= 30) return "bg-amber-500 dark:bg-amber-600";
    return "bg-emerald-500 dark:bg-emerald-600";
  };

  const getProgressPercentage = (daysUntilRenewal: number) => {
    const maxDays = 180;
    return Math.min(100, Math.max(5, ((maxDays - daysUntilRenewal) / maxDays) * 100));
  };

  const getStatusLabel = (daysUntilRenewal: number) => {
    if (daysUntilRenewal <= 14) return t('renewals.urgent');
    if (daysUntilRenewal <= 30) return t('renewals.dueThisMonth');
    return t('renewals.upcoming90Days');
  };

  const filteredRenewals = renewalData.filter(r => {
    if (activeFilter === "all") return true;
    if (activeFilter === "urgent") return r.daysUntilRenewal <= 14;
    if (activeFilter === "thisMonth") return r.daysUntilRenewal <= 30;
    if (activeFilter === "upcoming") return r.daysUntilRenewal > 30;
    return true;
  });

  const urgentCount = renewalData.filter(r => r.daysUntilRenewal <= 14).length;
  const thisMonthCount = renewalData.filter(r => r.daysUntilRenewal <= 30).length;
  const autoRenewCount = renewalData.filter(r => r.autoRenew).length;
  const totalPremiums = renewalData.reduce((sum, r) => sum + r.premiumAmount, 0);
  const nextRenewal = renewalData.reduce((min, r) => r.daysUntilRenewal < min.daysUntilRenewal ? r : min, renewalData[0]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            <span className="sr-only">{t('renewals.policyRenewals')}</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('renewals.policyRenewals')}</h1>
            <p className="text-sm text-muted-foreground">{t('renewals.trackRenewals')}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Next Renewal */}
        <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-400" data-testid="card-next-renewal">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Timer className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span className="sr-only">{t('renewals.nextRenewal')}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('renewals.nextRenewal')}</p>
                <p className="text-xl font-bold">{t('renewals.daysCount', { count: nextRenewal.daysUntilRenewal })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due This Month */}
        <Card className="border-l-4 border-l-red-500 dark:border-l-red-400" data-testid="card-due-this-month">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                <span className="sr-only">{t('renewals.dueThisMonth')}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('renewals.dueThisMonth')}</p>
                <p className="text-xl font-bold">{thisMonthCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Renew */}
        <Card className="border-l-4 border-l-emerald-500 dark:border-l-emerald-400" data-testid="card-auto-renew">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="sr-only">{t('renewals.autoRenewEnabled')}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('renewals.autoRenewEnabled')}</p>
                <p className="text-xl font-bold">{autoRenewCount}/{renewalData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Premiums */}
        <Card className="border-l-4 border-l-primary" data-testid="card-total-premiums">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="sr-only">{t('renewals.totalPremiums')}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('renewals.totalPremiums')}</p>
                <p className="text-xl font-bold">{formatCurrency(totalPremiums)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: t('renewals.allPolicies'), count: renewalData.length },
          { key: "urgent", label: t('renewals.urgent'), count: urgentCount },
          { key: "thisMonth", label: t('renewals.thisMonth'), count: thisMonthCount },
          { key: "upcoming", label: t('renewals.next3Months'), count: renewalData.length - thisMonthCount },
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={activeFilter === key ? "default" : "outline"}
            className="min-h-[44px] gap-2"
            onClick={() => setActiveFilter(key as typeof activeFilter)}
            data-testid={`button-filter-${key}`}
          >
            {label}
            <Badge variant="secondary" className={`text-xs ${activeFilter === key ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}>
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Renewals Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            {t('renewals.renewalTimeline')}
          </h2>
          <Button variant="ghost" className="text-sm gap-1 min-h-[44px]" data-testid="button-set-reminder">
            <Bell className="h-4 w-4" aria-hidden="true" />
            {t('renewals.setReminder')}
          </Button>
        </div>

        <div className="space-y-4">
          {filteredRenewals.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-1">{t('renewals.noPoliciesDue')}</h3>
                <p className="text-sm text-muted-foreground">{t('renewals.allCaughtUp')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredRenewals.map((renewal) => (
              <Card 
                key={renewal.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
                data-testid={`card-renewal-${renewal.id}`}
              >
                {/* Urgency Bar */}
                <div className={`h-1 ${
                  renewal.daysUntilRenewal <= 14 ? 'bg-red-500 dark:bg-red-600' : 
                  renewal.daysUntilRenewal <= 30 ? 'bg-amber-500 dark:bg-amber-600' : 
                  'bg-emerald-500 dark:bg-emerald-600'
                }`} aria-hidden="true" />
                
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column - Policy Info */}
                    <div className="flex-1 p-4 md:p-5 space-y-4">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            renewal.typeKey === 'health' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                            renewal.typeKey === 'auto' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                            renewal.typeKey === 'home' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {getPolicyIcon(renewal.typeKey)}
                            <span className="sr-only">{t(`policyTypes.${renewal.typeKey}`)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{t(`policyTypes.${renewal.typeKey}`)}</h3>
                            <p className="text-sm text-muted-foreground">{renewal.provider}</p>
                            <p className="text-xs text-muted-foreground font-mono">{renewal.policyNumber}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(renewal.statusKey)} flex items-center gap-1`}>
                          {getStatusIcon(renewal.statusKey)}
                          <span>{getStatusLabel(renewal.daysUntilRenewal)}</span>
                        </Badge>
                      </div>

                      {/* Countdown */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('renewals.renewsIn')}</span>
                          <span className={`text-2xl font-bold ${
                            renewal.daysUntilRenewal <= 14 ? 'text-red-600 dark:text-red-400' :
                            renewal.daysUntilRenewal <= 30 ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {t('renewals.daysCount', { count: renewal.daysUntilRenewal })}
                          </span>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={getProgressPercentage(renewal.daysUntilRenewal)} aria-valuemin={0} aria-valuemax={100}>
                          <div 
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getProgressColor(renewal.daysUntilRenewal)}`}
                            style={{ width: `${getProgressPercentage(renewal.daysUntilRenewal)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('renewals.expiresOn')} {formatLocalizedDate(renewal.renewalDate)}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">{t('renewals.premium')}</p>
                          <p className="font-semibold">{formatCurrency(renewal.premiumAmount)}</p>
                          <p className="text-xs text-muted-foreground">/{t(`billing.${renewal.premiumPeriodKey}`)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 dark:bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">{t('renewals.lastRenewed')}</p>
                          <p className="font-semibold">{formatShortDate(new Date(renewal.lastRenewed))}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Status & Actions */}
                    <div className="md:w-64 p-4 md:p-5 bg-muted/30 dark:bg-muted/20 md:border-l border-border flex flex-col justify-between gap-4">
                      {/* Status Items */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {renewal.autoRenew ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                              <span className="text-sm text-emerald-700 dark:text-emerald-400">{t('renewals.autoRenewOn')}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
                              <span className="text-sm text-amber-700 dark:text-amber-400">{t('renewals.autoRenewOff')}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-muted-foreground">{t(`common.${renewal.paymentMethodKey}`)}</span>
                        </div>
                        {renewal.daysUntilRenewal <= 30 && (
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                            <span className="text-sm text-primary font-medium">{t('renewals.actionRequired')}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-between min-h-[44px]"
                          data-testid={`button-view-policy-${renewal.id}`}
                        >
                          {t('renewals.viewPolicy')}
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button 
                          className="w-full justify-between min-h-[44px] bg-gradient-to-r from-primary to-primary/90"
                          data-testid={`button-renew-${renewal.id}`}
                        >
                          {t('renewals.renewNow')}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Savings Opportunity Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 border-primary/20 overflow-hidden" data-testid="card-savings-opportunity">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
              <span className="sr-only">{t('renewals.savingsOpportunity')}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {t('renewals.savingsOpportunity')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('renewals.bundleSaveAmount', { amount: 450 })}
              </p>
            </div>
            <Button className="min-h-[44px] gap-2" data-testid="button-compare-quotes">
              {t('renewals.compareQuotes')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips Section */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30" data-testid="card-pro-tips">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            {t('renewals.proTips')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: RefreshCw, title: t('renewals.autoRenewal'), desc: t('renewals.tipAutoRenewal') },
              { icon: Shield, title: t('renewals.reviewBeforeRenewal'), desc: t('renewals.tipReviewBeforeRenewal') },
              { icon: TrendingUp, title: t('renewals.compareOptions'), desc: t('renewals.tipCompareOptions') },
              { icon: CreditCard, title: t('billing.updatePaymentMethod'), desc: t('renewals.tipUpdatePayment') },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/60 dark:bg-background/40">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
