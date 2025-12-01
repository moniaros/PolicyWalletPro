import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Search, X, ChevronRight, Plus, FileText, Heart, Car, Home, Briefcase, Dog, Loader2, Shield } from "lucide-react";
import type { Policy } from "@shared/schema";

type PolicyWithVehicle = Policy;

const getPolicyIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "auto": return Car;
    case "health": return Heart;
    case "home": return Home;
    case "life": return Briefcase;
    case "pet": return Dog;
    default: return FileText;
  }
};

const getPolicyTypeLabel = (type: string, t: any) => {
  const labels: Record<string, string> = {
    health: t("policyTypes.health"),
    auto: t("policyTypes.auto"),
    home: t("policyTypes.home"),
    life: t("policyTypes.life"),
    travel: t("policyTypes.travel"),
    pet: t("policyTypes.pet"),
    business: t("policyTypes.business"),
  };
  return labels[type.toLowerCase()] || type;
};

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "expired":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "cancelled":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "";
  }
};

const formatPremium = (premium: string | number, frequency: string) => {
  const amount = typeof premium === "string" ? parseFloat(premium) : premium;
  const formatted = new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
  return `${formatted}/${frequency === "monthly" ? "month" : frequency === "quarterly" ? "quarter" : "year"}`;
};

const getVehicleLabel = (policy: PolicyWithVehicle): string => {
  const policyAny = policy as any;
  const vehicleData = policyAny.vehicleData || policyAny.documentParsedData?.vehicle;
  if (!vehicleData) return "";
  
  const parts: string[] = [];
  
  if (vehicleData.make) parts.push(vehicleData.make.toUpperCase());
  if (vehicleData.model) parts.push(vehicleData.model.toUpperCase());
  if (vehicleData.engineCC) parts.push(`(${vehicleData.engineCC})`);
  if (vehicleData.year) parts.push(`- ${vehicleData.year}`);
  if (vehicleData.plate) parts.push(`- ${vehicleData.plate.toUpperCase()}`);
  
  return parts.join(" ") || "";
};

const getRenewalDuration = (frequency: string, t: any): string => {
  switch (frequency?.toLowerCase()) {
    case "annual":
    case "yearly":
      return t("policies.annual");
    case "monthly":
      return t("policies.monthly");
    case "quarterly":
      return t("policies.quarterly");
    case "semiannual":
    case "semi-annual":
      return t("policies.semiAnnual");
    default:
      return t("policies.annual");
  }
};

const getCategoryLabel = (type: string, t: any): string => {
  switch (type.toLowerCase()) {
    case "auto":
      return t("policies.transportation");
    case "health":
      return t("policies.health");
    case "home":
      return t("policies.property");
    case "life":
      return t("policies.lifeProtection");
    default:
      return getPolicyTypeLabel(type, t);
  }
};

const getCategoryIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "auto": return Car;
    case "health": return Heart;
    case "home": return Home;
    case "life": return Briefcase;
    case "pet": return Dog;
    default: return FileText;
  }
};

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data: policies = [], isLoading } = useQuery<PolicyWithVehicle[]>({
    queryKey: ["/api/policies"],
  });

  const groupedPolicies = useMemo(() => {
    const groups: Record<string, PolicyWithVehicle[]> = {};
    policies.forEach((policy) => {
      const type = policy.policyType.toLowerCase();
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(policy);
    });
    return groups;
  }, [policies]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const filteredPolicies = policies.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.policyNumber.toLowerCase().includes(searchLower) ||
      p.policyType.toLowerCase().includes(searchLower) ||
      p.policyName?.toLowerCase().includes(searchLower) ||
      p.holderName?.toLowerCase().includes(searchLower);

    const isExpiringSoon = new Date(p.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && p.status === "active") ||
      (activeFilter === "expiring" && isExpiringSoon && p.status === "active");

    return matchesSearch && matchesFilter;
  });

  const activePolicies = policies.filter((p) => p.status === "active").length;
  const expiringPolicies = policies.filter(
    (p) => p.status === "active" && new Date(p.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const filterOptions = [
    { id: "all", label: t("policies.allPolicies"), shortLabel: t("common.all"), count: policies.length },
    { id: "active", label: t("common.active"), shortLabel: t("common.active"), count: activePolicies },
    { id: "expiring", label: t("policies.expiringSoon"), shortLabel: t("policies.expiring"), count: expiringPolicies },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{t("policies.title")}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {policies.length} {t("policies.totalPolicies")}
              </p>
            </div>
            <Link href="/add-policy">
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                data-testid="button-add-policy"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div
              className={`flex items-center gap-2 bg-secondary/80 rounded-xl transition-all ${
                isSearchFocused ? "ring-2 ring-primary/50" : ""
              }`}
            >
              <Search className="h-4 w-4 text-muted-foreground ml-3 flex-shrink-0" />
              <Input
                placeholder={t("policies.searchPlaceholder")}
                className="border-0 shadow-none focus-visible:ring-0 h-11 bg-transparent text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                data-testid="input-search-policies"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2 mr-1 rounded-full hover:bg-muted/50 transition-colors"
                    onClick={() => setSearch("")}
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="relative bg-secondary/60 rounded-xl p-1">
            <div className="grid grid-cols-3 gap-1">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative flex flex-col items-center justify-center min-h-[44px] px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`filter-${filter.id}`}
                >
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.shortLabel}</span>
                  <span
                    className={`text-xs mt-0.5 ${
                      activeFilter === filter.id ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {policies.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("policies.noPolicies")}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{t("policies.noPoliciesDesc")}</p>
            <Link href="/add-policy">
              <Button data-testid="button-add-first-policy">
                <Plus className="h-4 w-4 mr-2" />
                {t("policies.addFirstPolicy")}
              </Button>
            </Link>
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{t("policies.noResults")}</p>
            <Button variant="outline" onClick={() => setSearch("")}>
              {t("common.clearSearch")}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPolicies).map(([type, typePolicies]) => {
              const filteredTypePolicies = typePolicies.filter((p) => {
                const searchLower = search.toLowerCase();
                const vehicleLabel = getVehicleLabel(p);
                const matchesSearch =
                  p.policyNumber.toLowerCase().includes(searchLower) ||
                  p.policyType.toLowerCase().includes(searchLower) ||
                  p.policyName?.toLowerCase().includes(searchLower) ||
                  p.holderName?.toLowerCase().includes(searchLower) ||
                  vehicleLabel.toLowerCase().includes(searchLower);

                const isExpiringSoon = new Date(p.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const matchesFilter =
                  activeFilter === "all" ||
                  (activeFilter === "active" && p.status === "active") ||
                  (activeFilter === "expiring" && isExpiringSoon && p.status === "active");

                return matchesSearch && matchesFilter;
              });

              if (filteredTypePolicies.length === 0) return null;

              const CategoryIcon = getCategoryIcon(type);

              return (
                <Card 
                  key={type} 
                  className="overflow-hidden border border-border/50"
                  data-testid={`card-category-${type}`}
                >
                  <div className="bg-amber-50/80 dark:bg-amber-900/20 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="h-4 w-4 text-primary" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {getCategoryLabel(type, t)}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-border/50">
                    {filteredTypePolicies.map((policy) => {
                      const vehicleLabel = getVehicleLabel(policy);
                      const displayLabel = type === "auto" && vehicleLabel 
                        ? vehicleLabel 
                        : policy.policyName || policy.policyNumber;

                      return (
                        <Link key={policy.id} href={`/policies/${policy.id}`}>
                          <div 
                            className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                            data-testid={`row-policy-${policy.id}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                <span className="font-medium text-foreground truncate">
                                  {displayLabel || t("policies.unknownVehicle")}
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </div>
                            
                            <div className="ml-5 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span>
                                <span className="font-medium text-foreground">
                                  {formatPremium(policy.premium, policy.premiumFrequency)}
                                </span>
                              </span>
                              <span>
                                {t("policies.renewalDuration")}: {getRenewalDuration(policy.premiumFrequency, t)}
                              </span>
                              <Badge className={`${getStatusBadgeClass(policy.status)} text-[10px] px-1.5 py-0`}>
                                {t(`common.${policy.status}`)}
                              </Badge>
                              <span>
                                {t("policies.expires")}: {new Date(policy.endDate).toLocaleDateString("el-GR")}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
