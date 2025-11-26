// Gap analysis calculation engine for per-policy recommendations
import type { UserProfileData } from "@/hooks/useUserProfile";

export interface PolicyRecommendation {
  type: "add" | "drop" | "enhance" | "optional";
  coverage: string;
  reason: string;
  savingsOrBenefit: string;
  priority: "critical" | "high" | "medium" | "low";
  requiresUnderwriting: boolean; // true = Request Quote, false = Buy Now
  estimatedMonthlyPrice?: number; // For direct purchase
}

export interface PolicyGapAnalysis {
  score: number; // 0-100, higher is better
  gaps: PolicyRecommendation[];
  aiInsight: string;
}

export function calculatePolicyGaps(
  policyType: string,
  profile: UserProfileData | null
): PolicyGapAnalysis {
  const gaps: PolicyRecommendation[] = [];

  if (!profile) {
    return {
      score: 50,
      gaps: [],
      aiInsight: "Complete your profile to get personalized recommendations",
    };
  }

  const coverage = new Set(profile.currentCoverages || []);
  const ageGroup = profile.ageGroup || "31-45";
  const dependents = (profile.dependents ?? 0) as number;
  const familyStatus = profile.familyStatus || "Single";

  // HEALTH INSURANCE ANALYSIS
  if (policyType.toLowerCase() === "health") {
    if (profile.healthStatus === "Has chronic conditions" && !coverage.has("Disability")) {
      gaps.push({
        type: "add",
        coverage: "Disability Insurance",
        reason: "Protects income if health condition prevents work",
        savingsOrBenefit: "Replace 60-80% income, €30-80/month",
        priority: "critical",
        requiresUnderwriting: true,
      });
    }

    if (profile.travelFrequency !== "Never" && !coverage.has("Travel")) {
      gaps.push({
        type: "add",
        coverage: "International Travel Medical",
        reason: `You travel ${profile.travelFrequency} but health only covers domestic`,
        savingsOrBenefit: "€80-150/year for worldwide coverage",
        priority: "high",
        requiresUnderwriting: false,
        estimatedMonthlyPrice: 12,
      });
    }

    if (profile.emergencyFund === "Minimal or none") {
      gaps.push({
        type: "enhance",
        coverage: "Emergency Fund + Health Safety Net",
        reason: "Unexpected medical costs without emergency savings create debt",
        savingsOrBenefit: "Build 3-6 months (€3k-€15k minimum)",
        priority: "high",
        requiresUnderwriting: false,
      });
    }

    gaps.push({
      type: "optional",
      coverage: "Mental Health Coverage Add-on",
      reason: "Mental wellness as important as physical health",
      savingsOrBenefit: "€15-40/month for therapy sessions coverage",
      priority: "medium",
      requiresUnderwriting: false,
      estimatedMonthlyPrice: 25,
    });

    if (profile.lifeStageFactors?.includes("Young children")) {
      gaps.push({
        type: "optional",
        coverage: "Pediatric Wellness Plan",
        reason: "Enhanced coverage for children's preventive care",
        savingsOrBenefit: "€20-50/month, saves on out-of-pocket",
        priority: "medium",
        requiresUnderwriting: false,
        estimatedMonthlyPrice: 35,
      });
    }
  }

  // AUTO INSURANCE ANALYSIS
  if (policyType.toLowerCase() === "auto") {
    if (profile.occupationRisk === "High risk" && dependents > 0) {
      gaps.push({
        type: "enhance",
        coverage: "Enhanced Liability Coverage",
        reason: "High-risk occupation + dependents = higher liability exposure",
        savingsOrBenefit: "€10-20/month more, but €1M-€3M protection",
        priority: "critical",
        requiresUnderwriting: true,
      });
    }

    if (profile.travelFrequency !== "Never") {
      gaps.push({
        type: "enhance",
        coverage: "International Travel Coverage",
        reason: `You travel internationally ${profile.travelFrequency} but policy may be limited`,
        savingsOrBenefit: "€5-15/month for EU+ coverage",
        priority: "high",
        requiresUnderwriting: false,
        estimatedMonthlyPrice: 10,
      });
    }

    if (!coverage.has("Life")) {
      gaps.push({
        type: "add",
        coverage: "Related Life Insurance",
        reason: "If at-fault accident causes disability/death, family protected",
        savingsOrBenefit: "Bundle discount potential",
        priority: "high",
        requiresUnderwriting: true,
      });
    }

    gaps.push({
      type: "optional",
      coverage: "Accident Waiver Add-on",
      reason: "Small cost add-on waives deductible if hit by uninsured driver",
      savingsOrBenefit: "€5-10/month, saves €500+ claim deductible",
      priority: "low",
      requiresUnderwriting: false,
      estimatedMonthlyPrice: 7,
    });
  }

  // LIFE INSURANCE ANALYSIS
  if (policyType.toLowerCase() === "life") {
    if (dependents > 2 && profile.lifeStageFactors?.includes("Mortgage")) {
      gaps.push({
        type: "enhance",
        coverage: "Increase Death Benefit",
        reason: `3+ dependents + mortgage = higher financial obligation`,
        savingsOrBenefit: "Add €50k-€100k cover, €10-20/month more",
        priority: "critical",
        requiresUnderwriting: true,
      });
    }

    if (profile.occupationRisk === "High risk") {
      gaps.push({
        type: "add",
        coverage: "Accidental Death & Dismemberment",
        reason: "High-risk occupation increases accident exposure",
        savingsOrBenefit: "€50-100/month additional protection",
        priority: "high",
        requiresUnderwriting: true,
      });
    }

    if (!coverage.has("Disability")) {
      gaps.push({
        type: "add",
        coverage: "Disability Insurance",
        reason: "Income protection more important than death benefit if you're sole earner",
        savingsOrBenefit: "€30-80/month replaces 60-80% income",
        priority: "high",
        requiresUnderwriting: true,
      });
    }

    gaps.push({
      type: "optional",
      coverage: "Living Benefits Rider",
      reason: "Access funds if diagnosed with terminal illness while alive",
      savingsOrBenefit: "€10-25/month for peace of mind",
      priority: "medium",
      requiresUnderwriting: false,
      estimatedMonthlyPrice: 15,
    });
  }

  // HOME INSURANCE ANALYSIS
  if (policyType.toLowerCase() === "home") {
    if (profile.lifeStageFactors?.includes("First home purchase planned")) {
      gaps.push({
        type: "enhance",
        coverage: "Inflation Guard Endorsement",
        reason: "Home values increase; ensure coverage grows annually",
        savingsOrBenefit: "€5-15/month, auto-adjust coverage 3%/year",
        priority: "high",
        requiresUnderwriting: false,
        estimatedMonthlyPrice: 8,
      });
    }

    if (!coverage.has("Umbrella")) {
      gaps.push({
        type: "add",
        coverage: "Umbrella Liability Policy",
        reason: "Home liability accident could exceed standard policy limits",
        savingsOrBenefit: "€1M umbrella = €15-30/month, protects assets",
        priority: "high",
        requiresUnderwriting: true,
      });
    }

    gaps.push({
      type: "optional",
      coverage: "Water Damage Add-on",
      reason: "Standard policies don't cover sump pump failure or backup",
      savingsOrBenefit: "€10-20/month, saves €5k+ in cleanup costs",
      priority: "medium",
      requiresUnderwriting: false,
      estimatedMonthlyPrice: 15,
    });

    if (profile.lifeStageFactors?.includes("Young children")) {
      gaps.push({
        type: "optional",
        coverage: "Home Safety System Discount",
        reason: "Monitored alarm system reduces premium + increases safety",
        savingsOrBenefit: "Save €10-30/month on premium with system",
        priority: "low",
        requiresUnderwriting: false,
        estimatedMonthlyPrice: 20,
      });
    }
  }

  // Calculate score based on gaps
  const criticalCount = gaps.filter((g) => g.priority === "critical").length;
  const highCount = gaps.filter((g) => g.priority === "high").length;
  let score = 95 - criticalCount * 15 - highCount * 5;
  score = Math.max(0, Math.min(100, score));

  // AI insight
  let aiInsight = "";
  if (criticalCount > 0) {
    aiInsight = `⚠️ ${criticalCount} critical gap(s) detected. You may be significantly underprotected.`;
  } else if (highCount > 0) {
    aiInsight = `📊 ${highCount} recommendation(s) to optimize your coverage and reduce risk.`;
  } else if (gaps.length > 0) {
    aiInsight = "✓ Coverage is strong. Consider optional enhancements for complete peace of mind.";
  } else {
    aiInsight = "✓ Your coverage looks well-structured for your profile.";
  }

  return { score, gaps, aiInsight };
}

export function getSavingsOpportunities(
  policyType: string,
  profile: UserProfileData | null
): PolicyRecommendation[] {
  if (!profile) return [];

  const opportunities: PolicyRecommendation[] = [];

  // Single person with expensive health coverage
  if (
    profile.familyStatus === "Single" &&
    (profile.dependents ?? 0) === 0 &&
    policyType.toLowerCase() === "health"
  ) {
    opportunities.push({
      type: "drop",
      coverage: "Family/Spouse Rider",
      reason: "You don't have dependents - paying for unused coverage",
      savingsOrBenefit: "Save €20-50/month",
      priority: "high",
      requiresUnderwriting: false,
    });
  }

  // Young, low-risk occupation with life insurance
  if (
    profile.ageGroup === "18-30" &&
    profile.occupationRisk === "Low risk" &&
    (profile.dependents ?? 0) === 0 &&
    policyType.toLowerCase() === "life"
  ) {
    opportunities.push({
      type: "drop",
      coverage: "High-Benefit Term Life",
      reason: "Young, low-risk, no dependents = minimal life insurance needs",
      savingsOrBenefit: "Drop to basic coverage, save €30-60/month",
      priority: "medium",
      requiresUnderwriting: false,
    });
  }

  // No travel with travel insurance
  if (
    profile.travelFrequency === "Never" &&
    policyType.toLowerCase() === "auto"
  ) {
    opportunities.push({
      type: "drop",
      coverage: "International Travel Add-on",
      reason: "You never travel internationally",
      savingsOrBenefit: "Save €5-10/month",
      priority: "low",
      requiresUnderwriting: false,
    });
  }

  return opportunities;
}
