import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { AlertCircle, TrendingUp, Zap, Calendar, DollarSign, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function RenewalsWidget() {
  const { t } = useTranslation();
  const upcomingRenewals = [
    { id: 1, provider: "NN Hellas", daysUntil: 35, premium: "€145" },
    { id: 2, provider: "Generali", daysUntil: 18, premium: "€160" },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-card hover:shadow-md transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          {t('renewals.policyRenewals')}
        </CardTitle>
        <CardDescription>2 policies renewing soon</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingRenewals.map((renewal) => (
          <div key={renewal.id} className="flex items-center justify-between p-3.5 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
            <div>
              <p className="font-semibold text-sm text-foreground">{renewal.provider}</p>
              <p className="text-xs text-muted-foreground font-medium">{renewal.daysUntil} days until renewal</p>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-0 font-semibold">{renewal.premium}</Badge>
          </div>
        ))}
        <Link href="/renewals">
          <Button className="w-full text-sm font-semibold bg-primary hover:bg-primary/90">
            {t('renewals.policyRenewals')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function BillingWidget() {
  const { t } = useTranslation();
  
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-card hover:shadow-md transition-all">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="h-8 w-8 rounded-lg bg-emerald-200/50 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          {t('billing.title')}
        </CardTitle>
        <CardDescription>This month's overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Average Monthly</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">€87.08</span>
          </div>
          <Progress value={60} className="h-2.5 bg-emerald-100 dark:bg-emerald-900/30" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-100/50 to-emerald-50/50 dark:from-emerald-900/30 dark:to-emerald-950/20 p-3 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Paid YTD</p>
            <p className="font-bold text-emerald-700 dark:text-emerald-300 text-lg mt-1">€1,045</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 dark:from-blue-900/30 dark:to-blue-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Due Next</p>
            <p className="font-bold text-blue-700 dark:text-blue-300 text-lg mt-1">€145</p>
          </div>
        </div>
        <Link href="/billing">
          <Button className="w-full text-sm font-semibold bg-emerald-600 hover:bg-emerald-700">
            {t('billing.title')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function RecommendationsWidget() {
  const { t } = useTranslation();
  
  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-1 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          {t('recommendations.aiPoweredRecommendations')}
        </CardTitle>
        <CardDescription>2 action items awaiting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('recommendations.actionItems')}</span>
            <Badge className="bg-red-100 text-red-800">2</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('recommendations.potentialSavings')}</span>
            <span className="font-bold">€495-1,062/yr</span>
          </div>
        </div>
        <Progress value={33} className="h-2" />
        <Link href="/recommendations">
          <Button className="w-full bg-primary text-xs" size="sm">
            {t('recommendations.title')}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function InsuranceHealthWidget() {
  const { t } = useTranslation();
  
  const categories = [
    { label: "Health", score: 98, status: "Excellent" },
    { label: "Auto", score: 85, status: "Good" },
    { label: "Home", score: 72, status: "Fair" },
  ];

  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Coverage Health by Type
        </CardTitle>
        <CardDescription>{ t("details.policyCompletenessScores") }</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{cat.label}</span>
              <span className="text-xs font-bold text-muted-foreground">{cat.score}%</span>
            </div>
            <Progress value={cat.score} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PaymentRemindersWidget() {
  const { t } = useTranslation();
  
  const upcoming = [
    { date: "Dec 1", amount: "€145", provider: "NN Hellas", status: "Scheduled" },
    { date: "Dec 15", amount: "€160", provider: "Generali", status: "Scheduled" },
  ];

  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          {t('billing.title')}
        </CardTitle>
        <CardDescription>{ t('policy.next2DueDates') }</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcoming.map((payment, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-accent/50 rounded text-xs">
            <div>
              <p className="font-medium">{payment.date}</p>
              <p className="text-muted-foreground">{payment.provider}</p>
            </div>
            <span className="font-bold">{payment.amount}</span>
          </div>
        ))}
        <Link href="/billing">
          <Button variant="outline" className="w-full text-xs mt-2" size="sm">
            {t('billing.title')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
