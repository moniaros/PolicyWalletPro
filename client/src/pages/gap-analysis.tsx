import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, TrendingUp, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GapAnalysisResponse {
  ageGroup: string;
  familyStatus: string;
  currentCoverages: string[];
  incomeRange: string;
  healthStatus: string;
  lifeStageRisks: string[];
  emergencyFund: string;
  dependents: string;
  travelFrequency: string;
  occupationRisk: string;
}

interface CoverageGap {
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  recommendation: string;
  estimatedCost: string;
}

const getQuestions = (t: any) => [
  {
    id: "ageGroup",
    title: t("gapAnalysisQuestions.ageGroup"),
    type: "radio",
    options: ["18-30", "31-45", "46-60", "60+"],
  },
  {
    id: "familyStatus",
    title: t("gapAnalysisQuestions.familyStatusQuestion"),
    type: "radio",
    options: [t("familyStatus.single"), t("familyStatus.married"), t("familyStatus.domesticPartner"), t("familyStatus.widowedDivorced")],
  },
  {
    id: "dependents",
    title: t("gapAnalysisQuestions.dependentsQuestion"),
    type: "radio",
    options: [t("dependents.noDependents"), t("dependents.oneTwoDependents"), t("dependents.threePlusDependents")],
  },
  {
    id: "currentCoverages",
    title: t("gapAnalysisQuestions.currentCoveragesQuestion"),
    type: "checkbox",
    options: [t("insuranceTypes.health"), t("insuranceTypes.auto"), t("insuranceTypes.home"), t("insuranceTypes.life"), t("insuranceTypes.disability"), t("insuranceTypes.travel"), t("insuranceTypes.pet")],
  },
  {
    id: "incomeRange",
    title: t("gapAnalysisQuestions.incomeRangeQuestion"),
    type: "radio",
    options: ["<€30k", "€30-60k", "€60-100k", "€100-150k", ">€150k"],
  },
  {
    id: "healthStatus",
    title: t("gapAnalysisQuestions.healthStatusQuestion"),
    type: "radio",
    options: [t("gapAnalysisQuestions.excellent"), t("gapAnalysisQuestions.good"), t("gapAnalysisQuestions.fair"), t("gapAnalysisQuestions.chronicConditions")],
  },
  {
    id: "emergencyFund",
    title: t("gapAnalysisQuestions.emergencyFundQuestion"),
    type: "radio",
    options: [t("gapAnalysisQuestions.wellCovered"), t("gapAnalysisQuestions.partiallyCovered"), t("gapAnalysisQuestions.minimalOrNone")],
  },
  {
    id: "travelFrequency",
    title: t("gapAnalysisQuestions.travelFrequencyQuestion"),
    type: "radio",
    options: [t("gapAnalysisQuestions.never"), t("gapAnalysisQuestions.oneTwoTimesYear"), t("gapAnalysisQuestions.threeSixTimesYear"), t("gapAnalysisQuestions.monthlyPlus")],
  },
  {
    id: "occupationRisk",
    title: t("gapAnalysisQuestions.occupationRiskQuestion"),
    type: "radio",
    options: [t("gapAnalysisQuestions.lowRiskOffice"), t("gapAnalysisQuestions.mediumRiskMixed"), t("gapAnalysisQuestions.highRiskPhysical")],
  },
  {
    id: "lifeStageRisks",
    title: t("gapAnalysisQuestions.lifeStageRisksQuestion"),
    type: "checkbox",
    options: [t("gapAnalysisQuestions.firstHomePurchase"), t("gapAnalysisQuestions.youngChildren"), t("gapAnalysisQuestions.mortgageHolder"), t("gapAnalysisQuestions.highDebt"), t("gapAnalysisQuestions.businessOwner")],
  },
];

function calculateGaps(responses: GapAnalysisResponse): CoverageGap[] {
  const gaps: CoverageGap[] = [];
  const coverage = new Set(responses.currentCoverages);

  // Life insurance gap
  if (
    (responses.dependents !== "Χωρίς εξαρτώμενα" && responses.dependents !== "No dependents" || responses.familyStatus === "Παντρεμένος/η" || responses.familyStatus === "Married") &&
    !coverage.has(t("insuranceTypes.life"))
  ) {
    gaps.push({
      type: t("gapAnalysis.lifeInsurance"),
      priority: "critical",
      description: t("gapAnalysis.lifeInsuranceDesc"),
      recommendation: t("gapAnalysis.lifeInsuranceRec"),
      estimatedCost: "€15-40/month",
    });
  }

  // Disability insurance gap
  if (responses.incomeRange !== "<€30k" && !coverage.has(t("insuranceTypes.disability"))) {
    gaps.push({
      type: t("gapAnalysis.disabilityInsurance"),
      priority: "high",
      description: t("gapAnalysis.disabilityInsuranceDesc"),
      recommendation: t("gapAnalysis.disabilityInsuranceRec"),
      estimatedCost: "€30-80/month",
    });
  }

  // Travel insurance gap
  if (responses.travelFrequency !== t("gapAnalysisQuestions.never") && !coverage.has(t("insuranceTypes.travel"))) {
    gaps.push({
      type: t("gapAnalysis.travelInsurance"),
      priority: "high",
      description: t("gapAnalysis.travelInsuranceDesc"),
      recommendation: t("gapAnalysis.travelInsuranceRec"),
      estimatedCost: "€80-150/year",
    });
  }

  // Health insurance gap
  if (!coverage.has(t("insuranceTypes.health"))) {
    gaps.push({
      type: t("gapAnalysis.healthInsurance"),
      priority: "critical",
      description: t("gapAnalysis.healthInsuranceDesc"),
      recommendation: t("gapAnalysis.healthInsuranceRec"),
      estimatedCost: "€50-150/month",
    });
  }

  // Home/Property gap
  if (!coverage.has(t("insuranceTypes.home")) && responses.lifeStageRisks.includes(t("gapAnalysisQuestions.firstHomePurchase"))) {
    gaps.push({
      type: t("gapAnalysis.homeInsurance"),
      priority: "critical",
      description: t("gapAnalysis.homeInsuranceDesc"),
      recommendation: t("gapAnalysis.homeInsuranceRec"),
      estimatedCost: "€30-80/month",
    });
  }

  // Auto insurance gap
  if (!coverage.has(t("insuranceTypes.auto")) && responses.occupationRisk !== t("gapAnalysisQuestions.lowRiskOffice")) {
    gaps.push({
      type: t("gapAnalysis.autoInsurance"),
      priority: "critical",
      description: t("gapAnalysis.autoInsuranceDesc"),
      recommendation: t("gapAnalysis.autoInsuranceRec"),
      estimatedCost: "€40-120/month",
    });
  }

  // Emergency fund gap
  if (responses.emergencyFund === t("gapAnalysisQuestions.minimalOrNone")) {
    gaps.push({
      type: t("gapAnalysis.emergencyFund"),
      priority: "high",
      description: t("gapAnalysis.emergencyFundDesc"),
      recommendation: t("gapAnalysis.emergencyFundRec"),
      estimatedCost: t("gapAnalysis.selfFunding"),
    });
  }

  // Pet insurance (if not mentioned)
  if (responses.lifeStageRisks.includes(t("gapAnalysisQuestions.youngChildren")) && !coverage.has(t("insuranceTypes.pet"))) {
    gaps.push({
      type: t("gapAnalysis.petInsurance"),
      priority: "low",
      description: t("gapAnalysis.petInsuranceDesc"),
      recommendation: t("gapAnalysis.petInsuranceRec"),
      estimatedCost: "€15-40/month",
    });
  }

  return gaps;
}

export default function GapAnalysisPage() {
  const { t } = useTranslation();
  const questions = getQuestions(t);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Map question titles to translation keys
  const getQuestionTitle = (key: string) => {
    const titleMap: { [key: string]: string } = {
      "What is your age group?": t('gapAnalysisQuestions.ageGroup'),
      "What is your family status?": t('gapAnalysisQuestions.familyStatus'),
      "Do you have dependents (children)?": t('gapAnalysisQuestions.dependents'),
      "Which insurance types do you currently have?": t('policyTypes'),
      "What is your annual household income range?": t('gapAnalysisQuestions.incomeRange'),
      "How would you describe your current health?": t('gapAnalysisQuestions.health'),
      "Do you have 3-6 months of emergency savings?": t('gapAnalysisQuestions.emergencySavings'),
      "How often do you travel internationally?": t('gapAnalysisQuestions.travelFrequency'),
      "Would you describe your occupation as:": "Would you describe your occupation as:",
      "Which of these apply to your life stage?": t('gapAnalysisQuestions.lifeStageRisks'),
    };
    return titleMap[key] || key;
  };

  const getOptionLabel = (value: string) => {
    const optionMap: { [key: string]: string } = {
      "First home purchase planned": t('gapAnalysisQuestions.firstHomePurchase'),
      "Young children": t('gapAnalysisQuestions.youngChildren'),
      "Mortgage holder": t('gapAnalysisQuestions.mortgageHolder'),
      "High debt": t('gapAnalysisQuestions.highDebt'),
      "Business owner": t('gapAnalysisQuestions.businessOwner'),
    };
    return optionMap[value] || value;
  };

  const [responses, setResponses] = useState<GapAnalysisResponse>({
    ageGroup: "",
    familyStatus: "",
    currentCoverages: [],
    incomeRange: "",
    healthStatus: "",
    lifeStageRisks: [],
    emergencyFund: "",
    dependents: "",
    travelFrequency: "",
    occupationRisk: "",
  });
  const [gaps, setGaps] = useState<CoverageGap[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const calculatedGaps = calculateGaps(responses);
      setGaps(calculatedGaps);
      setCompleted(true);
    }
  };

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setResponses({
      ageGroup: "",
      familyStatus: "",
      currentCoverages: [],
      incomeRange: "",
      healthStatus: "",
      lifeStageRisks: [],
      emergencyFund: "",
      dependents: "",
      travelFrequency: "",
      occupationRisk: "",
    });
    setGaps([]);
    setCompleted(false);
  };

  if (!completed) {
    const question = questions[currentStep];
    const isAnswered = question.type === "checkbox"
      ? (responses as any)[question.id]?.length > 0
      : (responses as any)[question.id] !== "";

    return (
      <div className="space-y-8 max-w-full sm:max-w-2xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Insurance Gap Analysis</h1>
          <p className="text-lg text-muted-foreground">
            10 quick questions to identify coverage gaps and recommend policies for your peace of mind
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Question {currentStep + 1} of {questions.length}</span>
            <span className="text-muted-foreground">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">{question.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {question.type === "radio" && (
              <RadioGroup
                value={(responses as any)[question.id]}
                onValueChange={(value) => handleResponseChange(question.id, value)}
                data-testid={`radio-group-${question.id}`}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                      <RadioGroupItem value={option} id={option} data-testid={`radio-${option}`} />
                      <Label htmlFor={option} className="cursor-pointer flex-1 font-medium text-base">
                        {getOptionLabel(option)}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "checkbox" && (
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                    <Checkbox
                      id={`checkbox-${option}`}
                      checked={(responses as any)[question.id]?.includes(option) || false}
                      onCheckedChange={(checked) => {
                        const current = (responses as any)[question.id] || [];
                        const updated = checked
                          ? [...current, option]
                          : current.filter((item: string) => item !== option);
                        handleResponseChange(question.id, updated);
                      }}
                      data-testid={`checkbox-${option}`}
                    />
                    <Label htmlFor={`checkbox-${option}`} className="cursor-pointer flex-1 font-medium text-base">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
              data-testid="button-previous"
            >
              {t('gapAnalysisPage.previous')}
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 bg-primary hover:bg-primary/90"
            data-testid="button-next-question"
          >
            {currentStep === questions.length - 1 ? t('gapAnalysisPage.viewResults') : t('actions.next')}
          </Button>
        </div>
      </div>
    );
  }

  // Results View
  const criticalGaps = gaps.filter((g) => g.priority === "critical");
  const highGaps = gaps.filter((g) => g.priority === "high");
  const mediumGaps = gaps.filter((g) => g.priority === "medium");
  const lowGaps = gaps.filter((g) => g.priority === "low");

  return (
    <div className="space-y-8 max-w-full sm:max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t('gapAnalysisPage.yourInsuranceGapAnalysis')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{criticalGaps.length}</div>
            <p className="text-sm text-red-700 font-medium">{t('gapAnalysisPage.criticalGaps')}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">{highGaps.length}</div>
            <p className="text-sm text-amber-700 font-medium">{t('gapAnalysisPage.highPriority')}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-600">{mediumGaps.length + lowGaps.length}</div>
            <p className="text-sm text-emerald-700 font-medium">{t('gapAnalysisPage.optional')}</p>
          </div>
        </div>
      </div>

      {/* Critical Gaps */}
      {criticalGaps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600" />
            {t('gapAnalysisPage.criticalCoverageGaps')}
          </h2>
          <div className="space-y-3">
            {criticalGaps.map((gap) => (
              <Card key={gap.type} className="border-l-4 border-l-red-600 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">{gap.type}</CardTitle>
                  <CardDescription className="text-base">{gap.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert className="bg-white border-red-200">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-base font-medium">{gap.recommendation}</AlertDescription>
                  </Alert>
                  <p className="text-sm font-medium text-muted-foreground">Estimated cost: {gap.estimatedCost}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* High Priority Gaps */}
      {highGaps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            High Priority Recommendations
          </h2>
          <div className="space-y-3">
            {highGaps.map((gap) => (
              <Card key={gap.type} className="border-l-4 border-l-amber-600 bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700">{gap.type}</CardTitle>
                  <CardDescription className="text-base">{gap.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert className="bg-white border-amber-200">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-base">{gap.recommendation}</AlertDescription>
                  </Alert>
                  <p className="text-sm font-medium text-muted-foreground">Estimated cost: {gap.estimatedCost}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medium/Low Priority */}
      {(mediumGaps.length > 0 || lowGaps.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            Optional Enhancements
          </h2>
          <div className="space-y-3">
            {[...mediumGaps, ...lowGaps].map((gap) => (
              <Card key={gap.type} className="border-l-4 border-l-emerald-600 bg-emerald-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700">{gap.type}</CardTitle>
                  <CardDescription className="text-base">{gap.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{gap.recommendation}</p>
                  <p className="text-sm font-medium text-muted-foreground">Estimated cost: {gap.estimatedCost}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base text-muted-foreground">
            Ready to close your coverage gaps? Our insurance agents can help you find the best policies at competitive rates.
          </p>
          <div className="flex gap-3">
            <Button className="flex-1" data-testid="button-contact-agent">
              Contact Insurance Agent
            </Button>
            <Button variant="outline" onClick={handleReset} data-testid="button-restart-analysis">
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
