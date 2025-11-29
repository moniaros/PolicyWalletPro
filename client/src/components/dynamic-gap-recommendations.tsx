import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import type { TypeSpecificGapAnalysis } from "@/lib/enhanced-gap-analysis";
import {
  SliderVisualization,
  MeterVisualization,
  HospitalSimulation,
  GoalTimeline,
  CareerShield,
  BreedRadar,
} from "./gap-analysis-visualizations";

interface DynamicGapRecommendationsProps {
  analysis: TypeSpecificGapAnalysis;
  onQuoteRequest?: () => void;
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "critical": return "bg-red-50 border-red-200";
    case "high": return "bg-amber-50 border-amber-200";
    case "medium": return "bg-blue-50 border-blue-200";
    case "low": return "bg-emerald-50 border-emerald-200";
    default: return "bg-gray-50 border-gray-200";
  }
}

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case "critical": return "bg-red-100 text-red-800";
    case "high": return "bg-amber-100 text-amber-800";
    case "medium": return "bg-blue-100 text-blue-800";
    case "low": return "bg-emerald-100 text-emerald-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export function DynamicGapRecommendations({ analysis, onQuoteRequest }: DynamicGapRecommendationsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-emerald-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-foreground">{analysis.primaryGap}</p>
              <p className="text-sm text-muted-foreground mt-1">Potential Annual Revenue: €{analysis.estimatedTotalRevenue.toLocaleString()}</p>
            </div>
            <Badge className="bg-primary text-white">
              {analysis.policyType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Visualizations */}
      <div className="space-y-4">
        {analysis.metrics.map((metric, idx) => (
          <Card key={idx} className={`border-l-4 ${getUrgencyColor(metric.urgency)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{metric.category}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{metric.gap}</p>
                </div>
                <Badge className={getUrgencyBadge(metric.urgency)}>
                  {metric.urgency.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Render type-specific visualizations */}
              {metric.visualization === "slider" && analysis.visualization.sliderMin !== undefined && (
                <SliderVisualization
                  min={analysis.visualization.sliderMin}
                  max={analysis.visualization.sliderMax}
                  current={analysis.visualization.currentPosition}
                  safe={analysis.visualization.safePosition}
                  threshold={analysis.visualization.thresholdPosition}
                />
              )}

              {metric.visualization === "meter" && analysis.visualization.meterMin !== undefined && (
                <MeterVisualization
                  min={analysis.visualization.meterMin}
                  max={analysis.visualization.meterMax}
                  current={analysis.visualization.currentValue}
                  safeZoneMin={analysis.visualization.safeZoneMin}
                  safeZoneMax={analysis.visualization.safeZoneMax}
                  status={analysis.visualization.status}
                />
              )}

              {metric.visualization === "chart" && analysis.visualization.hospitalCost !== undefined && (
                <HospitalSimulation
                  hospitalCost={analysis.visualization.hospitalCost}
                  insurancePays={analysis.visualization.insurancePays}
                  patientPays={analysis.visualization.patientPays}
                  deductibleGap={analysis.visualization.deductibleGap}
                />
              )}

              {metric.visualization === "chart" && analysis.visualization.timelineYears !== undefined && (
                <GoalTimeline
                  yearsArray={analysis.visualization.timelineYears}
                  targetLine={analysis.visualization.targetLine}
                  currentPath={analysis.visualization.currentPath}
                  shortfall={analysis.visualization.shortfall}
                />
              )}

              {metric.visualization === "timeline" && analysis.visualization.timeline !== undefined && (
                <CareerShield
                  timeline={analysis.visualization.timeline}
                  protectedFrom={analysis.visualization.protectedFrom}
                  unprotectedYears={analysis.visualization.unprotectedYears}
                  specialty={analysis.visualization.specialty}
                />
              )}

              {metric.visualization === "radar" && analysis.visualization.conditions !== undefined && (
                <BreedRadar
                  breed={analysis.visualization.breed}
                  conditions={analysis.visualization.conditions}
                  covered={analysis.visualization.covered}
                  uncovered={analysis.visualization.uncovered}
                />
              )}

              {/* Action Button */}
              <Button className="w-full" onClick={onQuoteRequest}>
                <TrendingUp className="h-4 w-4 mr-2" />
                {metric.actionLabel}
                {metric.estimatedRevenue && ` - €${metric.estimatedRevenue}/year`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Summary */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-emerald-900 font-semibold uppercase tracking-wider">💰 Revenue Opportunity</p>
            <p className="text-3xl font-bold text-emerald-700">€{analysis.estimatedTotalRevenue.toLocaleString()}/year</p>
            <p className="text-xs text-emerald-700">{t('ui.potentialAnnualPremium')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
