import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Activity, Heart, TrendingUp, AlertCircle, Check, FileUp, Plus, Calendar, Zap, Target, CheckCircle2 } from "lucide-react";

const DEMO_USER_ID = "demo-user-001"; // Demo user for testing

export default function HealthWellnessPage() {
  const { t } = useTranslation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState("Annual");
  const [uploadProvider, setUploadProvider] = useState("");
  const [uploadResults, setUploadResults] = useState("");

  // Fetch risk assessment
  const { data: riskAssessment = {}, isLoading: riskLoading } = useQuery<any>({
    queryKey: [`/api/health/risk-assessment/${DEMO_USER_ID}`],
  });

  // Fetch checkups
  const { data: checkups = [], isLoading: checkupsLoading } = useQuery<any[]>({
    queryKey: [`/api/health/checkups/${DEMO_USER_ID}`],
  });

  // Fetch recommendations
  const { data: recommendations = [], isLoading: recsLoading } = useQuery<any[]>({
    queryKey: [`/api/health/recommendations/${DEMO_USER_ID}`],
  });

  // Upload checkup mutation
  const uploadCheckupMutation = useMutation({
    mutationFn: async () => {
      if (!uploadProvider.trim()) throw new Error("Provider required");
      
      const response = await fetch("/api/health/checkups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          checkupDate: new Date().toISOString(),
          checkupType: uploadType,
          provider: uploadProvider,
          results: uploadResults,
          fileUrls: [],
        }),
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      setIsUploadOpen(false);
      setUploadProvider("");
      setUploadResults("");
      // Refetch checkups
      window.location.reload();
    },
  });

  // Complete recommendation mutation
  const completeRecMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/health/recommendations/${id}/complete`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to complete");
      return response.json();
    },
  });

  const getRiskColor = (score?: number) => {
    if (!score) return "bg-blue-50 border-blue-200";
    if (score >= 70) return "bg-red-50 border-red-200";
    if (score >= 50) return "bg-amber-50 border-amber-200";
    return "bg-emerald-50 border-emerald-200";
  };

  const getRiskBadgeColor = (score?: number) => {
    if (!score) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-red-100 text-red-800";
    if (score >= 50) return "bg-amber-100 text-amber-800";
    return "bg-emerald-100 text-emerald-800";
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{t('health.healthWellness')}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{t('health.uploadCheckup')}</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 font-semibold h-11 px-6">
              <FileUp className="h-4 w-4 mr-2" />
              {t('health.uploadCheckup')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('health.uploadCheckup')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>{t('healthWellness.checkupType')}</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual Health Screening</SelectItem>
                    <SelectItem value="Dental">Dental Checkup</SelectItem>
                    <SelectItem value="Eye">Eye Exam</SelectItem>
                    <SelectItem value="Cardiac">Cardiac Screening</SelectItem>
                    <SelectItem value="Lab">Lab Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t('healthWellness.healthcareProvider')}</Label>
                <Input
                  placeholder="e.g., Dr. Papadopoulos, Athens Medical Center"
                  value={uploadProvider}
                  onChange={(e) => setUploadProvider(e.target.value)}
                  data-testid="input-provider"
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('healthWellness.resultsFindings')}</Label>
                <Textarea
                  placeholder="Paste findings, measurements, or key results..."
                  value={uploadResults}
                  onChange={(e) => setUploadResults(e.target.value)}
                  className="h-24"
                  data-testid="textarea-results"
                />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('healthWellness.coveredUnderPolicy')}</AlertTitle>
                <AlertDescription>
                  {t('healthWellness.regularCheckups')}
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => uploadCheckupMutation.mutate()}
                disabled={uploadCheckupMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-upload-checkup"
              >
                {uploadCheckupMutation.isPending ? "Uploading..." : "Upload Results"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Assessment Card */}
        <Card className={`lg:col-span-1 border ${getRiskColor(riskAssessment?.riskScore)} shadow-md`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Health Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`inline-block px-6 py-3 rounded-full text-3xl font-bold ${getRiskBadgeColor(riskAssessment?.riskScore)}`}>
                {riskAssessment?.riskScore || 45}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Risk Assessment Score</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Risk Level</span>
                <Badge variant="outline" className={getRiskBadgeColor(riskAssessment?.riskScore)}>
                  {riskAssessment?.riskLevel || "Moderate"}
                </Badge>
              </div>
              <Progress
                value={riskAssessment?.riskScore || 45}
                className="h-2"
              />
            </div>

            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">Key Factors</p>
              <ul className="space-y-1 text-xs">
                {riskAssessment?.healthFactors?.conditions?.length ? (
                  riskAssessment.healthFactors.conditions.map((c: string, i: number) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {c}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    No major health conditions
                  </li>
                )}
              </ul>
            </div>

            {riskAssessment?.nextCheckupDue && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Next Checkup Due</p>
                <p className="text-sm font-semibold">
                  {new Date(riskAssessment.nextCheckupDue).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preventive Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              Recommended Actions
            </h2>

            {recsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec: any) => (
                    <Card key={rec.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{rec.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="inline-block px-2 py-1 bg-secondary rounded">
                                {rec.category}
                              </span>
                              {rec.coverageStatus && (
                                <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                                  {rec.coverageStatus}
                                </span>
                              )}
                              {rec.estimatedCost && (
                                <span className="text-muted-foreground">{rec.estimatedCost}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => completeRecMutation.mutate(rec.id)}
                            data-testid={`button-complete-rec-${rec.id}`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-muted/20 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
                      <p className="text-sm">All recommendations completed!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkup History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Checkup History
        </h2>

        {checkupsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {checkups.length > 0 ? (
              checkups.map((checkup: any) => (
                <Card key={checkup.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px]">
                          <span className="text-xs font-bold uppercase">
                            {new Date(checkup.checkupDate).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold">
                            {new Date(checkup.checkupDate).getDate()}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{checkup.checkupType} Checkup</h3>
                            <Badge variant="secondary" className="text-[10px]">
                              {checkup.provider}
                            </Badge>
                          </div>
                          {checkup.results && (
                            <p className="text-sm text-muted-foreground">{checkup.results.substring(0, 100)}...</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(checkup.createdAt).toLocaleDateString()} • Uploaded
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" data-testid={`button-view-checkup-${checkup.id}`}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mb-3 opacity-20" />
                  <p>No checkups uploaded yet. Upload your first checkup result to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Health Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Coverage Info
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-emerald-800">
            <p>Your health policy covers preventive screenings 100%. Annual checkups and vaccinations are fully covered at network providers.</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p>Complete your recommended actions and upload results to get a personalized health risk assessment and savings opportunities.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
