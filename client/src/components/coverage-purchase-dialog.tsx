import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CreditCard, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { PolicyRecommendation } from "@/lib/gap-calculation";

interface CoveragePurchaseDialogProps {
  recommendation: PolicyRecommendation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoveragePurchaseDialog({ recommendation, isOpen, onOpenChange }: CoveragePurchaseDialogProps) {
  const [activeTab, setActiveTab] = useState<"quote" | "purchase">(
    recommendation.requiresUnderwriting ? "quote" : "purchase"
  );
  const [requestingQuote, setRequestingQuote] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem("userProfile") ? JSON.parse(localStorage.getItem("userProfile") || "{}").fullName : "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

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

      toast.success(`Quote request sent for ${recommendation.coverage}! Your agent will contact you soon.`);
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
      toast.error("Payment failed. Please try again.");
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
            <strong>Benefit:</strong> {recommendation.savingsOrBenefit}
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

            <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Cost:</span>
              <span className="text-xl font-bold text-primary">€{recommendation.estimatedMonthlyPrice}</span>
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
                {processingPayment ? "Processing..." : `Buy Now - €${recommendation.estimatedMonthlyPrice}/month`}
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
