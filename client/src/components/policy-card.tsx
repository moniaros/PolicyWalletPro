import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getExpiryStatus } from "@/lib/policy-utils";

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

export default function PolicyCard({ policy, index = 0 }: { policy: PolicyProps, index?: number }) {
  const { t } = useTranslation();
  const statusBadge = getSmartStatusBadge(policy, t);
  const StatusIcon = statusBadge.icon;

  return (
    <Link href={`/policies/${policy.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <div 
          className="bg-card rounded-2xl border border-border/50 shadow-sm active:bg-muted/30 transition-all duration-150 min-h-[88px]"
          data-testid={`policy-card-${policy.id}`}
        >
          {/* Simplified 3-Item Layout: Icon + Provider | Status Badge | Premium */}
          <div className="p-4 flex items-center gap-4">
            {/* 1. iOS-Style Icon */}
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${getIOSIconBg(policy.type)}`}>
              <policy.icon className="h-7 w-7 text-white" />
            </div>

            {/* 2. Type + Provider (stacked) */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground leading-tight truncate">
                {policy.type}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {policy.provider}
              </p>
              
              {/* Single Smart Status Badge */}
              <Badge 
                variant="secondary"
                className={`mt-2 text-xs font-medium ${statusBadge.className}`}
                data-testid={`status-badge-${policy.id}`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusBadge.label}
              </Badge>
            </div>

            {/* 3. Premium + Chevron */}
            <div className="flex items-center gap-2 shrink-0">
              <p className="text-base font-bold text-foreground">{policy.premium}</p>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
