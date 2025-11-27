import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Download, Search, DollarSign, Calendar, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const billingData = {
  overview: {
    totalAnnualPremiums: "€1,045.00",
    monthlyAverage: "€87.08",
    nextPaymentDue: "2025-12-01",
    upcomingAmount: "€145.00",
    totalPaidThisYear: "€1,045.00",
    pendingPayments: "€0.00"
  },
  payments: [
    {
      id: 1,
      date: new Date(2025, 10, 1),
      policyNumber: "NN-ORANGE-992",
      provider: "NN Hellas",
      type: "Health Insurance",
      amount: "€145.00",
      status: "Paid",
      method: "Credit Card ***1234",
      reference: "PAY-20251101-001"
    },
    {
      id: 2,
      date: new Date(2025, 10, 1),
      policyNumber: "GEN-SPEED-882",
      provider: "Generali",
      type: "Auto Insurance",
      amount: "€160.00",
      status: "Paid",
      method: "Direct Debit",
      reference: "PAY-20251101-002"
    },
    {
      id: 3,
      date: new Date(2025, 9, 1),
      policyNumber: "NN-ORANGE-992",
      provider: "NN Hellas",
      type: "Health Insurance",
      amount: "€145.00",
      status: "Paid",
      method: "Credit Card ***1234",
      reference: "PAY-20251001-001"
    },
    {
      id: 4,
      date: new Date(2025, 9, 1),
      policyNumber: "GEN-SPEED-882",
      provider: "Generali",
      type: "Auto Insurance",
      amount: "€160.00",
      status: "Paid",
      method: "Direct Debit",
      reference: "PAY-20251001-002"
    },
    {
      id: 5,
      date: new Date(2025, 8, 1),
      policyNumber: "NN-ORANGE-992",
      provider: "NN Hellas",
      type: "Health Insurance",
      amount: "€145.00",
      status: "Paid",
      method: "Credit Card ***1234",
      reference: "PAY-20250901-001"
    },
    {
      id: 6,
      date: new Date(2025, 12, 1),
      policyNumber: "NN-ORANGE-992",
      provider: "NN Hellas",
      type: "Health Insurance",
      amount: "€145.00",
      status: "Scheduled",
      method: "Credit Card ***1234",
      reference: "PAY-SCHEDULED-001"
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: "Credit Card",
      lastFour: "1234",
      brand: "Visa",
      expiryDate: "12/26",
      isDefault: true
    },
    {
      id: 2,
      type: "Direct Debit",
      bank: "Eurobank",
      iban: "GR**-****-****-*123",
      isDefault: false
    }
  ]
};

export default function BillingPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  const filteredPayments = billingData.payments.filter(p =>
    p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Failed":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Scheduled":
        return <Calendar className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-lg text-muted-foreground">
          Manage your payments, view history, and track your premium costs
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium uppercase">Total Annual Premiums</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{billingData.overview.totalAnnualPremiums}</p>
                    <p className="text-xs text-blue-700 mt-2">Average: {billingData.overview.monthlyAverage}/month</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-blue-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium uppercase">Paid This Year</p>
                    <p className="text-3xl font-bold text-emerald-900 mt-1">{billingData.overview.totalPaidThisYear}</p>
                    <p className="text-xs text-emerald-700 mt-2">12 payments completed</p>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-600 font-medium uppercase">Next Payment Due</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">{billingData.overview.upcomingAmount}</p>
                    <p className="text-xs text-amber-700 mt-2">{billingData.overview.nextPaymentDue}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-amber-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Premium Payment Trends
              </CardTitle>
              <CardDescription>
                Your 12-month payment history at a glance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simple trend visualization */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Health Insurance (NN Hellas)</span>
                    <span className="text-sm text-muted-foreground">€145/month</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Auto Insurance (Generali)</span>
                    <span className="text-sm text-muted-foreground">€160/month</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Home Insurance (Ergo)</span>
                    <span className="text-sm text-muted-foreground">€150/year</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Year-over-Year Change</p>
                  <p className="text-lg font-bold text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    +2.5%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Average Payment Delay</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">0 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full h-12 bg-primary" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" className="w-full h-12" size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
          </div>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground ml-2" />
            <Input
              placeholder="Search by provider or policy number..."
              className="border-0 shadow-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="font-semibold text-sm">{payment.provider}</p>
                      <p className="text-xs text-muted-foreground">{payment.type}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{payment.policyNumber}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Date</p>
                      <p className="font-semibold text-sm">{format(payment.date, 'MMM dd, yyyy')}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Amount</p>
                      <p className="font-bold text-lg">{payment.amount}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Method</p>
                      <p className="text-sm">{payment.method}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <div className="space-y-3">
            {billingData.paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {method.type === "Credit Card" ? `${method.brand} ••••${method.lastFour}` : `${method.bank} Direct Debit`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method.type === "Credit Card" ? `Expires ${method.expiryDate}` : method.iban}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
