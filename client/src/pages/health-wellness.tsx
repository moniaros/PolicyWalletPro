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
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Zap,
  Target,
  Footprints,
  Droplets,
  Moon,
  Apple,
  ChevronRight,
  Plus,
  FileUp,
  Sparkles,
  Shield,
  Stethoscope,
  Pill,
  Eye,
  Smile
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface HealthMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: any;
  color: string;
  trend?: "up" | "down" | "stable";
}

interface Checkup {
  id: number;
  type: string;
  provider: string;
  date: string;
  status: "completed" | "scheduled" | "overdue";
  results?: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  covered: boolean;
  completed: boolean;
}

const healthMetrics: HealthMetric[] = [
  { id: "steps", label: "Steps", value: 7234, target: 10000, unit: "steps", icon: Footprints, color: "text-blue-600", trend: "up" },
  { id: "water", label: "Water", value: 6, target: 8, unit: "glasses", icon: Droplets, color: "text-cyan-600", trend: "stable" },
  { id: "sleep", label: "Sleep", value: 7.5, target: 8, unit: "hours", icon: Moon, color: "text-indigo-600", trend: "up" },
  { id: "calories", label: "Nutrition", value: 1850, target: 2000, unit: "kcal", icon: Apple, color: "text-green-600", trend: "down" },
];

const checkupsData: Checkup[] = [
  { id: 1, type: "Annual Physical", provider: "Dr. Papadopoulos", date: "2024-11-15", status: "completed", results: "All tests normal. Cholesterol slightly elevated." },
  { id: 2, type: "Dental Checkup", provider: "Dental Care Athens", date: "2024-12-10", status: "scheduled" },
  { id: 3, type: "Eye Exam", provider: "OptiVision Clinic", date: "2024-06-20", status: "overdue" },
  { id: 4, type: "Cardiac Screening", provider: "Hygeia Hospital", date: "2024-09-05", status: "completed", results: "ECG normal. Blood pressure within range." },
];

const recommendationsData: Recommendation[] = [
  { id: 1, title: "Schedule Eye Exam", description: "Your last eye exam was over 12 months ago. Regular checkups help detect issues early.", priority: "high", category: "Preventive", covered: true, completed: false },
  { id: 2, title: "Flu Vaccination", description: "Flu season is approaching. Get vaccinated to stay protected.", priority: "medium", category: "Vaccination", covered: true, completed: false },
  { id: 3, title: "Increase Daily Steps", description: "You're averaging 7,000 steps. Try to reach 10,000 for better cardiovascular health.", priority: "low", category: "Lifestyle", covered: false, completed: false },
  { id: 4, title: "Dental Cleaning", description: "Your dental cleaning is due. Regular cleanings prevent cavities and gum disease.", priority: "medium", category: "Preventive", covered: true, completed: true },
];

const upcomingAppointments = [
  { id: 1, type: "Dental Checkup", provider: "Dental Care Athens", date: "2024-12-10", time: "10:00 AM" },
  { id: 2, type: "Blood Work", provider: "Diagnostiki Lab", date: "2024-12-18", time: "8:30 AM" },
];

export default function HealthWellnessPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState("Annual");
  const [uploadProvider, setUploadProvider] = useState("");
  const [uploadResults, setUploadResults] = useState("");
  const [recommendations, setRecommendations] = useState(recommendationsData);

  // Calculate Wellness Score
  const completedRecs = recommendations.filter(r => r.completed).length;
  const totalRecs = recommendations.length;
  const checkupsUpToDate = checkupsData.filter(c => c.status !== "overdue").length;
  const totalCheckups = checkupsData.length;
  
  const wellnessScore = Math.round(
    ((completedRecs / totalRecs) * 30) + 
    ((checkupsUpToDate / totalCheckups) * 40) +
    ((healthMetrics.reduce((acc, m) => acc + (m.value / m.target), 0) / healthMetrics.length) * 30)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const handleCompleteRecommendation = (id: number) => {
    setRecommendations(recommendations.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
    toast.success("Recommendation updated");
  };

  const handleUploadCheckup = () => {
    if (!uploadProvider.trim()) {
      toast.error("Please enter a provider");
      return;
    }
    toast.success("Checkup uploaded successfully");
    setIsUploadOpen(false);
    setUploadProvider("");
    setUploadResults("");
  };

  const pendingRecs = recommendations.filter(r => !r.completed);
  const overdueCheckups = checkupsData.filter(c => c.status === "overdue");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Health & Wellness</h1>
                <p className="text-xs text-muted-foreground">Track your health journey</p>
              </div>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" data-testid="button-upload-checkup">
                  <FileUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Checkup Results</DialogTitle>
                  <DialogDescription>Add your latest health checkup to track your wellness</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Checkup Type</Label>
                    <Select value={uploadType} onValueChange={setUploadType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Annual">Annual Physical</SelectItem>
                        <SelectItem value="Dental">Dental Checkup</SelectItem>
                        <SelectItem value="Eye">Eye Exam</SelectItem>
                        <SelectItem value="Cardiac">Cardiac Screening</SelectItem>
                        <SelectItem value="Lab">Lab Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Healthcare Provider</Label>
                    <Input
                      placeholder="e.g., Dr. Papadopoulos"
                      value={uploadProvider}
                      onChange={(e) => setUploadProvider(e.target.value)}
                      data-testid="input-provider"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Results / Notes</Label>
                    <Textarea
                      placeholder="Paste your findings or add notes..."
                      value={uploadResults}
                      onChange={(e) => setUploadResults(e.target.value)}
                      className="h-24"
                      data-testid="textarea-results"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                  <Button onClick={handleUploadCheckup} data-testid="button-submit-checkup">
                    Upload Results
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Wellness Score - Hero Widget */}
        <Card className="p-5 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-5">
            {/* Circular Progress */}
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
                  stroke="url(#wellnessGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${wellnessScore}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="wellnessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(wellnessScore)}`}>{wellnessScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            
            {/* Score Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">Wellness Score</h2>
                <Badge variant="outline" className={`${getScoreColor(wellnessScore)} border-current`}>
                  {getScoreLabel(wellnessScore)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your checkups, health goals, and recommendations
              </p>
              <div className="flex items-center gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-muted-foreground">{completedRecs}/{totalRecs} Tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-muted-foreground">{checkupsUpToDate}/{totalCheckups} Checkups</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            const progress = Math.min((metric.value / metric.target) * 100, 100);
            
            return (
              <Card key={metric.id} className="p-3 border border-border/50">
                <div className="flex flex-col items-center text-center">
                  <Icon className={`h-5 w-5 ${metric.color} mb-1`} />
                  <p className="text-lg font-bold text-foreground">{metric.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <Progress value={progress} className="h-1 w-full" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Alerts Section */}
        {(overdueCheckups.length > 0 || pendingRecs.filter(r => r.priority === "high").length > 0) && (
          <div className="space-y-3">
            {overdueCheckups.length > 0 && (
              <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-red-800 dark:text-red-200">Overdue Checkups</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                      {overdueCheckups.length} checkup{overdueCheckups.length > 1 ? "s" : ""} overdue: {overdueCheckups.map(c => c.type).join(", ")}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0 border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                    Schedule
                  </Button>
                </div>
              </Card>
            )}
            
            {pendingRecs.filter(r => r.priority === "high").length > 0 && (
              <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">High Priority Actions</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                      {pendingRecs.filter(r => r.priority === "high").length} recommendation{pendingRecs.filter(r => r.priority === "high").length > 1 ? "s" : ""} need your attention
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                    View
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Upcoming Appointments Widget */}
        {upcomingAppointments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Upcoming Appointments</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="p-4 min-w-[240px] flex-shrink-0 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                        {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {new Date(apt.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">{apt.type}</p>
                      <p className="text-xs text-muted-foreground">{apt.provider}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{apt.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Card className="p-4 min-w-[120px] flex-shrink-0 border border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:bg-muted/30">
                <div className="text-center">
                  <Plus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">Schedule New</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Health Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Recommended Actions</h2>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {pendingRecs.length} pending
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            {recommendations.slice(0, 4).map((rec) => {
              const priorityConfig = {
                high: { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", border: "border-red-200 dark:border-red-800" },
                medium: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-200 dark:border-amber-800" },
                low: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-200 dark:border-blue-800" },
              };
              const config = priorityConfig[rec.priority];
              
              return (
                <Card 
                  key={rec.id} 
                  className={`p-4 border transition-all ${rec.completed ? "opacity-60 bg-muted/30" : "border-border/50"}`}
                  data-testid={`recommendation-${rec.id}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleCompleteRecommendation(rec.id)}
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        rec.completed 
                          ? "bg-emerald-500 border-emerald-500" 
                          : "border-muted-foreground/30 hover:border-primary"
                      }`}
                      data-testid={`button-complete-${rec.id}`}
                    >
                      {rec.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`font-semibold text-sm ${rec.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {rec.title}
                        </h3>
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${config.color} ${config.border}`}>
                          {rec.priority}
                        </Badge>
                        {rec.covered && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Covered
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Checkups */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Checkup History</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {checkupsData.slice(0, 3).map((checkup) => {
              const statusConfig = {
                completed: { color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: CheckCircle2 },
                scheduled: { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/40", icon: Calendar },
                overdue: { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/40", icon: AlertCircle },
              };
              const config = statusConfig[checkup.status];
              const StatusIcon = config.icon;
              
              return (
                <Card key={checkup.id} className="p-4 border border-border/50" data-testid={`checkup-${checkup.id}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl ${config.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className="text-xs font-bold uppercase" style={{ color: 'inherit' }}>
                        {new Date(checkup.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(checkup.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm text-foreground">{checkup.type}</h3>
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${config.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {checkup.status.charAt(0).toUpperCase() + checkup.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{checkup.provider}</p>
                      {checkup.results && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{checkup.results}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coverage Benefits Widget */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/50">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-100 mb-1">Health Coverage Benefits</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                Your NN Hellas health plan covers preventive care including annual physicals, vaccinations, and screenings.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>Annual Physical</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <Pill className="h-3.5 w-3.5" />
                  <span>Vaccinations</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Vision Care</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <Smile className="h-3.5 w-3.5" />
                  <span>Dental Basic</span>
                </div>
              </div>
            </div>
            <Link href="/policies">
              <Button size="sm" variant="outline" className="flex-shrink-0 border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                View Plan
              </Button>
            </Link>
          </div>
        </Card>

        {/* Wellness Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Daily Wellness Tips</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Stay Hydrated</p>
                  <p className="text-xs text-muted-foreground">Drink 8 glasses of water daily</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Quality Sleep</p>
                  <p className="text-xs text-muted-foreground">Aim for 7-8 hours nightly</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
