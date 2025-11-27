import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Plus, Clock, AlertCircle, Phone, Heart, ShieldAlert } from "lucide-react";

export function QuickActions() {
  const { t } = useTranslation();
  
  const actions = [
    {
      icon: Plus,
      labelKey: "quickActions.addPolicy",
      href: "/policies",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      testId: "quick-add-policy"
    },
    {
      icon: Clock,
      labelKey: "quickActions.renewPolicy",
      href: "/renewals",
      color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
      testId: "quick-renew-policy"
    },
    {
      icon: ShieldAlert,
      labelKey: "quickActions.fileClaim",
      href: "/claims",
      color: "bg-red-100 text-red-700 hover:bg-red-200",
      testId: "quick-file-claim"
    },
    {
      icon: Heart,
      labelKey: "quickActions.bookAppointment",
      href: "/appointments",
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
      testId: "quick-book-appointment"
    },
    {
      icon: AlertCircle,
      labelKey: "quickActions.viewRecommendations",
      href: "/recommendations",
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      testId: "quick-recommendations"
    },
    {
      icon: Phone,
      labelKey: "quickActions.contactAgent",
      href: "/agents",
      color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
      testId: "quick-contact-agent"
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{t('quickActions.quickActions')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.testId} href={action.href}>
              <Button
                variant="ghost"
                className={`w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all ${action.color}`}
                data-testid={action.testId}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium text-center">{t(action.labelKey)}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
