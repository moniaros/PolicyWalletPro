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
import { markFirstTimeSetupComplete } from "./dashboard";

type AddMethod = "document" | "search" | "manual";
type WizardStep = "insurer" | "type" | "method" | "input" | "review" | "correct";

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
  const [parsedData, setParsedData] = useState<any>(null);
  const [policySearchId, setPolicySearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [manualStep, setManualStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary?: string;
    keyCoverages?: string[];
    keyNumbers?: string[];
    thingsToKnow?: string;
    benefits?: string[];
  } | null>(null);

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
    correct: 85,
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

  const validateExtractedData = (mappedData: Partial<PolicyFormData>) => {
    const errors: Record<string, string> = {};
    
    if (!mappedData.policyNumber) errors.policyNumber = t("addPolicy.errors.policyNumberRequired");
    if (!mappedData.startDate) errors.startDate = t("addPolicy.errors.startDateRequired");
    if (!mappedData.endDate) errors.endDate = t("addPolicy.errors.endDateRequired");
    if (!mappedData.premium) errors.premium = t("addPolicy.errors.premiumRequired");
    if (mappedData.holderAfm && !validateAfm(mappedData.holderAfm)) {
      errors.holderAfm = t("addPolicy.errors.invalidAfm");
    }
    
    return errors;
  };

  const handleParseDocument = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);
    
    try {
      const isImage = uploadedFile.type.startsWith('image/');
      const isPdf = uploadedFile.type === 'application/pdf';
      
      let requestBody: any = {
        documentType: uploadedFile.type,
        insurerId: selectedInsurer?.id,
        policyType: selectedType,
      };

      if (isImage || isPdf) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(uploadedFile);
        });
        requestBody.documentBase64 = base64;
        requestBody.mimeType = uploadedFile.type;
      } else {
        const textContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(uploadedFile);
        });
        requestBody.documentContent = textContent;
      }

      const response = await apiRequest("POST", "/api/policies/parse-document", requestBody);
      const result = await response.json();
      
      if (result.success && result.parsedData) {
        const parsed = result.parsedData;
        
        const mappedData: Partial<PolicyFormData> = {
          policyNumber: parsed.policy?.policyNumber,
          policyName: parsed.policy?.policyName,
          startDate: parsed.policy?.startDate,
          endDate: parsed.policy?.endDate,
          premium: parsed.policy?.premium?.toString(),
          premiumFrequency: parsed.policy?.premiumFrequency,
          coverageAmount: parsed.policy?.totalCoverage?.toString(),
          deductible: parsed.policy?.deductible?.toString(),
          holderName: parsed.policyholder?.fullName,
          holderAfm: parsed.policyholder?.afm,
          holderAddress: parsed.policyholder?.address,
          holderPhone: parsed.policyholder?.phone || parsed.policyholder?.mobile,
          holderEmail: parsed.policyholder?.email,
          vehicleMake: parsed.vehicle?.make,
          vehicleModel: parsed.vehicle?.model,
          vehiclePlate: parsed.vehicle?.plate,
          propertyAddress: parsed.property?.address,
          propertySqm: parsed.property?.squareMeters?.toString(),
        };
        
        Object.keys(mappedData).forEach(key => {
          if (mappedData[key as keyof typeof mappedData] === undefined) {
            delete mappedData[key as keyof typeof mappedData];
          }
        });

        setParsedData({ ...parsed, ...mappedData });
        setFormData(prev => ({ ...prev, ...mappedData }));
        
        const errors = validateExtractedData(mappedData);
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          setStep("correct");
          toast.info(t("addPolicy.info.reviewExtractedData"));
        } else {
          const confidence = result.confidence || 75;
          toast.success(t("addPolicy.success.documentParsed") + ` (${confidence}% ${t("addPolicy.confidence")})`);
          setStep("review");
        }
      } else {
        throw new Error(result.error || "Failed to parse document");
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
    if (!formData.policyNumber || !formData.startDate || !formData.endDate || !formData.premium) {
      toast.error(t("addPolicy.errors.requiredFields"));
      return;
    }

    if (formData.holderAfm && !validateAfm(formData.holderAfm)) {
      toast.error(t("addPolicy.errors.invalidAfm"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const policyPayload: any = {
        policy: {
          policyNumber: formData.policyNumber,
          policyName: formData.policyName || formData.policyNumber,
          policyType: selectedType,
          insurerId: selectedInsurer?.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          premium: formData.premium,
          premiumFrequency: formData.premiumFrequency || "annual",
          totalCoverage: formData.coverageAmount,
          deductible: formData.deductible,
          addedMethod: addMethod === "document" ? "ai_parsed" : addMethod === "search" ? "insurer_search" : "manual",
        },
        policyholder: {
          fullName: formData.holderName,
          afm: formData.holderAfm,
          address: formData.holderAddress,
          phone: formData.holderPhone,
          email: formData.holderEmail,
        },
      };

      if (selectedType === "auto" && (formData.vehicleMake || formData.vehiclePlate)) {
        policyPayload.vehicle = {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          plate: formData.vehiclePlate,
        };
      }

      if (selectedType === "home" && (formData.propertyAddress || formData.propertySqm)) {
        policyPayload.property = {
          address: formData.propertyAddress,
          squareMeters: formData.propertySqm ? parseInt(formData.propertySqm) : undefined,
        };
      }

      if (parsedData?.beneficiaries) {
        policyPayload.beneficiaries = parsedData.beneficiaries;
      }
      if (parsedData?.drivers) {
        policyPayload.drivers = parsedData.drivers;
      }
      if (parsedData?.coverages) {
        policyPayload.coverages = parsedData.coverages;
      }

      const response = await apiRequest("POST", "/api/policies", policyPayload);
      const newPolicy = await response.json();
      
      markFirstTimeSetupComplete();
      
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

      case "correct":
        return (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="font-bold text-base text-foreground">{t("addPolicy.reviewExtractedData")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("addPolicy.correctDataDesc")}</p>
            </div>

            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md p-3">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">{t("addPolicy.errors.missingFields")}</p>
                <ul className="space-y-1">
                  {Object.values(validationErrors).map((error, idx) => (
                    <li key={idx} className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Card className="p-4 space-y-4">
              <div>
                <Label htmlFor="correct-policy-number" className="text-xs font-semibold">{t("addPolicy.policyNumberShort")} *</Label>
                <Input
                  id="correct-policy-number"
                  value={formData.policyNumber}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, policyNumber: e.target.value }));
                    if (validationErrors.policyNumber) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.policyNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className="mt-1 text-sm"
                  data-testid="input-correct-policy-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="correct-start-date" className="text-xs font-semibold">{t("addPolicy.startDateShort")} *</Label>
                  <Input
                    id="correct-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, startDate: e.target.value }));
                      if (validationErrors.startDate) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.startDate;
                          return newErrors;
                        });
                      }
                    }}
                    className="mt-1 text-sm"
                    data-testid="input-correct-start-date"
                  />
                </div>

                <div>
                  <Label htmlFor="correct-end-date" className="text-xs font-semibold">{t("addPolicy.endDateShort")} *</Label>
                  <Input
                    id="correct-end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, endDate: e.target.value }));
                      if (validationErrors.endDate) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.endDate;
                          return newErrors;
                        });
                      }
                    }}
                    className="mt-1 text-sm"
                    data-testid="input-correct-end-date"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="correct-premium" className="text-xs font-semibold">{t("addPolicy.premiumLabel")} (€) *</Label>
                <Input
                  id="correct-premium"
                  type="number"
                  value={formData.premium}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, premium: e.target.value }));
                    if (validationErrors.premium) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.premium;
                        return newErrors;
                      });
                    }
                  }}
                  className="mt-1 text-sm"
                  data-testid="input-correct-premium"
                />
              </div>

              <div>
                <Label htmlFor="correct-afm" className="text-xs font-semibold">{t("addPolicy.taxId")}</Label>
                <Input
                  id="correct-afm"
                  placeholder="9 digits"
                  value={formData.holderAfm}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, holderAfm: e.target.value }));
                    if (validationErrors.holderAfm) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.holderAfm;
                        return newErrors;
                      });
                    }
                  }}
                  className="mt-1 text-sm"
                  data-testid="input-correct-afm"
                />
              </div>
            </Card>

            <Button
              onClick={async () => {
                const errors = validateExtractedData(formData);
                if (Object.keys(errors).length > 0) {
                  setValidationErrors(errors);
                  toast.error(t("addPolicy.errors.stillHasErrors"));
                  return;
                }
                
                setValidationErrors({});
                setIsAnalyzing(true);
                
                try {
                  const verifiedData = {
                    policy: {
                      policyNumber: formData.policyNumber,
                      policyName: formData.policyName,
                      policyType: selectedType,
                      startDate: formData.startDate,
                      endDate: formData.endDate,
                      premium: parseFloat(formData.premium) || 0,
                      premiumFrequency: formData.premiumFrequency,
                      totalCoverage: parseFloat(formData.coverageAmount) || 0,
                      deductible: parseFloat(formData.deductible) || 0,
                    },
                    policyholder: {
                      fullName: formData.holderName,
                      afm: formData.holderAfm,
                      address: formData.holderAddress,
                      phone: formData.holderPhone,
                      email: formData.holderEmail,
                    },
                    coverages: parsedData?.coverages || [],
                    benefits: parsedData?.benefits || [],
                    vehicle: parsedData?.vehicle,
                    property: parsedData?.property,
                    drivers: parsedData?.drivers,
                    beneficiaries: parsedData?.beneficiaries,
                  };
                  
                  const response = await apiRequest("POST", "/api/policies/analyze-verified", {
                    verifiedData,
                    policyType: selectedType,
                    language: i18n.language,
                  });
                  
                  const data = await response.json();
                  
                  const analysis = data.aiAnalysis;
                  const hasValidAnalysis = analysis && (
                    analysis.summary ||
                    (analysis.keyCoverages && analysis.keyCoverages.length > 0) ||
                    (analysis.keyNumbers && analysis.keyNumbers.length > 0) ||
                    analysis.thingsToKnow ||
                    (analysis.benefits && analysis.benefits.length > 0)
                  );
                  
                  if (hasValidAnalysis) {
                    setAiAnalysis(analysis);
                    toast.success(t("addPolicy.success.analysisComplete"));
                    setStep("review");
                  } else {
                    toast.error(t("addPolicy.errors.analysisFailed"));
                  }
                } catch (error) {
                  console.error("Analysis error:", error);
                  toast.error(t("addPolicy.errors.analysisFailed"));
                } finally {
                  setIsAnalyzing(false);
                }
              }}
              className="w-full"
              disabled={isAnalyzing}
              data-testid="button-correct-continue"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("addPolicy.analyzingPolicy")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t("addPolicy.confirmAndAnalyze")}
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                const errors = validateExtractedData(formData);
                if (Object.keys(errors).length > 0) {
                  setValidationErrors(errors);
                  toast.error(t("addPolicy.errors.stillHasErrors"));
                  return;
                }
                setValidationErrors({});
                setStep("review");
              }}
              className="w-full text-muted-foreground"
              disabled={isAnalyzing}
              data-testid="button-skip-analysis"
            >
              {t("addPolicy.skipAnalysis")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        );

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

            {/* Policy Header */}
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

            {/* AI Analysis Summary - Plain Language Explanation */}
            {aiAnalysis && (
              <Card className="p-4 space-y-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{t("addPolicy.aiSummary")}</h3>
                    <p className="text-[10px] text-muted-foreground">{t("addPolicy.aiSummaryDesc")}</p>
                  </div>
                </div>

                {/* Summary */}
                {aiAnalysis.summary && (
                  <div className="bg-white/60 dark:bg-black/20 rounded-md p-3">
                    <p className="text-sm text-foreground">{aiAnalysis.summary}</p>
                  </div>
                )}

                {/* Key Coverages */}
                {aiAnalysis.keyCoverages && aiAnalysis.keyCoverages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      {t("addPolicy.keyCoverages")}
                    </h4>
                    <div className="space-y-1.5">
                      {aiAnalysis.keyCoverages.map((coverage, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs bg-white/40 dark:bg-black/10 rounded-md p-2">
                          <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">{idx + 1}.</span>
                          <p className="text-muted-foreground">{coverage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Numbers */}
                {aiAnalysis.keyNumbers && aiAnalysis.keyNumbers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Euro className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {t("addPolicy.keyNumbers")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.keyNumbers.map((num, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Things to Know */}
                {aiAnalysis.thingsToKnow && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      {t("addPolicy.thingsToKnow")}
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2.5">
                      <p className="text-xs text-amber-800 dark:text-amber-200">{aiAnalysis.thingsToKnow}</p>
                    </div>
                  </div>
                )}

                {/* Benefits from AI Analysis */}
                {aiAnalysis.benefits && aiAnalysis.benefits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      {t("addPolicy.includedBenefits")}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {aiAnalysis.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* AI Analysis Skipped Message */}
            {!aiAnalysis && addMethod === "document" && (
              <Card className="p-3 bg-muted/50 border-dashed">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Sparkles className="h-4 w-4" />
                  <span>{t("addPolicy.analysisSkipped")}</span>
                </div>
              </Card>
            )}

            {/* Coverages Section */}
            {(parsedData?.coverages && parsedData.coverages.length > 0) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {t("addPolicy.coverageDetails")}
                </h3>
                <div className="space-y-2">
                  {parsedData.coverages.map((coverage: any, idx: number) => (
                    <div key={idx} className="bg-muted/50 rounded-md p-3 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-foreground">{coverage.name || coverage.code || `${t("addPolicy.coverage")} ${idx + 1}`}</p>
                        {coverage.limit && <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 whitespace-nowrap">€{coverage.limit}</Badge>}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        {coverage.deductible && <div><span className="text-[9px] uppercase">{t("addPolicy.deductibleLabel")}:</span> €{coverage.deductible}</div>}
                        {coverage.premium && <div><span className="text-[9px] uppercase">{t("addPolicy.premiumLabel")}:</span> €{coverage.premium}</div>}
                        {coverage.waitingPeriod && <div><span className="text-[9px] uppercase">{t("addPolicy.waitingPeriod")}:</span> {coverage.waitingPeriod} {t("addPolicy.days")}</div>}
                      </div>
                      {coverage.description && <p className="text-[9px] text-muted-foreground italic">{coverage.description}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Perks & Benefits Section */}
            {(parsedData?.benefits && parsedData.benefits.length > 0) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  {t("addPolicy.perksAndBenefits")}
                </h3>
                <div className="space-y-2">
                  {parsedData.benefits.map((benefit: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <div>
                        <p className="font-medium text-foreground">{benefit.name || benefit}</p>
                        {benefit.description && <p className="text-muted-foreground">{benefit.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Vehicle Details (Auto) */}
            {(selectedType === "auto" && parsedData?.vehicle) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {t("addPolicy.vehicleDetails")}
                </h3>
                <div className="space-y-2 text-xs">
                  {parsedData.vehicle.make && <div><span className="text-muted-foreground">{t("addPolicy.vehicleMake")}:</span> <span className="font-medium">{parsedData.vehicle.make}</span></div>}
                  {parsedData.vehicle.model && <div><span className="text-muted-foreground">{t("addPolicy.vehicleModel")}:</span> <span className="font-medium">{parsedData.vehicle.model}</span></div>}
                  {parsedData.vehicle.plate && <div><span className="text-muted-foreground">{t("addPolicy.vehiclePlate")}:</span> <span className="font-medium font-mono">{parsedData.vehicle.plate}</span></div>}
                  {parsedData.vehicle.vin && <div><span className="text-muted-foreground">VIN:</span> <span className="font-medium font-mono text-[9px]">{parsedData.vehicle.vin}</span></div>}
                </div>
              </Card>
            )}

            {/* Property Details (Home) */}
            {(selectedType === "home" && parsedData?.property) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Home className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  {t("addPolicy.propertyDetails")}
                </h3>
                <div className="space-y-2 text-xs">
                  {parsedData.property.address && <div><span className="text-muted-foreground">{t("addPolicy.propertyAddress")}:</span> <span className="font-medium">{parsedData.property.address}</span></div>}
                  {parsedData.property.squareMeters && <div><span className="text-muted-foreground">{t("addPolicy.propertySqm")}:</span> <span className="font-medium">{parsedData.property.squareMeters} m²</span></div>}
                  {parsedData.property.floors && <div><span className="text-muted-foreground">{t("addPolicy.floors")}:</span> <span className="font-medium">{parsedData.property.floors}</span></div>}
                  {parsedData.property.construction && <div><span className="text-muted-foreground">{t("addPolicy.construction")}:</span> <span className="font-medium">{parsedData.property.construction}</span></div>}
                </div>
              </Card>
            )}

            {/* Drivers (Auto) */}
            {(selectedType === "auto" && parsedData?.drivers && parsedData.drivers.length > 0) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  {t("addPolicy.drivers")} ({parsedData.drivers.length})
                </h3>
                <div className="space-y-2">
                  {parsedData.drivers.map((driver: any, idx: number) => (
                    <div key={idx} className="bg-muted/50 rounded-md p-2 text-xs">
                      <p className="font-medium text-foreground">{driver.fullName}</p>
                      <p className="text-muted-foreground">{t("addPolicy.licenseIssueDate")}: {driver.licenseIssueDate}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Beneficiaries (Life) */}
            {(selectedType === "life" && parsedData?.beneficiaries && parsedData.beneficiaries.length > 0) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  {t("addPolicy.beneficiaries")} ({parsedData.beneficiaries.length})
                </h3>
                <div className="space-y-2">
                  {parsedData.beneficiaries.map((beneficiary: any, idx: number) => (
                    <div key={idx} className="bg-muted/50 rounded-md p-2 text-xs">
                      <p className="font-medium text-foreground">{beneficiary.name}</p>
                      <p className="text-muted-foreground">{beneficiary.relationship} • {beneficiary.percentage}%</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Insurer Contact Information */}
            {parsedData?.insurer && (parsedData.insurer.name || parsedData.insurer.customerSupportPhone || parsedData.insurer.claimsDepartmentPhone) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  {t("addPolicy.insurerContacts")}
                </h3>
                <div className="space-y-2 text-xs">
                  {parsedData.insurer.name && (
                    <div><span className="text-muted-foreground">{t("addPolicy.insurerName")}:</span> <span className="font-medium">{parsedData.insurer.name}</span></div>
                  )}
                  {parsedData.insurer.address && (
                    <div><span className="text-muted-foreground">{t("addPolicy.address")}:</span> <span className="font-medium">{parsedData.insurer.address}{parsedData.insurer.city ? `, ${parsedData.insurer.city}` : ''}</span></div>
                  )}
                  {parsedData.insurer.customerSupportPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{t("addPolicy.customerSupport")}:</span> 
                      <span className="font-medium font-mono">{parsedData.insurer.customerSupportPhone}</span>
                    </div>
                  )}
                  {parsedData.insurer.claimsDepartmentPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{t("addPolicy.claimsDepartment")}:</span> 
                      <span className="font-medium font-mono">{parsedData.insurer.claimsDepartmentPhone}</span>
                    </div>
                  )}
                  {parsedData.insurer.emergencyHotline && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <Phone className="h-3 w-3" />
                      <span className="font-semibold">{t("addPolicy.emergencyHotline")}:</span> 
                      <span className="font-bold font-mono">{parsedData.insurer.emergencyHotline}</span>
                    </div>
                  )}
                  {parsedData.insurer.website && (
                    <div><span className="text-muted-foreground">{t("addPolicy.website")}:</span> <span className="font-medium text-primary">{parsedData.insurer.website}</span></div>
                  )}
                  {parsedData.insurer.customerSupportHours && (
                    <div><span className="text-muted-foreground">{t("addPolicy.supportHours")}:</span> <span className="font-medium">{parsedData.insurer.customerSupportHours}</span></div>
                  )}
                </div>
              </Card>
            )}

            {/* Perks & Benefits Section */}
            {parsedData?.perks && parsedData.perks.length > 0 && (
              <Card className="p-4 space-y-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Wand2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {t("addPolicy.perksTitle")}
                </h3>
                <p className="text-[10px] text-muted-foreground">{t("addPolicy.perksDesc")}</p>
                <div className="space-y-3">
                  {parsedData.perks.map((perk: any, idx: number) => (
                    <div key={idx} className="bg-white/60 dark:bg-black/20 rounded-md p-3 space-y-1.5">
                      <p className="font-semibold text-sm text-foreground">{perk.name}</p>
                      {perk.description && <p className="text-xs text-muted-foreground">{perk.description}</p>}
                      {perk.howToUse && (
                        <div className="text-xs bg-emerald-100/50 dark:bg-emerald-900/30 rounded p-2 mt-2">
                          <span className="font-medium text-emerald-700 dark:text-emerald-300">{t("addPolicy.howToUse")}:</span>
                          <p className="text-emerald-600 dark:text-emerald-400 mt-0.5">{perk.howToUse}</p>
                        </div>
                      )}
                      {perk.contactNumber && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{perk.contactNumber}</span>
                        </div>
                      )}
                      {perk.reminderNote && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-1">
                          {perk.reminderNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Claim Process Section */}
            {parsedData?.claimProcess && (parsedData.claimProcess.generalSteps?.length > 0 || parsedData.claimProcess.contactPhone) && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {t("addPolicy.claimProcessTitle")}
                </h3>
                <div className="space-y-3">
                  {parsedData.claimProcess.generalSteps && parsedData.claimProcess.generalSteps.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-foreground">{t("addPolicy.generalSteps")}:</p>
                      {parsedData.claimProcess.generalSteps.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{idx + 1}</span>
                          <p className="text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {parsedData.claimProcess.requiredDocuments && parsedData.claimProcess.requiredDocuments.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">{t("addPolicy.requiredDocuments")}:</p>
                      <div className="flex flex-wrap gap-1">
                        {parsedData.claimProcess.requiredDocuments.map((doc: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-[9px]">{doc}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {parsedData.claimProcess.deadlineDays && (
                      <div>
                        <span className="text-muted-foreground">{t("addPolicy.deadline")}:</span>
                        <span className="font-medium ml-1">{parsedData.claimProcess.deadlineDays} {t("addPolicy.days")}</span>
                      </div>
                    )}
                    {parsedData.claimProcess.contactPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono">{parsedData.claimProcess.contactPhone}</span>
                      </div>
                    )}
                  </div>
                  {parsedData.claimProcess.emergencyProcedure && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-2">
                      <p className="text-xs font-medium text-red-700 dark:text-red-300">{t("addPolicy.emergencyProcedure")}:</p>
                      <p className="text-xs text-red-600 dark:text-red-400">{parsedData.claimProcess.emergencyProcedure}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Possible Claims Section */}
            {parsedData?.possibleClaims && parsedData.possibleClaims.length > 0 && (
              <Card className="p-4 space-y-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  {t("addPolicy.possibleClaimsTitle")}
                </h3>
                <p className="text-[10px] text-muted-foreground">{t("addPolicy.possibleClaimsDesc")}</p>
                <div className="space-y-3">
                  {parsedData.possibleClaims.map((claim: any, idx: number) => (
                    <div key={idx} className="bg-white/60 dark:bg-black/20 rounded-md p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-foreground">{claim.title}</p>
                        {claim.estimatedCoverage && (
                          <Badge variant="outline" className="text-[9px] bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                            {claim.estimatedCoverage}
                          </Badge>
                        )}
                      </div>
                      {claim.description && <p className="text-xs text-muted-foreground">{claim.description}</p>}
                      {claim.steps && claim.steps.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <p className="text-[10px] font-medium text-foreground">{t("addPolicy.howToSubmit")}:</p>
                          {claim.steps.map((step: string, stepIdx: number) => (
                            <div key={stepIdx} className="flex items-start gap-1.5 text-[10px]">
                              <span className="text-amber-600 dark:text-amber-400 font-bold">{stepIdx + 1}.</span>
                              <span className="text-muted-foreground">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {claim.requiredDocuments && claim.requiredDocuments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-[10px] font-medium text-foreground">{t("addPolicy.documentsNeeded")}:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {claim.requiredDocuments.map((doc: string, docIdx: number) => (
                              <Badge key={docIdx} variant="secondary" className="text-[8px]">{doc}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {claim.tips && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 italic border-l-2 border-emerald-300 dark:border-emerald-700 pl-2 mt-2">
                          {claim.tips}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

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
                  } else if (step === "correct") {
                    setStep("input");
                  } else if (step === "review") {
                    if (addMethod === "manual") {
                      setStep("input");
                    } else if (validationErrors && Object.keys(validationErrors).length > 0) {
                      setStep("correct");
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
                  {step === "correct" && t("addPolicy.correctData")}
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
