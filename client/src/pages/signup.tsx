import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  FileText,
  BookOpen,
  TrendingDown,
  Trophy,
  Car,
  Home,
  Users,
  Heart,
  Shield,
  Plane,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

interface SignupPageProps {
  onComplete?: () => void;
  onSignIn?: () => void;
}

interface SignupData {
  goals: string[];
  policyTypes: string[];
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  phone: string;
  birthdate: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
}

const goals = [
  { id: "manage", icon: FileText },
  { id: "learn", icon: BookOpen },
  { id: "shop", icon: TrendingDown },
  { id: "rewards", icon: Trophy },
];

const policyTypes = [
  { id: "auto", icon: Car },
  { id: "home", icon: Home },
  { id: "health", icon: Heart },
  { id: "life", icon: Shield },
  { id: "travel", icon: Plane },
  { id: "family", icon: Users },
];

const regionKeys = [
  "attiki",
  "centralMacedonia",
  "thessaly",
  "westernGreece",
  "crete",
  "peloponnese",
  "easternMacedoniaThrace",
  "epirus",
  "westernMacedonia",
  "centralGreece",
  "ionianIslands",
  "northAegean",
  "southAegean",
];

const SIGNUP_STORAGE_KEY = "policywallet_signup_data";
const SIGNUP_STEP_KEY = "policywallet_signup_step";

const defaultSignupData: SignupData = {
  goals: [],
  policyTypes: [],
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  preferredName: "",
  phone: "",
  birthdate: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
};

const getStoredSignupData = (): SignupData => {
  try {
    const stored = localStorage.getItem(SIGNUP_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure password (excluded from storage) is always empty string
      return { ...defaultSignupData, ...parsed, password: "" };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultSignupData;
};

const getStoredStep = (): number => {
  try {
    const stored = localStorage.getItem(SIGNUP_STEP_KEY);
    if (stored) {
      const step = parseInt(stored, 10);
      if (step >= 1 && step <= 5) return step;
    }
  } catch {
    // Ignore parse errors
  }
  return 1;
};

export default function SignupPage({ onComplete, onSignIn }: SignupPageProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(getStoredStep);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<SignupData>(getStoredSignupData);

  const totalSteps = 5;

  // Persist signup data to localStorage (excluding password for security)
  useEffect(() => {
    const { password, ...safeData } = data;
    localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(safeData));
  }, [data]);

  // Persist current step to localStorage
  useEffect(() => {
    localStorage.setItem(SIGNUP_STEP_KEY, currentStep.toString());
  }, [currentStep]);

  // Clear signup data on completion
  const clearSignupData = useCallback(() => {
    localStorage.removeItem(SIGNUP_STORAGE_KEY);
    localStorage.removeItem(SIGNUP_STEP_KEY);
  }, []);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Clear signup data on completion
      clearSignupData();
      if (onComplete) {
        onComplete();
      } else {
        setLocation("/");
      }
    }
  };

  const handleSignIn = () => {
    // Clear signup data when user switches to login
    clearSignupData();
    if (onSignIn) {
      onSignIn();
    } else {
      setLocation("/login");
    }
  };

  const toggleGoal = (goalId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const togglePolicyType = (typeId: string) => {
    setData((prev) => ({
      ...prev,
      policyTypes: prev.policyTypes.includes(typeId)
        ? prev.policyTypes.filter((t) => t !== typeId)
        : [...prev.policyTypes, typeId],
    }));
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return data.goals.length > 0;
      case 2:
        return data.policyTypes.length > 0;
      case 3:
        return data.email.length > 0 && data.password.length >= 8;
      case 4:
        return data.firstName.length > 0 && data.lastName.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
          data-testid="text-step1-title"
        >
          {t("signup.step1.title")}
        </h1>
        <p
          className="mt-2 text-slate-600 dark:text-slate-300"
          data-testid="text-step1-subtitle"
        >
          {t("signup.step1.subtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = data.goals.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              data-testid={`button-goal-${goal.id}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? "bg-orange-100 dark:bg-orange-900/50"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isSelected
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                />
              </div>
              <span
                className={`flex-1 text-left font-medium ${
                  isSelected
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {t(`signup.step1.goals.${goal.id}`)}
              </span>
              {isSelected && (
                <Check className="h-5 w-5 text-orange-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
          data-testid="text-step2-title"
        >
          {t("signup.step2.title")}
        </h1>
        <p
          className="mt-2 text-slate-600 dark:text-slate-300"
          data-testid="text-step2-subtitle"
        >
          {t("signup.step2.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {policyTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = data.policyTypes.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => togglePolicyType(type.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              data-testid={`button-policy-${type.id}`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isSelected
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              />
              <span
                className={`font-medium ${
                  isSelected
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {t(`signup.step2.types.${type.id}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
          data-testid="text-step3-title"
        >
          {t("signup.step3.title")}
        </h1>
        <p
          className="mt-2 text-slate-600 dark:text-slate-300"
          data-testid="text-step3-subtitle"
        >
          {t("signup.step3.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
            {t("signup.step3.email")}
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
            {t("signup.step3.password")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="h-12 rounded-xl border-slate-200 dark:border-slate-700 pr-12"
              data-testid="input-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              data-testid="button-toggle-password"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <button
          onClick={() => {
            toast({
              title: t("signup.step3.googleComingSoon"),
              description: t("signup.step3.googleComingSoonDesc"),
            });
          }}
          className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors opacity-70"
          data-testid="button-google-signup"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {t("signup.step3.googleSignup")}
          </span>
        </button>

        <Button
          onClick={handleContinue}
          disabled={!canContinue()}
          className="w-full h-12 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-xl"
          data-testid="button-email-signup"
        >
          {t("signup.step3.emailSignup")}
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t("signup.step3.terms.prefix")}{" "}
        <button className="text-slate-700 dark:text-slate-300 underline" data-testid="link-terms">
          {t("signup.step3.terms.termsLink")}
        </button>{" "}
        {t("signup.step3.terms.and")}{" "}
        <button className="text-slate-700 dark:text-slate-300 underline" data-testid="link-privacy">
          {t("signup.step3.terms.privacyLink")}
        </button>
      </p>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
          data-testid="text-step4-title"
        >
          {t("signup.step4.title")}
        </h1>
        <p
          className="mt-2 text-slate-600 dark:text-slate-300"
          data-testid="text-step4-subtitle"
        >
          {t("signup.step4.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-300">
            {t("signup.step4.firstName")}
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-first-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-300">
            {t("signup.step4.lastName")}
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-last-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredName" className="text-slate-700 dark:text-slate-300">
            {t("signup.step4.preferredName")}
          </Label>
          <Input
            id="preferredName"
            value={data.preferredName}
            onChange={(e) => setData({ ...data, preferredName: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-preferred-name"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
          data-testid="text-step5-title"
        >
          {t("signup.step5.title")}
        </h1>
        <p
          className="mt-2 text-slate-600 dark:text-slate-300"
          data-testid="text-step5-subtitle"
        >
          {t("signup.step5.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">
            {t("signup.step5.phone")}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+30 6XX XXX XXXX"
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-phone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthdate" className="text-slate-700 dark:text-slate-300">
            {t("signup.step5.birthdate")}
          </Label>
          <Input
            id="birthdate"
            type="date"
            value={data.birthdate}
            onChange={(e) => setData({ ...data, birthdate: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-birthdate"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-slate-700 dark:text-slate-300">
            {t("signup.step5.address")}
          </Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-slate-700 dark:text-slate-300">
            {t("signup.step5.city")}
          </Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => setData({ ...data, city: e.target.value })}
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-slate-700 dark:text-slate-300">
            {t("signup.step5.region")}
          </Label>
          <Select
            value={data.region}
            onValueChange={(value) => setData({ ...data, region: value })}
          >
            <SelectTrigger
              className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
              data-testid="select-region"
            >
              <SelectValue placeholder={t("signup.step5.selectRegion")} />
            </SelectTrigger>
            <SelectContent>
              {regionKeys.map((regionKey) => (
                <SelectItem key={regionKey} value={regionKey}>
                  {t(`signup.step5.regions.${regionKey}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-slate-700 dark:text-slate-300">
            {t("signup.step5.postalCode")}
          </Label>
          <Input
            id="postalCode"
            value={data.postalCode}
            onChange={(e) => setData({ ...data, postalCode: e.target.value })}
            placeholder="XXX XX"
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
            data-testid="input-postal-code"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 flex flex-col" data-testid="page-signup">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-4">
        {currentStep > 1 ? (
          <button
            onClick={handleBack}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            data-testid="button-back"
            aria-label={t("common.back")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="flex-1 text-center text-lg font-semibold text-white" data-testid="text-header-title">
          {t("signup.header")}
        </h1>
        <div className="w-10" />
      </header>

      {/* Content Card */}
      <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-3xl overflow-y-auto">
        <div className="px-6 py-6 max-w-lg mx-auto">
          {/* Step indicator text */}
          <p className="text-sm font-medium text-orange-500 mb-2" data-testid="text-step-indicator">
            {t("signup.stepIndicator", { current: currentStep, total: totalSteps })}
          </p>

          {/* Progress bar - 5 segments */}
          <div 
            className="flex gap-1.5 mb-6" 
            data-testid="progress-bar"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={t("signup.progressLabel", { current: currentStep, total: totalSteps })}
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index < currentStep
                    ? "bg-orange-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
                data-testid={`progress-segment-${index + 1}`}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Current step content */}
          {renderCurrentStep()}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="bg-white dark:bg-slate-950 px-6 pb-8 pt-4 space-y-3 max-w-lg mx-auto w-full">
        {currentStep === 1 && (
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full text-center text-slate-500 dark:text-slate-400 font-medium py-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            data-testid="button-not-sure"
          >
            {t("signup.notSure")}
          </button>
        )}

        {currentStep !== 3 && (
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="w-full h-12 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-xl disabled:opacity-50"
            data-testid="button-continue"
          >
            {t("signup.continue")}
          </Button>
        )}

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
          {t("signup.alreadyHaveAccount")}{" "}
          <button
            onClick={handleSignIn}
            className="text-slate-800 dark:text-white font-medium underline"
            data-testid="link-sign-in"
          >
            {t("signup.signInLink")}
          </button>
        </p>
      </div>
    </div>
  );
}
