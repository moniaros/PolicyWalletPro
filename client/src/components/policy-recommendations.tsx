import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, CheckCircle2, AlertTriangle, FileText, CreditCard } from "lucide-react";
import { CoveragePurchaseDialog } from "./coverage-purchase-dialog";
import type { PolicyGapAnalysis, PolicyRecommendation } from "@/lib/gap-calculation";

interface PolicyRecommendationsProps {
  analysis: PolicyGapAnalysis;
  onContactAgent?: () => void;
}

const priorityConfig = {
  critical: { color: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", icon: AlertTriangle },
  high: { color: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", icon: AlertCircle },
  medium: { color: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon: TrendingUp },
  low: { color: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

export function PolicyRecommendations({ analysis, onContactAgent }: PolicyRecommendationsProps) {
  const [selectedRec, setSelectedRec] = useState<PolicyRecommendation | null>(null);
  
  const groupedByType = {
    add: analysis.gaps.filter((g) => g.type === "add"),
    drop: analysis.gaps.filter((g) => g.type === "drop"),
    enhance: analysis.gaps.filter((g) => g.type === "enhance"),
    optional: analysis.gaps.filter((g) => g.type === "optional"),
  };

  return (
    <div className="space-y-4">
      {/* AI Insight Banner */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-emerald-500/5">
        <CardContent className="pt-6">
          <p className="text-base font-medium text-foreground flex items-start gap-2">
            <span className="text-xl">🤖</span>
            <span>{analysis.aiInsight}</span>
          </p>
        </CardContent>
      </Card>

      {/* Coverage Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">{analysis.score}</div>
              <p className="text-sm text-muted-foreground font-medium">Coverage Score</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-amber-600">{analysis.gaps.length}</div>
              <p className="text-sm text-muted-foreground font-medium">{t("ui.recommendations")}</p>
              <p className="text-xs text-muted-foreground">Found based on your profile</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations by Type */}

      {/* CRITICAL GAPS - ADD */}
      {groupedByType.add.filter((g) => g.priority === "critical").length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical: Add These Coverages
          </h3>
          <div className="space-y-2">
            {groupedByType.add
              .filter((g) => g.priority === "critical")
              .map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} onSelect={() => setSelectedRec(rec)} />
              ))}
          </div>
        </div>
      )}

      {/* HIGH - ADD */}
      {groupedByType.add.filter((g) => g.priority === "high").length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-amber-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recommended: Add These Coverages
          </h3>
          <div className="space-y-2">
            {groupedByType.add
              .filter((g) => g.priority === "high")
              .map((rec, i) => (
                <RecommendationCard key={i} recommendation={rec} onSelect={() => setSelectedRec(rec)} />
              ))}
          </div>
        </div>
      )}

      {/* DROP - SAVE MONEY */}
      {groupedByType.drop.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Save Money: Coverages to Drop
          </h3>
          <div className="space-y-2">
            {groupedByType.drop.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} onSelect={() => setSelectedRec(rec)} />
            ))}
          </div>
        </div>
      )}

      {/* ENHANCE */}
      {groupedByType.enhance.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-blue-700 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Enhance: Increase Protection
          </h3>
          <div className="space-y-2">
            {groupedByType.enhance.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} onSelect={() => setSelectedRec(rec)} />
            ))}
          </div>
        </div>
      )}

      {/* OPTIONAL */}
      {groupedByType.optional.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-blue-700 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Optional: Nice-to-Have Coverages
          </h3>
          <div className="space-y-2">
            {groupedByType.optional.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} onSelect={() => setSelectedRec(rec)} />
            ))}
          </div>
        </div>
      )}

      {selectedRec && (
        <CoveragePurchaseDialog
          recommendation={selectedRec}
          isOpen={!!selectedRec}
          onOpenChange={(open) => !open && setSelectedRec(null)}
        />
      )}
    </div>
  );
}

function RecommendationCard({ recommendation, onSelect }: { recommendation: PolicyRecommendation; onSelect: () => void }) {
  const config = priorityConfig[recommendation.priority];
  const Icon = config.icon;
  const isAddable = recommendation.type === "add" || recommendation.type === "enhance";

  return (
    <Card className={`border ${config.border} ${config.color}`}>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{recommendation.coverage}</p>
                <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
              </div>
            </div>
            <Badge className={config.badge} variant="secondary">
              {recommendation.type === "add" && "Add"}
              {recommendation.type === "drop" && "Drop"}
              {recommendation.type === "enhance" && "Enhance"}
              {recommendation.type === "optional" && "Optional"}
            </Badge>
          </div>
          <p className="text-sm font-medium text-foreground">{recommendation.savingsOrBenefit}</p>

          {/* Action Buttons */}
          {isAddable && (
            <div className="flex gap-2 pt-2">
              {recommendation.requiresUnderwriting ? (
                <Button
                  onClick={onSelect}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary text-primary hover:bg-primary/5"
                  data-testid={`button-request-quote-${recommendation.coverage.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  Request Quote
                </Button>
              ) : (
                <Button
                  onClick={onSelect}
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  data-testid={`button-buy-now-${recommendation.coverage.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <CreditCard className="h-3.5 w-3.5 mr-2" />
                  Buy Now
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
