import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Check, Building2, Shield, ArrowLeft, Upload, FileText, Search as SearchIcon, PenTool, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Comprehensive list of Greek/European insurers
const GREEK_INSURERS = [
  { id: "ethniki", name: "Ethniki Asfalistiki", code: "ETH", country: "GR", popular: true },
  { id: "generali", name: "Generali Hellas", code: "GEN", country: "GR", popular: true },
  { id: "ergo", name: "ERGO Hellas", code: "ERG", country: "GR", popular: true },
  { id: "nn", name: "NN Hellas", code: "NN", country: "GR", popular: true },
  { id: "allianz", name: "Allianz Hellas", code: "ALL", country: "GR", popular: true },
  { id: "interamerican", name: "Interamerican", code: "INT", country: "GR", popular: true },
  { id: "euroins", name: "Euroins", code: "EUR", country: "GR", popular: false },
  { id: "alpha", name: "Alpha Insurance", code: "ALP", country: "GR", popular: false },
  { id: "cosmos", name: "Cosmos Insurance", code: "COS", country: "GR", popular: false },
  { id: "elpidos", name: "Elpidos Insurance", code: "ELP", country: "GR", popular: false },
  { id: "hellenic", name: "Hellenic General Insurance", code: "HGI", country: "GR", popular: false },
  { id: "metlife", name: "MetLife Hellas", code: "MET", country: "GR", popular: false },
  { id: "prudential", name: "Prudential Hellas", code: "PRU", country: "GR", popular: false },
  { id: "zurich", name: "Zurich Insurance Hellas", code: "ZUR", country: "GR", popular: true },
  { id: "axa", name: "AXA Hellas", code: "AXA", country: "GR", popular: true },
  { id: "chartis", name: "Chartis Hellas", code: "CHA", country: "GR", popular: false },
  { id: "qbe", name: "QBE Hellas", code: "QBE", country: "GR", popular: false },
  { id: "hdi", name: "HDI Global Hellas", code: "HDI", country: "GR", popular: false },
  { id: "mapfre", name: "Mapfre Hellas", code: "MAP", country: "GR", popular: false },
  { id: "unipol", name: "Unipol Hellas", code: "UNI", country: "GR", popular: false },
];

// ACORD Line of Business (LoB) codes
const LOB_TYPES = [
  { id: "HLT", label: "Health Insurance", code: "HLT", icon: "❤️", description: "Medical and health coverage" },
  { id: "AUT", label: "Auto Insurance", code: "AUT", icon: "🚗", description: "Vehicle and motor coverage" },
  { id: "PRP", label: "Property & Liability", code: "PRP", icon: "🏠", description: "Home and property coverage" },
  { id: "LIF", label: "Life Insurance", code: "LIF", icon: "💰", description: "Life and investment coverage" },
  { id: "PET", label: "Pet Insurance", code: "PET", icon: "🐾", description: "Pet health coverage" },
  { id: "TRV", label: "Travel Insurance", code: "TRV", icon: "✈️", description: "Travel and trip coverage" },
];

const COUNTRIES = [
  { id: "GR", name: "Greece", flag: "🇬🇷", default: true },
  { id: "DE", name: "Germany", flag: "🇩🇪", default: false },
  { id: "FR", name: "France", flag: "🇫🇷", default: false },
  { id: "IT", name: "Italy", flag: "🇮🇹", default: false },
  { id: "ES", name: "Spain", flag: "🇪🇸", default: false },
];

interface AddPolicyFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (policyData: any) => void;
}

export function AddPolicyFlow({ isOpen, onClose, onComplete }: AddPolicyFlowProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("GR");
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null);
  const [selectedPolicyType, setSelectedPolicyType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState({
    policyNumber: "",
    effectiveDate: "",
    expiryDate: "",
    premium: "",
  });
  const [step3Method, setStep3Method] = useState<"search" | "upload" | "manual" | null>(null);

  const filteredInsurers = GREEK_INSURERS.filter((insurer) =>
    insurer.country === selectedCountry &&
    (insurer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     insurer.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const popularInsurers = filteredInsurers.filter((i) => i.popular);
  const otherInsurers = filteredInsurers.filter((i) => !i.popular);

  const handleNext = () => {
    if (step === 1 && selectedInsurer) {
      setStep(2);
    } else if (step === 2 && selectedPolicyType) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3 && step3Method) {
      setStep3Method(null);
    } else if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handleComplete = () => {
    if (!selectedInsurer || !selectedPolicyType) {
      toast.error(t('policies.fillAllFields'));
      return;
    }

    if (step3Method === "search" && !policyId) {
      toast.error(t('policies.enterPolicyId'));
      return;
    }

    if (step3Method === "upload" && !uploadedFile) {
      toast.error(t('policies.uploadDocument'));
      return;
    }

    if (step3Method === "manual" && !manualData.policyNumber) {
      toast.error(t('policies.fillManualData'));
      return;
    }

    const insurer = GREEK_INSURERS.find((i) => i.id === selectedInsurer);
    const policyType = LOB_TYPES.find((p) => p.id === selectedPolicyType);

    onComplete({
      country: selectedCountry,
      insurer: insurer?.name,
      insurerCode: insurer?.code,
      policyType: policyType?.label,
      lobCode: policyType?.code,
      method: step3Method,
      policyId: step3Method === "search" ? policyId : undefined,
      uploadedFile: step3Method === "upload" ? uploadedFile : undefined,
      manualData: step3Method === "manual" ? manualData : undefined,
    });

    toast.success(t('policies.policyAdded'));
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCountry("GR");
    setSelectedInsurer(null);
    setSelectedPolicyType(null);
    setSearchQuery("");
    setPolicyId("");
    setUploadedFile(null);
    setManualData({
      policyNumber: "",
      effectiveDate: "",
      expiryDate: "",
      premium: "",
    });
    setStep3Method(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('documents.fileTooLarge'));
        return;
      }
      setUploadedFile(file);
      toast.success(t('documents.fileSelected', { name: file.name }));
    }
  };

  const progress = (step / 3) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('policies.addNewPolicy')}
          </DialogTitle>
          <DialogDescription>
            {t('policies.addPolicyDescription')}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{t('policies.step', { current: step, total: 3 })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Insurer */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('policies.selectInsurer')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('policies.selectInsurerDescription')}
                </p>
              </div>

              {/* Country Selection */}
              <div>
                <Label className="mb-2 block">{t('policies.selectCountry')}</Label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {COUNTRIES.map((country) => (
                    <Button
                      key={country.id}
                      variant={selectedCountry === country.id ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCountry(country.id);
                        setSelectedInsurer(null);
                        setSearchQuery("");
                      }}
                      className="rounded-xl whitespace-nowrap"
                    >
                      <span className="mr-2">{country.flag}</span>
                      {country.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('policies.searchInsurers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>

              {/* Popular Insurers */}
              {!searchQuery && popularInsurers.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('policies.popularInsurers')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {popularInsurers.map((insurer) => (
                      <Card
                        key={insurer.id}
                        className={`cursor-pointer transition-all ${
                          selectedInsurer === insurer.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedInsurer(insurer.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{insurer.name}</p>
                              <p className="text-xs text-muted-foreground">{insurer.code}</p>
                            </div>
                            {selectedInsurer === insurer.id && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Insurers */}
              <div className="space-y-3">
                {searchQuery && (
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('policies.searchResults')} ({filteredInsurers.length})
                  </p>
                )}
                {!searchQuery && (
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('policies.allInsurers')}
                  </p>
                )}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {(searchQuery ? filteredInsurers : otherInsurers).map((insurer) => (
                    <Card
                      key={insurer.id}
                      className={`cursor-pointer transition-all ${
                        selectedInsurer === insurer.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedInsurer(insurer.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{insurer.name}</p>
                              <p className="text-xs text-muted-foreground">{insurer.code}</p>
                            </div>
                          </div>
                          {selectedInsurer === insurer.id && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Insurance Type (LoB) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('policies.selectPolicyType')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('policies.selectPolicyTypeDescription')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {LOB_TYPES.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all ${
                      selectedPolicyType === type.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPolicyType(type.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <p className="font-semibold text-sm mb-1">{type.label}</p>
                      <p className="text-xs text-muted-foreground mb-2">{type.code}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                      {selectedPolicyType === type.id && (
                        <div className="mt-2 flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Three Options */}
          {step === 3 && !step3Method && (
            <motion.div
              key="step3-options"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('policies.howToAddPolicy')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('policies.chooseMethod')}
                </p>
              </div>

              <div className="space-y-3">
                {/* Option A: Find by PolicyID */}
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setStep3Method("search")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <SearchIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">{t('policies.findByPolicyId')}</p>
                        <p className="text-sm text-muted-foreground">{t('policies.findByPolicyIdDescription')}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* Option B: Upload Documents */}
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setStep3Method("upload")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                        <Upload className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">{t('policies.uploadDocuments')}</p>
                        <p className="text-sm text-muted-foreground">{t('policies.uploadDocumentsDescription')}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* Option C: Manual Entry */}
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => setStep3Method("manual")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                        <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">{t('policies.manualEntry')}</p>
                        <p className="text-sm text-muted-foreground">{t('policies.manualEntryDescription')}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step 3A: Find by PolicyID */}
          {step === 3 && step3Method === "search" && (
            <motion.div
              key="step3-search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep3Method(null)}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-semibold text-lg">{t('policies.findByPolicyId')}</h3>
                  <p className="text-sm text-muted-foreground">{t('policies.enterPolicyIdToSearch')}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="policyId">{t('policies.policyId')}</Label>
                <Input
                  id="policyId"
                  placeholder={t('policies.policyIdPlaceholder')}
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  className="h-11 rounded-xl mt-1"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t('policies.policyIdHelp')}
                </p>
              </div>

              <Button
                onClick={handleComplete}
                disabled={!policyId}
                className="w-full h-11 rounded-xl"
              >
                {t('policies.searchAndAdd')}
              </Button>
            </motion.div>
          )}

          {/* Step 3B: Upload Documents */}
          {step === 3 && step3Method === "upload" && (
            <motion.div
              key="step3-upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep3Method(null)}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-semibold text-lg">{t('policies.uploadDocuments')}</h3>
                  <p className="text-sm text-muted-foreground">{t('policies.uploadPolicyDocuments')}</p>
                </div>
              </div>

              <div
                onClick={() => document.getElementById("policy-file-upload")?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <input
                  id="policy-file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {uploadedFile ? (
                  <div>
                    <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="font-semibold text-base mb-1">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t('common.remove')}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-semibold text-base mb-1">{t('policies.clickToUpload')}</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleComplete}
                disabled={!uploadedFile}
                className="w-full h-11 rounded-xl"
              >
                {t('policies.uploadAndAdd')}
              </Button>
            </motion.div>
          )}

          {/* Step 3C: Manual Entry */}
          {step === 3 && step3Method === "manual" && (
            <motion.div
              key="step3-manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep3Method(null)}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-semibold text-lg">{t('policies.manualEntry')}</h3>
                  <p className="text-sm text-muted-foreground">{t('policies.enterPolicyDetailsManually')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="policyNumber">{t('policies.policyNumber')} *</Label>
                  <Input
                    id="policyNumber"
                    placeholder={t('policies.policyNumberPlaceholder')}
                    value={manualData.policyNumber}
                    onChange={(e) => setManualData({ ...manualData, policyNumber: e.target.value })}
                    className="h-11 rounded-xl mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="effectiveDate">{t('policies.effectiveDate')}</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={manualData.effectiveDate}
                      onChange={(e) => setManualData({ ...manualData, effectiveDate: e.target.value })}
                      className="h-11 rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">{t('policies.expiryDate')}</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={manualData.expiryDate}
                      onChange={(e) => setManualData({ ...manualData, expiryDate: e.target.value })}
                      className="h-11 rounded-xl mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="premium">{t('policies.premium')}</Label>
                  <Input
                    id="premium"
                    placeholder="€0.00"
                    value={manualData.premium}
                    onChange={(e) => setManualData({ ...manualData, premium: e.target.value })}
                    className="h-11 rounded-xl mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={!manualData.policyNumber}
                className="w-full h-11 rounded-xl"
              >
                {t('policies.addPolicy')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handleBack}
            className="rounded-xl"
          >
            {step === 1 ? (
              t('common.cancel')
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </>
            )}
          </Button>
          {step < 3 && (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedInsurer) ||
                (step === 2 && !selectedPolicyType)
              }
              className="rounded-xl"
            >
              {t('common.next')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
