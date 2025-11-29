import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Shield, 
  AlertTriangle, 
  MessageCircle, 
  CheckCircle, 
  Star,
  TrendingUp,
  Sparkles,
  Heart,
  DollarSign
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const totalSteps = 4;
  const progressValue = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t('onboardingNew.dashboardIn60')}</h3>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-lg text-orange-900">{t('onboardingNew.protectionGapFound')}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-orange-600">€500K</span>
                    <span className="text-muted-foreground">{t('onboardingNew.coverage')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{t('onboardingNew.butYouHave')}</span>
                    <span className="text-xl font-bold text-red-600">€1.2M</span>
                    <span className="text-muted-foreground">{t('onboardingNew.exposure')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('onboardingNew.youAreMissing')} <span className="font-bold text-red-600">€700,000</span> {t('onboardingNew.inProtection')}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t('onboardingNew.meetYourGaps')}</h3>
                <p className="text-muted-foreground">{t('onboardingNew.foundOpportunities')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-900">{t('onboardingNew.noDisability')}</p>
                      <p className="text-sm text-muted-foreground">{t('onboardingNew.unprotectedWork')}</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">{t('onboardingNew.highPriority')}</Badge>
                </div>
                <div className="mt-4 p-3 bg-white/80 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('onboardingNew.solution')}</p>
                      <p className="font-bold text-emerald-700">€15/mo {t('onboardingNew.addsProtection')}</p>
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-add-disability">
                      {t('onboardingNew.addToList')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{t('onboardingNew.missingDental')}</p>
                      <p className="text-sm text-muted-foreground">{t('onboardingNew.dentalCosts')}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{t('onboardingNew.recommended')}</Badge>
                </div>
                <div className="mt-4 p-3 bg-white/80 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('onboardingNew.solution')}</p>
                      <p className="font-bold text-blue-700">€12/mo {t('onboardingNew.addsDentalPlan')}</p>
                    </div>
                    <Button size="sm" variant="outline" data-testid="button-learn-dental">
                      {t('priority.learnMore')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-emerald-400 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-2xl font-bold">{t('onboardingNew.mariaReviewed')}</h3>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">(4.9/5 from 1,200+ clients)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                  M
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-slate-800">
                    "{t('onboardingNew.mariaMessage')}"
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-600 font-medium">{t('onboardingNew.mariaOnline')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button className="h-12 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2" data-testid="button-chat-now">
                <MessageCircle className="h-4 w-4" />
                {t('onboardingNew.chatNow')}
              </Button>
              <Button variant="outline" className="h-12" data-testid="button-schedule-call">
                {t('onboardingNew.scheduleCall')}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t('onboardingNew.youreAllSet')}</h3>
                <p className="text-muted-foreground">{t('onboardingNew.achievedToday')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">{t('onboardingNew.dashboardActivated')}</p>
                  <p className="text-sm text-emerald-700">{t('onboardingNew.allPoliciesInPlace')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{t('onboardingNew.gapAnalysisComplete')}</p>
                  <p className="text-sm text-blue-700">{t('onboardingNew.gapsIdentified')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <MessageCircle className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">{t('onboardingNew.agentAssigned')}</p>
                  <p className="text-sm text-purple-700">{t('onboardingNew.mariaReady')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900">{t('onboardingNew.unlockDiscount')}</p>
                  <p className="text-sm text-amber-700">{t('onboardingNew.upload2ndPolicy')}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (step) {
      case 1: return t('onboardingNew.letsFix');
      case 2: return t('onboardingNew.meetAgent');
      case 3: return t('onboardingNew.continueToDashboard');
      case 4: return t('onboardingNew.goToDashboard');
      default: return t('common.next');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{step} of {totalSteps}</Badge>
          </div>
          <Progress value={progressValue} className="h-2" />
          <DialogTitle className="sr-only">Onboarding Step {step}</DialogTitle>
          <DialogDescription className="sr-only">
            Welcome to PolicyWallet - your insurance command center
          </DialogDescription>
        </DialogHeader>

        {renderStep()}

        <div className="flex justify-center gap-2 pt-2" role="tablist" aria-label={t("onboarding.steps")}>
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? "bg-primary w-8" : i < step ? "bg-emerald-500 w-2" : "bg-muted w-2"
              }`}
              data-testid={`onboarding-dot-${i}`}
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${i}`}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-skip"
            className="flex-1"
            aria-label={t("onboarding.skipTutorial")}
          >
            {t("buttons.skipForNow")}
          </Button>
          <Button
            onClick={handleNext}
            className={`flex-1 ${step === 4 ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            data-testid={step === 4 ? "button-finish-onboard" : "button-next-onboard"}
            aria-label={step < 4 ? `Go to step ${step + 1}` : t("onboarding.completeAndContinue")}
          >
            {getButtonText()} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
