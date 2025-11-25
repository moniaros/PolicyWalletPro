import { useRoute, Link } from "wouter";
import { policies } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, CreditCard, Users, AlertTriangle, FileCheck, Shield, TrendingUp, AlertCircle, DollarSign, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PolicyDetailsPage() {
  const [match, params] = useRoute("/policies/:id");
  const id = params ? parseInt(params.id) : 0;
  const policy = policies.find((p) => p.id === id);

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">Policy Not Found</h1>
        <Link href="/policies">
          <Button>Back to Policies</Button>
        </Link>
      </div>
    );
  }

  // Calculate some stats for the gap analysis
  const gapScore = policy.details?.gapAnalysis?.score || 0;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/policies">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{policy.type} Insurance</h1>
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
            Download PDF
          </Button>
          <Button size="sm">Make Payment</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <Shield className="h-5 w-5" />
             </div>
             <div>
               <p className="text-sm text-muted-foreground font-medium">Total Coverage</p>
               <p className="text-xl font-bold text-foreground">{policy.coverage}</p>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-muted">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
               <DollarSign className="h-5 w-5" />
             </div>
             <div>
               <p className="text-sm text-muted-foreground font-medium">Monthly Premium</p>
               <p className="text-xl font-bold text-foreground">{policy.premium}</p>
             </div>
          </CardContent>
        </Card>
         <Card className="bg-secondary/50 border-muted">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
               <Users className="h-5 w-5" />
             </div>
             <div>
               <p className="text-sm text-muted-foreground font-medium">Beneficiaries</p>
               <p className="text-xl font-bold text-foreground">{policy.details?.beneficiaries.length || 0}</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <FileCheck className="h-5 w-5 text-primary" />
                   Coverage Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(policy.details?.coverageLimits || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold">{value as string}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <Users className="h-5 w-5 text-primary" />
                   Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {policy.details?.beneficiaries.map((name: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {name.charAt(0)}
                      </div>
                      <span className="font-medium">{name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
               <CardTitle>Payment Status</CardTitle>
               <CardDescription>Manage your upcoming payments and view history.</CardDescription>
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
                          <p className="font-medium">Monthly Premium</p>
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
                          <p className="font-medium">Monthly Premium</p>
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
             <h3 className="text-lg font-bold">Claims History</h3>
             <Button size="sm" variant="outline">File New Claim</Button>
          </div>
          
          {policy.details?.claims.length === 0 ? (
            <Card className="bg-muted/20 border-dashed">
               <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ShieldCheckIcon className="h-12 w-12 mb-3 opacity-20" />
                  <p>No claims filed yet. Keep up the good work!</p>
               </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
               {policy.details?.claims.map((claim: any) => (
                  <Card key={claim.id}>
                     <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{claim.reason}</h4>
                              <Badge variant={claim.status === "Paid" ? "secondary" : "outline"} className={claim.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800 border-orange-200"}>
                                 {claim.status}
                              </Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">Filed on {claim.date} • ID: {claim.id}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg">{claim.amount}</p>
                           <Button variant="link" size="sm" className="h-auto p-0 text-primary">View Details</Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="md:col-span-2">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Policy Gap Analysis
                   </CardTitle>
                   <CardDescription>AI-driven analysis based on your age, location, and lifestyle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div>
                      <div className="flex justify-between mb-2">
                         <span className="font-medium">Coverage Score</span>
                         <span className={`font-bold ${gapScore > 80 ? 'text-emerald-600' : gapScore > 50 ? 'text-amber-600' : 'text-red-600'}`}>{gapScore}/100</span>
                      </div>
                      <Progress value={gapScore} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-2">
                         {gapScore > 80 ? "Excellent coverage. You are well protected." : "There are some gaps in your coverage that need attention."}
                      </p>
                   </div>

                   {policy.details?.gapAnalysis?.gaps.length > 0 && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                         <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> Identified Gaps
                         </h4>
                         <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                            {policy.details?.gapAnalysis?.gaps.map((gap: string, i: number) => (
                               <li key={i}>{gap}</li>
                            ))}
                         </ul>
                      </div>
                   )}
                </CardContent>
             </Card>

             <Card className="bg-indigo-50 border-indigo-100">
                <CardHeader>
                   <CardTitle className="text-indigo-900">Proposals</CardTitle>
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
    </div>
  );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
