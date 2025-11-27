import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, TrendingUp, Shield, DollarSign, Clock } from 'lucide-react';
import type { GapAnalysisResult, CoverageGap } from '@/lib/underwriting-engine';

interface GapAnalysisDisplayProps {
  analysis: GapAnalysisResult;
  onRequestQuote?: (gap: CoverageGap) => void;
}

export function GapAnalysisDisplay({ analysis, onRequestQuote }: GapAnalysisDisplayProps) {
  const { t } = useTranslation();

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'warning';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityBg = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-amber-50 border-amber-200';
      case 'medium':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
      {/* SCORES OVERVIEW - Top Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Coverage Score */}
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Coverage Score</span>
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-900">{analysis.profileScore}%</div>
              <Progress value={analysis.profileScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Risk Score */}
        <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-900">Risk Score</span>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-900">{analysis.riskScore}%</div>
              <p className="text-xs text-orange-700">
                {analysis.riskScore >= 70 ? 'High' : analysis.riskScore >= 50 ? 'Moderate' : 'Low'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Critical Gaps */}
        <Card className="border-none shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-900">Critical Gaps</span>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-900">{analysis.keyMetrics.criticalGaps}</div>
              <p className="text-xs text-red-700">Immediate action needed</p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Optimization */}
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Monthly Cost</span>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900">€{Math.abs(analysis.keyMetrics.estimatedMonthlyOptimization)}</div>
              <p className="text-xs text-blue-700">
                {analysis.keyMetrics.estimatedMonthlyOptimization < 0 ? 'Savings' : 'Investment'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SUMMARY ALERT */}
      <div className="lg:col-span-3">
        <Alert className={`border-2 ${
          analysis.keyMetrics.criticalGaps > 2 
            ? 'bg-red-50 border-red-300' 
            : analysis.profileScore < 60
            ? 'bg-amber-50 border-amber-300'
            : 'bg-emerald-50 border-emerald-300'
        }`}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className={
            analysis.keyMetrics.criticalGaps > 2
              ? 'text-red-900'
              : analysis.profileScore < 60
              ? 'text-amber-900'
              : 'text-emerald-900'
          }>
            Underwriting Assessment
          </AlertTitle>
          <AlertDescription className={
            analysis.keyMetrics.criticalGaps > 2
              ? 'text-red-800'
              : analysis.profileScore < 60
              ? 'text-amber-800'
              : 'text-emerald-800'
          }>
            {analysis.summary}
          </AlertDescription>
        </Alert>
      </div>

      {/* KEY METRICS */}
      <div className="lg:col-span-3">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Metrics
            </CardTitle>
            <CardDescription>Professional underwriting analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total Exposure</p>
                <p className="text-lg font-bold">{analysis.keyMetrics.totalExposure}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Protection</p>
                <p className="text-lg font-bold">{analysis.keyMetrics.protectionPercentage}%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Coverage Gaps</p>
                <p className="text-lg font-bold">{analysis.gaps.length}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Opportunities</p>
                <p className="text-lg font-bold">{analysis.gaps.filter(g => g.type === 'low').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECOMMENDATIONS */}
      {analysis.recommendations.length > 0 && (
        <div className="lg:col-span-3">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Underwriter Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm p-2 bg-gray-50 rounded">
                    <span className="text-lg mt-0.5">{rec.split(':')[0]}</span>
                    <span className="text-gray-700">{rec.split(':')[1]?.trim()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GAPS DETAIL */}
      {analysis.gaps.length > 0 && (
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Coverage Gaps & Recommendations
          </h3>

          {analysis.gaps.map((gap) => (
            <Card
              key={gap.id}
              className={`border-2 transition-all hover:shadow-lg ${getSeverityBg(gap.type)}`}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(gap.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-base">{gap.coverage}</h4>
                          <Badge variant={getSeverityColor(gap.type)} className="text-xs">
                            {gap.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {gap.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{gap.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-gray-200">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Risk Exposure</p>
                      <p className="text-sm font-bold text-gray-900">{gap.riskExposure}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Annual Cost</p>
                      <p className="text-sm font-bold text-gray-900">{gap.estimatedAnnualCost}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Monthly Premium</p>
                      <p className="text-sm font-bold text-gray-900">
                        €{gap.estimatedPremium ? Math.abs(gap.estimatedPremium) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">ROI Timeline</p>
                      <p className="text-sm font-bold text-gray-900">
                        {gap.roiMonths ? `${gap.roiMonths} months` : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Reason & Recommendation */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Why This Matters</p>
                      <p className="text-sm text-gray-700">{gap.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Underwriter Recommendation</p>
                      <p className="text-sm text-gray-700">{gap.recommendation}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2 pt-2">
                    {gap.requiresUnderwriting ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onRequestQuote?.(gap)}
                        className="gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Request Quote
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onRequestQuote?.(gap)}>
                        Learn More
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {analysis.gaps.length === 0 && (
        <div className="lg:col-span-3 text-center py-12">
          <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">No Coverage Gaps Identified</h3>
          <p className="text-gray-600 text-sm">Your insurance portfolio is well-structured.</p>
        </div>
      )}
    </div>
  );
}
