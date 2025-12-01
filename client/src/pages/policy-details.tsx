import { useRoute, Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { 
  ArrowLeft, 
  Download, 
  Shield, 
  Calendar, 
  Hash, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  Home, 
  Heart, 
  PawPrint,
  Briefcase,
  User,
  Loader2,
  AlertCircle
} from "lucide-react";
import type { Policy, PolicyCoverage, PolicyVehicle, PolicyProperty, PolicyBeneficiary, PolicyDriver } from "@shared/schema";

interface PolicyWithRelations extends Policy {
  beneficiaries?: PolicyBeneficiary[];
  drivers?: PolicyDriver[];
  coverages?: PolicyCoverage[];
  vehicles?: PolicyVehicle[];
  properties?: PolicyProperty[];
}

function getIOSIconBg(policyType: string) {
  switch(policyType.toLowerCase()) {
    case "health": return "bg-red-500 dark:bg-red-600";
    case "auto": return "bg-blue-500 dark:bg-blue-600";
    case "home": return "bg-amber-500 dark:bg-amber-600";
    case "life": return "bg-emerald-500 dark:bg-emerald-600";
    case "pet": return "bg-purple-500 dark:bg-purple-600";
    case "travel": return "bg-cyan-500 dark:bg-cyan-600";
    default: return "bg-slate-500 dark:bg-slate-600";
  }
}

function getPolicyIcon(policyType: string) {
  switch(policyType.toLowerCase()) {
    case "health": return Heart;
    case "auto": return Car;
    case "home": return Home;
    case "life": return Briefcase;
    case "pet": return PawPrint;
    default: return Shield;
  }
}

function getStatusBadgeClass(status: string) {
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
}

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(num);
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PolicyDetailsPage() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/policies/:id");
  const policyId = params?.id || "";
  const [activeTab, setActiveTab] = useState<"overview" | "coverages" | "details">("overview");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: policyData, isLoading, error } = useQuery<PolicyWithRelations>({
    queryKey: ["/api/policies", policyId],
    enabled: !!policyId && isAuthenticated,
    retry: false,
  });

  const policy = policyData;
  const coverages = policyData?.coverages || [];
  const vehicles = policyData?.vehicles || [];
  const properties = policyData?.properties || [];
  const beneficiaries = policyData?.beneficiaries || [];
  const drivers = policyData?.drivers || [];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("401")) {
        setLocation("/login");
      }
    }
  }, [error, setLocation]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-xl font-semibold">{t("policyDetails.policyNotFound")}</h1>
        <Link href="/policies">
          <Button className="h-12 px-6 rounded-xl">{t("policyDetails.backToPolicies")}</Button>
        </Link>
      </div>
    );
  }

  const IconComponent = getPolicyIcon(policy.policyType);
  const getPolicyTypeLabel = (type: string) => {
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

  const tabs = [
    { id: "overview", label: t("policyDetails.overview") },
    { id: "coverages", label: t("policyDetails.coveragesTab") },
    { id: "details", label: t("policyDetails.detailsTab") },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/policies">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full -ml-2"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${getIOSIconBg(policy.policyType)}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-base text-foreground truncate">
                  {getPolicyTypeLabel(policy.policyType)}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{policy.policyName || policy.policyNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full"
                data-testid="button-download"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="bg-secondary/80 rounded-xl p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-border/50 overflow-hidden mb-4">
            <div className={`h-2 ${getIOSIconBg(policy.policyType)}`} />
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t("policies.status")}</p>
                  <Badge className={getStatusBadgeClass(policy.status)}>
                    {t(`common.${policy.status}`)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t("policies.premium")}</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(policy.premium)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{policy.premiumFrequency === "monthly" ? t("time.month") : policy.premiumFrequency === "quarterly" ? t("time.quarter") : t("time.year")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t("policyDetails.startDate")}
                  </p>
                  <p className="text-sm font-medium text-foreground">{formatDate(policy.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t("policyDetails.endDate")}
                  </p>
                  <p className="text-sm font-medium text-foreground">{formatDate(policy.endDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <Card className="border border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  {t("policyDetails.policyInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("policies.policyNumber")}</span>
                  <span className="font-medium">{policy.policyNumber}</span>
                </div>
                {policy.coverageAmount && parseFloat(policy.coverageAmount.toString()) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("policyDetails.totalCoverage")}</span>
                    <span className="font-medium">{formatCurrency(policy.coverageAmount)}</span>
                  </div>
                )}
                {policy.deductible && parseFloat(policy.deductible.toString()) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("policyDetails.deductible")}</span>
                    <span className="font-medium">{formatCurrency(policy.deductible)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("policyDetails.addedMethod")}</span>
                  <Badge variant="secondary" className="text-xs">
                    {policy.addedMethod === "ai_parsed" ? t("addPolicy.document") : 
                     policy.addedMethod === "insurer_search" ? t("addPolicy.search") : 
                     t("addPolicy.manual")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {policy.holderName && (
              <Card className="border border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {t("policyDetails.policyHolder")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("addPolicy.holderName")}</span>
                    <span className="font-medium">{policy.holderName}</span>
                  </div>
                  {policy.holderAfm && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("addPolicy.taxId")}</span>
                      <span className="font-medium">{policy.holderAfm}</span>
                    </div>
                  )}
                  {policy.holderPhone && (
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {t("forms.phone")}
                      </span>
                      <span className="font-medium">{policy.holderPhone}</span>
                    </div>
                  )}
                  {policy.holderEmail && (
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {t("forms.email")}
                      </span>
                      <span className="font-medium">{policy.holderEmail}</span>
                    </div>
                  )}
                  {policy.holderAddress && (
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {t("forms.address")}
                      </span>
                      <span className="font-medium text-right max-w-[60%]">{policy.holderAddress}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {vehicles.length > 0 && (
              <Card className="border border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    {t("policyDetails.vehicleInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicles.map((vehicle, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("addPolicy.vehicleMake")}</span>
                        <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("addPolicy.vehiclePlate")}</span>
                        <span className="font-medium">{vehicle.licensePlate}</span>
                      </div>
                      {vehicle.year && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("policyDetails.year")}</span>
                          <span className="font-medium">{vehicle.year}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {properties.length > 0 && (
              <Card className="border border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    {t("policyDetails.propertyInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {properties.map((property, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("forms.address")}</span>
                        <span className="font-medium text-right max-w-[60%]">{property.address}</span>
                      </div>
                      {property.squareMeters && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("addPolicy.propertySqm")}</span>
                          <span className="font-medium">{property.squareMeters} m²</span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "coverages" && (
          <div className="space-y-4">
            {coverages.length === 0 ? (
              <Card className="border border-border/50 p-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">{t("policyDetails.noCoverages")}</p>
              </Card>
            ) : (
              coverages.map((coverage, idx) => (
                <Card key={idx} className="border border-border/50">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{coverage.coverageName}</h3>
                      {coverage.isActive && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                          {t("common.active")}
                        </Badge>
                      )}
                    </div>
                    {coverage.description && (
                      <p className="text-sm text-muted-foreground">{coverage.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("policyDetails.limit")}</p>
                        <p className="text-sm font-medium">{formatCurrency(coverage.limitAmount)}</p>
                      </div>
                      {coverage.deductible && parseFloat(coverage.deductible.toString()) > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground">{t("policyDetails.deductible")}</p>
                          <p className="text-sm font-medium">{formatCurrency(coverage.deductible)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            {beneficiaries.length > 0 && (
              <Card className="border border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t("addPolicy.beneficiaries")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {beneficiaries.map((beneficiary, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <p className="font-medium text-foreground">{beneficiary.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {beneficiary.relationship} - {beneficiary.percentage}%
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {drivers.length > 0 && (
              <Card className="border border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t("addPolicy.drivers")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {drivers.map((driver, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <p className="font-medium text-foreground">{driver.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("addPolicy.licenseNumber")}: {driver.licenseNumber}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="border border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {t("policyDetails.metadata")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("policyDetails.autoRenew")}</span>
                  <Badge variant={policy.autoRenew ? "default" : "secondary"} className="text-xs">
                    {policy.autoRenew ? t("common.yes") : t("common.no")}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("policyDetails.createdAt")}</span>
                  <span className="font-medium">{formatDate(policy.createdAt)}</span>
                </div>
                {policy.notes && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">{t("policyDetails.notes")}</p>
                    <p className="text-sm">{policy.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
