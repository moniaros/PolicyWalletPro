import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  Wallet,
  Euro,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Receipt,
  TrendingUp,
  TrendingDown,
  Banknote,
  FileText,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Shield,
  Trash2,
  Edit3,
  Bell,
  BellOff,
  Landmark,
  History,
  PiggyBank,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  date: string;
  policyNumber: string;
  policyType: string;
  provider: string;
  amount: number;
  status: "paid" | "pending" | "scheduled" | "failed" | "overdue";
  method: string;
  reference: string;
}

interface PaymentMethod {
  id: number;
  type: "card" | "bank";
  name: string;
  lastFour: string;
  brand?: string;
  bank?: string;
  expiryDate?: string;
  iban?: string;
  isDefault: boolean;
  linkedPolicies: number;
}

const paymentsData: Payment[] = [
  { id: "PAY-2024-001", date: "2024-12-01", policyNumber: "NN-ORANGE-992", policyType: "Υγεία", provider: "NN Hellas", amount: 145, status: "scheduled", method: "Visa •••• 1234", reference: "SCH-20241201-001" },
  { id: "PAY-2024-002", date: "2024-11-28", policyNumber: "GEN-AUTO-882", policyType: "Αυτοκίνητο", provider: "Generali", amount: 160, status: "paid", method: "Eurobank •••• 5678", reference: "PAY-20241128-001" },
  { id: "PAY-2024-003", date: "2024-11-15", policyNumber: "NN-ORANGE-992", policyType: "Υγεία", provider: "NN Hellas", amount: 145, status: "paid", method: "Visa •••• 1234", reference: "PAY-20241115-001" },
  { id: "PAY-2024-004", date: "2024-11-01", policyNumber: "ERGO-HOME-456", policyType: "Κατοικία", provider: "Ergo", amount: 85, status: "paid", method: "Alpha Bank •••• 9012", reference: "PAY-20241101-001" },
  { id: "PAY-2024-005", date: "2024-10-28", policyNumber: "GEN-AUTO-882", policyType: "Αυτοκίνητο", provider: "Generali", amount: 160, status: "paid", method: "Eurobank •••• 5678", reference: "PAY-20241028-001" },
  { id: "PAY-2024-006", date: "2024-10-15", policyNumber: "INT-LIFE-789", policyType: "Ζωή", provider: "Interamerican", amount: 120, status: "paid", method: "Visa •••• 1234", reference: "PAY-20241015-001" },
];

const paymentMethodsData: PaymentMethod[] = [
  { id: 1, type: "card", name: "Visa Eurobank", lastFour: "1234", brand: "Visa", expiryDate: "12/26", isDefault: true, linkedPolicies: 2 },
  { id: 2, type: "bank", name: "Eurobank", lastFour: "5678", bank: "Eurobank", iban: "GR16 0172 0XXX XXXX XXXX 5678", isDefault: false, linkedPolicies: 1 },
  { id: 3, type: "bank", name: "Alpha Bank", lastFour: "9012", bank: "Alpha Bank", iban: "GR16 0140 0XXX XXXX XXXX 9012", isDefault: false, linkedPolicies: 1 },
];

const upcomingPayments = [
  { id: 1, policyType: "Υγεία", provider: "NN Hellas", amount: 145, dueDate: "2024-12-01", daysUntil: 3 },
  { id: 2, policyType: "Αυτοκίνητο", provider: "Generali", amount: 160, dueDate: "2024-12-15", daysUntil: 17 },
  { id: 3, policyType: "Ζωή", provider: "Interamerican", amount: 120, dueDate: "2025-01-15", daysUntil: 48 },
];

const statusConfig = {
  paid: { label: "Πληρώθηκε", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: CheckCircle2 },
  pending: { label: "Εκκρεμεί", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", icon: Clock },
  scheduled: { label: "Προγραμματισμένη", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", icon: Calendar },
  failed: { label: "Απέτυχε", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: AlertCircle },
  overdue: { label: "Ληξιπρόθεσμη", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", icon: AlertCircle },
};

const policyTypeIcons: Record<string, { icon: any; color: string; bg: string }> = {
  "Υγεία": { icon: Shield, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
  "Αυτοκίνητο": { icon: Shield, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  "Κατοικία": { icon: Shield, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  "Ζωή": { icon: Shield, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
};

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [newMethodType, setNewMethodType] = useState("card");
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const totalAnnualPremiums = 2600;
  const paidThisYear = 1875;
  const pendingAmount = 305;
  const paidPercentage = Math.round((paidThisYear / totalAnnualPremiums) * 100);

  const paidPayments = paymentsData.filter(p => p.status === "paid");
  const scheduledPayments = paymentsData.filter(p => p.status === "scheduled" || p.status === "pending");

  const filteredPayments = paymentsData.filter(p =>
    p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.policyType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPayments = showAllPayments ? filteredPayments : filteredPayments.slice(0, 4);

  const handleAddPaymentMethod = () => {
    toast.success("Η μέθοδος πληρωμής προστέθηκε επιτυχώς");
    setIsAddMethodOpen(false);
  };

  const handleSetDefault = (id: number) => {
    toast.success("Η προεπιλεγμένη μέθοδος πληρωμής ενημερώθηκε");
  };

  const handlePayNow = (payment: typeof upcomingPayments[0]) => {
    toast.success(`Η πληρωμή €${payment.amount} για ${payment.policyType} ξεκίνησε`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">Πληρωμές & Χρεώσεις</h1>
                <p className="text-xs text-muted-foreground">Διαχείριση Ασφαλίστρων</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0" data-testid="button-settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        
        {/* Payment Overview Card */}
        <Card className="p-4 border border-border/50 overflow-hidden relative" data-testid="card-payment-overview">
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
                  stroke="url(#billingGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${paidPercentage}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="billingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{paidPercentage}%</span>
                <span className="text-[10px] text-muted-foreground">Πληρωμένα</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground mb-1">Ετήσια Ασφάλιστρα</h2>
              <p className="text-xs text-muted-foreground mb-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">€{paidThisYear.toLocaleString('el-GR')}</span> / €{totalAnnualPremiums.toLocaleString('el-GR')}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="text-muted-foreground">{paidPayments.length} πληρωμές</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">€{pendingAmount} εκκρεμεί</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-2.5 border border-border/50" data-testid="card-stat-paid">
            <div className="text-center">
              <Euro className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-paid-amount">€{paidThisYear.toLocaleString('el-GR')}</p>
              <p className="text-[10px] text-muted-foreground">Πληρωμένα</p>
            </div>
          </Card>
          <Card className="p-2.5 border border-border/50" data-testid="card-stat-pending">
            <div className="text-center">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400" data-testid="text-pending-amount">€{pendingAmount}</p>
              <p className="text-[10px] text-muted-foreground">Εκκρεμούν</p>
            </div>
          </Card>
          <Card className="p-2.5 border border-border/50" data-testid="card-stat-trend">
            <div className="text-center">
              <TrendingDown className="h-4 w-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400" data-testid="text-trend">-5%</p>
              <p className="text-[10px] text-muted-foreground">vs Πέρυσι</p>
            </div>
          </Card>
        </div>

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-foreground">Επερχόμενες Πληρωμές</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">{upcomingPayments.length}</Badge>
            </div>
            
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {upcomingPayments.map((payment) => {
                const typeConfig = policyTypeIcons[payment.policyType] || policyTypeIcons["Υγεία"];
                const isUrgent = payment.daysUntil <= 7;
                
                return (
                  <Card 
                    key={payment.id} 
                    className={`p-3 min-w-[200px] flex-shrink-0 border snap-start ${isUrgent ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/20" : "border-border/50"}`}
                    data-testid={`upcoming-${payment.id}`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`h-9 w-9 rounded-lg ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <Euro className={`h-4 w-4 ${typeConfig.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-foreground">€{payment.amount}</p>
                        <p className="text-[10px] text-muted-foreground">{payment.policyType}</p>
                      </div>
                      {isUrgent && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700">
                          Σύντομα
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{payment.provider}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString('el-GR')} ({payment.daysUntil} ημ.)
                      </span>
                      <Button 
                        size="sm" 
                        className="h-6 text-[10px] px-2"
                        onClick={() => handlePayNow(payment)}
                        data-testid={`button-pay-${payment.id}`}
                      >
                        Πληρωμή
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Auto-Pay Settings */}
        <Card className="p-3 border border-border/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Αυτόματη Πληρωμή</p>
                  <p className="text-[10px] text-muted-foreground">Αυτόματη χρέωση κατά τη λήξη</p>
                </div>
              </div>
              <Switch 
                checked={autoPayEnabled} 
                onCheckedChange={setAutoPayEnabled}
                data-testid="switch-autopay"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Υπενθυμίσεις</p>
                  <p className="text-[10px] text-muted-foreground">Email/SMS πριν τη λήξη</p>
                </div>
              </div>
              <Switch 
                checked={reminderEnabled} 
                onCheckedChange={setReminderEnabled}
                data-testid="switch-reminders"
              />
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Μέθοδοι Πληρωμής</span>
            </div>
            <Dialog open={isAddMethodOpen} onOpenChange={setIsAddMethodOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" data-testid="button-add-method">
                  <Plus className="h-3 w-3 mr-1" />
                  Προσθήκη
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Προσθήκη Μεθόδου Πληρωμής</DialogTitle>
                  <DialogDescription>Προσθέστε κάρτα ή τραπεζικό λογαριασμό</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={newMethodType === "card" ? "default" : "outline"}
                      onClick={() => setNewMethodType("card")}
                      className="h-20 flex-col gap-2"
                      data-testid="button-select-card"
                    >
                      <CreditCard className="h-6 w-6" />
                      <span className="text-xs">Κάρτα</span>
                    </Button>
                    <Button
                      variant={newMethodType === "bank" ? "default" : "outline"}
                      onClick={() => setNewMethodType("bank")}
                      className="h-20 flex-col gap-2"
                      data-testid="button-select-bank"
                    >
                      <Landmark className="h-6 w-6" />
                      <span className="text-xs">Τράπεζα</span>
                    </Button>
                  </div>
                  {newMethodType === "card" ? (
                    <div className="space-y-3">
                      <Input placeholder="Αριθμός Κάρτας" data-testid="input-card-number" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM/YY" data-testid="input-expiry" />
                        <Input placeholder="CVV" type="password" maxLength={4} data-testid="input-cvv" />
                      </div>
                      <Input placeholder="Όνομα Κατόχου" data-testid="input-cardholder" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Select>
                        <SelectTrigger data-testid="select-bank">
                          <SelectValue placeholder="Επιλογή Τράπεζας" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eurobank">Eurobank</SelectItem>
                          <SelectItem value="alpha">Alpha Bank</SelectItem>
                          <SelectItem value="piraeus">Πειραιώς</SelectItem>
                          <SelectItem value="nbg">Εθνική</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="IBAN (GR...)" data-testid="input-iban" />
                      <Input placeholder="Όνομα Δικαιούχου" data-testid="input-account-holder" />
                    </div>
                  )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setIsAddMethodOpen(false)} className="w-full sm:w-auto" data-testid="button-cancel-method">
                    Ακύρωση
                  </Button>
                  <Button onClick={handleAddPaymentMethod} className="w-full sm:w-auto" data-testid="button-save-method">
                    <Plus className="h-4 w-4 mr-1" />
                    Προσθήκη
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            {paymentMethodsData.map((method) => (
              <Card key={method.id} className="p-3 border border-border/50" data-testid={`method-${method.id}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${method.type === "card" ? "bg-blue-100 dark:bg-blue-900/40" : "bg-emerald-100 dark:bg-emerald-900/40"}`}>
                    {method.type === "card" ? (
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Landmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-semibold text-sm text-foreground">
                        {method.type === "card" ? `${method.brand} •••• ${method.lastFour}` : `${method.bank} •••• ${method.lastFour}`}
                      </h3>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          Προεπιλογή
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {method.type === "card" ? `Λήξη ${method.expiryDate}` : method.iban?.slice(0, 15) + "..."}
                      {" • "}{method.linkedPolicies} συνδεδεμέν{method.linkedPolicies === 1 ? "ο" : "α"} συμβόλαι{method.linkedPolicies === 1 ? "ο" : "α"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!method.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[10px] px-2"
                        onClick={() => handleSetDefault(method.id)}
                        data-testid={`button-default-${method.id}`}
                      >
                        Ορισμός
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" data-testid={`button-edit-method-${method.id}`}>
                      <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Ιστορικό Πληρωμών</span>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση πληρωμής..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
              data-testid="input-search-payments"
            />
          </div>
          
          <div className="space-y-2">
            {displayedPayments.map((payment) => {
              const config = statusConfig[payment.status];
              const StatusIcon = config.icon;
              const typeConfig = policyTypeIcons[payment.policyType] || policyTypeIcons["Υγεία"];
              
              return (
                <Card key={payment.id} className="p-3 border border-border/50" data-testid={`payment-${payment.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${config.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className={`text-[10px] font-bold uppercase ${config.color}`}>
                        {new Date(payment.date).toLocaleString('el-GR', { month: 'short' })}
                      </span>
                      <span className={`text-sm font-bold ${config.color} leading-none`}>
                        {new Date(payment.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-xs text-foreground truncate">{payment.provider}</h3>
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${config.color}`}>
                          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {payment.policyType} • {payment.policyNumber}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {payment.method}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">€{payment.amount}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 mt-1">
                        <Download className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {filteredPayments.length > 4 && (
            <Button
              variant="ghost"
              className="w-full text-xs h-8"
              onClick={() => setShowAllPayments(!showAllPayments)}
              data-testid="button-toggle-payments"
            >
              {showAllPayments ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Λιγότερες
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Όλες ({filteredPayments.length})
                </>
              )}
            </Button>
          )}
        </div>

        {/* Premium Breakdown */}
        <Card className="p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Ανάλυση Ασφαλίστρων</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-foreground">Υγεία</span>
                <span className="text-xs text-muted-foreground">€1.740/έτος</span>
              </div>
              <Progress value={67} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-foreground">Αυτοκίνητο</span>
                <span className="text-xs text-muted-foreground">€480/έτος</span>
              </div>
              <Progress value={18} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-foreground">Κατοικία</span>
                <span className="text-xs text-muted-foreground">€255/έτος</span>
              </div>
              <Progress value={10} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-foreground">Ζωή</span>
                <span className="text-xs text-muted-foreground">€125/έτος</span>
              </div>
              <Progress value={5} className="h-1.5" />
            </div>
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="p-4 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-green-900 dark:text-green-100 mb-1">Συμβουλές Εξοικονόμησης</h3>
              <ul className="text-[10px] text-green-700 dark:text-green-300 space-y-1">
                <li className="flex items-start gap-1">
                  <Banknote className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Ετήσια πληρωμή: Έκπτωση έως 10% στα ασφάλιστρα</span>
                </li>
                <li className="flex items-start gap-1">
                  <RefreshCw className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Αυτόματη πληρωμή: Αποφύγετε καθυστερήσεις και χρεώσεις</span>
                </li>
                <li className="flex items-start gap-1">
                  <Shield className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Πολλαπλά συμβόλαια: Ζητήστε έκπτωση πακέτου</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Download Reports */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-10 text-xs" data-testid="button-download-statement">
            <Download className="h-4 w-4 mr-1.5" />
            Κατέβασμα Αναλυτικής
          </Button>
          <Button variant="outline" className="flex-1 h-10 text-xs" data-testid="button-download-receipts">
            <Receipt className="h-4 w-4 mr-1.5" />
            Αποδείξεις Έτους
          </Button>
        </div>
      </div>
    </div>
  );
}
