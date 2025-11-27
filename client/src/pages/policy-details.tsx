import { useRoute, Link } from "wouter";
import { policies } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, CreditCard, Users, AlertTriangle, FileCheck, Shield, TrendingUp, AlertCircle, DollarSign, CheckCircle2, Calendar, Hash, FileText } from "lucide-react";
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

export default function PolicyDetailsPage() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/policies/:id");
  const id = params ? parseInt(params.id) : 0;
  const policy = policies.find((p) => p.id === id);
  const userProfile = useUserProfile();

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">{t('policyDetails.policyNotFound')}</h1>
        <Link href="/policies">
          <Button>{t('policyDetails.backToPolicies')}</Button>
        </Link>
      </div>
    );
  }

  // Calculate gap analysis based on user profile
  const gapAnalysis = userProfile ? calculatePolicyGaps(policy.type, userProfile) : null;
  const gapScore = gapAnalysis?.score || 0;
  
  // Calculate type-specific enhanced gap analysis
  let enhancedGapAnalysis: any = null;
  
  if (policy.type === "Home & Liability") {
    enhancedGapAnalysis = analyzeHomeGaps(450000, 280); // Example property
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

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Link href="/policies">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50 hover:scale-110 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{policy.type} Insurance</h1>
              <Badge variant={policy.status === "Active" ? "secondary" : "destructive"} className={`${policy.status === "Active" ? "bg-emerald-100 text-emerald-800" : ""}`}>
                {policy.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{policy.provider} • {policy.policyNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('actions.downloadACORD')}
          </Button>
          <Button size="sm">{t('actions.makePayment')}</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
               <Shield className="h-6 w-6" />
             </div>
             <div className="min-w-0">
               <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('policyDetails.lobCode')}</p>
               <p className="text-lg font-bold text-foreground truncate">{policy.lob}</p>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-emerald-200/50 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-sm">
               <DollarSign className="h-6 w-6" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('policyCard.premium')}</p>
               <p className="text-lg font-bold text-foreground">{policy.premium}</p>
             </div>
          </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30 hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-blue-200/50 dark:bg-blue-800/50 flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-sm">
               <Calendar className="h-6 w-6" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('policyDetails.effective')}</p>
               <p className="text-lg font-bold text-foreground">{policy.effectiveDate}</p>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-muted">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
               <Users className="h-5 w-5" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('policyDetails.beneficiaries')}</p>
               <p className="text-xl font-bold text-foreground">{policy.details?.beneficiaries.length || 0}</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">{t('policyDetails.overview')}</TabsTrigger>
          <TabsTrigger value="billing">{t('policyDetails.billing')}</TabsTrigger>
          <TabsTrigger value="claims">{t('policyDetails.claimsTab')}</TabsTrigger>
          <TabsTrigger value="analysis">{t('policyDetails.analysis')}</TabsTrigger>
        </TabsList>

        {/* Type-Specific Detailed Views */}
        {policy.type === "Health" && <TabsContent value="overview" className="mt-6"><HealthDetailedView policy={policy} metadata={policy.quickViewMetadata} /></TabsContent>}
        {policy.type === "Auto" && <TabsContent value="overview" className="mt-6"><AutoDetailedView policy={policy} metadata={policy.quickViewMetadata} /></TabsContent>}
        {policy.type === "Home & Liability" && <TabsContent value="overview" className="mt-6"><HomeDetailedView policy={policy} metadata={policy.quickViewMetadata} /></TabsContent>}
        {policy.type === "Investment Life" && <TabsContent value="overview" className="mt-6"><InvestmentLifeDetailedView policy={policy} metadata={policy.quickViewMetadata} /></TabsContent>}
        {policy.type === "Pet Insurance" && <TabsContent value="overview" className="mt-6"><PetDetailedView policy={policy} metadata={policy.quickViewMetadata} /></TabsContent>}
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <FileCheck className="h-5 w-5 text-primary" />
                   {t('policyDetails.scheduleOfBenefits')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 divide-y">
                {Object.entries(policy.details?.coverageLimits || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-muted-foreground">{key}</span>
                    <span className="text-sm font-bold text-foreground text-right">{value as string}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <Users className="h-5 w-5 text-primary" />
                     Beneficiaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policy.details?.beneficiaries.map((beneficiary: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-secondary">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {beneficiary.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-bold text-sm">{beneficiary.name}</p>
                             <p className="text-xs text-muted-foreground">Rel: {beneficiary.relation} • DOB: {beneficiary.dob}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <Badge variant="outline">{beneficiary.allocation}</Badge>
                           {beneficiary.primary && <p className="text-[10px] text-primary font-medium mt-1">{ t("details.primary") }</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                       <FileText className="h-5 w-5 text-primary" />
                       Technical Data
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                       <p className="text-muted-foreground text-xs uppercase">Carrier ID</p>
                       <p className="font-mono font-medium">{policy.carrierId || "N/A"}</p>
                    </div>
                    <div>
                       <p className="text-muted-foreground text-xs uppercase">{ t('policy.lobCode') }</p>
                       <p className="font-mono font-medium">{policy.lob || "N/A"}</p>
                    </div>
                    <div>
                       <p className="text-muted-foreground text-xs uppercase">Payment Freq</p>
                       <p className="font-medium">{policy.paymentFrequency || "Monthly"}</p>
                    </div>
                    <div>
                       <p className="text-muted-foreground text-xs uppercase">{ t("details.expiration") }</p>
                       <p className="font-medium">{policy.expiry}</p>
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
               <CardTitle>{t('billing.paymentStatus')}</CardTitle>
               <CardDescription>{t('cardDescriptions.managePaymentsHistory')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                       <p className="font-bold text-yellow-900">Pending Payment</p>
                       <p className="text-sm text-yellow-700">Due on {policy.details?.nextPaymentDue}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-lg text-yellow-900">${policy.details?.pendingPayments > 0 ? policy.details?.pendingPayments : policy.premium.replace('/mo', '')}</p>
                    <Button size="sm" className="mt-1 h-7 text-xs bg-yellow-600 hover:bg-yellow-700 border-none text-white">Pay Now</Button>
                 </div>
              </div>

              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground tracking-wider">Payment History</h3>
              <div className="space-y-2">
                 <div className="flex justify-between items-center p-3 border rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                       <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="font-medium">{ t('policy.monthlyPremium') }</p>
                          <p className="text-xs text-muted-foreground">{policy.details?.lastPayment}</p>
                       </div>
                    </div>
                    <span className="font-bold">{policy.premium}</span>
                 </div>
                 {/* Mock older history */}
                 <div className="flex justify-between items-center p-3 border rounded-lg bg-white opacity-70">
                    <div className="flex items-center gap-3">
                       <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="font-medium">{ t('policy.monthlyPremium') }</p>
                          <p className="text-xs text-muted-foreground">2025-10-01</p>
                       </div>
                    </div>
                    <span className="font-bold">{policy.premium}</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-bold">{t('policyDetails.claimsHistory')}</h3>
             <Button size="sm" variant="outline">{t('actions.fileNewClaim')}</Button>
          </div>
          
          {policy.details?.claims.length === 0 ? (
            <Card className="bg-muted/20 border-dashed">
               <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mb-3 opacity-20" />
                  <p>{t('policyDetails.noClaimsFiled')}</p>
               </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
               {policy.details?.claims.map((claim: any) => (
                  <Card key={claim.id}>
                     <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold">{claim.reason}</h4>
                                <Badge variant={claim.status === "Paid" ? "secondary" : "outline"} className={claim.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800 border-orange-200"}>
                                   {claim.status}
                                </Badge>
                             </div>
                             <div className="text-xs text-muted-foreground space-y-1">
                                <p>ID: <span className="font-mono">{claim.id}</span> • Incident: {claim.incidentDate}</p>
                                <p>Adjuster: {claim.adjuster || "Unassigned"}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-lg">{claim.amount}</p>
                             <p className="text-xs text-muted-foreground">Paid: {claim.paidAmount}</p>
                             <p className="text-xs text-muted-foreground">Reserve: {claim.reserveAmount}</p>
                          </div>
                        </div>
                        
                        {/* ACORD Claim Status Steps */}
                        {claim.steps && (
                           <div className="w-full bg-secondary/30 h-1.5 rounded-full mt-2 overflow-hidden flex">
                              {claim.steps.map((s: string, i: number) => (
                                 <div key={i} className={`h-full flex-1 border-r border-white/20 last:border-0 ${i < (claim.step || 0) ? 'bg-primary' : 'bg-transparent'}`}></div>
                              ))}
                           </div>
                        )}
                        <div className="flex justify-between mt-1">
                           {claim.steps?.map((s: string, i: number) => (
                              <span key={i} className={`text-[10px] ${i < (claim.step || 0) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{s}</span>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-6">
             {/* Enhanced Dynamic Gap Analysis */}
             {enhancedGapAnalysis && (
                <DynamicGapRecommendations 
                  analysis={enhancedGapAnalysis}
                  onQuoteRequest={() => {
                    toast.success("Quote request sent to agent!");
                  }}
                />
             )}
             
             {gapAnalysis ? (
                <PolicyRecommendations 
                  analysis={gapAnalysis} 
                  onContactAgent={() => {
                    toast.info("Redirecting to agent contact form...");
                  }}
                />
             ) : (
                <Card className="bg-blue-50 border-blue-200">
                   <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                         <AlertCircle className="h-12 w-12 text-blue-600 mx-auto" />
                         <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                         <p className="text-sm text-muted-foreground">
                            Personalized gap analysis requires your profile information. Visit the Profile page to get started.
                         </p>
                         <Link href="/profile">
                            <Button className="mt-2">Complete Profile</Button>
                         </Link>
                      </div>
                   </CardContent>
                </Card>
             )}

             <Card className="bg-indigo-50 border-indigo-100">
                <CardHeader>
                   <CardTitle className="text-indigo-900">{ t("details.proposals") }</CardTitle>
                </CardHeader>
                <CardContent>
                   {policy.details?.gapAnalysis?.proposals.length > 0 ? (
                      <ul className="space-y-3">
                         {policy.details?.gapAnalysis?.proposals.map((prop: string, i: number) => (
                            <li key={i} className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 text-sm">
                               <p className="font-medium text-indigo-900">{prop}</p>
                               <Button size="sm" variant="ghost" className="mt-2 w-full text-xs text-indigo-600 hover:bg-indigo-50 h-7">
                                  View Quote
                               </Button>
                            </li>
                         ))}
                      </ul>
                   ) : (
                      <p className="text-sm text-indigo-800">No new proposals. Your coverage is optimal!</p>
                   )}
                </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Universal Broker Actions */}
      <UniversalBrokerActions policy={policy} />
    </div>
  );
}
