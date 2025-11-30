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
  const expiryStatus = getExpiryStatus(policy.expiry);

  // Simplified card showing only 3 essential items: Provider, Premium, Expiry Status
  return (
    <Link href={`/policies/${policy.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2 }}
        className="block"
      >
        <div 
          className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-lg active:bg-muted/30 transition-all duration-200 cursor-pointer group"
          data-testid={`policy-card-${policy.id}`}
        >
          <div className="p-5">
            {/* Header: Icon + Provider + Status Badge */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform ${getIOSIconBg(policy.type)}`}>
                <PolicyIcon className="h-7 w-7 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground leading-tight mb-1">
                  {policy.provider}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {policy.productName || policy.type}
                </p>
              </div>

              <Badge 
                variant="secondary"
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 ${statusBadge.className}`}
                data-testid={`status-badge-${policy.id}`}
              >
                <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                {statusBadge.label}
              </Badge>
            </div>

            {/* Essential Info: Premium + Expiry (2 items only) */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              {/* Premium */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('policyCard.premium')}</p>
                <p className="font-bold text-lg text-foreground">{policy.premium}</p>
              </div>

              {/* Expiry Date with visual indicator */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">{t('policyCard.expires')}</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-base text-foreground">
                    {formatDate(policy.expiry, i18n.language)}
                  </p>
                  {expiryStatus === "critical" && (
                    <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                  {expiryStatus === "warning" && (
                    <div className="h-2 w-2 bg-amber-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>

            {/* Subtle hint to tap for details */}
            <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-border/30">
              <span className="text-xs text-muted-foreground/70">{t('policyCard.tapForDetails')}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
