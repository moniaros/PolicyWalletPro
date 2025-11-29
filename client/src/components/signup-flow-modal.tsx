import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Home, 
  AlertTriangle, 
  DollarSign, 
  HelpCircle, 
  FileText, 
  Upload, 
  CheckCircle, 
  MessageCircle,
  Star,
  Shield,
  Lightbulb,
  Phone
} from "lucide-react";

interface SignupFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type InsuranceConcern = 'gaps' | 'overpaying' | 'understanding' | 'claim';

export function SignupFlowModal({ isOpen, onClose, onComplete }: SignupFlowModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [dependents, setDependents] = useState<string | null>(null);
  const [ownsHome, setOwnsHome] = useState<string | null>(null);
  const [concern, setConcern] = useState<InsuranceConcern | null>(null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const concernInsights: Record<InsuranceConcern, { insight: string; icon: typeof AlertTriangle; color: string }> = {
    gaps: { 
      insight: t('signupFlow.insightGaps'), 
      icon: Shield,
      color: "text-orange-600"
    },
    overpaying: { 
      insight: t('signupFlow.insightOverpaying'), 
      icon: DollarSign,
      color: "text-emerald-600"
    },
    understanding: { 
      insight: t('signupFlow.insightUnderstanding'), 
      icon: FileText,
      color: "text-blue-600"
    },
    claim: { 
      insight: t('signupFlow.insightClaim'), 
      icon: MessageCircle,
      color: "text-purple-600"
    },
  };

  const concernOptions = [
    { value: 'gaps', label: t('signupFlow.gapsInCoverage'), icon: AlertTriangle },
    { value: 'overpaying', label: t('signupFlow.payingTooMuch'), icon: DollarSign },
    { value: 'understanding', label: t('signupFlow.dontUnderstand'), icon: HelpCircle },
    { value: 'claim', label: t('signupFlow.needClaimHelp'), icon: FileText },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return dependents !== null && ownsHome !== null && concern !== null;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold" data-testid="text-welcome-title">{t('signupFlow.welcomeTitle')}</h3>
              <p className="text-muted-foreground" data-testid="text-welcome-desc">
                {t('signupFlow.welcomeDesc')}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200" data-testid="text-data-protected">{t('signupFlow.dataProtected')}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1" data-testid="text-keep-simple">{t('signupFlow.keepSimple')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-lg font-bold text-white">
                  {t('signupFlow.agentInitial')}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <p className="font-medium" data-testid="text-maria-guide">{t('signupFlow.mariaGuide')}</p>
                <p className="text-sm text-muted-foreground" data-testid="text-dedicated-specialist">{t('signupFlow.dedicatedSpecialist')}</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold" data-testid="text-quick-profile">{t('signupFlow.quickProfile')}</h3>
              <p className="text-sm text-muted-foreground" data-testid="text-quick-profile-desc">{t('signupFlow.quickProfileDesc')}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <Label className="font-medium" data-testid="label-dependents">{t('signupFlow.howManyDepend')}</Label>
              </div>
              <RadioGroup value={dependents || ""} onValueChange={setDependents} className="grid grid-cols-4 gap-2">
                {[
                  { value: '0', label: t('signupFlow.dependentNone') },
                  { value: '1-2', label: t('signupFlow.dependent1to2') },
                  { value: '3-4', label: t('signupFlow.dependent3to4') },
                  { value: '5+', label: t('signupFlow.dependent5plus') },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem value={option.value} id={`dep-${option.value}`} className="peer sr-only" data-testid={`radio-dependents-${option.value}`} />
                    <Label
                      htmlFor={`dep-${option.value}`}
                      className="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {dependents && dependents !== '0' && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
                  <Lightbulb className="h-4 w-4" />
                  <span data-testid="text-life-insurance-hint">{t('signupFlow.lifeInsuranceHint')}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-600" />
                <Label className="font-medium" data-testid="label-own-home">{t('signupFlow.ownHome')}</Label>
              </div>
              <RadioGroup value={ownsHome || ""} onValueChange={setOwnsHome} className="grid grid-cols-2 gap-3">
                <div>
                  <RadioGroupItem value="yes" id="home-yes" className="peer sr-only" data-testid="radio-home-yes" />
                  <Label
                    htmlFor="home-yes"
                    className="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {t('signupFlow.yesOwnHome')}
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="no" id="home-no" className="peer sr-only" data-testid="radio-home-no" />
                  <Label
                    htmlFor="home-no"
                    className="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {t('signupFlow.noRent')}
                  </Label>
                </div>
              </RadioGroup>
              {ownsHome === 'yes' && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">
                  <Lightbulb className="h-4 w-4" />
                  <span data-testid="text-home-insurance-hint">{t('signupFlow.homeInsuranceHint')}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <Label className="font-medium" data-testid="label-concern">{t('signupFlow.biggestConcern')}</Label>
              </div>
              <RadioGroup value={concern || ""} onValueChange={(v) => setConcern(v as InsuranceConcern)} className="space-y-2">
                {concernOptions.map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem value={option.value} id={`concern-${option.value}`} className="peer sr-only" data-testid={`radio-concern-${option.value}`} />
                    <Label
                      htmlFor={`concern-${option.value}`}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <option.icon className="h-5 w-5 text-muted-foreground" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {concern && (
                <div className={`flex items-center gap-2 text-sm ${concernInsights[concern].color} bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border`}>
                  {(() => {
                    const InsightIcon = concernInsights[concern].icon;
                    return <InsightIcon className="h-4 w-4" />;
                  })()}
                  <span className="font-medium" data-testid={`text-insight-${concern}`}>{concernInsights[concern].insight}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-bold" data-testid="text-meet-specialist">{t('signupFlow.meetSpecialist')}</h3>
              <p className="text-sm text-muted-foreground" data-testid="text-maria-here">{t('signupFlow.mariaHere')}</p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 border-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                    {t('signupFlow.agentInitial')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-400 rounded-full border-3 border-white dark:border-slate-900 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-xl font-bold" data-testid="text-agent-name">{t('signupFlow.agentName')}</h4>
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground" data-testid="text-your-specialist">{t('signupFlow.yourSpecialist')}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <Badge variant="secondary" data-testid="badge-years-exp">{t('signupFlow.yearsExp')}</Badge>
                  <Badge variant="secondary" data-testid="badge-location">{t('signupFlow.location')}</Badge>
                  <Badge variant="secondary" data-testid="badge-clients">{t('signupFlow.clients')}</Badge>
                </div>

                <p className="text-sm text-muted-foreground italic" data-testid="text-maria-quote">
                  {t('signupFlow.mariaQuote')}
                </p>

                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span data-testid="text-online-ready">{t('signupFlow.onlineReady')}</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 flex items-center gap-2" data-testid="button-chat-now">
                <MessageCircle className="h-4 w-4" />
                {t('signupFlow.chatNow')}
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2" data-testid="button-schedule-call">
                <Phone className="h-4 w-4" />
                {t('signupFlow.scheduleCall')}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground" data-testid="text-availability">
              {t('signupFlow.availability')}
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-bold" data-testid="text-upload-first">{t('signupFlow.uploadFirst')}</h3>
              <p className="text-sm text-muted-foreground" data-testid="text-upload-desc">{t('signupFlow.uploadDesc')}</p>
            </div>

            <div 
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
              data-testid="dropzone-policy"
            >
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium" data-testid="text-drop-policy">{t('signupFlow.dropPolicy')}</p>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-file-formats">{t('signupFlow.fileFormats')}</p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200" data-testid="text-why-upload">{t('signupFlow.whyUpload')}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1" data-testid="text-upload-benefit">{t('signupFlow.uploadBenefit')}</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleNext} data-testid="button-skip-upload">
              {t('signupFlow.skipForNow')}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" data-testid="badge-step">{t('signupFlow.stepOf', { step, total: totalSteps })}</Badge>
            {step > 1 && (
              <Button variant="ghost" size="sm" onClick={handleBack} data-testid="button-back-signup">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('signupFlow.back')}
              </Button>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          <DialogTitle className="sr-only">
            {t('signupFlow.stepOf', { step, total: totalSteps })}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t('signupFlow.welcomeDesc')}
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}

        <div className="flex gap-3 pt-2">
          {step < totalSteps && (
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={!canProceed()}
              data-testid="button-next-signup"
            >
              {step === 1 ? t('signupFlow.letsGetStarted') : t('signupFlow.continue')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          {step === totalSteps && (
            <Button
              onClick={handleNext}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-complete-signup"
            >
              {t('signupFlow.goToDashboard')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
