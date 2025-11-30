import { useRoute, Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { policies } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, CreditCard, Users, AlertTriangle, FileCheck, Shield, TrendingUp, AlertCircle, DollarSign, CheckCircle2, Calendar, Hash, FileText, ChevronRight, Phone, Mail, MessageCircle, Clock, MapPin, Car, Home, Heart, PawPrint } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PolicyRecommendations } from "@/components/policy-recommendations";
import { DynamicGapRecommendations } from "@/components/dynamic-gap-recommendations";
import { calculatePolicyGaps } from "@/lib/gap-calculation";
import { 
  analyzeHomeGaps, 
  analyzeAutoGaps, 
  analyzeHealthGaps, 
  analyzeInvestmentGaps, 
  analyzePetGaps,
  analyzeDoctorGaps,
  analyzeMarineGaps
} from "@/lib/enhanced-gap-analysis";
import { useUserProfile } from "@/hooks/useUserProfile";
import { HealthDetailedView, AutoDetailedView, HomeDetailedView, InvestmentLifeDetailedView, PetDetailedView, UniversalBrokerActions } from "@/components/policy-detail-sections";
import { toast } from "sonner";

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

function getPolicyIcon(policyType: string) {
  switch(policyType) {
    case "Health": return Heart;
    case "Auto": return Car;
    case "Home & Liability": return Home;
    case "Pet Insurance": return PawPrint;
    default: return Shield;
  }
}

export default function PolicyDetailsPage() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/policies/:id");
  const id = params ? parseInt(params.id) : 0;
  const policy = policies.find((p) => p.id === id);
  const userProfile = useUserProfile();
  const [activeTab, setActiveTab] = useState<"overview" | "billing" | "claims" | "analysis">("overview");

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
          <Shield className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-xl font-semibold">{t('policyDetails.policyNotFound')}</h1>
        <Link href="/policies">
          <Button className="h-12 px-6 rounded-xl">{t('policyDetails.backToPolicies')}</Button>
        </Link>
      </div>
    );
  }

  const gapAnalysis = userProfile ? calculatePolicyGaps(policy.type, userProfile) : null;
  const gapScore = gapAnalysis?.score || 0;
  
  let enhancedGapAnalysis: any = null;
  
  if (policy.type === "Home & Liability") {
    enhancedGapAnalysis = analyzeHomeGaps(450000, 280);
  } else if (policy.type === "Auto") {
    enhancedGapAnalysis = analyzeAutoGaps(25000, 180000);
  } else if (policy.type === "Health") {
    enhancedGapAnalysis = analyzeHealthGaps(1500, 800, 500);
  } else if (policy.type === "Investment Life") {
    enhancedGapAnalysis = analyzeInvestmentGaps(45200, 75000, 15);
  } else if (policy.type === "Pet Insurance") {
    enhancedGapAnalysis = analyzePetGaps("Golden Retriever", 3, { "Hip Dysplasia": true });
  } else if (policy.type === "Doctor Civil Liability") {
    enhancedGapAnalysis = analyzeDoctorGaps("Surgeon", 2010, 2015);
  } else if (policy.type === "Marine") {
    enhancedGapAnalysis = analyzeMarineGaps("Mediterranean", "Ionian", 0, 45000);
  }

  const IconComponent = policy.icon || getPolicyIcon(policy.type);

  const tabs = [
    { id: "overview", label: t('policyDetails.overview') },
    { id: "billing", label: t('policyDetails.billing') },
    { id: "claims", label: t('policyDetails.claimsTab') },
    { id: "analysis", label: t('policyDetails.analysis') },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* iOS-Style Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3">
          {/* Navigation Row */}
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
            
            {/* Compact Header Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${getIOSIconBg(policy.type)}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-base text-foreground truncate">
                  {t(`policyTypes.${policy.type.toLowerCase().replace(/[^a-z]/g, '')}`, policy.type)}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{policy.provider}</p>
              </div>
            </div>

            {/* Action Buttons */}
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

        {/* iOS-Style Segmented Control */}
        <div className="px-4 pb-3">
          <div className="bg-secondary/80 rounded-xl p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 shadow-lg ${getIOSIconBg(policy.type)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  className={`text-xs font-medium ${
                    policy.status === "Active" 
                      ? "bg-white/20 text-white border-white/30" 
                      : "bg-red-500/80 text-white border-red-400/30"
                  }`}
                >
                  {policy.status === "Active" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {t(`common.${policy.status.toLowerCase()}`)}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {t(`policyTypes.${policy.type.toLowerCase().replace(/[^a-z]/g, '')}`, policy.type)}
              </h2>
              <p className="text-white/80 text-sm">{policy.provider}</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{t('policyCard.premium')}</p>
              <p className="text-xl font-bold text-white mt-0.5">{policy.premium}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{t('policyDetails.effective')}</p>
              <p className="text-xl font-bold text-white mt-0.5">{policy.effectiveDate}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pt-6 space-y-4">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Policy Details Card */}
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50">
                  <h3 className="font-semibold text-base">{t('policyDetails.policyDetails')}</h3>
                </div>
                <div className="divide-y divide-border/50">
                  <div className="px-4 py-3.5 flex items-center justify-between min-h-[52px]">
                    <span className="text-muted-foreground text-sm">{t('appointments.policyNumber')}</span>
                    <span className="font-mono font-medium text-sm">{policy.policyNumber}</span>
                  </div>
                  <div className="px-4 py-3.5 flex items-center justify-between min-h-[52px]">
                    <span className="text-muted-foreground text-sm">{t('policyDetails.lobCode')}</span>
                    <span className="font-medium text-sm">{policy.lob}</span>
                  </div>
                  <div className="px-4 py-3.5 flex items-center justify-between min-h-[52px]">
                    <span className="text-muted-foreground text-sm">{t('details.expiration')}</span>
                    <span className="font-medium text-sm">{policy.expiry}</span>
                  </div>
                  <div className="px-4 py-3.5 flex items-center justify-between min-h-[52px]">
                    <span className="text-muted-foreground text-sm">{t('policyCard.coverage')}</span>
                    <span className="font-medium text-sm">{policy.coverage}</span>
                  </div>
                </div>
              </div>

              {/* Coverage Limits */}
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">{t('policyDetails.scheduleOfBenefits')}</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {Object.entries(policy.details?.coverageLimits || {}).map(([key, value]) => (
                    <div key={key} className="px-4 py-3.5 flex items-center justify-between min-h-[52px]">
                      <span className="text-muted-foreground text-sm">{key}</span>
                      <span className="font-semibold text-sm">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficiaries */}
              {policy.details?.beneficiaries && policy.details.beneficiaries.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-base">{t('policyDetails.beneficiaries')}</h3>
                  </div>
                  <div className="divide-y divide-border/50">
                    {policy.details.beneficiaries.map((beneficiary: any, i: number) => (
                      <div key={i} className="px-4 py-3.5 flex items-center gap-3 min-h-[60px]">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {beneficiary.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{beneficiary.name}</p>
                          <p className="text-xs text-muted-foreground">{beneficiary.relation}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="secondary" className="text-xs">{beneficiary.allocation}</Badge>
                          {beneficiary.primary && (
                            <p className="text-[10px] text-primary font-medium mt-1">{t("details.primary")}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type-Specific Views */}
              {policy.type === "Health" && <HealthDetailedView policy={policy} metadata={policy.quickViewMetadata} />}
              {policy.type === "Auto" && <AutoDetailedView policy={policy} metadata={policy.quickViewMetadata} />}
              {policy.type === "Home & Liability" && <HomeDetailedView policy={policy} metadata={policy.quickViewMetadata} />}
              {policy.type === "Investment Life" && <InvestmentLifeDetailedView policy={policy} metadata={policy.quickViewMetadata} />}
              {policy.type === "Pet Insurance" && <PetDetailedView policy={policy} metadata={policy.quickViewMetadata} />}
            </motion.div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Payment Alert */}
              <div className="bg-amber-50 dark:bg-amber-950/50 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-amber-900 dark:text-amber-100">{t('details.pendingPayment')}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                      {t('details.dueOn')} {policy.details?.nextPaymentDue}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-lg text-amber-900 dark:text-amber-100">
                      ${policy.details?.pendingPayments > 0 ? policy.details?.pendingPayments : policy.premium.replace('/mo', '')}
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  data-testid="button-pay-now"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('details.payNow')}
                </Button>
              </div>

              {/* Payment History */}
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50">
                  <h3 className="font-semibold text-base">{t('details.paymentHistory')}</h3>
                </div>
                <div className="divide-y divide-border/50">
                  <div className="px-4 py-3.5 flex items-center gap-3 min-h-[60px]">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{t('policy.monthlyPremium')}</p>
                      <p className="text-xs text-muted-foreground">{policy.details?.lastPayment}</p>
                    </div>
                    <span className="font-bold text-sm">{policy.premium}</span>
                  </div>
                  <div className="px-4 py-3.5 flex items-center gap-3 min-h-[60px] opacity-60">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{t('policy.monthlyPremium')}</p>
                      <p className="text-xs text-muted-foreground">2025-10-01</p>
                    </div>
                    <span className="font-bold text-sm">{policy.premium}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Claims Tab */}
          {activeTab === "claims" && (
            <motion.div
              key="claims"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* File New Claim Button */}
              <Button 
                className="w-full h-12 rounded-xl font-semibold"
                data-testid="button-file-claim"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t('actions.fileNewClaim')}
              </Button>

              {policy.details?.claims?.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground">{t('policyDetails.noClaimsFiled')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {policy.details?.claims?.map((claim: any) => (
                    <div key={claim.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">{claim.reason}</h4>
                              <Badge 
                                variant="secondary"
                                className={`text-xs ${
                                  claim.status === "Paid" 
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                }`}
                              >
                                {claim.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t('policy.id')}: {claim.id} · {claim.incidentDate}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-lg">{claim.amount}</p>
                            <p className="text-xs text-muted-foreground">{t('billing.paid')}: {claim.paidAmount}</p>
                          </div>
                        </div>
                        
                        {claim.steps && (
                          <>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden flex">
                              {claim.steps.map((s: string, i: number) => (
                                <div 
                                  key={i} 
                                  className={`h-full flex-1 border-r border-background last:border-0 ${
                                    i < (claim.step || 0) ? 'bg-primary' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex justify-between mt-2">
                              {claim.steps.map((s: string, i: number) => (
                                <span 
                                  key={i} 
                                  className={`text-[10px] ${
                                    i < (claim.step || 0) ? 'text-primary font-bold' : 'text-muted-foreground'
                                  }`}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {enhancedGapAnalysis && (
                <DynamicGapRecommendations 
                  analysis={enhancedGapAnalysis}
                  onQuoteRequest={() => {
                    toast.success(t('policyDetails.quoteRequestSent'));
                  }}
                />
              )}
              
              {gapAnalysis ? (
                <PolicyRecommendations 
                  analysis={gapAnalysis} 
                  onContactAgent={() => {
                    toast.info(t('policyDetails.redirectingToAgent'));
                  }}
                />
              ) : (
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                    {t('policyDetails.completeYourProfile')}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    {t('policyDetails.profileRequiredForGapAnalysis')}
                  </p>
                  <Link href="/profile">
                    <Button className="h-12 px-6 rounded-xl" data-testid="button-complete-profile">
                      {t('policyDetails.completeProfile')}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Proposals */}
              {policy.details?.gapAnalysis?.proposals?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-base">{t("details.proposals")}</h3>
                  </div>
                  <div className="divide-y divide-border/50">
                    {policy.details.gapAnalysis.proposals.map((prop: string, i: number) => (
                      <div key={i} className="p-4">
                        <p className="text-sm mb-3">{prop}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full h-10 rounded-xl"
                          data-testid={`button-view-quote-${i}`}
                        >
                          {t('policyDetails.viewQuote')}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Universal Broker Actions */}
      <div className="px-4 pt-6">
        <UniversalBrokerActions policy={policy} />
      </div>
    </div>
  );
}
