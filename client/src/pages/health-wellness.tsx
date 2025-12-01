import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  Smile,
  Link2,
  Link2Off,
  Flame,
  Timer,
  MapPin,
  Bike,
  Dumbbell,
  Waves,
  Mountain,
  RefreshCw,
  Minus,
  Edit3,
  Save,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  FileText,
  Building2
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface DailyMetric {
  id: string;
  label: string;
  labelEn: string;
  value: number;
  target: number;
  unit: string;
  icon: any;
  color: string;
  bgColor: string;
  field: string;
}

interface MedicalExamination {
  id: number;
  type: string;
  typeEn: string;
  provider: string;
  providerType: string;
  date: string;
  status: "completed" | "scheduled" | "overdue";
  results?: string;
  coveredByPolicy: boolean;
}

interface PreventiveCareAction {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  coveredByInsurance: boolean;
  completed: boolean;
  estimatedCost?: string;
  insuranceCoverage?: string;
}

interface StravaActivity {
  id: string;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  average_heartrate?: number;
  calories?: number;
}

const medicalExaminations: MedicalExamination[] = [
  { 
    id: 1, 
    type: "Ετήσιος Γενικός Έλεγχος", 
    typeEn: "Annual Health Screening",
    provider: "Δρ. Παπαδόπουλος", 
    providerType: "Παθολόγος",
    date: "2024-11-15", 
    status: "completed", 
    results: "Όλες οι εξετάσεις φυσιολογικές. Χοληστερόλη οριακά αυξημένη.",
    coveredByPolicy: true
  },
  { 
    id: 2, 
    type: "Οδοντιατρικός Έλεγχος", 
    typeEn: "Dental Examination",
    provider: "Dental Care Athens", 
    providerType: "Οδοντιατρείο",
    date: "2024-12-10", 
    status: "scheduled",
    coveredByPolicy: true
  },
  { 
    id: 3, 
    type: "Οφθαλμολογική Εξέταση", 
    typeEn: "Ophthalmological Exam",
    provider: "OptiVision Clinic", 
    providerType: "Οφθαλμολογικό Κέντρο",
    date: "2024-06-20", 
    status: "overdue",
    coveredByPolicy: true
  },
  { 
    id: 4, 
    type: "Καρδιολογικός Έλεγχος", 
    typeEn: "Cardiac Screening",
    provider: "Υγεία Hospital", 
    providerType: "Νοσοκομείο",
    date: "2024-09-05", 
    status: "completed", 
    results: "ΗΚΓ φυσιολογικό. Αρτηριακή πίεση εντός ορίων.",
    coveredByPolicy: true
  },
];

const preventiveCareActions: PreventiveCareAction[] = [
  { 
    id: 1, 
    title: "Προγραμματισμός Οφθαλμολογικής Εξέτασης", 
    description: "Η τελευταία εξέταση ήταν πριν από 12+ μήνες. Οι τακτικοί έλεγχοι βοηθούν στην έγκαιρη ανίχνευση προβλημάτων.", 
    priority: "high", 
    category: "Πρόληψη", 
    coveredByInsurance: true, 
    completed: false,
    estimatedCost: "€80",
    insuranceCoverage: "100%"
  },
  { 
    id: 2, 
    title: "Εμβολιασμός Γρίπης", 
    description: "Πλησιάζει η περίοδος της γρίπης. Εμβολιαστείτε για προστασία.", 
    priority: "medium", 
    category: "Εμβολιασμός", 
    coveredByInsurance: true, 
    completed: false,
    estimatedCost: "€25",
    insuranceCoverage: "100%"
  },
  { 
    id: 3, 
    title: "Αύξηση Ημερήσιων Βημάτων", 
    description: "Ο μέσος όρος σας είναι 7.000 βήματα. Στοχεύστε στα 10.000 για καλύτερη καρδιαγγειακή υγεία.", 
    priority: "low", 
    category: "Τρόπος Ζωής", 
    coveredByInsurance: false, 
    completed: false
  },
  { 
    id: 4, 
    title: "Οδοντικός Καθαρισμός", 
    description: "Ο καθαρισμός σας είναι προγραμματισμένος. Οι τακτικοί καθαρισμοί προλαμβάνουν τερηδόνα και ουλίτιδα.", 
    priority: "medium", 
    category: "Πρόληψη", 
    coveredByInsurance: true, 
    completed: true,
    estimatedCost: "€60",
    insuranceCoverage: "80%"
  },
];

const scheduledAppointments = [
  { id: 1, type: "Οδοντιατρικός Έλεγχος", typeEn: "Dental Checkup", provider: "Dental Care Athens", date: "2024-12-10", time: "10:00" },
  { id: 2, type: "Αιματολογικές Εξετάσεις", typeEn: "Blood Work", provider: "Διαγνωστικό Κέντρο", date: "2024-12-18", time: "08:30" },
];

const mockStravaActivities: StravaActivity[] = [
  { id: "1", name: "Πρωινό Τρέξιμο", type: "Run", distance: 5200, moving_time: 1800, elapsed_time: 1900, start_date: "2024-12-01T06:30:00Z", average_heartrate: 145, calories: 320 },
  { id: "2", name: "Απογευματινή Ποδηλασία", type: "Ride", distance: 15000, moving_time: 2700, elapsed_time: 3000, start_date: "2024-11-30T17:00:00Z", average_heartrate: 135, calories: 450 },
  { id: "3", name: "Κολύμβηση", type: "Swim", distance: 1500, moving_time: 2400, elapsed_time: 2500, start_date: "2024-11-29T12:00:00Z", calories: 280 },
];

const activityTypeIcons: Record<string, any> = {
  Run: Footprints,
  Ride: Bike,
  Swim: Waves,
  Walk: Footprints,
  Hike: Mountain,
  Workout: Dumbbell,
  default: Activity
};

const getActivityTypeLabels = (t: (key: string) => string): Record<string, string> => ({
  Run: t("wellness.strava.activityTypes.run"),
  Ride: t("wellness.strava.activityTypes.ride"),
  Swim: t("wellness.strava.activityTypes.swim"),
  Walk: t("wellness.strava.activityTypes.walk"),
  Hike: t("wellness.strava.activityTypes.hike"),
  Workout: t("wellness.strava.activityTypes.workout"),
});

export default function HealthWellnessPage() {
  const { t } = useTranslation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState("annual");
  const [uploadProvider, setUploadProvider] = useState("");
  const [uploadResults, setUploadResults] = useState("");
  const [actions, setActions] = useState(preventiveCareActions);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [showStravaActivities, setShowStravaActivities] = useState(true);

  const [editableMetrics, setEditableMetrics] = useState({
    steps: 7234,
    waterGlasses: 6,
    sleepHours: 7.5,
    calories: 1850,
    activeMinutes: 45,
  });

  const [metricGoals] = useState({
    stepsGoal: 10000,
    waterGoal: 8,
    sleepGoal: 8,
    caloriesGoal: 2000,
    activeMinutesGoal: 30,
  });

  const [stravaData, setStravaData] = useState({
    athleteName: "",
    activities: mockStravaActivities,
  });

  const dailyMetrics: DailyMetric[] = [
    { id: "steps", label: "Βήματα", labelEn: "Steps", value: editableMetrics.steps, target: metricGoals.stepsGoal, unit: "", icon: Footprints, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/40", field: "steps" },
    { id: "water", label: "Νερό", labelEn: "Water", value: editableMetrics.waterGlasses, target: metricGoals.waterGoal, unit: "ποτ.", icon: Droplets, color: "text-cyan-600 dark:text-cyan-400", bgColor: "bg-cyan-100 dark:bg-cyan-900/40", field: "waterGlasses" },
    { id: "sleep", label: "Ύπνος", labelEn: "Sleep", value: editableMetrics.sleepHours, target: metricGoals.sleepGoal, unit: "ώρες", icon: Moon, color: "text-indigo-600 dark:text-indigo-400", bgColor: "bg-indigo-100 dark:bg-indigo-900/40", field: "sleepHours" },
    { id: "calories", label: "Διατροφή", labelEn: "Nutrition", value: editableMetrics.calories, target: metricGoals.caloriesGoal, unit: "kcal", icon: Apple, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/40", field: "calories" },
  ];

  const completedActions = actions.filter(a => a.completed).length;
  const totalActions = actions.length;
  const examsUpToDate = medicalExaminations.filter(e => e.status !== "overdue").length;
  const totalExams = medicalExaminations.length;
  
  const metricsScore = dailyMetrics.reduce((acc, m) => acc + Math.min((m.value / m.target), 1), 0) / dailyMetrics.length;
  
  const wellnessScore = Math.round(
    ((completedActions / totalActions) * 25) + 
    ((examsUpToDate / totalExams) * 35) +
    (metricsScore * 40)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t("wellness.scoreExcellent");
    if (score >= 60) return t("wellness.scoreGood");
    if (score >= 40) return t("wellness.scoreAverage");
    return t("wellness.scoreNeedsWork");
  };

  const handleCompleteAction = (id: number) => {
    setActions(actions.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
    toast.success("Η ενέργεια ενημερώθηκε");
  };

  const handleUploadExamination = () => {
    if (!uploadProvider.trim()) {
      toast.error("Παρακαλώ εισάγετε τον πάροχο υγείας");
      return;
    }
    toast.success("Τα αποτελέσματα εξέτασης καταχωρήθηκαν επιτυχώς");
    setIsUploadOpen(false);
    setUploadProvider("");
    setUploadResults("");
  };

  const handleConnectStrava = () => {
    setStravaConnected(true);
    setStravaData({
      athleteName: "Μαρία Κ.",
      activities: mockStravaActivities,
    });
    toast.success(t("wellness.strava.connectSuccess"));
  };

  const handleDisconnectStrava = () => {
    setStravaConnected(false);
    setStravaData({ athleteName: "", activities: [] });
    toast.info(t("wellness.strava.disconnected"));
  };

  const handleMetricChange = (field: string, delta: number) => {
    setEditableMetrics(prev => ({
      ...prev,
      [field]: Math.max(0, (prev as any)[field] + delta)
    }));
  };

  const handleSaveMetrics = () => {
    setIsEditingMetrics(false);
    toast.success("Οι μετρήσεις αποθηκεύτηκαν!");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}ω ${minutes}λ`;
    return `${minutes} λεπτά`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} χλμ`;
    return `${meters} μ`;
  };

  const pendingActions = actions.filter(a => !a.completed);
  const overdueExams = medicalExaminations.filter(e => e.status === "overdue");

  const weeklyStats = stravaConnected ? {
    totalDistance: stravaData.activities.reduce((sum, a) => sum + a.distance, 0),
    totalTime: stravaData.activities.reduce((sum, a) => sum + a.moving_time, 0),
    totalCalories: stravaData.activities.reduce((sum, a) => sum + (a.calories || 0), 0),
    activityCount: stravaData.activities.length,
  } : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">Υγεία & Ευεξία</h1>
                <p className="text-xs text-muted-foreground">Παρακολούθηση Προληπτικής Φροντίδας</p>
              </div>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-shrink-0" data-testid="button-upload-exam">
                  <FileUp className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Καταχώρηση</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Καταχώρηση Ιατρικής Εξέτασης</DialogTitle>
                  <DialogDescription>Προσθέστε τα αποτελέσματα της πρόσφατης εξέτασής σας</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Τύπος Εξέτασης</Label>
                    <Select value={uploadType} onValueChange={setUploadType}>
                      <SelectTrigger data-testid="select-exam-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Ετήσιος Γενικός Έλεγχος</SelectItem>
                        <SelectItem value="dental">Οδοντιατρική Εξέταση</SelectItem>
                        <SelectItem value="eye">Οφθαλμολογική Εξέταση</SelectItem>
                        <SelectItem value="cardiac">Καρδιολογικός Έλεγχος</SelectItem>
                        <SelectItem value="lab">Εργαστηριακές Εξετάσεις</SelectItem>
                        <SelectItem value="gynecological">Γυναικολογική Εξέταση</SelectItem>
                        <SelectItem value="dermatological">Δερματολογική Εξέταση</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Πάροχος Υγείας / Ιατρός</Label>
                    <Input
                      placeholder="π.χ. Δρ. Παπαδόπουλος, Υγεία Hospital"
                      value={uploadProvider}
                      onChange={(e) => setUploadProvider(e.target.value)}
                      data-testid="input-provider"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Αποτελέσματα / Σημειώσεις</Label>
                    <Textarea
                      placeholder="Καταγράψτε τα ευρήματα ή τις συστάσεις του ιατρού..."
                      value={uploadResults}
                      onChange={(e) => setUploadResults(e.target.value)}
                      className="min-h-[100px]"
                      data-testid="textarea-results"
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="w-full sm:w-auto">Ακύρωση</Button>
                  <Button onClick={handleUploadExamination} className="w-full sm:w-auto" data-testid="button-submit-exam">
                    <FileUp className="h-4 w-4 mr-2" />
                    Καταχώρηση
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        
        {/* Wellness Score Card */}
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
                <span className={`text-xl font-bold ${getScoreColor(wellnessScore)}`}>{wellnessScore}</span>
                <span className="text-[10px] text-muted-foreground">/ 100</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-base font-bold text-foreground">{t("wellness.wellnessIndex")}</h2>
                <Badge variant="outline" className={`text-xs ${getScoreColor(wellnessScore)} border-current`}>
                  {getScoreLabel(wellnessScore)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {t("wellness.wellnessIndexDesc")}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="text-muted-foreground">{completedActions}/{totalActions} {t("wellness.actions")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">{examsUpToDate}/{totalExams} {t("wellness.exams")}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Strava Integration */}
        <Card className={`p-4 border overflow-hidden ${stravaConnected ? "border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50/50 to-rose-50/50 dark:from-orange-950/20 dark:to-rose-950/20" : "border-border/50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${stravaConnected ? "bg-orange-500" : "bg-muted"}`}>
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-foreground">Strava</h3>
                  {stravaConnected && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                      {t("wellness.strava.connected")}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {stravaConnected 
                    ? t("wellness.strava.syncFor", { name: stravaData.athleteName }) 
                    : t("wellness.strava.syncActivities")}
                </p>
              </div>
            </div>
            {stravaConnected ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => toast.success(t("wellness.strava.syncComplete"))}
                  data-testid="button-sync-strava"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDisconnectStrava}
                  className="text-red-600 dark:text-red-400 text-xs px-2"
                  data-testid="button-disconnect-strava"
                >
                  <Link2Off className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleConnectStrava}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 flex-shrink-0"
                data-testid="button-connect-strava"
              >
                <Link2 className="h-4 w-4 mr-1" />
                {t("wellness.strava.connect")}
              </Button>
            )}
          </div>
          
          {stravaConnected && weeklyStats && (
            <div className="mt-3 pt-3 border-t border-orange-200/50 dark:border-orange-800/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {formatDistance(weeklyStats.totalDistance)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{t("wellness.strava.distance")}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {formatDuration(weeklyStats.totalTime)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{t("wellness.strava.time")}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {weeklyStats.totalCalories}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{t("wellness.strava.calories")}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {weeklyStats.activityCount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{t("wellness.strava.workouts")}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Strava Activities */}
        {stravaConnected && stravaData.activities.length > 0 && (
          <div className="space-y-2">
            <button
              className="flex items-center justify-between w-full px-1"
              onClick={() => setShowStravaActivities(!showStravaActivities)}
              data-testid="toggle-activities"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-foreground">{t("wellness.strava.recentActivities")}</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0">{stravaData.activities.length}</Badge>
              </div>
              {showStravaActivities ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {showStravaActivities && (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                {stravaData.activities.map((activity) => {
                  const ActivityIcon = activityTypeIcons[activity.type] || activityTypeIcons.default;
                  const activityTypeLabels = getActivityTypeLabels(t);
                  const activityLabel = activityTypeLabels[activity.type] || activity.type;
                  return (
                    <Card key={activity.id} className="p-3 min-w-[180px] flex-shrink-0 border border-border/50 snap-start" data-testid={`activity-${activity.id}`}>
                      <div className="flex items-start gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                          <ActivityIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs text-foreground truncate">{activity.name}</p>
                          <p className="text-[10px] text-muted-foreground">{activityLabel}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              {formatDistance(activity.distance)}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Timer className="h-2.5 w-2.5" />
                              {formatDuration(activity.moving_time)}
                            </span>
                          </div>
                          {activity.calories && (
                            <div className="flex items-center gap-0.5 mt-1 text-[10px] text-orange-600 dark:text-orange-400">
                              <Flame className="h-2.5 w-2.5" />
                              {activity.calories} kcal
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Daily Wellness Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{t("wellness.dailyHealthGoals")}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isEditingMetrics ? handleSaveMetrics() : setIsEditingMetrics(true)}
              className="text-xs h-7 px-2"
              data-testid="button-edit-metrics"
            >
              {isEditingMetrics ? (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  {t("common.save")}
                </>
              ) : (
                <>
                  <Edit3 className="h-3 w-3 mr-1" />
                  {t("common.edit")}
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            {dailyMetrics.map((metric) => {
              const Icon = metric.icon;
              const progress = Math.min((metric.value / metric.target) * 100, 100);
              const isComplete = metric.value >= metric.target;
              
              return (
                <Card key={metric.id} className={`p-3 border transition-all ${isComplete ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-950/20" : "border-border/50"}`} data-testid={`metric-${metric.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-8 w-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    {isComplete && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-lg font-bold text-foreground">
                        {metric.value.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        / {metric.target.toLocaleString()} {metric.unit}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <Progress value={progress} className="h-1.5" />
                    
                    {isEditingMetrics && (
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMetricChange(metric.field, metric.id === "sleep" ? -0.5 : metric.id === "water" ? -1 : metric.id === "calories" ? -50 : -500)}
                          data-testid={`decrease-${metric.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMetricChange(metric.field, metric.id === "sleep" ? 0.5 : metric.id === "water" ? 1 : metric.id === "calories" ? 50 : 500)}
                          data-testid={`increase-${metric.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          
          {/* Active Minutes */}
          <Card className="p-3 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
                <Flame className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Ενεργά Λεπτά</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {editableMetrics.activeMinutes} / {metricGoals.activeMinutesGoal} λεπ.
                  </span>
                </div>
                <Progress 
                  value={Math.min((editableMetrics.activeMinutes / metricGoals.activeMinutesGoal) * 100, 100)} 
                  className="h-1.5" 
                />
              </div>
              {isEditingMetrics && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditableMetrics(prev => ({ ...prev, activeMinutes: Math.max(0, prev.activeMinutes - 5) }))}
                    data-testid="decrease-active-minutes"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditableMetrics(prev => ({ ...prev, activeMinutes: prev.activeMinutes + 5 }))}
                    data-testid="increase-active-minutes"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Alerts */}
        {(overdueExams.length > 0 || pendingActions.filter(a => a.priority === "high").length > 0) && (
          <div className="space-y-2">
            {overdueExams.length > 0 && (
              <Card className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-red-800 dark:text-red-200">Εκκρεμείς Ιατρικές Εξετάσεις</h3>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                      {overdueExams.length} εξέταση{overdueExams.length > 1 ? "εις" : ""} έχ{overdueExams.length > 1 ? "ουν" : "ει"} καθυστερήσει
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {overdueExams.map(exam => (
                        <Badge key={exam.id} variant="outline" className="text-[10px] px-1.5 py-0 text-red-700 border-red-300 dark:text-red-300 dark:border-red-700">
                          {exam.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex-shrink-0 text-xs border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                    Κλείσε Ραντεβού
                  </Button>
                </div>
              </Card>
            )}
            
            {pendingActions.filter(a => a.priority === "high").length > 0 && (
              <Card className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">Προτεραιότητα Υψηλή</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      {pendingActions.filter(a => a.priority === "high").length} ενέργει{pendingActions.filter(a => a.priority === "high").length > 1 ? "ες" : "α"} χρειάζ{pendingActions.filter(a => a.priority === "high").length > 1 ? "ονται" : "εται"} την προσοχή σας
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Scheduled Appointments */}
        {scheduledAppointments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Προγραμματισμένα Ραντεβού</span>
              </div>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {scheduledAppointments.map((apt) => (
                <Card key={apt.id} className="p-3 min-w-[200px] flex-shrink-0 border border-border/50 snap-start" data-testid={`appointment-${apt.id}`}>
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                        {new Date(apt.date).toLocaleString('el-GR', { month: 'short' })}
                      </span>
                      <span className="text-base font-bold text-blue-700 dark:text-blue-300 leading-none">
                        {new Date(apt.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-foreground">{apt.type}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{apt.provider}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{apt.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Card className="p-3 min-w-[100px] flex-shrink-0 border border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:bg-muted/30 snap-start">
                <div className="text-center">
                  <Plus className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <span className="text-[10px] text-muted-foreground">Νέο</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Preventive Care Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Προληπτική Φροντίδα</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {pendingActions.length} εκκρεμείς
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            {actions.map((action) => {
              const priorityConfig = {
                high: { label: "Υψηλή", color: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
                medium: { label: "Μέτρια", color: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
                low: { label: "Χαμηλή", color: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
              };
              const config = priorityConfig[action.priority];
              
              return (
                <Card 
                  key={action.id} 
                  className={`p-3 border transition-all ${action.completed ? "opacity-60 bg-muted/30" : "border-border/50"}`}
                  data-testid={`action-${action.id}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleCompleteAction(action.id)}
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        action.completed 
                          ? "bg-emerald-500 border-emerald-500" 
                          : "border-muted-foreground/30 hover:border-primary"
                      }`}
                      data-testid={`button-complete-${action.id}`}
                    >
                      {action.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <h3 className={`font-semibold text-xs ${action.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {action.title}
                        </h3>
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${config.color} ${config.border}`}>
                          {config.label}
                        </Badge>
                        {action.coveredByInsurance && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                            <Shield className="h-2.5 w-2.5 mr-0.5" />
                            Καλύπτεται
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{action.description}</p>
                      {action.estimatedCost && (
                        <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                          <span className="text-muted-foreground">Εκτ. κόστος: {action.estimatedCost}</span>
                          {action.insuranceCoverage && (
                            <span className="text-emerald-600 dark:text-emerald-400">Κάλυψη: {action.insuranceCoverage}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Medical Examinations History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Ιστορικό Εξετάσεων</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground">
              Όλες <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {medicalExaminations.slice(0, 3).map((exam) => {
              const statusConfig = {
                completed: { label: "Ολοκληρώθηκε", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: CheckCircle2 },
                scheduled: { label: "Προγραμματισμένη", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/40", icon: Calendar },
                overdue: { label: "Εκκρεμεί", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/40", icon: AlertCircle },
              };
              const config = statusConfig[exam.status];
              const StatusIcon = config.icon;
              
              return (
                <Card key={exam.id} className="p-3 border border-border/50" data-testid={`exam-${exam.id}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-lg ${config.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className={`text-[10px] font-bold uppercase ${config.color}`}>
                        {new Date(exam.date).toLocaleString('el-GR', { month: 'short' })}
                      </span>
                      <span className={`text-base font-bold ${config.color} leading-none`}>
                        {new Date(exam.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-xs text-foreground">{exam.type}</h3>
                        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${config.color}`}>
                          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                          {config.label}
                        </Badge>
                        {exam.coveredByPolicy && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                            <Shield className="h-2.5 w-2.5" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{exam.provider} - {exam.providerType}</p>
                      {exam.results && (
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{exam.results}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Insurance Coverage Benefits */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-100 mb-1">Καλύψεις Υγείας Ασφαλιστηρίου</h3>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mb-2">
                Το πρόγραμμα NN Hellas καλύπτει προληπτικούς ελέγχους, εμβολιασμούς και διαγνωστικές εξετάσεις.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Stethoscope className="h-3 w-3" />
                  <span>Ετήσιος Έλεγχος</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Pill className="h-3 w-3" />
                  <span>Εμβολιασμοί</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Eye className="h-3 w-3" />
                  <span>Οφθαλμολογικά</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Smile className="h-3 w-3" />
                  <span>Οδοντιατρικά</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50">
            <Link href="/policies">
              <Button size="sm" variant="outline" className="w-full text-xs border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Δείτε το Ασφαλιστήριο Υγείας
              </Button>
            </Link>
          </div>
        </Card>

        {/* Wellness Tips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Συμβουλές Ευεξίας</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs text-foreground">Ενυδάτωση</p>
                  <p className="text-[10px] text-muted-foreground">8 ποτήρια νερό ημερησίως</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 border border-border/50">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs text-foreground">Ύπνος</p>
                  <p className="text-[10px] text-muted-foreground">7-8 ώρες κάθε βράδυ</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
