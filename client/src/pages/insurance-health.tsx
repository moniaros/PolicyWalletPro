import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { policies } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  FileText,
  ChevronRight
} from "lucide-react";
import { getExpiryStatus } from "@/lib/policy-utils";

export default function InsuranceHealthPage() {
  const { t } = useTranslation();
  
  // Calculate insurance health score (0-100)
  const healthScore = useMemo(() => {
    const totalPolicies = policies.length;
    const activePolicies = policies.filter(p => p.status === "Active").length;
    const expiringSoon = policies.filter(p => {
      const status = getExpiryStatus(p.expiry);
      return status === "critical" || status === "warning";
    }).length;
    const hasGaps = policies.some(p => p.details?.gaps?.length > 0);
    
    let score = 70; // Base score
    score += (activePolicies / totalPolicies) * 20; // Active policies boost
    score -= expiringSoon * 5; // Penalty for expiring policies
    score -= hasGaps ? 10 : 0; // Penalty for coverage gaps
    
    return Math.min(100, Math.max(30, Math.round(score)));
  }, []);

  // Get renewal timeline (next 12 months)
  const renewalTimeline = useMemo(() => {
    const now = new Date();
    const next12Months = policies
      .filter(p => p.status === "Active")
      .map(p => ({
        policy: p,
        expiryDate: new Date(p.expiry),
        daysUntil: Math.floor((new Date(p.expiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }))
      .filter(p => p.daysUntil >= 0 && p.daysUntil <= 365)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 6);
    
    return next12Months;
  }, []);

  // Calculate total premium
  const totalPremium = useMemo(() => {
    return policies
      .filter(p => p.status === "Active")
      .reduce((sum, p) => {
        const premium = parseFloat(p.premium.replace(/[€,]/g, '')) || 0;
        return sum + premium;
      }, 0);
  }, []);

  // Get coverage gaps
  const coverageGaps = useMemo(() => {
    const gaps: Array<{ type: string; priority: string; impact: string; recommendation: string }> = [];
    
    policies.forEach(policy => {
      if (policy.details?.gaps) {
        policy.details.gaps.forEach((gap: any) => {
          gaps.push({
            type: policy.type,
            priority: gap.priority || "medium",
            impact: gap.impact || "€0",
            recommendation: gap.recommendation || ""
          });
        });
      }
    });
    
    return gaps.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
    });
  }, []);

  // Get premium optimization opportunities
  const optimizationOpportunities = useMemo(() => {
    const opportunities = [];
    
    // Multi-policy discount opportunity
    if (policies.filter(p => p.status === "Active").length >= 2) {
      const potentialSavings = totalPremium * 0.15; // 15% bundle discount
      opportunities.push({
        type: "bundle",
        title: t('insuranceHealth.bundleDiscount'),
        description: t('insuranceHealth.bundleDescription'),
        savings: `€${Math.round(potentialSavings)}`,
        action: t('insuranceHealth.learnMore')
      });
    }
    
    // Overinsurance detection
    const autoPolicies = policies.filter(p => p.type === "Auto" && p.status === "Active");
    if (autoPolicies.length > 0) {
      opportunities.push({
        type: "overinsurance",
        title: t('insuranceHealth.overinsuranceCheck'),
        description: t('insuranceHealth.overinsuranceDescription'),
        savings: "€200-400",
        action: t('insuranceHealth.reviewNow')
      });
    }
    
    return opportunities;
  }, [totalPremium, t]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return t('insuranceHealth.excellent');
    if (score >= 60) return t('insuranceHealth.good');
    return t('insuranceHealth.needsAttention');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {t('insuranceHealth.title')}
        </h1>
        <p className="text-muted-foreground text-base">
          {t('insuranceHealth.subtitle')}
        </p>
      </div>

      {/* Insurance Health Score */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  {t('insuranceHealth.healthScore')}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t('insuranceHealth.scoreDescription')}
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                      className={getHealthScoreColor(healthScore)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getHealthScoreColor(healthScore)}`}>
                      {healthScore}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={`text-lg font-semibold ${getHealthScoreColor(healthScore)} mb-1`}>
                    {getHealthScoreLabel(healthScore)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('insuranceHealth.scoreOutOf', { score: healthScore })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Heatmap & Renewal Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('insuranceHealth.coverageOverview')}
            </CardTitle>
            <CardDescription>
              {t('insuranceHealth.coverageDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {policies.filter(p => p.status === "Active").map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <policy.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{policy.type}</p>
                    <p className="text-xs text-muted-foreground">{policy.provider}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t('common.active')}
                </Badge>
              </div>
            ))}
            <Link href="/policies">
              <Button variant="outline" className="w-full">
                {t('insuranceHealth.viewAllPolicies')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Renewal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('insuranceHealth.renewalTimeline')}
            </CardTitle>
            <CardDescription>
              {t('insuranceHealth.renewalDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {renewalTimeline.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t('insuranceHealth.noUpcomingRenewals')}</p>
              </div>
            ) : (
              renewalTimeline.map((item, idx) => {
                const status = getExpiryStatus(item.policy.expiry);
                const isUrgent = status === "critical";
                
                return (
                  <div
                    key={item.policy.id}
                    className={`p-3 rounded-lg border ${
                      isUrgent 
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800" 
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <item.policy.icon className="h-4 w-4 text-muted-foreground" />
                        <p className="font-semibold text-sm">{item.policy.type}</p>
                      </div>
                      {isUrgent && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {t('common.urgent')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {item.daysUntil <= 30 
                          ? t('insuranceHealth.daysRemaining', { days: item.daysUntil })
                          : t('insuranceHealth.monthsRemaining', { months: Math.round(item.daysUntil / 30) })
                        }
                      </span>
                      <span className="font-medium">
                        {new Date(item.policy.expiry).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <Link href="/renewals">
              <Button variant="outline" className="w-full">
                {t('insuranceHealth.manageRenewals')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Premium Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('insuranceHealth.premiumOptimization')}
          </CardTitle>
          <CardDescription>
            {t('insuranceHealth.optimizationDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{t('insuranceHealth.totalAnnualPremium')}</span>
              <span className="text-2xl font-bold text-foreground">€{totalPremium.toLocaleString()}</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {t('insuranceHealth.premiumBreakdown')}
            </p>
          </div>
          
          {optimizationOpportunities.length > 0 ? (
            <div className="space-y-3">
              {optimizationOpportunities.map((opp, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="font-semibold text-sm">{opp.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{opp.description}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      {opp.savings}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    {opp.action}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('insuranceHealth.noOptimizations')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coverage Gaps */}
      {coverageGaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {t('insuranceHealth.coverageGaps')}
            </CardTitle>
            <CardDescription>
              {t('insuranceHealth.gapsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coverageGaps.slice(0, 5).map((gap, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    gap.priority === "high"
                      ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      : gap.priority === "medium"
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                      : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={gap.priority === "high" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {gap.priority === "high" ? t('common.urgent') : gap.priority === "medium" ? t('insuranceHealth.medium') : t('insuranceHealth.low')}
                      </Badge>
                      <span className="font-semibold text-sm">{gap.type}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{gap.impact}</span>
                  </div>
                  {gap.recommendation && (
                    <p className="text-xs text-muted-foreground">{gap.recommendation}</p>
                  )}
                </div>
              ))}
            </div>
            <Link href="/gap-analysis" className="mt-4 block">
              <Button variant="outline" className="w-full">
                {t('insuranceHealth.viewAllGaps')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/recommendations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t('insuranceHealth.getRecommendations')}</p>
                  <p className="text-xs text-muted-foreground">{t('insuranceHealth.aiPowered')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/renewals">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t('insuranceHealth.manageRenewals')}</p>
                  <p className="text-xs text-muted-foreground">{t('insuranceHealth.renewalActions')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/documents">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t('insuranceHealth.viewDocuments')}</p>
                  <p className="text-xs text-muted-foreground">{t('insuranceHealth.allPolicies')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}


