import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    fullName: "",
    dateOfBirth: "",
    ageGroup: "",
    familyStatus: "",
    dependents: "0",
    incomeRange: "",
    healthStatus: "",
    emergencyFund: "",
    travelFrequency: "",
    occupationRisk: "",
    lifeStageFactors: [] as string[],
    currentCoverages: [] as string[],
    chronicConditions: [] as string[],
  });

  const [saved, setSaved] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : ((prev[field as keyof typeof prev] as string[]).filter((item) => item !== value)),
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (
      !profile.fullName ||
      !profile.ageGroup ||
      !profile.familyStatus ||
      !profile.incomeRange ||
      !profile.healthStatus
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Save to localStorage for now (would be API call in production)
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setSaved(true);
      toast.success("Profile saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="space-y-8 max-w-full sm:max-w-3xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{t('profile.yourProfile')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('profile.helpUnderstand')}
        </p>
      </div>

      {saved && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 font-medium">
            {t('profile.profileUpdated')}
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.personalInfo')}</CardTitle>
          <CardDescription>{t('profile.basicDetails')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('profile.fullName')}</Label>
              <Input
                id="fullName"
                placeholder="Ιωάννης Παπαδόπουλος"
                value={profile.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                data-testid="input-fullname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">{t('profile.dateOfBirth')}</Label>
              <Input
                id="dob"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                data-testid="input-dob"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('profile.ageGroup')}</Label>
            <RadioGroup value={profile.ageGroup} onValueChange={(value) => handleInputChange("ageGroup", value)}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["18-30", "31-45", "46-60", "60+"].map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <RadioGroupItem value={age} id={`age-${age}`} />
                    <Label htmlFor={`age-${age}`} className="cursor-pointer">
                      {age}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>{t('profile.familyStatus')} *</Label>
            <RadioGroup value={profile.familyStatus} onValueChange={(value) => handleInputChange("familyStatus", value)}>
              <div className="space-y-2">
                {[{label: t("familyStatus.single"), val: "Single"}, {label: t("familyStatus.married"), val: "Married"}, {label: t("familyStatus.domesticPartner"), val: "Domestic Partner"}, {label: t("familyStatus.widowedDivorced"), val: "Widowed/Divorced"}].map(({label, val}) => (
                  <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={val} id={`status-${val}`} />
                    <Label htmlFor={`status-${val}`} className="cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependents">{t('profile.dependents')} *</Label>
            <Select value={profile.dependents} onValueChange={(value) => handleInputChange("dependents", value)}>
              <SelectTrigger id="dependents" data-testid="select-dependents">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["0", "1", "2", "3", "4+"].map((num) => (
                  <SelectItem key={num} value={num}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sections.financialInformation')}</CardTitle>
          <CardDescription>{t('sections.financialInformationDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>{t('profile.incomeRange')} *</Label>
            <RadioGroup value={profile.incomeRange} onValueChange={(value) => handleInputChange("incomeRange", value)}>
              <div className="space-y-2">
                {["<€30k", "€30-60k", "€60-100k", "€100-150k", ">€150k"].map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <RadioGroupItem value={range} id={`income-${range}`} />
                    <Label htmlFor={`income-${range}`} className="cursor-pointer">
                      {range}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>{t('profile.emergencyFund')}</Label>
            <RadioGroup value={profile.emergencyFund} onValueChange={(value) => handleInputChange("emergencyFund", value)}>
              <div className="space-y-2">
                {[t("gapAnalysisQuestions.wellCovered"), t("gapAnalysisQuestions.partiallyCovered"), t("gapAnalysisQuestions.minimalOrNone")].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <RadioGroupItem value={status} id={`fund-${status}`} />
                    <Label htmlFor={`fund-${status}`} className="cursor-pointer">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Health & Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sections.healthAndLifestyle')}</CardTitle>
          <CardDescription>{t('sections.healthAndLifestyleDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>{t('profile.healthStatus')} *</Label>
            <RadioGroup value={profile.healthStatus} onValueChange={(value) => handleInputChange("healthStatus", value)}>
              <div className="space-y-2">
                {[t("gapAnalysisQuestions.excellent"), t("gapAnalysisQuestions.good"), t("gapAnalysisQuestions.fair"), t("gapAnalysisQuestions.chronicConditions")].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <RadioGroupItem value={status} id={`health-${status}`} />
                    <Label htmlFor={`health-${status}`} className="cursor-pointer">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Chronic Conditions (if applicable)</Label>
            <div className="space-y-2">
              {[t("healthConditions.hypertension"), t("healthConditions.diabetes"), t("healthConditions.heartDisease"), t("healthConditions.mentalHealth"), t("healthConditions.respiratory"), t("healthConditions.other")].map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={profile.chronicConditions.includes(condition)}
                    onCheckedChange={(checked) => handleCheckboxChange("chronicConditions", condition, !!checked)}
                  />
                  <Label htmlFor={`condition-${condition}`} className="cursor-pointer">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('profile.travelFrequency')}</Label>
            <RadioGroup value={profile.travelFrequency} onValueChange={(value) => handleInputChange("travelFrequency", value)}>
              <div className="space-y-2">
                {[t("gapAnalysisQuestions.never"), t("gapAnalysisQuestions.oneTwoTimesYear"), t("gapAnalysisQuestions.threeSixTimesYear"), t("gapAnalysisQuestions.monthlyPlus")].map((freq) => (
                  <div key={freq} className="flex items-center space-x-2">
                    <RadioGroupItem value={freq} id={`travel-${freq}`} />
                    <Label htmlFor={`travel-${freq}`} className="cursor-pointer">
                      {freq}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>{t('chatbot.occupationRiskLevel')}</Label>
            <RadioGroup value={profile.occupationRisk} onValueChange={(value) => handleInputChange("occupationRisk", value)}>
              <div className="space-y-2">
                {["Low risk (office work)", "Medium risk (mixed activities)", "High risk (physical/travel)"].map((risk) => {
                  const riskMap: {[key: string]: string} = {
                    "Low risk (office work)": t('gapAnalysisQuestions.lowRiskOffice'),
                    "Medium risk (mixed activities)": t('gapAnalysisQuestions.mediumRiskMixed'),
                    "High risk (physical/travel)": t('gapAnalysisQuestions.highRiskPhysical'),
                  };
                  return (
                    <div key={risk} className="flex items-center space-x-2">
                      <RadioGroupItem value={risk} id={`risk-${risk}`} />
                      <Label htmlFor={`risk-${risk}`} className="cursor-pointer">
                        {riskMap[risk] || risk}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Life Stage & Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>{t('chatbot.lifeStageAndCoverage')}</CardTitle>
          <CardDescription>{t('chatbot.helpIdentifyGaps')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>{t('chatbot.lifeStageFactors')}</Label>
            <div className="space-y-2">
              {["First home purchase planned", "Young children", "Mortgage holder", "High debt", "Business owner"].map((factor) => {
                const factorMap: {[key: string]: string} = {
                  "First home purchase planned": t('gapAnalysisQuestions.firstHomePurchase'),
                  "Young children": t('gapAnalysisQuestions.youngChildren'),
                  "Mortgage holder": t('gapAnalysisQuestions.mortgageHolder'),
                  "High debt": t('gapAnalysisQuestions.highDebt'),
                  "Business owner": t('gapAnalysisQuestions.businessOwner'),
                };
                return (
                  <div key={factor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`factor-${factor}`}
                      checked={profile.lifeStageFactors.includes(factor)}
                      onCheckedChange={(checked) => handleCheckboxChange("lifeStageFactors", factor, !!checked)}
                    />
                    <Label htmlFor={`factor-${factor}`} className="cursor-pointer">
                      {factorMap[factor] || factor}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('chatbot.currentCoverage')}</Label>
            <div className="space-y-2">
              {["Health", "Auto", "Home", "Life", "Disability", "Travel", "Pet", "Umbrella/Liability"].map((coverage) => (
                <div key={coverage} className="flex items-center space-x-2">
                  <Checkbox
                    id={`coverage-${coverage}`}
                    checked={profile.currentCoverages.includes(coverage)}
                    onCheckedChange={(checked) => handleCheckboxChange("currentCoverages", coverage, !!checked)}
                  />
                  <Label htmlFor={`coverage-${coverage}`} className="cursor-pointer">
                    {coverage}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90" size="lg" data-testid="button-save-profile">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Your profile helps us identify coverage gaps and recommend missing policies. This information is used only to improve your recommendations and is protected by strict privacy policies.
        </AlertDescription>
      </Alert>
    </div>
  );
}
