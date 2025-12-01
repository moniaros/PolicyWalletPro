import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldAlert,
  Plus,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Euro,
  ChevronRight,
  Upload,
  Calendar,
  ArrowRight,
  CircleDollarSign,
  FileCheck,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Eye,
  X,
  Banknote,
  Timer,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface Claim {
  id: string;
  reason: string;
  amount: string;
  amountValue: number;
  status: "Submitted" | "In Review" | "Approved" | "Paid" | "Rejected";
  policyType: string;
  policyProvider: string;
  reportedDate: string;
  estimatedCompletion?: string;
  step: number;
  documents?: number;
  notes?: string;
}

const claimsData: Claim[] = [
  { 
    id: "CLM-2024-001", 
    reason: "Car Accident Repair", 
    amount: "€2,450", 
    amountValue: 2450,
    status: "In Review", 
    policyType: "Auto", 
    policyProvider: "Generali", 
    reportedDate: "2024-11-28",
    estimatedCompletion: "2024-12-15",
    step: 2,
    documents: 4,
    notes: "Awaiting damage assessment report"
  },
  { 
    id: "CLM-2024-002", 
    reason: "Medical Consultation", 
    amount: "€180", 
    amountValue: 180,
    status: "Approved", 
    policyType: "Health", 
    policyProvider: "NN Hellas", 
    reportedDate: "2024-11-20",
    estimatedCompletion: "2024-12-05",
    step: 3,
    documents: 2
  },
  { 
    id: "CLM-2024-003", 
    reason: "Dental Treatment", 
    amount: "€320", 
    amountValue: 320,
    status: "Paid", 
    policyType: "Health", 
    policyProvider: "NN Hellas", 
    reportedDate: "2024-10-15",
    step: 4,
    documents: 3
  },
  { 
    id: "CLM-2024-004", 
    reason: "Water Damage Repair", 
    amount: "€1,850", 
    amountValue: 1850,
    status: "Paid", 
    policyType: "Home", 
    policyProvider: "Ergo", 
    reportedDate: "2024-09-10",
    step: 4,
    documents: 6
  },
  { 
    id: "CLM-2024-005", 
    reason: "Prescription Medication", 
    amount: "€95", 
    amountValue: 95,
    status: "Paid", 
    policyType: "Health", 
    policyProvider: "NN Hellas", 
    reportedDate: "2024-08-22",
    step: 4,
    documents: 1
  },
];

const policies = [
  { id: 1, type: "Health", provider: "NN Hellas" },
  { id: 2, type: "Auto", provider: "Generali" },
  { id: 3, type: "Home", provider: "Ergo" },
  { id: 4, type: "Life", provider: "Interamerican" },
];

const statusConfig = {
  Submitted: { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-900/40", icon: FileText },
  "In Review": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", icon: Clock },
  Approved: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", icon: CheckCircle2 },
  Paid: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: CircleDollarSign },
  Rejected: { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: X },
};

const claimSteps = ["Submitted", "Reviewing", "Approved", "Paid"];

export default function ClaimsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");

  // Calculate stats
  const activeClaims = claimsData.filter(c => c.status !== "Paid" && c.status !== "Rejected");
  const paidClaims = claimsData.filter(c => c.status === "Paid");
  const totalPaid = paidClaims.reduce((acc, c) => acc + c.amountValue, 0);
  const pendingAmount = activeClaims.reduce((acc, c) => acc + c.amountValue, 0);
  const successRate = Math.round((paidClaims.length / claimsData.length) * 100);
  const avgProcessingDays = 12; // Mock average

  const handleSubmitClaim = () => {
    toast.success("Claim submitted successfully! You'll receive updates via email.");
    setIsWizardOpen(false);
    setWizardStep(1);
    setSelectedPolicy("");
    setIncidentDate("");
    setIncidentType("");
    setDescription("");
  };

  const recentPayouts = paidClaims.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Claims Center</h1>
                <p className="text-xs text-muted-foreground">{claimsData.length} total claims</p>
              </div>
            </div>
            <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-red-600 hover:bg-red-700" data-testid="button-file-claim">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">File Claim</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>File a New Claim</DialogTitle>
                  <DialogDescription>Step {wizardStep} of 3</DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center gap-2 py-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div className={`h-2 flex-1 rounded-full ${step <= wizardStep ? "bg-primary" : "bg-muted"}`} />
                    </div>
                  ))}
                </div>

                {wizardStep === 1 && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Which policy?</Label>
                      <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                        <SelectTrigger data-testid="select-policy">
                          <SelectValue placeholder="Select a policy" />
                        </SelectTrigger>
                        <SelectContent>
                          {policies.map(p => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.type} - {p.provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date of incident</Label>
                      <Input 
                        type="date" 
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        data-testid="input-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type of incident</Label>
                      <Select value={incidentType} onValueChange={setIncidentType}>
                        <SelectTrigger data-testid="select-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="damage">Property Damage</SelectItem>
                          <SelectItem value="medical">Medical Expense</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Describe what happened</Label>
                      <Textarea 
                        placeholder="Provide details about the incident..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-28"
                        data-testid="textarea-description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Upload evidence</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl h-28 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                        <Camera className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-sm">Tap to upload photos or documents</span>
                        <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</span>
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4 py-6 text-center">
                    <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Ready to Submit</h3>
                    <p className="text-sm text-muted-foreground">
                      Review your claim details before submitting. You'll receive email updates on the status.
                    </p>
                    <Card className="p-4 text-left bg-muted/30">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Policy:</span>
                          <span className="font-medium">{policies.find(p => p.id.toString() === selectedPolicy)?.type || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Incident Date:</span>
                          <span className="font-medium">{incidentDate || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{incidentType || "—"}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <DialogFooter className="flex justify-between sm:justify-between gap-2">
                  {wizardStep > 1 ? (
                    <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)}>Back</Button>
                  ) : <div />}
                  
                  {wizardStep < 3 ? (
                    <Button onClick={() => setWizardStep(wizardStep + 1)} data-testid="button-next">
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitClaim} data-testid="button-submit-claim">
                      Submit Claim
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Claims Overview - Hero Widget */}
        <Card className="p-5 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-5">
            {/* Total Paid Circle */}
            <div className="relative h-24 w-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted/20"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#claimsGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${successRate}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="claimsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{successRate}%</span>
                <span className="text-xs text-muted-foreground">Success</span>
              </div>
            </div>
            
            {/* Overview Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground mb-1">Claims Overview</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Total recovered: <span className="font-bold text-emerald-600 dark:text-emerald-400">€{totalPaid.toLocaleString()}</span>
              </p>
              <div className="flex items-center gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">{activeClaims.length} Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">{paidClaims.length} Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">~{avgProcessingDays} days avg</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{claimsData.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{activeClaims.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{paidClaims.length}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
          </Card>
          <Card className="p-3 border border-border/50">
            <div className="text-center">
              <Euro className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">€{pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </Card>
        </div>

        {/* Active Claims Section */}
        {activeClaims.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-foreground">Active Claims</h2>
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {activeClaims.length}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              {activeClaims.map((claim) => {
                const config = statusConfig[claim.status];
                const StatusIcon = config.icon;
                const progressPercent = (claim.step / 4) * 100;
                
                return (
                  <Card key={claim.id} className="p-4 border border-border/50" data-testid={`claim-${claim.id}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-foreground">{claim.reason}</h3>
                          <Badge variant="outline" className={`text-xs px-1.5 py-0 ${config.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {claim.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {claim.policyType} ({claim.policyProvider}) • Filed {new Date(claim.reportedDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {claim.id} • {claim.documents} documents
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-foreground">{claim.amount}</p>
                        <p className="text-xs text-muted-foreground">Claimed</p>
                      </div>
                    </div>
                    
                    {/* Progress Tracker */}
                    <div className="space-y-2">
                      <Progress value={progressPercent} className="h-2" />
                      <div className="flex justify-between text-xs">
                        {claimSteps.map((step, idx) => (
                          <span 
                            key={step} 
                            className={idx < claim.step ? "text-primary font-medium" : "text-muted-foreground"}
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {claim.notes && (
                      <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <MessageSquare className="h-3 w-3" />
                          {claim.notes}
                        </p>
                      </div>
                    )}
                    
                    {claim.estimatedCompletion && (
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Estimated completion</span>
                        <span className="font-medium text-foreground">
                          {new Date(claim.estimatedCompletion).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Active Claims State */}
        {activeClaims.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Active Claims</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All your claims have been processed. File a new claim if needed.
            </p>
            <Button onClick={() => setIsWizardOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              File New Claim
            </Button>
          </Card>
        )}

        {/* Recent Payouts Widget */}
        {recentPayouts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-foreground">Recent Payouts</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {recentPayouts.map((claim) => (
                <Card key={claim.id} className="p-4 min-w-[200px] flex-shrink-0 border border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-emerald-700 dark:text-emerald-300">{claim.amount}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Paid</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm text-foreground line-clamp-1">{claim.reason}</p>
                  <p className="text-xs text-muted-foreground">{claim.policyProvider}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Claims History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Claims History</h2>
            </div>
          </div>
          
          <div className="space-y-2">
            {paidClaims.map((claim) => {
              const config = statusConfig[claim.status];
              const StatusIcon = config.icon;
              
              return (
                <Card 
                  key={claim.id} 
                  className="p-4 border border-border/50 bg-muted/20"
                  data-testid={`history-${claim.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-foreground">{claim.reason}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {claim.policyProvider} • {new Date(claim.reportedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{claim.amount}</p>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 text-emerald-600 border-emerald-200">
                        Paid
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-blue-900 dark:text-blue-100 mb-1">Need Help Filing a Claim?</h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                Our support team is here to help you through the claims process. Average response time: 2 hours.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Chat with Us
                </Button>
                <Button size="sm" variant="ghost" className="text-blue-700 dark:text-blue-300">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  FAQ
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Quick Tips</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <Camera className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-foreground">Document Everything</p>
                  <p className="text-xs text-muted-foreground">Photos speed up claims</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs text-foreground">File Within 48h</p>
                  <p className="text-xs text-muted-foreground">Faster processing time</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
