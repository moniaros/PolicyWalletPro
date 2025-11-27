import { useState } from "react";
import { useTranslation } from "react-i18next";
import { policies } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Plus, FileText, Camera, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function ClaimsPage() {
  const { t } = useTranslation();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Aggregate claims from all policies
  const allClaims = policies.flatMap(p => 
    (p.details?.claims || []).map(c => ({
      ...c,
      policyType: p.type,
      policyProvider: p.provider,
      policyId: p.id
    }))
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Paid": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Approved": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Reviewing": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Submitted": return "bg-gray-100 text-gray-800 border-gray-200";
      case "In Review": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('claims.claimsCenter')}</h1>
          <p className="text-muted-foreground mt-1">{t('claims.trackClaims')}</p>
        </div>
        <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200">
              <ShieldAlert className="h-4 w-4 mr-2" />
              {t('claims.fileNewClaim')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('claims.fileClaimStep', { step: wizardStep })}</DialogTitle>
            </DialogHeader>
            
            {wizardStep === 1 && (
              <div className="space-y-4 py-4">
                 <div className="grid gap-2">
                    <Label>{t('claims.whichPolicy')}</Label>
                    <Select>
                       <SelectTrigger>
                          <SelectValue placeholder={t('claims.selectPolicy')} />
                       </SelectTrigger>
                       <SelectContent>
                          {policies.map(p => (
                             <SelectItem key={p.id} value={p.id.toString()}>{p.type} - {p.provider}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="grid gap-2">
                    <Label>{t('claims.dateOfIncident')}</Label>
                    <Input type="date" />
                 </div>
                 <div className="grid gap-2">
                    <Label>{t('claims.incidentType')}</Label>
                    <Select>
                       <SelectTrigger>
                          <SelectValue placeholder={t('claims.selectType')} />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="accident">{t('claims.accident')}</SelectItem>
                          <SelectItem value="theft">{t('claims.theft')}</SelectItem>
                          <SelectItem value="damage">{t('claims.damage')}</SelectItem>
                          <SelectItem value="medical">{t('claims.medical')}</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4 py-4">
                 <div className="grid gap-2">
                    <Label>{t('claims.description')}</Label>
                    <Textarea placeholder={t('claims.describeWhat')} className="h-32" />
                 </div>
                 <div className="grid gap-2">
                    <Label>{t('claims.evidence')}</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl h-32 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                       <Camera className="h-8 w-8 mb-2 opacity-50" />
                       <span className="text-sm">{t('claims.uploadPhotos')}</span>
                    </div>
                 </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4 py-4 text-center">
                 <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                 </div>
                 <h3 className="text-lg font-bold">{t('claims.readySubmit')}</h3>
                 <p className="text-muted-foreground">{t('claims.reviewDetails')}</p>
              </div>
            )}

            <DialogFooter className="flex justify-between sm:justify-between">
               {wizardStep > 1 ? (
                 <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)}>{t('common.back')}</Button>
               ) : <div></div>}
               
               {wizardStep < 3 ? (
                 <Button onClick={() => setWizardStep(wizardStep + 1)}>{ t('forms.nextStep') }</Button>
               ) : (
                 <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsWizardOpen(false)}>Submit Claim</Button>
               )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Claims */}
      <div className="space-y-6">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Active Claims
         </h2>
         {allClaims.filter(c => c.status !== "Paid" && c.status !== "Closed").length > 0 ? (
            allClaims.filter(c => c.status !== "Paid" && c.status !== "Closed").map((claim, i) => (
               <Card key={i} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                     <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{claim.reason}</h3>
                              <Badge variant="outline" className={getStatusColor(claim.status)}>
                                 {claim.status}
                              </Badge>
                           </div>
                           <p className="text-muted-foreground text-sm">
                              {claim.policyType} ({claim.policyProvider}) • Filed on {claim.reportedDate} • ID: {claim.id}
                           </p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-xl">{claim.amount}</p>
                           <p className="text-xs text-muted-foreground">Estimated Amount</p>
                        </div>
                     </div>
                     
                     {/* Tracker */}
                     <div className="relative pt-4 pb-2">
                        <Progress value={(claim.step || 1) * 25} className="h-2" />
                        <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground">
                           {(claim.steps || [t("claimsSteps.submitted"), t("claimsSteps.reviewing"), t("claimsSteps.approved"), t("claimsSteps.paid")]).map((step: string, idx: number) => (
                              <span key={idx} className={idx < (claim.step || 0) ? "text-primary font-bold" : ""}>{step}</span>
                           ))}
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))
         ) : (
            <Card className="bg-muted/20 border-dashed">
               <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
                  <p>{ t('messages.noActiveClaims') }</p>
               </CardContent>
            </Card>
         )}
      </div>

      {/* History */}
      <div className="space-y-4 pt-4">
         <h2 className="text-xl font-bold flex items-center gap-2 text-muted-foreground">
            <FileText className="h-5 w-5" /> Past Claims
         </h2>
         <div className="grid gap-4">
            {allClaims.filter(c => c.status === "Paid" || c.status === "Closed").map((claim, i) => (
               <Card key={i} className="bg-secondary/30 border-transparent hover:bg-secondary/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                           <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                           <h4 className="font-semibold">{claim.reason}</h4>
                           <p className="text-xs text-muted-foreground">{claim.reportedDate} • {claim.policyProvider}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="font-bold text-emerald-700">{claim.amount}</span>
                        <Badge variant="outline" className="ml-3 bg-emerald-50 text-emerald-700 border-emerald-200">Paid</Badge>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
    </div>
  );
}
