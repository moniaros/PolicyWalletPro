import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Target, X } from "lucide-react";

interface SliderVisualizationProps {
  min: number;
  max: number;
  current: number;
  safe: number;
  threshold: number;
  currency?: boolean;
}

export function SliderVisualization({ min, max, current, safe, threshold, currency = true }: SliderVisualizationProps) {
  const { t } = useTranslation();
  const currentPercent = ((current - min) / (max - min)) * 100;
  const safePercent = ((safe - min) / (max - min)) * 100;
  const thresholdPercent = ((threshold - min) / (max - min)) * 100;
  
  const isSafe = current >= threshold;
  
  return (
    <div className="space-y-3">
      <div className="relative h-12 bg-gradient-to-r from-red-200 to-emerald-200 rounded-lg overflow-hidden">
        {/* Threshold line */}
        <div className="absolute top-0 bottom-0 w-1 bg-yellow-600" style={{left: `${thresholdPercent}%`}}/>
        {/* Current position */}
        <div className="absolute top-2 h-8 bg-white border-2 border-primary rounded shadow-lg" style={{left: `${currentPercent}%`, transform: "translateX(-50%)"}}>
          <div className="text-xs font-bold text-center h-full flex items-center justify-center" style={{width: "60px", marginLeft: "-30px"}}>
            {currency ? `€${Math.round(current/1000)}k` : current}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">{t('gap.current', 'Current')}</p>
          <p className="font-bold">{currency ? `€${(current/1000).toFixed(1)}k` : current}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('gap.safeLevel', 'Safe Level')}</p>
          <p className="font-bold text-emerald-700">{currency ? `€${(safe/1000).toFixed(1)}k` : safe}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('common.status', 'Status')}</p>
          <p className={`font-bold ${isSafe ? "text-emerald-700" : "text-red-700"}`}>
            {isSafe ? t('gap.safe', 'Safe') : t('gap.atRisk', 'At Risk')}
          </p>
        </div>
      </div>
    </div>
  );
}

interface MeterVisualizationProps {
  min: number;
  max: number;
  current: number;
  safeZoneMin: number;
  safeZoneMax: number;
  status: "optimal" | "overpaying" | "underprotected";
}

export function MeterVisualization({ min, max, current, safeZoneMin, safeZoneMax, status }: MeterVisualizationProps) {
  const { t } = useTranslation();
  const safeZoneMinPercent = ((safeZoneMin - min) / (max - min)) * 100;
  const safeZoneMaxPercent = ((safeZoneMax - min) / (max - min)) * 100;
  const currentPercent = ((current - min) / (max - min)) * 100;
  
  const statusColors = {
    optimal: "bg-emerald-500",
    overpaying: "bg-blue-500",
    underprotected: "bg-red-500",
  };
  
  const getStatusLabel = (s: string) => {
    switch(s) {
      case "optimal": return t('gap.optimalCoverage', 'Optimal Coverage');
      case "overpaying": return t('gap.overpaying', 'Overpaying');
      case "underprotected": return t('gap.underprotected', 'Underprotected');
      default: return s;
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Safe zone background */}
        <div className="absolute top-0 bottom-0 bg-emerald-100" style={{left: `${safeZoneMinPercent}%`, right: `${100 - safeZoneMaxPercent}%`}}/>
        {/* Current needle */}
        <div className={`absolute top-0 bottom-0 w-1 ${statusColors[status]}`} style={{left: `${currentPercent}%`}}/>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{t('gap.min', 'Min')}: €{(min/1000).toFixed(0)}k</span>
        <Badge variant="outline" className={`${status === "optimal" ? "bg-emerald-100" : status === "overpaying" ? "bg-blue-100" : "bg-red-100"}`}>
          {getStatusLabel(status)}
        </Badge>
        <span className="text-xs text-muted-foreground">{t('gap.max', 'Max')}: €{(max/1000).toFixed(0)}k</span>
      </div>
      
      <p className="text-sm font-medium text-center">
        {t('gap.current', 'Current')}: €{(current/1000).toFixed(1)}k ({t('gap.safeZone', 'Safe Zone')}: €{(safeZoneMin/1000).toFixed(0)}k - €{(safeZoneMax/1000).toFixed(0)}k)
      </p>
    </div>
  );
}

interface HospitalSimulationProps {
  hospitalCost: number;
  insurancePays: number;
  patientPays: number;
  deductibleGap?: number;
}

export function HospitalSimulation({ hospitalCost, insurancePays, patientPays, deductibleGap }: HospitalSimulationProps) {
  const { t } = useTranslation();
  const totalPercent = 100;
  const insurancePercent = (insurancePays / hospitalCost) * totalPercent;
  const patientPercent = (patientPays / hospitalCost) * totalPercent;
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-3">{t('gap.surgeryScenario', '5-Day Surgery Scenario')}</p>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span>{t('gap.hospitalBill', 'Hospital Bill')}:</span>
            <span className="font-bold">€{hospitalCost.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div className="bg-emerald-500" style={{width: `${insurancePercent}%`}}/>
              <div className="bg-red-500" style={{width: `${patientPercent}%`}}/>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-white dark:bg-background p-2 rounded border-l-4 border-emerald-500">
            <p className="text-muted-foreground">{t('gap.insurancePays', 'Insurance Pays')}</p>
            <p className="font-bold text-emerald-700 dark:text-emerald-400">€{insurancePays.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-background p-2 rounded border-l-4 border-red-500">
            <p className="text-muted-foreground">{t('gap.youPay', 'You Pay')}</p>
            <p className="font-bold text-red-700 dark:text-red-400">€{patientPays.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {deductibleGap && deductibleGap > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3 rounded-lg">
          <p className="text-xs text-orange-900 dark:text-orange-100 font-semibold mb-1 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {t('gap.deductibleGap', 'Deductible Gap')}
          </p>
          <p className="text-sm text-orange-800 dark:text-orange-200">
            {t('gap.deductibleExceeds', 'Your deductible (€{{amount}}) exceeds emergency savings', { amount: deductibleGap.toLocaleString() })}
          </p>
        </div>
      )}
    </div>
  );
}

interface GoalTimelineProps {
  yearsArray: number[];
  targetLine: number[];
  currentPath: number[];
  shortfall: number;
}

export function GoalTimeline({ yearsArray, targetLine, currentPath, shortfall }: GoalTimelineProps) {
  const { t } = useTranslation();
  const maxValue = Math.max(...targetLine, ...currentPath) * 1.1;
  
  return (
    <div className="space-y-3">
      <svg width="100%" height="150" viewBox="0 0 300 150" className="border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Grid */}
        <line x1="30" y1="10" x2="30" y2="130" stroke="#e5e7eb" strokeWidth="1"/>
        <line x1="30" y1="130" x2="290" y2="130" stroke="#e5e7eb" strokeWidth="1"/>
        
        {/* Target line (solid) */}
        <polyline
          points={targetLine.map((v, i) => `${30 + (i * 260)/(yearsArray.length - 1)},${130 - (v/maxValue)*120}`).join(" ")}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />
        
        {/* Current path (dotted) */}
        <polyline
          points={currentPath.map((v, i) => `${30 + (i * 260)/(yearsArray.length - 1)},${130 - (v/maxValue)*120}`).join(" ")}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
      
      {shortfall > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded-lg">
          <p className="text-sm font-bold text-red-900 dark:text-red-100">{t('gap.shortfall', 'Shortfall')}</p>
          <p className="text-lg font-bold text-red-700 dark:text-red-400">€{shortfall.toLocaleString()}</p>
        </div>
      )}
      
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"/>
          <span className="text-xs">{t('gap.target', 'Target')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"/>
          <span className="text-xs">{t('gap.currentPath', 'Current Path')}</span>
        </div>
      </div>
    </div>
  );
}

interface CareerShieldProps {
  timeline: number[];
  protectedFrom: number;
  unprotectedYears: number[];
  specialty: string;
}

export function CareerShield({ timeline, protectedFrom, unprotectedYears, specialty }: CareerShieldProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-3">
      <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg">
        <p className="text-sm font-semibold mb-2">{t('protection.careerProtectionTimeline', 'Career Protection Timeline')}</p>
        <div className="flex flex-wrap gap-1">
          {timeline.map((year) => (
            <div
              key={year}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded ${
                unprotectedYears.includes(year)
                  ? "bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-100"
                  : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100"
              }`}
              title={unprotectedYears.includes(year) ? t('gap.unprotected', 'Unprotected') : t('gap.protected', 'Protected')}
            >
              {year % 100}
            </div>
          ))}
        </div>
      </div>
      
      {unprotectedYears.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded-lg">
          <p className="text-xs font-bold text-red-900 dark:text-red-100 mb-1 flex items-center gap-1">
            <X className="h-4 w-4" />
            {t('protection.unprotectedYears', 'Unprotected Years')}
          </p>
          <p className="text-sm text-red-800 dark:text-red-200">
            {unprotectedYears.length} {t('common.years', 'years')} ({unprotectedYears[0]} - {unprotectedYears[unprotectedYears.length - 1]})
          </p>
        </div>
      )}
    </div>
  );
}

interface BreedRadarProps {
  breed: string;
  conditions: string[];
  covered: string[];
  uncovered: string[];
}

export function BreedRadar({ breed, conditions, covered, uncovered }: BreedRadarProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-3">
      <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
        <p className="text-sm font-semibold mb-2">{breed} {t('gap.healthRadar', 'Health Radar')}</p>
        
        {covered.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">{t('gap.covered', 'Covered')}</p>
            <div className="flex flex-wrap gap-1">
              {covered.map((cond) => (
                <Badge key={cond} variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs">
                  {cond}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {uncovered.length > 0 && (
          <div>
            <p className="text-xs text-red-700 dark:text-red-400 font-semibold mb-1">{t('gap.notCovered', 'Not Covered')}</p>
            <div className="flex flex-wrap gap-1">
              {uncovered.map((cond) => (
                <Badge key={cond} variant="outline" className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs">
                  {cond}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
