import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FileUp,
  Edit3,
  Building2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  FileText,
  Camera,
  Upload,
  Loader2,
  Shield,
  Heart,
  Car,
  Home,
  Users,
  Plane,
  PawPrint,
  Anchor,
  Lock,
  AlertCircle,
  X,
  Eye,
  Calendar,
  Euro,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  FileCheck,
  ArrowRight,
  Wand2
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { greekInsurers, insuranceTypeLabels, type Insurer, type InsuranceType, getInsurersByType } from "@/data/greek-insurers";
import { apiRequest } from "@/lib/queryClient";

type AddMethod = "document" | "search" | "manual";
type WizardStep = "insurer" | "type" | "method" | "input" | "review";

interface PolicyFormData {
  insurerId: string;
  insurerName: string;
  policyType: InsuranceType | "";
  policyNumber: string;
  policyName: string;
  startDate: string;
  endDate: string;
  premium: string;
  premiumFrequency: string;
  coverageAmount: string;
  deductible: string;
  holderName: string;
  holderAfm: string;
  holderAddress: string;
  holderPhone: string;
  holderEmail: string;
  notes: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  propertyAddress?: string;
  propertySqm?: string;
}

const typeIcons: Record<InsuranceType, any> = {
  health: Heart,
  auto: Car,
  home: Home,
  life: Users,
  travel: Plane,
  pet: PawPrint,
  business: Building2,
  marine: Anchor,
  liability: Shield,
  cyber: Lock,
};

const typeColors: Record<InsuranceType, { color: string; bg: string }> = {
  health: { color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
  auto: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  home: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  life: { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
  travel: { color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  pet: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  business: { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-900/40" },
  marine: { color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
  liability: { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  cyber: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
};

export default function AddPolicyPage() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<WizardStep>("insurer");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null);
  const [selectedType, setSelectedType] = useState<InsuranceType | "">("");
  const [addMethod, setAddMethod] = useState<AddMethod | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Partial<PolicyFormData> | null>(null);
  const [policySearchId, setPolicySearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [manualStep, setManualStep] = useState(1);

  const [formData, setFormData] = useState<PolicyFormData>({
    insurerId: "",
    insurerName: "",
    policyType: "",
    policyNumber: "",
    policyName: "",
    startDate: "",
    endDate: "",
    premium: "",
    premiumFrequency: "annual",
    coverageAmount: "",
    deductible: "",
    holderName: "",
    holderAfm: "",
    holderAddress: "",
    holderPhone: "",
    holderEmail: "",
    notes: "",
  });

  // Filter insurers based on search
  const filteredInsurers = useMemo(() => {
    if (!searchTerm) return greekInsurers;
    const lower = searchTerm.toLowerCase();
    return greekInsurers.filter(
      i => i.name.toLowerCase().includes(lower) || i.nameEn.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  // Get available types for selected insurer
  const availableTypes = useMemo(() => {
    if (!selectedInsurer) return [];
    return selectedInsurer.supportedTypes;
  }, [selectedInsurer]);

  const stepProgress = {
    insurer: 20,
    type: 40,
    method: 60,
    input: 80,
    review: 100,
  };

  const handleSelectInsurer = (insurer: Insurer) => {
    setSelectedInsurer(insurer);
    setFormData(prev => ({ ...prev, insurerId: insurer.id, insurerName: insurer.name }));
    setStep("type");
  };

  const handleSelectType = (type: InsuranceType) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, policyType: type }));
    setStep("method");
  };

  const handleSelectMethod = (method: AddMethod) => {
    setAddMethod(method);
    setStep("input");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("addPolicy.errors.fileTooLarge"));
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    toast.success(t("addPolicy.success.fileUploaded"));
  };

  const handleParseDocument = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);
    
    try {
      // Read file content as text or base64
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        if (uploadedFile.type === 'application/pdf') {
          reader.readAsDataURL(uploadedFile);
        } else {
          reader.readAsText(uploadedFile);
        }
      });

      // Call the Gemini AI API endpoint
      const response = await apiRequest("POST", "/api/policies/parse-document", {
        documentContent: fileContent,
        documentType: uploadedFile.type,
        insurerId: selectedInsurer?.id,
        policyType: selectedType,
      });

      const result = await response.json();
      
      if (result.success && result.parsedData) {
        const parsed = result.parsedData as Partial<PolicyFormData>;
        setParsedData(parsed);
        setFormData(prev => ({ ...prev, ...parsed }));
        toast.success(t("addPolicy.success.documentParsed"));
        setStep("review");
      } else {
        throw new Error("Failed to parse document");
      }
    } catch (error: any) {
      console.error("Document parsing error:", error);
      toast.error(t("addPolicy.errors.parseFailed"));
    } finally {
      setIsParsing(false);
    }
  };

  const handleSearchPolicy = async () => {
    if (!policySearchId.trim()) {
      toast.error(t("addPolicy.errors.enterPolicyNumber"));
      return;
    }

    setIsSearching(true);
    
    try {
      // Call the policy search API
      const response = await fetch(`/api/policies/search/${selectedInsurer?.id}/${encodeURIComponent(policySearchId)}`);
      const result = await response.json();

      if (result.found && result.policy) {
        const foundData = result.policy as Partial<PolicyFormData>;
        setParsedData(foundData);
        setFormData(prev => ({ ...prev, ...foundData }));
        toast.success(t("addPolicy.success.policyFound"));
        setStep("review");
      } else {
        toast.error(t("addPolicy.errors.policyNotFound"));
      }
    } catch (error: any) {
      console.error("Policy search error:", error);
      toast.error(t("addPolicy.errors.searchFailed"));
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualNext = () => {
    if (manualStep < 3) {
      setManualStep(manualStep + 1);
    } else {
      setStep("review");
    }
  };

  const handleManualBack = () => {
    if (manualStep > 1) {
      setManualStep(manualStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.policyNumber || !formData.startDate || !formData.endDate || !formData.premium) {
      toast.error(t("addPolicy.errors.requiredFields"));
      return;
    }

    // Validate ΑΦΜ if provided
    if (formData.holderAfm && !validateAfm(formData.holderAfm)) {
      toast.error(t("addPolicy.errors.invalidAfm"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the policy creation API
      const response = await apiRequest("POST", "/api/policies", {
        ...formData,
        insurerId: selectedInsurer?.id,
        policyType: selectedType,
      });

      const newPolicy = await response.json();
      
      toast.success(t("addPolicy.success.policyAdded"));
      setLocation("/policies");
    } catch (error: any) {
      console.error("Policy creation error:", error);
      toast.error(t("addPolicy.errors.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAfm = (afm: string) => {
    const cleanAfm = afm.replace(/\s/g, '');
    return /^\d{9}$/.test(cleanAfm);
  };

  const renderStepContent = () => {
    switch (step) {
      case "insurer":
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("addPolicy.searchInsurers")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-insurer"
              />
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredInsurers.slice(0, 20).map((insurer) => (
                <Card
                  key={insurer.id}
                  className="p-3 border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSelectInsurer(insurer)}
                  data-testid={`insurer-${insurer.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground">{insurer.name}</h3>
                      <p className="text-xs text-muted-foreground">{insurer.nameEn}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insurer.supportedTypes.slice(0, 4).map(type => (
                          <Badge key={type} variant="secondary" className="text-[9px] px-1 py-0">
                            {insuranceTypeLabels[type].el}
                          </Badge>
                        ))}
                        {insurer.supportedTypes.length > 4 && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">
                            +{insurer.supportedTypes.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredInsurers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("common.noResults")}</p>
              </div>
            )}
          </div>
        );

      case "type":
        return (
          <div className="space-y-4">
            <Card className="p-3 bg-muted/30 border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedInsurer?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedInsurer?.nameEn}</p>
                </div>
              </div>
            </Card>

            <p className="text-sm text-muted-foreground">{t("addPolicy.selectTypeDesc")}</p>
            
            <div className="grid grid-cols-2 gap-2">
              {availableTypes.map(type => {
                const Icon = typeIcons[type];
                const colors = typeColors[type];
                const label = insuranceTypeLabels[type];
                
                return (
                  <Card
                    key={type}
                    className="p-3 border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSelectType(type)}
                    data-testid={`type-${type}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${colors.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground">{label.el}</p>
                        <p className="text-[10px] text-muted-foreground">{label.en}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case "method":
        return (
          <div className="space-y-4">
            <Card className="p-3 bg-muted/30 border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{selectedInsurer?.name}</p>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-0.5">
                    {selectedType && t(`addPolicy.types.${selectedType}`)}
                  </Badge>
                </div>
              </div>
            </Card>

            <p className="text-sm text-muted-foreground">{t("addPolicy.selectMethodDesc")}</p>

            <div className="space-y-2">
              {/* Document Upload with AI */}
              <Card
                className="p-4 border border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleSelectMethod("document")}
                data-testid="method-document"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Wand2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground">{t("addPolicy.methods.document.title")}</h3>
                      <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0">
                        <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                        AI
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("addPolicy.methods.document.desc")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </Card>

              {/* Search Insurer DB */}
              <Card
                className="p-4 border border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleSelectMethod("search")}
                data-testid="method-search"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-foreground">{t("addPolicy.methods.search.title")}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("addPolicy.methods.search.desc", { insurer: selectedInsurer?.name })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </Card>

              {/* Manual Entry */}
              <Card
                className="p-4 border border-border/50 cursor-pointer hover:bg-muted/30 transition-all"
                onClick={() => handleSelectMethod("manual")}
                data-testid="method-manual"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Edit3 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-foreground">{t("addPolicy.methods.manual.title")}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("addPolicy.methods.manual.desc")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </Card>
            </div>
          </div>
        );

      case "input":
        if (addMethod === "document") {
          return (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-6 bg-purple-50/30 dark:bg-purple-950/20">
                {!uploadedFile ? (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-12 w-12 text-purple-400 mb-3" />
                    <span className="text-sm font-medium text-foreground mb-1">{t("addPolicy.selectFile")}</span>
                    <span className="text-xs text-muted-foreground">{t("addPolicy.fileFormats")}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileUpload}
                      data-testid="input-file"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setUploadedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {uploadedFile && !isUploading && (
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleParseDocument}
                  disabled={isParsing}
                  data-testid="button-parse"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("addPolicy.analyzingWithAI")}
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      {t("addPolicy.analyzeDocument")}
                    </>
                  )}
                </Button>
              )}

              {isParsing && (
                <Card className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
                    <div>
                      <p className="font-medium text-sm text-purple-900 dark:text-purple-100">{t("addPolicy.aiAnalysis")}</p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">{t("addPolicy.extractingData")}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          );
        }

        if (addMethod === "search") {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("addPolicy.policyNumber")}</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("addPolicy.policyNumberPlaceholder")}
                    value={policySearchId}
                    onChange={(e) => setPolicySearchId(e.target.value)}
                    className="pl-9"
                    data-testid="input-policy-search"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("addPolicy.searchHint")}
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleSearchPolicy}
                disabled={isSearching}
                data-testid="button-search-policy"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("addPolicy.searching")}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    {t("addPolicy.searchInDatabase", { insurer: selectedInsurer?.name })}
                  </>
                )}
              </Button>
            </div>
          );
        }

        if (addMethod === "manual") {
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`flex-1 h-1.5 rounded-full ${s <= manualStep ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>

              {manualStep === 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">{t("addPolicy.policyDetails")}</p>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.policyNumber")} <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder={t("addPolicy.policyNumberPlaceholder")}
                      value={formData.policyNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, policyNumber: e.target.value }))}
                      data-testid="input-policy-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.policyName")}</Label>
                    <Input
                      placeholder={t("addPolicy.policyNamePlaceholder")}
                      value={formData.policyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, policyName: e.target.value }))}
                      data-testid="input-policy-name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>{t("addPolicy.startDate")} <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        data-testid="input-start-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("addPolicy.endDate")} <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        data-testid="input-end-date"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>{t("addPolicy.premium")} <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder={t("addPolicy.premiumPlaceholder")}
                          value={formData.premium}
                          onChange={(e) => setFormData(prev => ({ ...prev, premium: e.target.value }))}
                          className="pl-9"
                          data-testid="input-premium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("addPolicy.premiumFrequency")}</Label>
                      <Select
                        value={formData.premiumFrequency}
                        onValueChange={(v) => setFormData(prev => ({ ...prev, premiumFrequency: v }))}
                      >
                        <SelectTrigger data-testid="select-frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">{t("addPolicy.monthly")}</SelectItem>
                          <SelectItem value="quarterly">{t("addPolicy.quarterly")}</SelectItem>
                          <SelectItem value="annual">{t("addPolicy.annual")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {manualStep === 2 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">{t("addPolicy.coverageDetails")}</p>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.coverageAmount")}</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder={t("addPolicy.coverageAmountPlaceholder")}
                        value={formData.coverageAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverageAmount: e.target.value }))}
                        className="pl-9"
                        data-testid="input-coverage"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.deductible")}</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder={t("addPolicy.deductiblePlaceholder")}
                        value={formData.deductible}
                        onChange={(e) => setFormData(prev => ({ ...prev, deductible: e.target.value }))}
                        className="pl-9"
                        data-testid="input-deductible"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.notes")}</Label>
                    <Textarea
                      placeholder={t("addPolicy.notesPlaceholder")}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      data-testid="textarea-notes"
                    />
                  </div>
                </div>
              )}

              {manualStep === 3 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">{t("addPolicy.holderDetails")}</p>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.holderName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("addPolicy.holderNamePlaceholder")}
                        value={formData.holderName}
                        onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
                        className="pl-9"
                        data-testid="input-holder-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.holderAfm")}</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("addPolicy.holderAfmPlaceholder")}
                        value={formData.holderAfm}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                          setFormData(prev => ({ ...prev, holderAfm: value }));
                        }}
                        maxLength={9}
                        className="pl-9"
                        data-testid="input-holder-afm"
                      />
                    </div>
                    {formData.holderAfm && !validateAfm(formData.holderAfm) && (
                      <p className="text-xs text-red-500">{t("addPolicy.errors.invalidAfm")}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>{t("addPolicy.holderPhone")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t("addPolicy.holderPhonePlaceholder")}
                          value={formData.holderPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, holderPhone: e.target.value }))}
                          className="pl-9"
                          data-testid="input-holder-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("addPolicy.holderEmail")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder={t("addPolicy.holderEmailPlaceholder")}
                          value={formData.holderEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, holderEmail: e.target.value }))}
                          className="pl-9"
                          data-testid="input-holder-email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("addPolicy.holderAddress")}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("addPolicy.holderAddressPlaceholder")}
                        value={formData.holderAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, holderAddress: e.target.value }))}
                        className="pl-9"
                        data-testid="input-holder-address"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {manualStep > 1 && (
                  <Button variant="outline" onClick={handleManualBack} className="flex-1">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t("addPolicy.back")}
                  </Button>
                )}
                <Button onClick={handleManualNext} className="flex-1" data-testid="button-manual-next">
                  {manualStep < 3 ? (
                    <>
                      {t("addPolicy.next")}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      {t("addPolicy.preview")}
                      <Eye className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        }
        return null;

      case "review":
        return (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t("addPolicy.readyToSave")}</h3>
              <p className="text-xs text-muted-foreground">{t("addPolicy.reviewDesc")}</p>
            </div>

            <Card className="p-4 bg-muted/30 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedInsurer?.name}</p>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {selectedType && t(`addPolicy.types.${selectedType}`)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{t("addPolicy.policyNumberShort")}</p>
                  <p className="font-medium font-mono text-xs">{formData.policyNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{t("addPolicy.premiumLabel")}</p>
                  <p className="font-bold text-primary">€{formData.premium || "0"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{t("addPolicy.startDateShort")}</p>
                  <p className="font-medium text-xs">{formData.startDate ? new Date(formData.startDate).toLocaleDateString(i18n.language === 'el' ? 'el-GR' : 'en-US') : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{t("addPolicy.endDateShort")}</p>
                  <p className="font-medium text-xs">{formData.endDate ? new Date(formData.endDate).toLocaleDateString(i18n.language === 'el' ? 'el-GR' : 'en-US') : "—"}</p>
                </div>
                {formData.coverageAmount && (
                  <>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">{t("addPolicy.coverageLabel")}</p>
                      <p className="font-medium text-xs">€{formData.coverageAmount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">{t("addPolicy.deductibleLabel")}</p>
                      <p className="font-medium text-xs">€{formData.deductible || "0"}</p>
                    </div>
                  </>
                )}
              </div>

              {(formData.holderName || formData.holderAfm) && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">{t("addPolicy.insuredPerson")}</p>
                  <p className="font-medium text-xs">{formData.holderName}</p>
                  {formData.holderAfm && <p className="text-xs text-muted-foreground">{t("addPolicy.taxId")}: {formData.holderAfm}</p>}
                </div>
              )}

              {parsedData && (
                <div className="pt-2 flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[10px]">{t("addPolicy.parsedWithAI")}</span>
                </div>
              )}
            </Card>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              data-testid="button-save-policy"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("addPolicy.saving")}
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-2" />
                  {t("addPolicy.savePolicy")}
                </>
              )}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (step === "insurer") {
                    setLocation("/policies");
                  } else if (step === "type") {
                    setStep("insurer");
                  } else if (step === "method") {
                    setStep("type");
                  } else if (step === "input") {
                    setStep("method");
                    setManualStep(1);
                  } else if (step === "review") {
                    if (addMethod === "manual") {
                      setStep("input");
                    } else {
                      setStep("method");
                    }
                  }
                }}
                data-testid="button-back"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">{t("addPolicy.title")}</h1>
                <p className="text-xs text-muted-foreground">
                  {step === "insurer" && t("addPolicy.selectInsurer")}
                  {step === "type" && t("addPolicy.selectType")}
                  {step === "method" && t("addPolicy.selectMethod")}
                  {step === "input" && t("addPolicy.policyDetails")}
                  {step === "review" && t("addPolicy.review")}
                </p>
              </div>
            </div>
          </div>
          <Progress value={stepProgress[step]} className="h-1 mt-3" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {renderStepContent()}
      </div>
    </div>
  );
}
