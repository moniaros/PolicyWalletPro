/**
 * Professional Insurance Underwriting Engine
 * ACORD-Compliant Risk Scoring & Gap Analysis
 * Designed for seamless API integration
 */

export interface UnderwritingProfile {
  userId: string;
  ageGroup: string;
  familyStatus: string;
  dependents: number;
  incomeRange: string;
  healthStatus: string;
  emergencyFund: string;
  travelFrequency: string;
  occupationRisk: string;
  currentCoverages: string[];
  chronicConditions?: string[];
}

export interface CoverageGap {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  coverage: string;
  description: string;
  reason: string;
  riskExposure: string;
  estimatedAnnualCost: string;
  priority: number;
  recommendation: string;
  actionType: 'add' | 'enhance' | 'optimize' | 'review';
  estimatedPremium?: number;
  requiresUnderwriting: boolean;
  roiMonths?: number;
}

export interface GapAnalysisResult {
  profileScore: number; // 0-100 overall coverage adequacy
  riskScore: number; // 0-100 underwriting risk level
  gaps: CoverageGap[];
  summary: string;
  keyMetrics: {
    totalExposure: string;
    protectionPercentage: number;
    criticalGaps: number;
    estimatedMonthlyOptimization: number;
  };
  recommendations: string[];
}

/**
 * ACORD-Compliant Risk Scoring (0-100)
 * 0-30: Minimal Risk
 * 31-60: Moderate Risk
 * 61-100: High Risk
 */
export class UnderwritingEngine {
  private profile: UnderwritingProfile;

  constructor(profile: UnderwritingProfile) {
    this.profile = profile;
  }

  /**
   * Calculate ACORD-compliant risk score
   */
  private calculateRiskScore(): number {
    let score = 25; // Base score

    // Age factor
    const ageMap: Record<string, number> = {
      '18-30': 5,
      '31-45': 10,
      '46-60': 20,
      '60+': 35
    };
    score += ageMap[this.profile.ageGroup] || 10;

    // Family status factor
    const familyMap: Record<string, number> = {
      'Single': 5,
      'Married': 10,
      'Domestic Partner': 10,
      'Widowed/Divorced': 12
    };
    score += familyMap[this.profile.familyStatus] || 5;

    // Dependents factor
    score += Math.min(this.profile.dependents * 8, 20);

    // Health factor
    const healthMap: Record<string, number> = {
      'Excellent': 0,
      'Good': 5,
      'Fair': 15,
      'Has chronic conditions': 25
    };
    score += healthMap[this.profile.healthStatus] || 5;

    // Emergency fund factor
    const fundMap: Record<string, number> = {
      'Yes, well covered': 0,
      'Partially covered': 10,
      'Minimal or none': 20
    };
    score += fundMap[this.profile.emergencyFund] || 5;

    // Occupation risk factor
    const occupationMap: Record<string, number> = {
      'Low risk (office work)': 0,
      'Medium risk (mixed activities)': 10,
      'High risk (physical/travel intensive)': 25
    };
    score += occupationMap[this.profile.occupationRisk] || 5;

    return Math.min(score, 100);
  }

  /**
   * Calculate coverage adequacy score (0-100, higher is better)
   */
  private calculateCoverageScore(): number {
    let score = 50; // Base score
    const coverageCount = this.profile.currentCoverages.length;

    // Coverage breadth
    const baselineCoverages = ['Health', 'Auto', 'Home'];
    const essentialCount = baselineCoverages.filter(c => 
      this.profile.currentCoverages.includes(c)
    ).length;
    score += essentialCount * 15;

    // Life coverage for families
    if (this.profile.dependents > 0) {
      score += this.profile.currentCoverages.includes('Life') ? 15 : -10;
    }

    // Disability coverage for workers
    if (this.profile.occupationRisk !== 'Low risk (office work)') {
      score += this.profile.currentCoverages.includes('Disability') ? 10 : -5;
    }

    return Math.max(Math.min(score, 100), 0);
  }

  /**
   * Identify coverage gaps based on underwriting rules
   */
  private identifyGaps(): CoverageGap[] {
    const gaps: CoverageGap[] = [];
    const coverage = new Set(this.profile.currentCoverages);

    // CRITICAL GAPS
    if (this.profile.dependents > 0 && !coverage.has('Life')) {
      gaps.push({
        id: 'gap-life-dependents',
        type: 'critical',
        category: 'Life Insurance',
        coverage: 'Term Life Insurance',
        description: `${this.profile.dependents} dependents without life protection`,
        reason: 'Family financial security at risk if breadwinner unable to work',
        riskExposure: '€500,000+',
        estimatedAnnualCost: '€300-600',
        priority: 100,
        recommendation: 'Obtain 10x annual income coverage immediately',
        actionType: 'add',
        estimatedPremium: 35,
        requiresUnderwriting: true,
        roiMonths: 12
      });
    }

    if (this.profile.incomeRange.includes('€100') && !coverage.has('Disability')) {
      gaps.push({
        id: 'gap-disability-income',
        type: 'critical',
        category: 'Income Protection',
        coverage: 'Disability Insurance',
        description: 'High earner without income replacement protection',
        reason: 'Loss of income would cause immediate financial crisis',
        riskExposure: '€2,000,000+',
        estimatedAnnualCost: '€600-1,200',
        priority: 95,
        recommendation: 'Minimum 60% income replacement for 5-year benefit period',
        actionType: 'add',
        estimatedPremium: 80,
        requiresUnderwriting: true,
        roiMonths: 24
      });
    }

    // HIGH PRIORITY GAPS
    if (this.profile.familyStatus === 'Married' && this.profile.dependents > 0 && !coverage.has('Umbrella/Liability')) {
      gaps.push({
        id: 'gap-umbrella',
        type: 'high',
        category: 'Liability Protection',
        coverage: 'Umbrella/Excess Liability',
        description: 'Insufficient liability coverage for family assets',
        reason: 'Standard policies inadequate for high-exposure family situation',
        riskExposure: '€1,000,000+',
        estimatedAnnualCost: '€300-500',
        priority: 85,
        recommendation: 'Minimum €2M umbrella policy recommended',
        actionType: 'add',
        estimatedPremium: 35,
        requiresUnderwriting: true,
        roiMonths: 36
      });
    }

    if (this.profile.travelFrequency !== 'Never' && !coverage.has('Travel')) {
      gaps.push({
        id: 'gap-travel',
        type: 'high',
        category: 'Travel Insurance',
        coverage: 'International Travel Medical',
        description: `Regular international traveler (${this.profile.travelFrequency}) without travel insurance`,
        reason: 'Domestic health insurance often excludes international incidents',
        riskExposure: '€100,000+',
        estimatedAnnualCost: '€80-200',
        priority: 75,
        recommendation: 'Annual multi-trip travel insurance with medical evacuation',
        actionType: 'add',
        estimatedPremium: 12,
        requiresUnderwriting: false,
        roiMonths: 6
      });
    }

    // MEDIUM PRIORITY GAPS
    if (this.profile.occupationRisk.includes('High') && !coverage.has('Critical Illness')) {
      gaps.push({
        id: 'gap-critical-illness',
        type: 'medium',
        category: 'Health Protection',
        coverage: 'Critical Illness Insurance',
        description: 'High-risk occupation without critical illness protection',
        reason: 'Serious illness could cause double financial impact',
        riskExposure: '€250,000+',
        estimatedAnnualCost: '€200-400',
        priority: 65,
        recommendation: 'Critical illness rider covering minimum 50% of annual income',
        actionType: 'add',
        estimatedPremium: 25,
        requiresUnderwriting: true,
        roiMonths: 18
      });
    }

    if (this.profile.emergencyFund === 'Minimal or none') {
      gaps.push({
        id: 'gap-emergency-fund',
        type: 'high',
        category: 'Financial Planning',
        coverage: 'Emergency Reserve Fund',
        description: 'No emergency savings = high deductible dependency risk',
        reason: 'Without emergency fund, even small claims create hardship',
        riskExposure: '€5,000-15,000',
        estimatedAnnualCost: '€0 (savings)',
        priority: 80,
        recommendation: 'Build 3-6 months emergency fund (€3k-€15k minimum)',
        actionType: 'optimize',
        requiresUnderwriting: false,
        roiMonths: 6
      });
    }

    // OPTIMIZATION GAPS
    if (coverage.has('Health') && coverage.has('Auto') && coverage.has('Home')) {
      gaps.push({
        id: 'gap-bundle-savings',
        type: 'low',
        category: 'Premium Optimization',
        coverage: 'Multi-policy Bundling',
        description: 'Multiple policies with different carriers',
        reason: 'Bundling typically saves 15-25% annually',
        riskExposure: 'Savings opportunity',
        estimatedAnnualCost: '-€400-600',
        priority: 40,
        recommendation: 'Consolidate policies with single carrier for bundling discount',
        actionType: 'optimize',
        estimatedPremium: -50,
        requiresUnderwriting: false,
        roiMonths: 1
      });
    }

    return gaps;
  }

  /**
   * Generate professional recommendations
   */
  private generateRecommendations(): string[] {
    const recs: string[] = [];
    const riskScore = this.calculateRiskScore();

    if (riskScore >= 70) {
      recs.push('🔴 HIGH RISK: Immediate underwriting consultation recommended');
    } else if (riskScore >= 50) {
      recs.push('🟡 MODERATE RISK: Schedule comprehensive gap analysis review');
    } else {
      recs.push('🟢 MANAGEABLE RISK: Annual review sufficient');
    }

    if (this.profile.dependents > 0) {
      recs.push('👨‍👩‍👧 FAMILY FOCUS: Prioritize life insurance and income protection');
    }

    if (this.profile.incomeRange.includes('>€') || this.profile.incomeRange.includes('€100')) {
      recs.push('💼 WEALTH PROTECTION: Consider asset protection and umbrella coverage');
    }

    if (this.profile.travelFrequency !== 'Never') {
      recs.push('✈️ TRAVEL READY: Add international medical and travel coverage');
    }

    if (this.profile.occupationRisk.includes('High')) {
      recs.push('⚠️ OCCUPATIONAL RISK: Enhance disability and critical illness coverage');
    }

    return recs;
  }

  /**
   * Execute complete gap analysis
   */
  analyze(): GapAnalysisResult {
    const riskScore = this.calculateRiskScore();
    const coverageScore = this.calculateCoverageScore();
    const gaps = this.identifyGaps();
    const recommendations = this.generateRecommendations();

    const criticalCount = gaps.filter(g => g.type === 'critical').length;
    const totalMonthlyPremium = gaps.reduce((sum, g) => sum + (g.estimatedPremium || 0), 0);

    return {
      profileScore: coverageScore,
      riskScore,
      gaps: gaps.sort((a, b) => b.priority - a.priority),
      summary: this.generateSummary(coverageScore, riskScore, criticalCount),
      keyMetrics: {
        totalExposure: `€${gaps.reduce((sum, g) => {
          const val = g.riskExposure.replace('€', '').replace('+', '').replace(',', '');
          return sum + parseInt(val) || 0;
        }, 0).toLocaleString()}`,
        protectionPercentage: coverageScore,
        criticalGaps: criticalCount,
        estimatedMonthlyOptimization: totalMonthlyPremium
      },
      recommendations
    };
  }

  private generateSummary(coverage: number, risk: number, criticalGaps: number): string {
    if (criticalGaps > 2) {
      return `URGENT: ${criticalGaps} critical coverage gaps identified. Immediate action required to protect assets and income.`;
    } else if (coverage < 60) {
      return `SIGNIFICANT GAPS: Coverage at ${coverage}% adequacy. Multiple high-priority recommendations available.`;
    } else if (coverage < 80) {
      return `MODERATE GAPS: Coverage at ${coverage}% adequacy. Consider recommended enhancements for complete protection.`;
    } else {
      return `STRONG COVERAGE: At ${coverage}% adequacy. Optional enhancements available for maximum peace of mind.`;
    }
  }
}
