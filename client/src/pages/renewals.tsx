import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, CheckCircle2, Clock, DollarSign, Bell, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
    statusKey: "dueSoon",
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
  }
];

export default function RenewalsPage() {
  const { t, i18n } = useTranslation();
  const [selectedRenewal, setSelectedRenewal] = useState<typeof renewalData[0] | null>(null);

  const formatLocalizedDate = (date: Date) => {
    const locale = i18n.language === 'el' ? 'el-GR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const getStatusColor = (statusKey: string) => {
    switch (statusKey) {
      case "dueSoon": 
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "upcoming": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const getStatusIcon = (statusKey: string) => {
    switch (statusKey) {
      case "dueSoon":
      case "urgent":
        return <AlertCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getProgressColor = (daysUntilRenewal: number) => {
    if (daysUntilRenewal <= 7) return "bg-red-500";
    if (daysUntilRenewal <= 30) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getProgressPercentage = (daysUntilRenewal: number) => {
    return Math.min(100, Math.max(0, (daysUntilRenewal / 180) * 100));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{t('renewals.policyRenewals')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('renewals.trackRenewals')}
        </p>
      </div>

      {/* Renewal Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium uppercase">{t('renewals.dueThisMonth')}</p>
                <p className="text-3xl font-bold text-red-900 mt-1">2</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium uppercase">{t('renewals.upcoming90Days')}</p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">1</p>
              </div>
              <Calendar className="h-12 w-12 text-yellow-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium uppercase">{t('renewals.autoRenewEnabled')}</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">3</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-emerald-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('renewals.policyRenewals')}</h2>
          <Badge variant="outline" className="text-sm">
            <Bell className="h-3 w-3 mr-1" />
            {t('notifications.title')}
          </Badge>
        </div>

        <div className="grid gap-4">
          {renewalData.map((renewal) => (
            <Card key={renewal.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left side */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{t(`policyTypes.${renewal.typeKey}`)}</h3>
                        <p className="text-sm text-muted-foreground">{renewal.provider}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{renewal.policyNumber}</p>
                      </div>
                      <Badge className={getStatusColor(renewal.statusKey)}>
                        {getStatusIcon(renewal.statusKey)}
                        <span className="ml-1">{t(`common.${renewal.statusKey}`)}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('renewals.timeUntilRenewal')}</span>
                        <span className="font-bold text-lg">{t('renewals.daysCount', { count: renewal.daysUntilRenewal })}</span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(renewal.daysUntilRenewal)} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">{t('renewals.renewalDate')}</p>
                        <p className="font-semibold text-sm">{formatLocalizedDate(renewal.renewalDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">{t('billing.amount')}</p>
                        <p className="font-semibold text-sm">€{renewal.premiumAmount} ({t(`billing.${renewal.premiumPeriodKey}`)})</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="space-y-4 border-l pl-6 md:border-l">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t('renewals.autoRenewal')}</p>
                          <p className="text-xs text-muted-foreground">{renewal.autoRenew ? t('notificationPreferences.alwaysOn') : t('renewals.manualRenewalRequired')}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t('billing.paymentMethod')}</p>
                          <p className="text-xs text-muted-foreground">{t(`common.${renewal.paymentMethodKey}`)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t('renewals.lastRenewed')}</p>
                          <p className="text-xs text-muted-foreground">{formatLocalizedDate(new Date(renewal.lastRenewed))}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1 text-xs">
                        {t('renewals.viewPolicy')}
                      </Button>
                      <Button className="flex-1 text-xs bg-primary">
                        {t('renewals.renewNow')}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            {t('renewals.proTips')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>• <strong>{t('renewals.autoRenewal')}:</strong> {t('renewals.tipAutoRenewal')}</p>
          <p>• <strong>{t('renewals.reviewBeforeRenewal')}:</strong> {t('renewals.tipReviewBeforeRenewal')}</p>
          <p>• <strong>{t('renewals.compareOptions')}:</strong> {t('renewals.tipCompareOptions')}</p>
          <p>• <strong>{t('billing.updatePaymentMethod')}:</strong> {t('renewals.tipUpdatePayment')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
