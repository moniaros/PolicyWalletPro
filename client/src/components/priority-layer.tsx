import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingDown, 
  Heart, 
  ArrowRight, 
  Sparkles,
  MessageCircle,
  Star,
  CheckCircle
} from "lucide-react";

interface PriorityItem {
  id: string;
  type: 'highest' | 'high' | 'nice_to_have';
  titleKey: string;
  descriptionKey: string;
  impactKey: string;
  cost?: string;
  savings?: string;
  agentRecommended: boolean;
  adoptionRate?: string;
  icon: typeof Shield;
}

const priorityItems: PriorityItem[] = [
  {
    id: '1',
    type: 'highest',
    titleKey: 'priority.disabilityTitle',
    descriptionKey: 'priority.disabilityDesc',
    impactKey: 'priority.disabilityImpact',
    cost: '€15/mo',
    agentRecommended: true,
    icon: Heart,
  },
  {
    id: '2',
    type: 'high',
    titleKey: 'priority.bundleTitle',
    descriptionKey: 'priority.bundleDesc',
    impactKey: 'priority.bundleImpact',
    savings: '15%',
    agentRecommended: true,
    icon: TrendingDown,
  },
  {
    id: '3',
    type: 'nice_to_have',
    titleKey: 'priority.petTitle',
    descriptionKey: 'priority.petDesc',
    impactKey: 'priority.petImpact',
    cost: '€12/mo',
    agentRecommended: false,
    adoptionRate: '8% of users add this',
    icon: Sparkles,
  },
];

export function PriorityLayer() {
  const { t } = useTranslation();
  
  const typeStyles = {
    highest: {
      badge: 'bg-red-100 text-red-700 border-red-200',
      card: 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200',
      accent: 'text-red-600',
      labelKey: 'priority.highestImpact',
    },
    high: {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      card: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
      accent: 'text-amber-600',
      labelKey: 'priority.highPriority',
    },
    nice_to_have: {
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      card: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
      accent: 'text-blue-600',
      labelKey: 'priority.niceToHave',
    },
  };

  return (
    <section className="space-y-4" data-testid="priority-layer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t('priority.yourOpportunities')}</h2>
            <p className="text-sm text-muted-foreground">{t('priority.top3Actions')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {priorityItems.map((item, index) => {
          const styles = typeStyles[item.type];
          const Icon = item.icon;
          
          return (
            <Card key={item.id} className={`${styles.card} border overflow-hidden transition-all hover:shadow-md`} data-testid={`priority-card-${item.id}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${styles.accent} font-bold text-lg`}>
                      {index + 1}
                    </div>
                    <Badge className={`${styles.badge} text-xs font-semibold border`}>
                      {t(styles.labelKey)}
                    </Badge>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-5 w-5 ${styles.accent}`} />
                          <h3 className="font-bold text-lg text-slate-800">{t(item.titleKey)}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{t(item.descriptionKey)}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className={`font-semibold ${styles.accent}`}>{t(item.impactKey)}</span>
                          {item.cost && (
                            <Badge variant="outline" className="font-medium">
                              {item.cost}
                            </Badge>
                          )}
                          {item.savings && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              Save {item.savings}
                            </Badge>
                          )}
                          {item.adoptionRate && (
                            <span className="text-muted-foreground text-xs">{item.adoptionRate}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button className="bg-slate-800 hover:bg-slate-900 text-white" data-testid={`button-priority-${item.id}`}>
                          {item.type === 'nice_to_have' ? t('priority.learnMore') : t('priority.letsAddIt')}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        
                        {item.agentRecommended && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                              M
                            </div>
                            <span>{t('priority.recommendedByMaria')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function AgentHeroSection() {
  const { t } = useTranslation();
  
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-primary/40 overflow-hidden" data-testid="agent-hero-section">
      <div className="absolute right-0 bottom-0 h-[140%] w-1/2 opacity-30 pointer-events-none bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/25">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-sm font-bold">
                M
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium">{t('agent.reviewedPolicies')}</p>
              <p className="text-xs text-white/70">{t('agent.lastCheck')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-400/30 text-emerald-100 border-0 text-sm px-3 py-1">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                {t('heroSection.excellentCoverage')}
              </Badge>
              <span className="text-emerald-300 font-bold text-2xl">92/100</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {t('heroSection.goodNews')}
            </h1>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 text-orange-300 mb-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">{t('heroSection.actionItem')}</span>
            </div>
            <p className="text-white/90 mb-3">
              {t('heroSection.addDisability')} <span className="font-bold text-emerald-300">€15/mo</span> {t('heroSection.toGet')} <span className="font-bold text-emerald-300">€400K</span> {t('heroSection.protection')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold" data-testid="button-discuss-maria">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('heroSection.discussWithMaria')}
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" data-testid="button-add-now">
                {t('heroSection.addNow')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xl font-bold">
                  M
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold">{t('agent.name')}</h3>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300">{t('agent.onlineNow')}</span>
            </div>

            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold" data-testid="button-chat-maria-hero">
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('agent.chatWithMaria')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
