import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Clock, AlertCircle, Calendar, Car, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getExpiryStatus } from "@/lib/policy-utils";

interface PolicyProps {
  id: number;
  type: string;
  productName?: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  expiry: string;
  premium: string;
  icon: any;
  color: string;
  status: string;
  vehicleReg?: string | null;
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

function getSmartStatusBadge(policy: PolicyProps, t: any) {
  const expiryStatus = getExpiryStatus(policy.expiry);
  const hasOpenClaim = policy.details?.claims?.some((c: any) => c.status !== "Paid");
  
  if (expiryStatus === "expired") {
    return {
      label: t('common.expired'),
      className: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
      icon: AlertCircle
    };
  }
  
  if (policy.status === "Cancelled") {
    return {
      label: t('common.cancelled'),
      className: "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300",
      icon: AlertCircle
    };
  }
  
  if (policy.status === "Pending") {
    return {
      label: t('common.pending'),
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      icon: Clock
    };
  }
  
  if (hasOpenClaim) {
    return {
      label: t('policyCard.claimOpen'),
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
      icon: Clock
    };
  }
  
  if (expiryStatus === "critical") {
    return {
      label: t('policyCard.renewSoon'),
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
      icon: Clock
    };
  }
  
  if (expiryStatus === "warning") {
    return {
      label: t('policyCard.expiringMonth'),
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
      icon: Clock
    };
  }
  
  return {
    label: t('common.active'),
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    icon: CheckCircle2
  };
}

function formatDate(dateString: string, locale: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export default function PolicyCard({ policy, index = 0 }: { policy: PolicyProps, index?: number }) {
  const { t, i18n } = useTranslation();
  const statusBadge = getSmartStatusBadge(policy, t);
  const StatusIcon = statusBadge.icon;
  const PolicyIcon = policy.icon;

  return (
    <Link href={`/policies/${policy.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <div 
          className="bg-card rounded-2xl border border-border/50 shadow-sm active:bg-muted/30 transition-all duration-150"
          data-testid={`policy-card-${policy.id}`}
        >
          <div className="p-4">
            {/* Header: Icon + Product Name + Status Badge */}
            <div className="flex items-start gap-3 mb-3">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${getIOSIconBg(policy.type)}`}>
                <PolicyIcon className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground leading-tight line-clamp-2">
                  {policy.productName || policy.type}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {policy.provider}
                </p>
              </div>

              <Badge 
                variant="secondary"
                className={`shrink-0 text-xs font-medium ${statusBadge.className}`}
                data-testid={`status-badge-${policy.id}`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusBadge.label}
              </Badge>
            </div>

            {/* Policy Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-border/50 pt-3">
              {/* Policy Number */}
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t('policyCard.policyNumber')}</p>
                  <p className="font-medium text-foreground truncate">{policy.policyNumber}</p>
                </div>
              </div>

              {/* Policy Type */}
              <div className="flex items-center gap-2">
                <PolicyIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t('policyCard.policyType')}</p>
                  <p className="font-medium text-foreground truncate">{t(`policyTypes.${policy.type.toLowerCase().replace(/[^a-z]/g, '')}`, policy.type)}</p>
                </div>
              </div>

              {/* Renewal Date */}
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t('policyCard.renewalDate')}</p>
                  <p className="font-medium text-foreground">{formatDate(policy.expiry, i18n.language)}</p>
                </div>
              </div>

              {/* Vehicle Registration (only for Auto policies) */}
              {policy.vehicleReg && (
                <div className="flex items-center gap-2">
                  <Car className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{t('policyCard.vehicleReg')}</p>
                    <p className="font-medium text-foreground">{policy.vehicleReg}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer: View Details */}
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border/50">
              <span className="text-sm text-muted-foreground">{t('policyCard.viewDetails')}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
