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
  Euro,
  ChevronRight,
  Calendar,
  ArrowRight,
  CircleDollarSign,
  MessageSquare,
  HelpCircle,
  X,
  Banknote,
  Timer,
  Building2,
  FileCheck,
  Upload,
  Receipt,
  CreditCard,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Claim {
  id: string;
  reason: string;
  reasonEn: string;
  amount: string;
  amountValue: number;
  status: "Submitted" | "In Review" | "Approved" | "Paid" | "Rejected";
  statusLabel: string;
  policyType: string;
  policyProvider: string;
  reportedDate: string;
  estimatedCompletion?: string;
  step: number;
  documents?: number;
  notes?: string;
  claimNumber: string;
}

const claimsData: Claim[] = [
  { 
    id: "CLM-2024-001", 
    claimNumber: "ΑΙΤ-2024-001",
    reason: "Επισκευή Αυτοκινήτου μετά από Ατύχημα", 
    reasonEn: "Car Accident Repair",
    amount: "€2.450", 
    amountValue: 2450,
    status: "In Review", 
    statusLabel: "Σε Εξέλιξη",
    policyType: "Αυτοκίνητο", 
    policyProvider: "Generali", 
    reportedDate: "2024-11-28",
    estimatedCompletion: "2024-12-15",
    step: 2,
    documents: 4,
    notes: "Αναμένεται έκθεση εκτίμησης ζημιών"
  },
  { 
    id: "CLM-2024-002", 
    claimNumber: "ΑΙΤ-2024-002",
    reason: "Ιατρική Επίσκεψη - Παθολόγος", 
    reasonEn: "Medical Consultation",
    amount: "€180", 
    amountValue: 180,
    status: "Approved", 
    statusLabel: "Εγκεκριμένη",
    policyType: "Υγεία", 
    policyProvider: "NN Hellas", 
    reportedDate: "2024-11-20",
    estimatedCompletion: "2024-12-05",
    step: 3,
    documents: 2
  },
  { 
    id: "CLM-2024-003", 
    claimNumber: "ΑΙΤ-2024-003",
    reason: "Οδοντιατρική Θεραπεία", 
    reasonEn: "Dental Treatment",
    amount: "€320", 
    amountValue: 320,
    status: "Paid", 
    statusLabel: "Πληρώθηκε",
    policyType: "Υγεία", 
    policyProvider: "NN Hellas", 
    reportedDate: "2024-10-15",
    step: 4,
    documents: 3
  },
  { 
    id: "CLM-2024-004", 
    claimNumber: "ΑΙΤ-2024-004",
    reason: "Επισκευή Ζημιάς από Διαρροή Νερού", 
    reasonEn: "Water Damage Repair",
    amount: "€1.850", 
    amountValue: 1850,
    status: "Paid", 
    statusLabel: "Πληρώθηκε",
    policyType: "Κατοικία", 
    policyProvider: "Ergo", 
    reportedDate: "2024-09-10",
    step: 4,
    documents: 6
  },
  { 
    id: "CLM-2024-005", 
    claimNumber: "ΑΙΤ-2024-005",
    reason: "Φαρμακευτική Αγωγή", 
    reasonEn: "Prescription Medication",
    amount: "€95", 
    amountValue: 95,
    status: "Paid", 
    statusLabel: "Πληρώθηκε",
    policyType: "Υγεία", 
    policyProvider: "NN Hellas", 
    reportedDate: "2024-08-22",
    step: 4,
    documents: 1
  },
];

const policies = [
  { id: 1, type: "Υγεία", typeEn: "Health", provider: "NN Hellas" },
  { id: 2, type: "Αυτοκίνητο", typeEn: "Auto", provider: "Generali" },
  { id: 3, type: "Κατοικία", typeEn: "Home", provider: "Ergo" },
  { id: 4, type: "Ζωή", typeEn: "Life", provider: "Interamerican" },
];

const statusConfig = {
  Submitted: { label: "Υποβλήθηκε", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-900/40", icon: FileText },
  "In Review": { label: "Σε Εξέλιξη", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", icon: Clock },
  Approved: { label: "Εγκεκριμένη", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", icon: CheckCircle2 },
  Paid: { label: "Πληρώθηκε", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: CircleDollarSign },
  Rejected: { label: "Απορρίφθηκε", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: X },
};

const claimSteps = [
  { key: "submitted", label: "Υποβολή" },
  { key: "review", label: "Έλεγχος" },
  { key: "approved", label: "Έγκριση" },
  { key: "paid", label: "Πληρωμή" },
];

export default function ClaimsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerAfm, setProviderAfm] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState("");

  const activeClaims = claimsData.filter(c => c.status !== "Paid" && c.status !== "Rejected");
  const paidClaims = claimsData.filter(c => c.status === "Paid");
  const totalPaid = paidClaims.reduce((acc, c) => acc + c.amountValue, 0);
  const pendingAmount = activeClaims.reduce((acc, c) => acc + c.amountValue, 0);
  const successRate = Math.round((paidClaims.length / claimsData.length) * 100);
  const avgProcessingDays = 12;

  const validateAfm = (afm: string) => {
    const cleanAfm = afm.replace(/\s/g, '');
    return /^\d{9}$/.test(cleanAfm);
  };

  const handleSubmitClaim = () => {
    if (!providerAfm.trim() || !validateAfm(providerAfm)) {
      toast.error("Απαιτείται έγκυρο ΑΦΜ παρόχου (9 ψηφία)");
      setWizardStep(3);
      return;
    }
    toast.success("Η αίτηση αποζημίωσης υποβλήθηκε επιτυχώς! Θα λάβετε ενημερώσεις μέσω email.");
    setIsWizardOpen(false);
    resetWizard();
  };

  const resetWizard = () => {
    setWizardStep(1);
    setSelectedPolicy("");
    setIncidentDate("");
    setIncidentType("");
    setDescription("");
    setProviderName("");
    setProviderAfm("");
    setProviderAddress("");
    setClaimAmount("");
  };

  const recentPayouts = paidClaims.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">Αιτήσεις Αποζημίωσης</h1>
                <p className="text-xs text-muted-foreground">{claimsData.length} συνολικές αιτήσεις</p>
              </div>
            </div>
            <Dialog open={isWizardOpen} onOpenChange={(open) => { setIsWizardOpen(open); if (!open) resetWizard(); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700 flex-shrink-0" data-testid="button-file-claim">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Νέα Αίτηση</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Υποβολή Αίτησης Αποζημίωσης</DialogTitle>
                  <DialogDescription>Βήμα {wizardStep} από 4</DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center gap-1.5 py-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex-1">
                      <div className={`h-1.5 rounded-full ${step <= wizardStep ? "bg-primary" : "bg-muted"}`} />
                    </div>
                  ))}
                </div>

                {wizardStep === 1 && (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Ασφαλιστήριο Συμβόλαιο</Label>
                      <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                        <SelectTrigger data-testid="select-policy">
                          <SelectValue placeholder="Επιλέξτε συμβόλαιο" />
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
                      <Label>Ημερομηνία Συμβάντος</Label>
                      <Input 
                        type="date" 
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        data-testid="input-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Τύπος Συμβάντος</Label>
                      <Select value={incidentType} onValueChange={setIncidentType}>
                        <SelectTrigger data-testid="select-type">
                          <SelectValue placeholder="Επιλέξτε τύπο" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accident">Ατύχημα</SelectItem>
                          <SelectItem value="theft">Κλοπή</SelectItem>
                          <SelectItem value="damage">Υλική Ζημιά</SelectItem>
                          <SelectItem value="medical">Ιατρικά Έξοδα</SelectItem>
                          <SelectItem value="hospitalization">Νοσηλεία</SelectItem>
                          <SelectItem value="dental">Οδοντιατρικά</SelectItem>
                          <SelectItem value="pharmacy">Φαρμακευτικά</SelectItem>
                          <SelectItem value="other">Άλλο</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Περιγραφή Συμβάντος</Label>
                      <Textarea 
                        placeholder="Περιγράψτε λεπτομερώς το συμβάν..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                        data-testid="textarea-description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Δικαιολογητικά Έγγραφα</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                        <Camera className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-sm text-center">Πατήστε για μεταφόρτωση φωτογραφιών ή εγγράφων</span>
                        <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG έως 10MB</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Απαιτούμενα: Αποδείξεις, Ιατρικές Γνωματεύσεις, Τιμολόγια με ΑΦΜ
                      </p>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4 py-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>Τα στοιχεία παρόχου είναι απαραίτητα για την επεξεργασία. Το ΑΦΜ πρέπει να είναι αυτό που αναγράφεται στο τιμολόγιο/απόδειξη.</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Επωνυμία Παρόχου <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="π.χ. Δρ. Παπαδόπουλος, Διαγνωστικό Κέντρο"
                        value={providerName}
                        onChange={(e) => setProviderName(e.target.value)}
                        data-testid="input-provider-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ΑΦΜ Παρόχου <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="π.χ. 123456789"
                        value={providerAfm}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                          setProviderAfm(value);
                        }}
                        maxLength={9}
                        className={providerAfm && !validateAfm(providerAfm) ? "border-red-500 focus-visible:ring-red-500" : ""}
                        data-testid="input-provider-afm"
                      />
                      {providerAfm && !validateAfm(providerAfm) && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Το ΑΦΜ πρέπει να είναι 9 ψηφία
                        </p>
                      )}
                      {providerAfm && validateAfm(providerAfm) && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Έγκυρη μορφή ΑΦΜ
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Διεύθυνση Παρόχου</Label>
                      <Input 
                        placeholder="π.χ. Βασ. Σοφίας 10, Αθήνα"
                        value={providerAddress}
                        onChange={(e) => setProviderAddress(e.target.value)}
                        data-testid="input-provider-address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ποσό Αποζημίωσης (EUR) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Euro className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          value={claimAmount}
                          onChange={(e) => setClaimAmount(e.target.value)}
                          className="pl-9"
                          data-testid="input-claim-amount"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 4 && (
                  <div className="space-y-4 py-4">
                    <div className="text-center">
                      <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">Έτοιμη για Υποβολή</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ελέγξτε τα στοιχεία πριν την υποβολή
                      </p>
                    </div>
                    <Card className="p-3 bg-muted/30">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Συμβόλαιο:</span>
                          <span className="text-xs font-medium">{policies.find(p => p.id.toString() === selectedPolicy)?.type || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Ημ/νία Συμβάντος:</span>
                          <span className="text-xs font-medium">{incidentDate ? new Date(incidentDate).toLocaleDateString('el-GR') : "—"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Τύπος:</span>
                          <span className="text-xs font-medium capitalize">{incidentType || "—"}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase">Στοιχεία Παρόχου</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Πάροχος:</span>
                            <span className="text-xs font-medium truncate max-w-[50%]">{providerName || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">ΑΦΜ:</span>
                            <span className="text-xs font-medium font-mono">{providerAfm || "—"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Αιτούμενο Ποσό:</span>
                            <span className="text-xs font-bold text-primary">€{claimAmount || "0,00"}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <DialogFooter className="flex-row justify-between gap-2">
                  {wizardStep > 1 ? (
                    <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)} className="flex-1 sm:flex-none">Πίσω</Button>
                  ) : <div className="flex-1 sm:flex-none" />}
                  
                  {wizardStep < 4 ? (
                    <Button 
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        if (wizardStep === 3) {
                          if (!providerName.trim()) {
                            toast.error("Απαιτείται επωνυμία παρόχου");
                            return;
                          }
                          if (!providerAfm.trim() || !validateAfm(providerAfm)) {
                            toast.error("Απαιτείται έγκυρο ΑΦΜ (9 ψηφία)");
                            return;
                          }
                          if (!claimAmount.trim() || parseFloat(claimAmount) <= 0) {
                            toast.error("Απαιτείται ποσό αποζημίωσης");
                            return;
                          }
                        }
                        setWizardStep(wizardStep + 1);
                      }} 
                      data-testid="button-next"
                    >
                      Συνέχεια <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitClaim} className="flex-1 sm:flex-none" data-testid="button-submit-claim">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Υποβολή Αίτησης
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        
        {/* Claims Overview Card */}
        <Card className="p-4 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
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
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{successRate}%</span>
                <span className="text-[10px] text-muted-foreground">Επιτυχία</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground mb-1">Επισκόπηση Αιτήσεων</h2>
              <p className="text-xs text-muted-foreground mb-2">
                Συνολικά αποζημιώθηκαν: <span className="font-bold text-emerald-600 dark:text-emerald-400">€{totalPaid.toLocaleString('el-GR')}</span>
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">{activeClaims.length} Ενεργές</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">{paidClaims.length} Πληρωμένες</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">~{avgProcessingDays} ημέρες</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2.5 border border-border/50">
            <div className="text-center">
              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{claimsData.length}</p>
              <p className="text-[10px] text-muted-foreground">Σύνολο</p>
            </div>
          </Card>
          <Card className="p-2.5 border border-border/50">
            <div className="text-center">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{activeClaims.length}</p>
              <p className="text-[10px] text-muted-foreground">Ενεργές</p>
            </div>
          </Card>
          <Card className="p-2.5 border border-border/50">
            <div className="text-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{paidClaims.length}</p>
              <p className="text-[10px] text-muted-foreground">Πληρωμένες</p>
            </div>
          </Card>
          <Card className="p-2.5 border border-border/50">
            <div className="text-center">
              <Euro className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">€{pendingAmount.toLocaleString('el-GR')}</p>
              <p className="text-[10px] text-muted-foreground">Εκκρεμεί</p>
            </div>
          </Card>
        </div>

        {/* Active Claims */}
        {activeClaims.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-foreground">Ενεργές Αιτήσεις</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {activeClaims.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {activeClaims.map((claim) => {
                const config = statusConfig[claim.status];
                const StatusIcon = config.icon;
                const progressPercent = (claim.step / 4) * 100;
                
                return (
                  <Card key={claim.id} className="p-3 border border-border/50" data-testid={`claim-${claim.id}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <h3 className="font-semibold text-sm text-foreground truncate">{claim.reason}</h3>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.color}`}>
                            <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {claim.policyType} ({claim.policyProvider}) • Υποβλήθηκε {new Date(claim.reportedDate).toLocaleDateString('el-GR')}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Αρ. Αίτησης: {claim.claimNumber} • {claim.documents} έγγραφα
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-foreground">{claim.amount}</p>
                        <p className="text-[10px] text-muted-foreground">Αιτούμενο</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Progress value={progressPercent} className="h-1.5" />
                      <div className="flex justify-between text-[10px]">
                        {claimSteps.map((step, idx) => (
                          <span 
                            key={step.key} 
                            className={idx < claim.step ? "text-primary font-medium" : "text-muted-foreground"}
                          >
                            {step.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {claim.notes && (
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          {claim.notes}
                        </p>
                      </div>
                    )}
                    
                    {claim.estimatedCompletion && (
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Εκτ. ολοκλήρωση</span>
                        <span className="font-medium text-foreground">
                          {new Date(claim.estimatedCompletion).toLocaleDateString('el-GR')}
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Active Claims */}
        {activeClaims.length === 0 && (
          <Card className="p-6 text-center border-dashed">
            <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Δεν υπάρχουν ενεργές αιτήσεις</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Όλες οι αιτήσεις σας έχουν διεκπεραιωθεί
            </p>
            <Button onClick={() => setIsWizardOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Νέα Αίτηση Αποζημίωσης
            </Button>
          </Card>
        )}

        {/* Recent Payouts */}
        {recentPayouts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">Πρόσφατες Αποζημιώσεις</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground">
                Όλες <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {recentPayouts.map((claim) => (
                <Card key={claim.id} className="p-3 min-w-[180px] flex-shrink-0 border border-border/50 bg-emerald-50/30 dark:bg-emerald-950/20 snap-start" data-testid={`payout-${claim.id}`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{claim.amount}</p>
                      <p className="text-[10px] text-muted-foreground">Αποζημίωση</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{claim.reason}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{claim.policyType} • {new Date(claim.reportedDate).toLocaleDateString('el-GR')}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Claims History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Ιστορικό Αιτήσεων</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground">
              Όλες <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {claimsData.slice(0, 4).map((claim) => {
              const config = statusConfig[claim.status];
              const StatusIcon = config.icon;
              
              return (
                <Card key={claim.id} className="p-3 border border-border/50" data-testid={`history-${claim.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-xs text-foreground truncate">{claim.reason}</h3>
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${config.color}`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {claim.policyType} • {new Date(claim.reportedDate).toLocaleDateString('el-GR')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">{claim.amount}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Claims Tips */}
        <Card className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-blue-900 dark:text-blue-100 mb-1">Συμβουλές Αποζημίωσης</h3>
              <ul className="text-[10px] text-blue-700 dark:text-blue-300 space-y-1">
                <li className="flex items-start gap-1">
                  <Receipt className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Διατηρείτε πάντα τις αποδείξεις με εμφανές ΑΦΜ</span>
                </li>
                <li className="flex items-start gap-1">
                  <Camera className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Φωτογραφίστε τις ζημιές άμεσα μετά το συμβάν</span>
                </li>
                <li className="flex items-start gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Υποβάλετε την αίτηση εντός 30 ημερών</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
