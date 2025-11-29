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

const concernInsights: Record<InsuranceConcern, { insight: string; icon: typeof AlertTriangle; color: string }> = {
  gaps: { 
    insight: "You likely need disability coverage (€15/mo protects you)", 
    icon: Shield,
    color: "text-orange-600"
  },
  overpaying: { 
    insight: "Our users save €495/year - we'll show you how", 
    icon: DollarSign,
    color: "text-emerald-600"
  },
  understanding: { 
    insight: "Upload your policies, we'll explain everything", 
    icon: FileText,
    color: "text-blue-600"
  },
  claim: { 
    insight: "Our claims agent Maria is ready to help", 
    icon: MessageCircle,
    color: "text-purple-600"
  },
};

export function SignupFlowModal({ isOpen, onClose, onComplete }: SignupFlowModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [dependents, setDependents] = useState<string | null>(null);
  const [ownsHome, setOwnsHome] = useState<string | null>(null);
  const [concern, setConcern] = useState<InsuranceConcern | null>(null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

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
              <h3 className="text-2xl font-bold">Welcome to PolicyWallet!</h3>
              <p className="text-muted-foreground">
                Just 3 quick questions to match you with your best agent and unlock personalized recommendations.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Your data is encrypted & GDPR protected</p>
                  <p className="text-xs text-blue-600 mt-1">We'll keep it simple. More later if you want.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-lg font-bold text-white">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="font-medium">Maria will guide you through setup</p>
                <p className="text-sm text-muted-foreground">Your dedicated insurance specialist</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Quick Profile</h3>
              <p className="text-sm text-muted-foreground">Just 3 questions to match you with your best agent</p>
            </div>

            {/* Question 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <Label className="font-medium">How many people depend on you?</Label>
              </div>
              <RadioGroup value={dependents || ""} onValueChange={setDependents} className="grid grid-cols-4 gap-2">
                {['0', '1-2', '3-4', '5+'].map((option) => (
                  <div key={option}>
                    <RadioGroupItem value={option} id={`dep-${option}`} className="peer sr-only" />
                    <Label
                      htmlFor={`dep-${option}`}
                      className="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 hover:bg-slate-50 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {dependents && dependents !== '0' && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                  <Lightbulb className="h-4 w-4" />
                  <span>Life insurance could protect your family's future</span>
                </div>
              )}
            </div>

            {/* Question 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-600" />
                <Label className="font-medium">Do you own a home?</Label>
              </div>
              <RadioGroup value={ownsHome || ""} onValueChange={setOwnsHome} className="grid grid-cols-2 gap-3">
                <div>
                  <RadioGroupItem value="yes" id="home-yes" className="peer sr-only" />
                  <Label
                    htmlFor="home-yes"
                    className="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 hover:bg-slate-50 transition-colors"
                  >
                    Yes, I own a home
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="no" id="home-no" className="peer sr-only" />
                  <Label
                    htmlFor="home-no"
                    className="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 hover:bg-slate-50 transition-colors"
                  >
                    No, I rent
                  </Label>
                </div>
              </RadioGroup>
              {ownsHome === 'yes' && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                  <Lightbulb className="h-4 w-4" />
                  <span>Home insurance is essential - we'll help you find the best coverage</span>
                </div>
              )}
            </div>

            {/* Question 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <Label className="font-medium">What's your biggest insurance concern?</Label>
              </div>
              <RadioGroup value={concern || ""} onValueChange={(v) => setConcern(v as InsuranceConcern)} className="space-y-2">
                {[
                  { value: 'gaps', label: 'I have gaps in coverage', icon: AlertTriangle },
                  { value: 'overpaying', label: 'Paying too much', icon: DollarSign },
                  { value: 'understanding', label: "Don't understand what I have", icon: HelpCircle },
                  { value: 'claim', label: 'Need help with a claim', icon: FileText },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem value={option.value} id={`concern-${option.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`concern-${option.value}`}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 hover:bg-slate-50 transition-colors"
                    >
                      <option.icon className="h-5 w-5 text-muted-foreground" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {concern && (
                <div className={`flex items-center gap-2 text-sm ${concernInsights[concern].color} bg-slate-50 p-3 rounded-lg border`}>
                  {(() => {
                    const InsightIcon = concernInsights[concern].icon;
                    return <InsightIcon className="h-4 w-4" />;
                  })()}
                  <span className="font-medium">{concernInsights[concern].insight}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-bold">Meet Your Insurance Specialist</h3>
              <p className="text-sm text-muted-foreground">Maria is here to help you every step of the way</p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 border-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-400 rounded-full border-3 border-white flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h4 className="text-xl font-bold">Maria Papadopoulou</h4>
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">Your Insurance Specialist</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <Badge variant="secondary">12 Years Experience</Badge>
                  <Badge variant="secondary">Athens</Badge>
                  <Badge variant="secondary">1,200+ Clients</Badge>
                </div>

                <p className="text-sm text-muted-foreground italic">
                  "I specialize in helping families like yours optimize coverage and find savings you didn't know existed."
                </p>

                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span>Online now - ready to help</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat Now
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Schedule Call
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              I'm online 9am-5pm, or email me anytime at maria@policywallet.gr
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-bold">Upload Your First Policy</h3>
              <p className="text-sm text-muted-foreground">Get an instant analysis and see what's missing</p>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <p className="font-medium">Drop your policy here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">PDF, JPG, or PNG up to 10MB</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Why upload a policy?</p>
                  <p className="text-xs text-emerald-600 mt-1">We'll analyze it and show you gaps in coverage, potential savings, and personalized recommendations.</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleNext}>
              Skip for now - I'll add policies later
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
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">Step {step} of {totalSteps}</Badge>
            {step > 1 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          <DialogTitle className="sr-only">
            Signup Flow Step {step}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Complete your profile to get personalized insurance recommendations
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
              {step === 1 ? "Let's Get Started" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          {step === totalSteps && (
            <Button
              onClick={handleNext}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-complete-signup"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
