import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, FileText, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const claimsData = [
    { month: "Jan", processed: 120, pending: 40, approved: 95, rejected: 25 },
    { month: "Feb", processed: 145, pending: 35, approved: 115, rejected: 30 },
    { month: "Mar", processed: 165, pending: 30, approved: 135, rejected: 30 },
    { month: "Apr", processed: 190, pending: 25, approved: 155, rejected: 35 },
    { month: "May", processed: 210, pending: 20, approved: 175, rejected: 35 },
  ];

  const policyData = [
    { name: "Health", value: 450 },
    { name: "Auto", value: 380 },
    { name: "Home", value: 290 },
    { name: "Life", value: 210 },
  ];

  const COLORS = ["#3b82f6", "#ef4444", "#f97316", "#8b5cf6"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Enterprise insurance platform analytics and management.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalUsers || "2.4k"}</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 12% from last month</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active Policies</p>
                <p className="text-3xl font-bold mt-2">{stats?.activePolicies || "1.8k"}</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 8% from last month</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Claims</p>
                <p className="text-3xl font-bold mt-2">{stats?.pendingClaims || "240"}</p>
                <p className="text-xs text-amber-600 mt-1">⚠ 5% increase</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Claims Approved</p>
                <p className="text-3xl font-bold mt-2">{stats?.claimsApproved || "92%"}</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 2% from last month</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Processing Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('cardTitles.claimsProcessingTrend')}</CardTitle>
            <CardDescription>{t('cardDescriptions.monthlyClaimsBreakdown')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" stackId="a" fill="#22c55e" />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="rejected" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Policy Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('cardTitles.policyDistribution')}</CardTitle>
            <CardDescription>{t('cardDescriptions.byInsuranceType')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={policyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {policyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Actions */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">{ t("tabs.systemAlerts") }</TabsTrigger>
          <TabsTrigger value="compliance">{ t("tabs.compliance") }</TabsTrigger>
          <TabsTrigger value="reports">{ t("tabs.reports") }</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>High Claims Volume:</strong> 240 pending claims exceeds target of 200. Recommend prioritizing reviews.
            </AlertDescription>
          </Alert>

          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription>
              <strong>GDPR Compliance:</strong> All data retention policies updated. Last audit: Nov 15, 2025
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Payment Processing:</strong> Stripe integration pending - 3 test transactions queued
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('cardTitles.acordComplianceStatus')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('admin.dataCompliance')}</span>
                  <span className="font-semibold">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('admin.securityRequirements')}</span>
                  <span className="font-semibold">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('admin.gdprRequirements')}</span>
                  <span className="font-semibold">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.availableReports')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {label: t("admin.monthlyClaims"), val: "monthly"},
                {label: t("admin.policyPortfolio"), val: "portfolio"},
                {label: t("admin.riskAssessment"), val: "risk"},
                {label: t("admin.auditTrail"), val: "audit"}
              ].map(
                ({label, val}) => (
                  <div
                    key={val}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
