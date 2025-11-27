import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CreditCard, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { PolicyRecommendation } from "@/lib/gap-calculation";

interface CoveragePurchaseDialogProps {
  recommendation: PolicyRecommendation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type BillingPlan = "monthly" | "6month" | "yearly";

export function CoveragePurchaseDialog({ recommendation, isOpen, onOpenChange }: CoveragePurchaseDialogProps) {
  const { t } = useTranslation();
  const [billingPlan, setBillingPlan] = useState<BillingPlan>("monthly");
  const [requestingQuote, setRequestingQuote] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const billingPlans = {
    monthly: { label: t('billingPlans.monthly'), multiplier: 1, savingsPercent: 0 },
    "6month": { label: t('billingPlans.sixMonths'), multiplier: 5.5, savingsPercent: 8 },
    yearly: { label: t('billingPlans.yearly'), multiplier: 10.5, savingsPercent: 12 },
  };
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem("userProfile") ? JSON.parse(localStorage.getItem("userProfile") || "{}").fullName : "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const monthlyPrice = recommendation.estimatedMonthlyPrice || 0;
  const planDetails = billingPlans[billingPlan];
  const totalPrice = Math.round(monthlyPrice * planDetails.multiplier * 100) / 100;

  const handleRequestQuote = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setRequestingQuote(true);
    try {
      // Simulate sending quote request to agent
      const quoteRequest = {
        coverage: recommendation.coverage,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        timestamp: new Date().toISOString(),
      };
      
      // Store in localStorage for demo (would send to backend in production)
      localStorage.setItem(
        "quoteRequests",
        JSON.stringify([...(JSON.parse(localStorage.getItem("quoteRequests") || "[]")), quoteRequest])
      );

      toast.success(`${t('billingPlans.quoteRequestSent')} ${recommendation.coverage}! ${t('billingPlans.yourAgentWillContact')}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit quote request");
    } finally {
      setRequestingQuote(false);
    }
  };

  const handlePurchase = async () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      toast.error("Please fill in all card details");
      return;
    }

    setProcessingPayment(true);
    try {
      // Simulate payment processing
      const purchase = {
        coverage: recommendation.coverage,
        amount: recommendation.estimatedMonthlyPrice,
        cardLast4: formData.cardNumber.slice(-4),
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      localStorage.setItem(
        "purchases",
        JSON.stringify([...(JSON.parse(localStorage.getItem("purchases") || "[]")), purchase])
      );

      toast.success(`✓ ${recommendation.coverage} added to your coverage! Starting immediately.`);
      onOpenChange(false);
    } catch (error) {
      toast.error(t('billingPlans.paymentFailed'));
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{recommendation.coverage}</DialogTitle>
          <DialogDescription className="text-base font-medium text-foreground">
            {recommendation.reason}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900">
            <strong>{t('billingPlans.benefit')}:</strong> {recommendation.savingsOrBenefit}
          </p>
        </div>

        {recommendation.requiresUnderwriting ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                This coverage requires underwriting. Our agent will review your profile and send a personalized quote.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="quote-name">Full Name *</Label>
                <Input
                  id="quote-name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  data-testid="input-quote-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quote-email">Email *</Label>
                  <Input
                    id="quote-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    data-testid="input-quote-email"
                  />
                </div>
                <div>
                  <Label htmlFor="quote-phone">Phone</Label>
                  <Input
                    id="quote-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+30 6XX XXX XXXX"
                    data-testid="input-quote-phone"
                  />
                </div>
              </div>

              <Button
                onClick={handleRequestQuote}
                disabled={requestingQuote}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                data-testid="button-request-quote"
              >
                <FileText className="h-4 w-4 mr-2" />
                {requestingQuote ? "Sending..." : "Request Quote"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900">Instant activation</p>
                <p className="text-xs text-emerald-800">Buy now and start coverage immediately</p>
              </div>
            </div>

            {/* Billing Plan Selection */}
            <div className="space-y-2">
              <Label className="font-semibold">Choose Your Plan</Label>
              <RadioGroup value={billingPlan} onValueChange={(val) => setBillingPlan(val as BillingPlan)}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="monthly" id="plan-monthly" />
                    <Label htmlFor="plan-monthly" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">Monthly</span>
                        <span className="text-sm font-bold text-primary">€{monthlyPrice}/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground">No commitment, cancel anytime</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-emerald-50 cursor-pointer bg-emerald-50/50 border-emerald-200">
                    <RadioGroupItem value="6month" id="plan-6month" />
                    <Label htmlFor="plan-6month" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <span className="font-medium">6 Months</span>
                          <span className="ml-2 text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Save 8%</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">€{(monthlyPrice * 5.5 * 0.92).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">€{(monthlyPrice * 5.5 * 0.92 / 6).toFixed(2)}/month avg</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer bg-blue-50/50 border-blue-200">
                    <RadioGroupItem value="yearly" id="plan-yearly" />
                    <Label htmlFor="plan-yearly" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <span className="font-medium">Yearly</span>
                          <span className="ml-2 text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded">Save 12%</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600">€{(monthlyPrice * 10.5 * 0.88).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">€{(monthlyPrice * 10.5 * 0.88 / 12).toFixed(2)}/month avg</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Total Price Display */}
            <div className="bg-primary/5 rounded-lg p-3 flex justify-between items-center border border-primary/20">
              <span className="text-sm font-medium">Total: {planDetails.label}</span>
              <span className="text-2xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="card-number">Card Number *</Label>
                <Input
                  id="card-number"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  placeholder="4532 1488 0343 6467"
                  maxLength={16}
                  data-testid="input-card-number"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    data-testid="input-expiry"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={3}
                    data-testid="input-cvv"
                  />
                </div>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={processingPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
                data-testid="button-buy-now"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {processingPayment ? t('billingPlans.processing') : `${t('billingPlans.buyNow')}${totalPrice.toFixed(2)}`}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Your payment information is secure and processed by Stripe
        </p>
      </DialogContent>
    </Dialog>
  );
}
