import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Zap,
  TrendingUp,
  Shield,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Lightbulb,
  PiggyBank,
  Heart,
  Home,
  Car,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  MessageSquare,
  Brain,
  Percent,
  Gift,
  Users,
  Calendar,
  ThumbsUp,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Recommendation {
  id: number;
  category: "coverage-gap" | "savings" | "life-event" | "wellness" | "optimization";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  insight: string;
  impact: string;
  savings: string;
  savingsValue: number;
  action: string;
  provider: string;
  policyType?: "health" | "auto" | "home" | "life";
  timeToImplement: string;
  dismissed?: boolean;
  completed?: boolean;
}

const recommendationsData: Recommendation[] = [
  {
    id: 1,
    category: "coverage-gap",
    priority: "high",
    title: "Add Dental Coverage",
    description: "Your health plan lacks dental coverage. 73% of users with similar profiles have dental insurance.",
    insight: "Average Greek family spends €400/year on dental without coverage",
    impact: "Protect against unexpected dental costs",
    savings: "€15/month",
    savingsValue: 180,
    action: "Get Quote",
    provider: "NN Hellas",
    policyType: "health",
    timeToImplement: "5 min"
  },
  {
    id: 2,
    category: "life-event",
    priority: "high",
    title: "Increase Life Coverage",
    description: "Based on your family size, your current life coverage may be insufficient.",
    insight: "Recommended coverage: 10x annual income for families with children",
    impact: "Better financial protection for your family",
    savings: "€45/month",
    savingsValue: 540,
    action: "Review Options",
    provider: "Interamerican",
    policyType: "life",
    timeToImplement: "10 min"
  },
  {
    id: 3,
    category: "savings",
    priority: "medium",
    title: "Bundle for 15% Discount",
    description: "Combining your auto and home policies with one provider saves significantly.",
    insight: "Multi-policy holders save an average of €180-270/year",
    impact: "Same coverage, lower cost",
    savings: "€180-270/year",
    savingsValue: 225,
    action: "Compare Bundles",
    provider: "Generali",
    timeToImplement: "15 min"
  },
  {
    id: 4,
    category: "optimization",
    priority: "medium",
    title: "Switch to Annual Billing",
    description: "Paying annually instead of monthly saves 5-10% on premiums.",
    insight: "You could save €120/year across all policies",
    impact: "Immediate cost reduction",
    savings: "€120/year",
    savingsValue: 120,
    action: "Update Billing",
    provider: "All Policies",
    timeToImplement: "3 min"
  },
  {
    id: 5,
    category: "wellness",
    priority: "low",
    title: "Wellness Program Discount",
    description: "Complete health checkups to earn premium discounts on your health policy.",
    insight: "Active wellness participants get up to 10% discount",
    impact: "Lower premiums + better health",
    savings: "Up to €300/year",
    savingsValue: 300,
    action: "Join Program",
    provider: "NN Hellas",
    policyType: "health",
    timeToImplement: "Ongoing"
  },
  {
    id: 6,
    category: "coverage-gap",
    priority: "low",
    title: "Consider Pet Insurance",
    description: "Protect your furry family member with comprehensive pet coverage.",
    insight: "Vet costs have increased 40% in the last 5 years",
    impact: "Cover unexpected pet medical expenses",
    savings: "€12/month",
    savingsValue: 144,
    action: "Explore Options",
    provider: "Petplan",
    timeToImplement: "5 min"
  }
];

const categoryConfig = {
  "coverage-gap": { label: "Coverage Gap", icon: Shield, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  "savings": { label: "Savings", icon: PiggyBank, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  "life-event": { label: "Life Event", icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  "wellness": { label: "Wellness", icon: Heart, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/40" },
  "optimization": { label: "Optimize", icon: Zap, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
};

const priorityConfig = {
  high: { label: "High Priority", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", border: "border-red-500" },
  medium: { label: "Medium", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-500" },
  low: { label: "Explore", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-500" },
};

const policyTypeConfig = {
  health: { icon: Heart, color: "text-pink-600" },
  auto: { icon: Car, color: "text-blue-600" },
  home: { icon: Home, color: "text-orange-600" },
  life: { icon: Briefcase, color: "text-purple-600" },
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(recommendationsData);
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const activeRecs = recommendations.filter(r => !r.dismissed && !r.completed);
  const highPriorityCount = activeRecs.filter(r => r.priority === "high").length;
  const completedCount = recommendations.filter(r => r.completed).length;
  
  const totalPotentialSavings = activeRecs.reduce((sum, r) => sum + r.savingsValue, 0);
  
  // Coverage optimization score
  const coverageScore = Math.round(
    72 + (completedCount * 5)
  );

  const filteredRecs = activeRecs.filter(r => {
    if (activeFilter === "all") return true;
    return r.priority === activeFilter;
  });

  const handleComplete = (id: number) => {
    setRecommendations(recommendations.map(r =>
      r.id === id ? { ...r, completed: true } : r
    ));
    toast.success("Recommendation completed! Great job optimizing your coverage.");
  };

  const handleDismiss = (id: number) => {
    setRecommendations(recommendations.map(r =>
      r.id === id ? { ...r, dismissed: true } : r
    ));
    toast.info("Recommendation dismissed");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Smart Recommendations</h1>
                <p className="text-xs text-muted-foreground">AI-powered insurance insights</p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1.5 text-violet-600 border-violet-200 dark:border-violet-800">
              <Brain className="h-3.5 w-3.5" />
              AI Powered
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Coverage Score - Hero Widget */}
        <Card className="p-5 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
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
                  stroke="url(#recGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${coverageScore}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="recGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{coverageScore}%</span>
                <span className="text-xs text-muted-foreground">Optimized</span>
              </div>
            </div>
            
            {/* Score Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">Coverage Optimization</h2>
                {coverageScore >= 90 && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {coverageScore >= 90 
                  ? "Excellent! Your coverage is highly optimized." 
                  : coverageScore >= 75 
                    ? "Good progress! A few improvements available."
                    : "Review recommendations to improve your coverage."}
              </p>
              <div className="flex items-center gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-muted-foreground">{highPriorityCount} urgent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-muted-foreground">{completedCount} completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-muted-foreground">{activeRecs.length} active</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{highPriorityCount}</p>
              <p className="text-xs text-muted-foreground">Urgent</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">€{totalPotentialSavings}</p>
              <p className="text-xs text-muted-foreground">Potential</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <Target className="h-5 w-5 text-violet-600 dark:text-violet-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{activeRecs.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </Card>
        </div>

        {/* Personalized Insight */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-violet-900 dark:text-violet-100 mb-1">AI Insight</h3>
              <p className="text-sm text-violet-700 dark:text-violet-300">
                Based on your profile and policy analysis, implementing the top 3 recommendations could save you <strong>€500+/year</strong> while improving your coverage by <strong>15%</strong>.
              </p>
            </div>
          </div>
        </Card>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {[
            { key: "all", label: "All", count: activeRecs.length },
            { key: "high", label: "Urgent", count: activeRecs.filter(r => r.priority === "high").length, color: "text-red-600" },
            { key: "medium", label: "Medium", count: activeRecs.filter(r => r.priority === "medium").length, color: "text-amber-600" },
            { key: "low", label: "Explore", count: activeRecs.filter(r => r.priority === "low").length, color: "text-blue-600" },
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

        {/* Recommendations List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Personalized Recommendations</h2>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredRecs.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">All Caught Up!</h3>
                <p className="text-sm text-muted-foreground">
                  No recommendations in this category. Great job optimizing your coverage!
                </p>
              </Card>
            ) : (
              filteredRecs.map((rec) => {
                const catConfig = categoryConfig[rec.category];
                const prioConfig = priorityConfig[rec.priority];
                const CatIcon = catConfig.icon;
                const PolicyIcon = rec.policyType ? policyTypeConfig[rec.policyType].icon : Shield;
                
                return (
                  <Card 
                    key={rec.id} 
                    className={`border overflow-hidden ${rec.priority === "high" ? "border-red-200 dark:border-red-800" : "border-border/50"}`}
                    data-testid={`recommendation-${rec.id}`}
                  >
                    {/* Priority Bar */}
                    <div className={`h-1 ${
                      rec.priority === "high" ? "bg-red-500" :
                      rec.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                    
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-xl ${catConfig.bg} flex items-center justify-center flex-shrink-0`}>
                            <CatIcon className={`h-5 w-5 ${catConfig.color}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-foreground">{rec.title}</h3>
                              <Badge variant="outline" className={`text-xs px-1.5 py-0 ${prioConfig.color}`}>
                                {prioConfig.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleDismiss(rec.id)}
                          data-testid={`dismiss-${rec.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Insight Box */}
                      <div className="p-3 rounded-lg bg-muted/30 mb-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">{rec.insight}</p>
                        </div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-center">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Savings</p>
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{rec.savings}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Provider</p>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate">{rec.provider}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-center">
                          <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">Time</p>
                          <p className="text-sm font-medium text-violet-700 dark:text-violet-300">{rec.timeToImplement}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleComplete(rec.id)}
                          data-testid={`complete-${rec.id}`}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Done
                        </Button>
                        <Button className="flex-1 gap-2" data-testid={`action-${rec.id}`}>
                          {rec.action}
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

        {/* Completed Recommendations */}
        {completedCount > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-semibold text-foreground">Completed</h2>
              <Badge variant="secondary" className="text-xs">{completedCount}</Badge>
            </div>
            <div className="space-y-2">
              {recommendations.filter(r => r.completed).map((rec) => (
                <Card key={rec.id} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{rec.title}</p>
                      <p className="text-xs text-muted-foreground">Saved {rec.savings}</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">Done</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Savings Calculator Widget */}
        <Card className="p-4 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-sm text-foreground">Potential Annual Savings</h3>
            </div>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">€{totalPotentialSavings}/year</span>
          </div>
          <div className="space-y-2">
            {activeRecs.slice(0, 3).map((rec) => (
              <div key={rec.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate">{rec.title}</span>
                <span className="font-medium text-foreground">{rec.savings}</span>
              </div>
            ))}
            {activeRecs.length > 3 && (
              <p className="text-xs text-muted-foreground">+{activeRecs.length - 3} more recommendations</p>
            )}
          </div>
          <Progress value={(completedCount / recommendations.length) * 100} className="h-2 mt-4" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedCount} of {recommendations.length} recommendations implemented
          </p>
        </Card>

        {/* Expert Consultation CTA */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-blue-900 dark:text-blue-100 mb-1">Need Expert Advice?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Schedule a free 15-minute call with our insurance specialists to discuss your coverage needs.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Call
                </Button>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Optimization Tips</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <Gift className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-foreground">Bundle & Save</p>
                  <p className="text-xs text-muted-foreground">Combine policies for discounts</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <Percent className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-foreground">Annual Billing</p>
                  <p className="text-xs text-muted-foreground">Save 5-10% on premiums</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
