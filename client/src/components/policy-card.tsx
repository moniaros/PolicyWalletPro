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
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('policyCard.insuredPerson')}</span>
            <span className="font-semibold text-sm text-foreground">{metadata.insuredPerson || "Primary Member"}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 px-2 py-1.5 rounded">
            <span className="text-xs text-purple-700 uppercase font-semibold">{t('policyCard.hospitalClass')}</span>
            <span className="font-bold text-purple-900">{metadata.hospitalClass || "A-Class"}</span>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{t('policyCard.coverage')}</p>
            <p className="font-semibold text-sm text-foreground">{policy.coverage}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />{t('policyCard.premium')}
            </p>
            <p className="font-semibold text-sm text-foreground">{policy.premium}</p>
          </div>
        </div>
      );
  }
}

export default function PolicyCard({ policy, index = 0 }: { policy: PolicyProps, index?: number }) {
  const { t } = useTranslation();
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
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-muted/50 group bg-white h-full flex flex-col hover:border-primary/20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        {/* Header: Product Info + Status Badge */}
        <CardHeader className="flex flex-col md:flex-row items-start justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-white to-muted/5 relative z-10">
          <div className="flex items-center gap-3 flex-1">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${policy.color} shadow-md`}>
              <policy.icon className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base leading-tight text-foreground">{policy.type}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate font-medium">{policy.provider}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(policy.status)} font-semibold text-xs ml-2 shrink-0 border px-2.5 py-1`}
            data-testid={`status-badge-${policy.id}`}
          >
            {policy.status === "Active" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {policy.status}
          </Badge>
        </CardHeader>

        <CardContent className="pt-5 pb-4 flex-1 space-y-4 relative z-10">
          {/* Type-Specific Quick View */}
          {renderQuickViewByType(policy)}

          {/* Row 2: Policy Number & Renewal Countdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1.5">{t('policyCard.policyNo')}</p>
              <p className="font-mono text-sm bg-gradient-to-br from-secondary/80 to-secondary/60 text-foreground py-2 px-2.5 rounded-lg font-semibold border border-secondary/40" data-testid={`policy-number-${policy.id}`}>{policy.policyNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Renews
              </p>
              <div className={`text-xs font-bold py-2 px-2.5 rounded-lg ${expiryColorClass} inline-block border`} data-testid={`renewal-countdown-${policy.id}`}>
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
        <CardFooter className="bg-gradient-to-r from-primary/5 via-muted/10 to-muted/5 p-4 flex gap-2 border-t border-muted/30 relative z-10">
          <Link href={`/policies/${policy.id}`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-9 text-xs hover:bg-primary hover:text-white border-primary/30 text-primary bg-white font-semibold transition-all hover:shadow-md"
              data-testid={`button-details-${policy.id}`}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Details
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-9 text-xs hover:bg-primary/10 hover:text-primary font-semibold transition-all" 
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
