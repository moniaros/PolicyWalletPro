import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Download, AlertCircle, CheckCircle2, ChevronRight, Clock, DollarSign, AlertTriangle, TrendingUp, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function getIOSIconBg(policyType: string) {
  switch(policyType) {
    case "Health": return "bg-red-500 dark:bg-red-600";
    case "Auto": return "bg-blue-500 dark:bg-blue-600";
    case "Home & Liability": return "bg-amber-500 dark:bg-amber-600";
    case "Investment Life": return "bg-emerald-500 dark:bg-emerald-600";
    case "Pet Insurance": return "bg-purple-500 dark:bg-purple-600";
    case "Travel": return "bg-cyan-500 dark:bg-cyan-600";
    default: return "bg-muted-foreground";
  }
}

function renderQuickMetric(policy: PolicyProps) {
  const { t } = useTranslation();
  const metadata = policy.quickViewMetadata || {};
  
  switch(policy.type) {
    case "Investment Life":
      return (
        <div className="flex items-center gap-2 min-h-[24px]">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-sm font-semibold">{metadata.ytdGrowth || t('policyCard.defaultGrowth', '+5.2%')}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{metadata.fundValue || t('policyCard.defaultFundValue', '€45,200')}</span>
        </div>
      );
    
    case "Auto":
      return (
        <div className="flex items-center gap-2 min-h-[24px]">
          <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
            {metadata.licensePlate || t('policyCard.defaultPlate', 'ΥΖΑ-1234')}
          </span>
        </div>
      );
    
    case "Home & Liability":
      return (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-h-[24px]">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[150px]">{metadata.propertyAddress || t('policyCard.defaultAddress', 'Ακαδημίας 10')}</span>
        </div>
      );
    
    case "Pet Insurance":
      return (
        <div className="flex items-center gap-2 min-h-[24px]">
          <span className="text-sm font-medium">{metadata.petName || t('policyCard.defaultPetName', 'Max')}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{metadata.limitUsed || "€400"}/{metadata.limitTotal || "€1,000"}</span>
        </div>
      );
    
    case "Health":
      return (
        <div className="flex items-center gap-2 min-h-[24px]">
          <Badge variant="secondary" className="text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            {metadata.hospitalClass || t('policyCard.defaultHospitalClass', 'A-Class')}
          </Badge>
        </div>
      );
    
    default:
      return (
        <span className="text-sm text-muted-foreground min-h-[24px]">{policy.coverage}</span>
      );
  }
}

export default function PolicyCard({ policy, index = 0 }: { policy: PolicyProps, index?: number }) {
  const { t } = useTranslation();
  const expiryStatus = getExpiryStatus(policy.expiry);
  const renewalText = formatRenewalCountdown(policy.expiry);
  const hasOpenClaim = policy.details?.claims?.some((c: any) => c.status !== "Paid");
  const pendingPayments = policy.details?.pendingPayments || 0;
  const hasAlert = hasOpenClaim || pendingPayments > 0;

  const getExpiryBadgeStyle = () => {
    switch(expiryStatus) {
      case "expired": return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";
      case "critical": return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
      case "warning": return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400";
      default: return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
    }
  };

  return (
    <Link href={`/policies/${policy.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <div 
          className="bg-card rounded-2xl border border-border/50 shadow-sm active:bg-muted/30 transition-all duration-150 overflow-hidden"
          data-testid={`policy-card-${policy.id}`}
        >
          {/* Main Content */}
          <div className="p-4 flex items-center gap-4">
            {/* iOS-Style App Icon */}
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${getIOSIconBg(policy.type)}`}>
              <policy.icon className="h-7 w-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base text-foreground leading-tight truncate">
                    {policy.type}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    {policy.provider}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
              </div>

              {/* Quick Metric */}
              <div className="mt-2">
                {renderQuickMetric(policy)}
              </div>
            </div>
          </div>

          {/* Footer with Status & Premium */}
          <div className="px-4 pb-4 pt-0">
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
              {/* Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Active/Expired Status */}
                <Badge 
                  variant="secondary"
                  className={`text-xs font-medium ${
                    policy.status === "Active" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                  }`}
                  data-testid={`status-badge-${policy.id}`}
                >
                  {policy.status === "Active" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {t(`common.${policy.status.toLowerCase()}`)}
                </Badge>

                {/* Renewal Badge */}
                <Badge 
                  variant="secondary"
                  className={`text-xs font-medium ${getExpiryBadgeStyle()}`}
                  data-testid={`renewal-badge-${policy.id}`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {renewalText}
                </Badge>

                {/* Alert Badge */}
                {hasAlert && (
                  <Badge 
                    variant="secondary"
                    className="text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {hasOpenClaim ? t('policyCard.claimOpen') : t('policyCard.paymentDue')}
                  </Badge>
                )}
              </div>

              {/* Premium */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">{policy.premium}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
