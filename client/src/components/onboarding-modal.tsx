import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Heart, BarChart2, ArrowRight } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Welcome to PolicyWallet",
      description: "Your personal insurance manager for managing policies from multiple insurers.",
      icon: FileText,
      details: [
        "Centralize all your policies in one place",
        "Track coverage and stay organized",
        "Get instant policy insights",
      ],
    },
    {
      title: "Your Health Matters",
      description: "Track your health data and get personalized wellness recommendations.",
      icon: Heart,
      details: [
        "Upload checkup results",
        "Get health risk assessments",
        "Receive preventive action suggestions",
      ],
    },
    {
      title: "Smart Analytics",
      description: "Understand your coverage gaps and optimize your protection.",
      icon: BarChart2,
      details: [
        "Visualize coverage vs. risk",
        "Find protection gaps",
        "Get bundle savings suggestions",
      ],
    },
  ];

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{step} of 3</Badge>
          </div>
          <DialogTitle className="text-2xl">{currentStep.title}</DialogTitle>
          <DialogDescription aria-hidden="true" className="sr-only">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>

          <p className="text-center text-muted-foreground text-lg">{currentStep.description}</p>

          <div className="space-y-2">
            {currentStep.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{detail}</span>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2" role="tablist" aria-label="Onboarding steps">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "bg-primary w-8" : i < step ? "bg-emerald-500 w-2" : "bg-muted w-2"
                }`}
                data-testid={`onboarding-dot-${i}`}
                role="tab"
                aria-selected={i === step}
                aria-label={`Step ${i}: ${steps[i - 1].title}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-skip"
            className="flex-1"
            aria-label="Skip onboarding tutorial"
          >
            Skip for Now
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1"
              data-testid="button-next-onboard"
              aria-label={`Go to step ${step + 1}`}
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-finish-onboard"
              aria-label="Complete onboarding and continue"
            >
              Let's Go! <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
