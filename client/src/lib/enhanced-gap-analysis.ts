// Enhanced gap analysis with dynamic visualizations for revenue generation
import type { UserProfileData } from "@/hooks/useUserProfile";

export interface GapMetric {
  category: string;
  currentValue: string;
  safeValue: string;
  gap: string;
  urgency: "critical" | "high" | "medium" | "low";
  visualization: "slider" | "meter" | "chart" | "timeline" | "radar";
  actionLabel: string;
  estimatedRevenue?: number; // Expected premium per year
}

export interface TypeSpecificGapAnalysis {
  policyType: string;
  metrics: GapMetric[];
  primaryGap: string;
  visualization: any; // Component-specific data
  estimatedTotalRevenue: number;
}

// HOME & LIABILITY ANALYSIS
export function analyzeHomeGaps(currentValue: number, propertySize: number): TypeSpecificGapAnalysis {
  const athensConstructionCost = 1600; // €/sqm
  const safeReplacementValue = propertySize * athensConstructionCost;
  const underinsuranceThreshold = safeReplacementValue * 0.9; // 10% deviation threshold
  
  const isUnderinsured = currentValue < underinsuranceThreshold;
  const gap = isUnderinsured ? safeReplacementValue - currentValue : 0;
  
  return {
    policyType: "Home & Liability",
    metrics: [
      {
        category: "Safe Replacement Value",
        currentValue: `€${currentValue.toLocaleString()}`,
        safeValue: `€${Math.round(safeReplacementValue).toLocaleString()}`,
        gap: isUnderinsured ? `€${Math.round(gap).toLocaleString()} underinsured` : "Optimal",
        urgency: isUnderinsured ? "high" : "low",
        visualization: "slider",
        actionLabel: "Increase coverage to safe level",
        estimatedRevenue: Math.round((gap / safeReplacementValue) * 120), // €120/€100k annually
      },
      {
        category: "ENFIA Tax Criteria",
        currentValue: "Status: Unknown",
        safeValue: "Fire + Earthquake + Flood",
        gap: "Tax rebate not verified",
        urgency: "high",
        visualization: "chart",
        actionLabel: "Add all three catastrophe coverages",
        estimatedRevenue: 150,
      }
    ],
    primaryGap: `Underinsured by €${Math.round(gap).toLocaleString()} - Tax rebate at risk`,
    visualization: {
      sliderMin: 0,
      sliderMax: Math.round(safeReplacementValue * 1.2),
      currentPosition: currentValue,
      safePosition: Math.round(safeReplacementValue),
      thresholdPosition: underinsuranceThreshold,
    },
    estimatedTotalRevenue: isUnderinsured ? Math.round((gap / safeReplacementValue) * 120) + 150 : 0,
  };
}

// AUTO ANALYSIS
export function analyzeAutoGaps(vehicleValue: number, insuranceLimit: number): TypeSpecificGapAnalysis {
  const marketValueDepreciation = vehicleValue * 0.85; // 15% avg depreciation
  const isOverinsured = insuranceLimit > vehicleValue * 1.1;
  const isUnderinsured = insuranceLimit < marketValueDepreciation;
  
  let overpayingAmount = 0;
  let riskAmount = 0;
  
  if (isOverinsured) {
    overpayingAmount = (insuranceLimit - vehicleValue) * 0.05; // €0.05 per euro overinsured
  }
  if (isUnderinsured) {
    riskAmount = marketValueDepreciation - insuranceLimit;
  }
  
  return {
    policyType: "Auto",
    metrics: [
      {
        category: "Vehicle Value vs Insurance",
        currentValue: `€${insuranceLimit.toLocaleString()}`,
        safeValue: `€${Math.round(marketValueDepreciation).toLocaleString()}`,
        gap: isOverinsured ? `Overpaying €${Math.round(overpayingAmount)}/year` : isUnderinsured ? `Payout risk: €${Math.round(riskAmount)}` : "Optimal",
        urgency: isOverinsured ? "medium" : isUnderinsured ? "critical" : "low",
        visualization: "meter",
        actionLabel: isOverinsured ? "Reduce coverage to save money" : "Increase coverage for protection",
        estimatedRevenue: isUnderinsured ? Math.round(riskAmount * 0.08) : 0,
      },
      {
        category: "Legal Protection",
        currentValue: `€${insuranceLimit.toLocaleString()}`,
        safeValue: "€3,000,000 (EU avg serious injury)",
        gap: `Gap: €${Math.max(0, 3000000 - insuranceLimit).toLocaleString()}`,
        urgency: insuranceLimit < 2000000 ? "high" : "medium",
        visualization: "chart",
        actionLabel: "Increase liability limit for serious claims",
        estimatedRevenue: 200,
      }
    ],
    primaryGap: isOverinsured ? "Overinsured - wasting premium" : isUnderinsured ? "Underinsured - payout risk" : "Coverage optimized",
    visualization: {
      meterMin: 0,
      meterMax: vehicleValue * 1.3,
      currentValue: insuranceLimit,
      safeZoneMin: marketValueDepreciation * 0.95,
      safeZoneMax: vehicleValue * 1.05,
      status: isOverinsured ? "overpaying" : isUnderinsured ? "underprotected" : "optimal",
    },
    estimatedTotalRevenue: (isOverinsured ? 0 : Math.round(riskAmount * 0.08)) + 200,
  };
}

// LIFE & HEALTH ANALYSIS
export function analyzeHealthGaps(deductible: number, savings: number, dailyRoomLimit: number): TypeSpecificGapAnalysis {
  const avgPrivateHospitalDaily = 500; // €500/day in Athens
  const fiveDaysSurgery = avgPrivateHospitalDaily * 5;
  const patientResponsibility = Math.max(0, fiveDaysSurgery - (dailyRoomLimit * 5));
  const deductibleRisk = deductible > savings;
  
  return {
    policyType: "Health",
    metrics: [
      {
        category: "Hospital Cost Simulation",
        currentValue: `You pay €${Math.round(patientResponsibility)} in 5-day surgery`,
        safeValue: "You pay €0 (fully covered)",
        gap: `Out-of-pocket: €${Math.round(patientResponsibility)}`,
        urgency: patientResponsibility > 2000 ? "high" : "medium",
        visualization: "chart",
        actionLabel: "Lower my risk to €0",
        estimatedRevenue: Math.round(patientResponsibility * 0.05),
      },
      {
        category: "Deductible Safety",
        currentValue: `Deductible €${deductible} vs Savings €${savings}`,
        safeValue: `Savings ≥ Deductible`,
        gap: deductibleRisk ? "Deductible gap exists" : "Covered",
        urgency: deductibleRisk ? "high" : "low",
        visualization: "slider",
        actionLabel: "Build emergency fund or lower deductible",
        estimatedRevenue: deductibleRisk ? 180 : 0,
      }
    ],
    primaryGap: `In 5-day surgery, you'll pay €${Math.round(patientResponsibility)} out-of-pocket`,
    visualization: {
      scenarioName: "5-Day Surgery Scenario",
      hospitalCost: fiveDaysSurgery,
      insurancePays: Math.min(fiveDaysSurgery, dailyRoomLimit * 5),
      patientPays: patientResponsibility,
      deductibleGap: deductibleRisk ? deductible - savings : 0,
    },
    estimatedTotalRevenue: Math.round(patientResponsibility * 0.05) + (deductibleRisk ? 180 : 0),
  };
}

// INVESTMENT LIFE ANALYSIS
export function analyzeInvestmentGaps(
  projectedMaturity: number,
  financialGoal: number,
  yearsToMaturity: number,
  inflationRate: number = 0.025
): TypeSpecificGapAnalysis {
  const purchasingPowerAtMaturity = financialGoal / Math.pow(1 + inflationRate, yearsToMaturity);
  const shortfall = Math.max(0, financialGoal - projectedMaturity);
  
  return {
    policyType: "Investment Life",
    metrics: [
      {
        category: "Goal Achievement",
        currentValue: `€${Math.round(projectedMaturity).toLocaleString()}`,
        safeValue: `€${Math.round(financialGoal).toLocaleString()}`,
        gap: shortfall > 0 ? `Shortfall: €${Math.round(shortfall).toLocaleString()}` : "Goal met",
        urgency: shortfall > financialGoal * 0.2 ? "high" : "medium",
        visualization: "chart",
        actionLabel: "Top-up investment or adjust goal",
        estimatedRevenue: Math.round(shortfall * 0.03),
      },
      {
        category: "Purchasing Power",
        currentValue: `Real value at maturity: €${Math.round(projectedMaturity / Math.pow(1 + inflationRate, yearsToMaturity)).toLocaleString()}`,
        safeValue: `Inflation-adjusted goal: €${Math.round(purchasingPowerAtMaturity).toLocaleString()}`,
        gap: `Erosion: €${Math.round(Math.max(0, purchasingPowerAtMaturity - projectedMaturity / Math.pow(1 + inflationRate, yearsToMaturity))).toLocaleString()}`,
        urgency: "medium",
        visualization: "chart",
        actionLabel: "Increase fund allocation to growth assets",
        estimatedRevenue: 250,
      }
    ],
    primaryGap: shortfall > 0 ? `Shortfall of €${Math.round(shortfall).toLocaleString()} to reach goal` : "On track to goal",
    visualization: {
      timelineYears: Array.from({length: yearsToMaturity}, (_, i) => i + 1),
      targetLine: Array(yearsToMaturity).fill(financialGoal),
      currentPath: Array.from({length: yearsToMaturity}, (_, i) => projectedMaturity * ((i + 1) / yearsToMaturity)),
      shortfall: shortfall,
    },
    estimatedTotalRevenue: Math.round(shortfall * 0.03) + 250,
  };
}

// PET INSURANCE ANALYSIS
export function analyzePetGaps(breed: string, age: number, waitingPeriodsStatus: Record<string, boolean>): TypeSpecificGapAnalysis {
  const highRiskBreeds: Record<string, string[]> = {
    "German Shepherd": ["Hip Dysplasia", "Elbow Dysplasia"],
    "Golden Retriever": ["Hip Dysplasia", "Lymphoma"],
    "Labrador": ["Hip Dysplasia", "Arthritis"],
    "Bulldog": ["Breathing Problems", "Skin Conditions"],
  };
  
  const breedriskConditions = highRiskBreeds[breed] || [];
  const uncoveredConditions = breedriskConditions.filter(cond => waitingPeriodsStatus[cond] === false);
  
  return {
    policyType: "Pet Insurance",
    metrics: [
      {
        category: "Breed Health Risk",
        currentValue: `${breed}: ${breedriskConditions.join(", ")} at risk`,
        safeValue: "All breed-specific conditions covered",
        gap: uncoveredConditions.length > 0 ? `${uncoveredConditions.join(", ")} not covered` : "All covered",
        urgency: uncoveredConditions.length > 0 ? "high" : "low",
        visualization: "radar",
        actionLabel: "Add breed-specific coverage riders",
        estimatedRevenue: uncoveredConditions.length > 0 ? 80 : 0,
      }
    ],
    primaryGap: uncoveredConditions.length > 0 ? `${uncoveredConditions.join(", ")} not covered for ${breed}` : "Breed risks covered",
    visualization: {
      breed,
      age,
      conditions: breedriskConditions,
      covered: breedriskConditions.filter(c => waitingPeriodsStatus[c] !== false),
      uncovered: uncoveredConditions,
    },
    estimatedTotalRevenue: uncoveredConditions.length > 0 ? 80 : 0,
  };
}

// DOCTOR LIABILITY ANALYSIS
export function analyzeDoctorGaps(specialty: string, startYear: number, retroactiveDate: number): TypeSpecificGapAnalysis {
  const currentYear = new Date().getFullYear();
  const careerYears = currentYear - startYear;
  const unprotectedYears = retroactiveDate - startYear;
  const hasGap = unprotectedYears > 0;
  
  const avgSettlements: Record<string, number> = {
    "Surgeon": 750000,
    "Cardiologist": 500000,
    "Anesthesiologist": 600000,
    "General Practitioner": 300000,
  };
  
  const avgForSpecialty = avgSettlements[specialty] || 400000;
  
  return {
    policyType: "Doctor Liability",
    metrics: [
      {
        category: "Career Protection",
        currentValue: `Retroactive: ${retroactiveDate}`,
        safeValue: `Coverage from: ${startYear}`,
        gap: hasGap ? `Unprotected years: ${unprotectedYears} (${startYear}-${retroactiveDate - 1})` : "Full career covered",
        urgency: hasGap ? "critical" : "low",
        visualization: "timeline",
        actionLabel: "Request extended retroactive coverage",
        estimatedRevenue: hasGap ? 500 : 0,
      },
      {
        category: "Limit vs Average Settlement",
        currentValue: `Current Limit: €500,000`,
        safeValue: `Specialty avg: €${avgForSpecialty.toLocaleString()}`,
        gap: avgForSpecialty > 500000 ? `Gap: €${(avgForSpecialty - 500000).toLocaleString()}` : "Adequate",
        urgency: avgForSpecialty > 600000 ? "high" : "medium",
        visualization: "chart",
        actionLabel: "Increase limit to specialty average",
        estimatedRevenue: 1200,
      }
    ],
    primaryGap: hasGap ? `${unprotectedYears} years (${startYear}-${retroactiveDate - 1}) unprotected` : "Career fully covered",
    visualization: {
      timeline: Array.from({length: careerYears}, (_, i) => startYear + i),
      protectedFrom: retroactiveDate,
      unprotectedYears: Array.from({length: unprotectedYears}, (_, i) => startYear + i),
      specialty,
      avgSettlement: avgForSpecialty,
    },
    estimatedTotalRevenue: (hasGap ? 500 : 0) + 1200,
  };
}

// MARINE ANALYSIS
export function analyzeMarineGaps(
  cruisingArea: string,
  insuredArea: string,
  tenderValue: number,
  tenderCost: number
): TypeSpecificGapAnalysis {
  const areaMismatch = cruisingArea !== insuredArea;
  const tenderUninsured = tenderValue === 0;
  
  return {
    policyType: "Marine",
    metrics: [
      {
        category: "Cruising Area Coverage",
        currentValue: `Sailing: ${cruisingArea}`,
        safeValue: `Insured: ${insuredArea}`,
        gap: areaMismatch ? `Mismatch - Consider downgrade to save premium` : "Aligned",
        urgency: areaMismatch ? "medium" : "low",
        visualization: "chart",
        actionLabel: "Adjust coverage zone to actual cruising area",
        estimatedRevenue: areaMismatch ? 300 : 0,
      },
      {
        category: "Tender (Dinghy) Coverage",
        currentValue: `Tender value: €${tenderValue.toLocaleString()}`,
        safeValue: `Market cost: €${Math.round(tenderCost).toLocaleString()}`,
        gap: tenderUninsured ? `Dinghy uninsured - Risk: €${Math.round(tenderCost).toLocaleString()}` : "Covered",
        urgency: tenderUninsured ? "high" : "low",
        visualization: "chart",
        actionLabel: "Add tender coverage",
        estimatedRevenue: tenderUninsured ? Math.round(tenderCost * 0.02) : 0,
      }
    ],
    primaryGap: tenderUninsured ? `Dinghy uninsured - risk of €${Math.round(tenderCost).toLocaleString()}` : "Coverage optimized",
    visualization: {
      areas: [cruisingArea, insuredArea],
      mismatch: areaMismatch,
      tenderUninsured,
      potentialSavings: areaMismatch ? 300 : 0,
      potentialUpsell: tenderUninsured ? Math.round(tenderCost * 0.02) : 0,
    },
    estimatedTotalRevenue: (areaMismatch ? 300 : 0) + (tenderUninsured ? Math.round(tenderCost * 0.02) : 0),
  };
}
