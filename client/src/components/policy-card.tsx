import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Download, AlertCircle, CheckCircle2, Eye, Clock, DollarSign, AlertTriangle, TrendingUp, MapPin, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRenewalCountdown, getStatusColor, getExpiryStatus } from "@/lib/policy-utils";

interface PolicyProps {
  id: number;
  type: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  expiry: string;
  premium: string;
  icon: any;
  color: string;
  status: string;
  index?: number;
  details?: any;
  quickViewMetadata?: Record<string, any>;
}

function renderQuickViewByType(policy: PolicyProps) {
  const { t } = useTranslation();
  const metadata = policy.quickViewMetadata || {};
  
  switch(policy.type) {
    case "Investment Life":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('insurance.sumInsured')}</span>
            <span className="font-bold text-lg text-foreground">{metadata.fundValue || "€45,200"}</span>
          </div>
          <div className="flex justify-between items-center bg-emerald-50 px-2 py-1.5 rounded">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><TrendingUp className="h-3 w-3" />YTD Growth</span>
            <span className="font-bold text-emerald-700">{metadata.ytdGrowth || "+5.2%"}</span>
          </div>
        </div>
      );
    
    case "Auto":
      return (
        <div className="space-y-2">
          <div className="bg-blue-50 px-3 py-2 rounded-md">
            <p className="text-xs text-blue-600 uppercase font-semibold">{t('auto.licensePlate')}</p>
            <p className="font-mono font-bold text-blue-900 text-lg">{metadata.licensePlate || "ΥΖΑ-1234"}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('insurance.coverage')}</span>
            <span className="font-semibold text-sm text-foreground">{metadata.coverageTier || t('auto.fullCasco')}</span>
          </div>
        </div>
      );
    
    case "Home & Liability":
      return (
        <div className="space-y-2">
          <div className="flex items-start gap-2 bg-amber-50 px-2 py-1.5 rounded">
            <MapPin className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-amber-700 uppercase font-semibold">{t('home.propertyAddress')}</p>
              <p className="text-sm font-semibold text-amber-900 truncate">{metadata.propertyAddress || "Ακαδημίας 10, Αθήνα"}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('insurance.sumInsured')}</span>
            <span className="font-bold text-foreground">{metadata.sumInsured || "€465,000"}</span>
          </div>
        </div>
      );
    
    case "Pet Insurance":
      return (
        <div className="space-y-2">
          <div className="font-semibold text-lg text-foreground">{metadata.petName || "Max"}</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{width: metadata.limitUsedPercent || "40%"}}></div>
          </div>
          <div className="text-xs text-muted-foreground">
            {metadata.limitUsed || "€400"} / {metadata.limitTotal || "€1,000"} used
          </div>
        </div>
      );
    
    case "Health":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Insured Person</span>
            <span className="font-semibold text-sm text-foreground">{metadata.insuredPerson || "Primary Member"}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 px-2 py-1.5 rounded">
            <span className="text-xs text-purple-700 uppercase font-semibold">Hospital Class</span>
            <span className="font-bold text-purple-900">{metadata.hospitalClass || "A-Class"}</span>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Coverage</p>
            <p className="font-semibold text-sm text-foreground">{policy.coverage}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />Premium
            </p>
            <p className="font-semibold text-sm text-foreground">{policy.premium}</p>
          </div>
        </div>
      );
  }
}

export default function PolicyCard({ policy, index = 0 }: { policy: PolicyProps, index?: number }) {
  const expiryStatus = getExpiryStatus(policy.expiry);
  const renewalText = formatRenewalCountdown(policy.expiry);
  const hasOpenClaim = policy.details?.claims?.some((c: any) => c.status !== "Paid");
  const openClaim = policy.details?.claims?.find((c: any) => c.status !== "Paid");
  const pendingPayments = policy.details?.pendingPayments || 0;

  const expiryColorClass = 
    expiryStatus === "expired" ? "text-red-600 bg-red-50" :
    expiryStatus === "critical" ? "text-amber-600 bg-amber-50" :
    expiryStatus === "warning" ? "text-orange-600 bg-orange-50" :
    "text-emerald-600 bg-emerald-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted group bg-white h-full flex flex-col">
        {/* Header: Product Info + Status Badge */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 border-b bg-gradient-to-r from-white to-muted/10">
          <div className="flex items-center gap-3 flex-1">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${policy.color}`}>
              <policy.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base leading-tight text-foreground">{policy.type}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{policy.provider}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(policy.status)} font-medium text-xs ml-2 shrink-0 border`}
            data-testid={`status-badge-${policy.id}`}
          >
            {policy.status === "Active" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {policy.status}
          </Badge>
        </CardHeader>

        <CardContent className="pt-4 pb-3 flex-1 space-y-3">
          {/* Type-Specific Quick View */}
          {renderQuickViewByType(policy)}

          {/* Row 2: Policy Number & Renewal Countdown */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Policy No.</p>
              <p className="font-mono text-xs bg-secondary/60 text-foreground py-1.5 px-2 rounded font-medium" data-testid={`policy-number-${policy.id}`}>{policy.policyNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Renews
              </p>
              <div className={`text-xs font-semibold py-1.5 px-2 rounded ${expiryColorClass} inline-block`} data-testid={`renewal-countdown-${policy.id}`}>
                {renewalText}
              </div>
            </div>
          </div>

          {/* Alerts: Open Claim */}
          {hasOpenClaim && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber-900">Claim Status</p>
                <p className="text-xs text-amber-800 mt-0.5" data-testid={`claim-status-${policy.id}`}>{openClaim?.reason} - {openClaim?.status}</p>
              </div>
            </div>
          )}

          {/* Alerts: Pending Payments */}
          {pendingPayments > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-900">Payment Due</p>
                  <p className="text-xs text-red-800 mt-0.5">{pendingPayments} overdue payment{pendingPayments > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer: Action Buttons */}
        <CardFooter className="bg-gradient-to-r from-muted/40 to-muted/20 p-3 flex gap-2 border-t">
          <Link href={`/policies/${policy.id}`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-8 text-xs hover:bg-white hover:shadow-sm border-primary/20 text-primary hover:text-primary bg-white font-medium"
              data-testid={`button-details-${policy.id}`}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Details
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-8 text-xs hover:bg-white hover:shadow-sm font-medium" 
            data-testid={`button-docs-${policy.id}`}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Docs
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
