import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Zap, TrendingUp, Shield, Target, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const recommendationData = [
  {
    id: 1,
    category: "coverage-gap",
    priority: "high",
    titleKey: "addDentalTitle",
    descriptionKey: "addDentalDesc",
    insightKey: "addDentalInsight",
    impactKey: "addDentalImpact",
    savings: "€15",
    actionKey: "addDentalAction",
    provider: "NN Hellas"
  },
  {
    id: 2,
    category: "life-event",
    priority: "high",
    titleKey: "increaseLifeTitle",
    descriptionKey: "increaseLifeDesc",
    insightKey: "increaseLifeInsight",
    impactKey: "increaseLifeImpact",
    savings: "€45",
    actionKey: "increaseLifeAction",
    provider: "Generali"
  },
  {
    id: 3,
    category: "savings-opportunity",
    priority: "medium",
    titleKey: "bundleDiscountTitle",
    descriptionKey: "bundleDiscountDesc",
    insightKey: "bundleDiscountInsight",
    impactKey: "bundleDiscountImpact",
    savings: "€180-270",
    actionKey: "bundleDiscountAction",
    provider: "Generali"
  },
  {
    id: 4,
    category: "market-opportunity",
    priority: "medium",
    titleKey: "petInsuranceTitle",
    descriptionKey: "petInsuranceDesc",
    insightKey: "petInsuranceInsight",
    impactKey: "petInsuranceImpact",
    savings: "€12",
    actionKey: "petInsuranceAction",
    provider: "NN Hellas"
  },
  {
    id: 5,
    category: "renewal-optimization",
    priority: "medium",
    titleKey: "autoRenewalTitle",
    descriptionKey: "autoRenewalDesc",
    insightKey: "autoRenewalInsight",
    impactKey: "autoRenewalImpact",
    savings: "€400-800",
    actionKey: "autoRenewalAction",
    provider: "Generali"
  },
  {
    id: 6,
    category: "wellness",
    priority: "low",
    titleKey: "wellnessTitle",
    descriptionKey: "wellnessDesc",
    insightKey: "wellnessInsight",
    impactKey: "wellnessImpact",
    savings: "€300",
    actionKey: "wellnessAction",
    provider: "NN Hellas"
  }
];

export default function RecommendationsPage() {
  const { t } = useTranslation();
  const [selectedRec, setSelectedRec] = useState<typeof recommendationData[0] | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredRecommendations = recommendationData.filter(rec => {
    if (filter === "all") return true;
    return rec.priority === filter;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "medium": return <Zap className="h-5 w-5 text-amber-500" />;
      default: return <TrendingUp className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "coverage-gap": return t('recommendations_categories.coverageGap');
      case "life-event": return t('recommendations_categories.lifeEvent');
      case "savings-opportunity": return t('recommendations_categories.savingsOpportunity');
      case "market-opportunity": return t('recommendations_categories.marketOpportunity');
      case "renewal-optimization": return t('recommendations_categories.renewalOptimization');
      case "wellness": return t('recommendations_categories.wellness');
      default: return t('common.new');
    }
  };

  const highPriorityCount = recommendationData.filter(r => r.priority === "high").length;
  const mediumPriorityCount = recommendationData.filter(r => r.priority === "medium").length;
  const lowPriorityCount = recommendationData.filter(r => r.priority === "low").length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          {t('recommendations.aiPoweredRecommendations')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('recommendations.personalizedInsights')}
        </p>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium uppercase">{t('recommendations.actionItems')}</p>
                <p className="text-3xl font-bold text-red-900 mt-1">{highPriorityCount}</p>
                <p className="text-xs text-red-700 mt-2">{t('recommendations.highPriorityRecs')}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium uppercase">{t('recommendations.potentialSavings')}</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{t('recommendations.savingsRange')}</p>
                <p className="text-xs text-emerald-700 mt-2">{t('recommendations.ifImplemented')}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-emerald-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium uppercase">{t('recommendations.coverageScore')}</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">72%</p>
                <p className="text-xs text-blue-700 mt-2">{t('recommendations.roomForImprovement')}</p>
              </div>
              <Shield className="h-12 w-12 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Score */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recommendations_pages.priorityScore')}</CardTitle>
          <CardDescription>
            {t('recommendations_pages.basedOnGaps')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t('recommendations_priority.immediateAction')}</span>
              <span className="text-sm font-semibold">{t('recommendations.itemCount', { count: highPriorityCount })}</span>
            </div>
            <Progress value={33} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t('recommendations_priority.within30Days')}</span>
              <span className="text-sm font-semibold">{t('recommendations.itemCount', { count: mediumPriorityCount })}</span>
            </div>
            <Progress value={50} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t('recommendations_priority.reviewExplore')}</span>
              <span className="text-sm font-semibold">{t('recommendations.itemCount', { count: lowPriorityCount })}</span>
            </div>
            <Progress value={17} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setFilter} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="all">{t('common.all')} ({recommendationData.length})</TabsTrigger>
          <TabsTrigger value="high" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {t('recommendations.high')} ({highPriorityCount})
          </TabsTrigger>
          <TabsTrigger value="medium" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {t('recommendations.medium')} ({mediumPriorityCount})
          </TabsTrigger>
          <TabsTrigger value="low" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {t('recommendations.low')} ({lowPriorityCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Left: Main Content */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getPriorityIcon(rec.priority)}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{t(`recommendations_items.${rec.titleKey}`)}</h3>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {t(`priority.${rec.priority}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{t(`recommendations_items.${rec.descriptionKey}`)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 bg-accent/50 p-4 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">{t('recommendations.keyInsight')}</p>
                        <p className="text-sm text-foreground mt-1">{t(`recommendations_items.${rec.insightKey}`)}</p>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-xs text-emerald-600 uppercase font-semibold">{ t("details.impact") }</p>
                        <p className="text-sm font-semibold text-emerald-900 mt-1">{t(`recommendations_items.${rec.impactKey}`)}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 uppercase font-semibold">{t('recommendations.costSavings')}</p>
                        <p className="text-sm font-semibold text-blue-900 mt-1">{rec.savings}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">{ t("details.category") }</p>
                      <Badge variant="secondary" className="mt-1">
                        {getCategoryLabel(rec.category)}
                      </Badge>
                      <p className="text-xs text-muted-foreground uppercase mt-4">{ t("details.provider") }</p>
                      <p className="font-semibold text-sm">{rec.provider}</p>
                    </div>
                    <Button className="w-full mt-6 bg-primary" data-testid={`button-recommendation-${rec.id}`}>
                      {t(`recommendations_items.${rec.actionKey}`)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            {t('recommendations.readyToOptimize')}
          </CardTitle>
          <CardDescription>
            {t('recommendations.specialistsAvailable')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-primary">
            {t('recommendations.scheduleConsultation')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
