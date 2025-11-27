import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Globe,
  Clock,
  Smartphone,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  INSURANCE_QUESTIONNAIRE,
  TRUST_BUILDING_INSIGHTS,
} from "@/lib/insurance-analyst-data";
import { NotificationsPreferences } from "@/components/notifications-preferences";

export default function UserSettingsPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [settingsPIN, setSettingsPIN] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [insuranceProfileCompleted, setInsuranceProfileCompleted] = useState(
    !!localStorage.getItem("userProfile"),
  );
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionnaire, setQuestionnaire] = useState({
    ageGroup: "",
    familyStatus: "",
    dependents: "",
    incomeRange: "",
    healthStatus: "",
    emergencyFund: "",
    travelFrequency: "",
    occupationRisk: "",
    currentCoverages: [] as string[],
    lifeStageFactors: [] as string[],
    chronicConditions: [] as string[],
  });

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setQuestionnaire(parsed);
      setInsuranceProfileCompleted(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    // Personal
    fullName: localStorage.getItem("userProfile")
      ? JSON.parse(localStorage.getItem("userProfile") || "{}").fullName
      : "",
    email: "",
    phone: "",
    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // Security
    enable2FA: localStorage.getItem("auth_2fa_enabled") === "true",
    loginPIN: localStorage.getItem("auth_pin") || "",
    biometricAuth: localStorage.getItem("auth_biometric") === "true",
    // Preferences
    language: localStorage.getItem("language") || localStorage.getItem("app_language") || i18n.language || "el",
    theme: localStorage.getItem("policy-guard-theme") || "system",
    availabilityStart:
      localStorage.getItem("agent_availability_start") || "09:00",
    availabilityEnd: localStorage.getItem("agent_availability_end") || "17:00",
    timezone: localStorage.getItem("user_timezone") || "Europe/Athens",
    contactPreference: localStorage.getItem("contact_preference") || "email",
  });

  const handlePersonalUpdate = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    localStorage.setItem("user_email", formData.email);
    localStorage.setItem("user_phone", formData.phone);
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    profile.fullName = formData.fullName;
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast.success("Personal information updated");
  };

  const handlePasswordChange = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    // In production, this would hash and verify against backend
    localStorage.setItem("user_password_hint", "Password updated");
    toast.success("Password changed successfully");
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleToggle2FA = () => {
    const new2FAState = !formData.enable2FA;
    setFormData({ ...formData, enable2FA: new2FAState });
    localStorage.setItem("auth_2fa_enabled", new2FAState.toString());
    toast.success(new2FAState ? "2FA enabled" : "2FA disabled");
  };

  const handleSetPIN = () => {
    if (formData.loginPIN.length !== 4 || !/^\d+$/.test(formData.loginPIN)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    localStorage.setItem("auth_pin", formData.loginPIN);
    toast.success("PIN set successfully");
    setSettingsPIN(false);
  };

  const handleToggleBiometric = () => {
    const newState = !formData.biometricAuth;
    setFormData({ ...formData, biometricAuth: newState });
    localStorage.setItem("auth_biometric", newState.toString());
    toast.success(
      newState ? "Biometric login enabled" : "Biometric login disabled",
    );
  };

  const handlePreferencesUpdate = () => {
    localStorage.setItem("app_language", formData.language);
    localStorage.setItem("language", formData.language);
    localStorage.setItem("policyguard_language", formData.language);
    i18n.changeLanguage(formData.language);
    localStorage.setItem("policy-guard-theme", formData.theme);
    localStorage.setItem(
      "agent_availability_start",
      formData.availabilityStart,
    );
    localStorage.setItem("agent_availability_end", formData.availabilityEnd);
    localStorage.setItem("user_timezone", formData.timezone);
    localStorage.setItem("contact_preference", formData.contactPreference);
    toast.success("Preferences updated");
    if (formData.theme !== "system") {
      document.documentElement.classList.toggle(
        "dark",
        formData.theme === "dark",
      );
    }
  };

  const handleQuestionnaireNext = () => {
    const current = INSURANCE_QUESTIONNAIRE[currentQuestionIdx];
    if (!questionnaire[current.id as keyof typeof questionnaire]) {
      toast.error("Please select an answer");
      return;
    }
    if (currentQuestionIdx < INSURANCE_QUESTIONNAIRE.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handleQuestionnaireComplete = async () => {
    setLoading(true);
    try {
      const profile = { ...questionnaire };
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setInsuranceProfileCompleted(true);
      setShowQuestionnaire(false);
      setCurrentQuestionIdx(0);
      toast.success(
        "Insurance profile saved! We'll personalize your recommendations.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (field: string, value: any) => {
    setQuestionnaire({ ...questionnaire, [field]: value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      localStorage.setItem("userProfile", JSON.stringify(questionnaire));
      toast.success("Insurance profile updated successfully!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account, security, preferences, notifications, and insurance profile
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList
          className="grid w-full grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-5"
          data-testid="settings-tabs"
        >
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        {/* PERSONAL INFORMATION */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.personalDetails')}</CardTitle>
              <CardDescription>
                Update your basic profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  data-testid="input-settings-fullname"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    data-testid="input-settings-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+30 6XX XXX XXXX"
                    data-testid="input-settings-phone"
                  />
                </div>
              </div>
              <Button
                onClick={handlePersonalUpdate}
                className="w-full"
                data-testid="button-save-personal"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-4">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your login password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password *</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    data-testid="input-current-password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    data-testid="input-new-password"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  data-testid="input-confirm-password"
                />
              </div>
              <Button
                onClick={handlePasswordChange}
                className="w-full"
                data-testid="button-change-password"
              >
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Require authentication code on login
                  </p>
                </div>
                <Checkbox
                  checked={formData.enable2FA}
                  onCheckedChange={handleToggle2FA}
                  data-testid="checkbox-2fa"
                />
              </div>
              {formData.enable2FA && (
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700">
                    2FA is enabled. You'll receive a code via email when logging
                    in.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Login PIN */}
          <Card>
            <CardHeader>
              <CardTitle>Login PIN</CardTitle>
              <CardDescription>
                Set a 4-digit PIN for quick login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!settingsPIN ? (
                <Button
                  onClick={() => setSettingsPIN(true)}
                  variant="outline"
                  className="w-full"
                  data-testid="button-set-pin"
                >
                  {formData.loginPIN ? "Change PIN" : "Set PIN"}
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="loginPin">PIN (4 digits) *</Label>
                    <div className="relative">
                      <Input
                        id="loginPin"
                        type={showPIN ? "text" : "password"}
                        value={formData.loginPIN}
                        onChange={(e) =>
                          setFormData({ ...formData, loginPIN: e.target.value })
                        }
                        placeholder="0000"
                        maxLength={4}
                        data-testid="input-pin"
                      />
                      <button
                        onClick={() => setShowPIN(!showPIN)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPIN ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSetPIN}
                      className="flex-1"
                      data-testid="button-confirm-pin"
                    >
                      Save PIN
                    </Button>
                    <Button
                      onClick={() => setSettingsPIN(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Biometric Login */}
          <Card>
            <CardHeader>
              <CardTitle>Biometric Login</CardTitle>
              <CardDescription>
                Use fingerprint or face recognition to login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Biometric Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Use your fingerprint or face to login
                  </p>
                </div>
                <Checkbox
                  checked={formData.biometricAuth}
                  onCheckedChange={handleToggleBiometric}
                  data-testid="checkbox-biometric"
                />
              </div>
              {formData.biometricAuth && (
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700">
                    Biometric login is enabled. Use your device's fingerprint or
                    face recognition.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(val) =>
                    setFormData({ ...formData, language: val })
                  }
                >
                  <SelectTrigger data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="el">Ελληνικά (Greek)</SelectItem>
                    <SelectItem value="de">Deutsch (German)</SelectItem>
                    <SelectItem value="fr">Français (French)</SelectItem>
                    <SelectItem value="it">Italiano (Italian)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Theme</Label>
                <RadioGroup
                  value={formData.theme}
                  onValueChange={(val) =>
                    setFormData({ ...formData, theme: val })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="cursor-pointer">
                      Light Mode
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="cursor-pointer">
                      Dark Mode
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="cursor-pointer">
                      System Default
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handlePreferencesUpdate}
                className="w-full"
                data-testid="button-save-preferences"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Agent Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Agent Contact Availability
              </CardTitle>
              <CardDescription>
                When can agents contact you for quotes and support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availabilityStart">Available From</Label>
                  <Input
                    id="availabilityStart"
                    type="time"
                    value={formData.availabilityStart}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availabilityStart: e.target.value,
                      })
                    }
                    data-testid="input-availability-start"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availabilityEnd">Available Until</Label>
                  <Input
                    id="availabilityEnd"
                    type="time"
                    value={formData.availabilityEnd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availabilityEnd: e.target.value,
                      })
                    }
                    data-testid="input-availability-end"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(val) =>
                    setFormData({ ...formData, timezone: val })
                  }
                >
                  <SelectTrigger data-testid="select-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Athens">
                      Athens (EET/EEST)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      London (GMT/BST)
                    </SelectItem>
                    <SelectItem value="Europe/Paris">
                      Paris (CET/CEST)
                    </SelectItem>
                    <SelectItem value="Europe/Berlin">
                      Berlin (CET/CEST)
                    </SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Preferred Contact Method</Label>
                <RadioGroup
                  value={formData.contactPreference}
                  onValueChange={(val) =>
                    setFormData({ ...formData, contactPreference: val })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="contact-email" />
                    <Label htmlFor="contact-email" className="cursor-pointer">
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="contact-phone" />
                    <Label htmlFor="contact-phone" className="cursor-pointer">
                      Phone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="contact-sms" />
                    <Label htmlFor="contact-sms" className="cursor-pointer">
                      SMS
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handlePreferencesUpdate}
                className="w-full"
                data-testid="button-save-availability"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Availability
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsPreferences />
        </TabsContent>

        {/* INSURANCE PROFILE (Gap Analysis) */}
        <TabsContent value="insurance">
          <div className="space-y-6">
            {/* Prominent Button Section */}
            {!showQuestionnaire && (
              <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Insurance Gap Analysis
                  </CardTitle>
                  <CardDescription>
                    Identify coverage gaps and get personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-white border-emerald-200">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-gray-700">
                      <strong>Why take this analysis?</strong>{" "}
                      {TRUST_BUILDING_INSIGHTS[0]}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {TRUST_BUILDING_INSIGHTS.slice(1, 4).map((insight, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-lg border border-blue-100"
                      >
                        <p className="text-sm text-gray-700">✓ {insight}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setShowQuestionnaire(!showQuestionnaire)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold"
                    data-testid="button-start-questionnaire"
                  >
                    {insuranceProfileCompleted
                      ? "Update Insurance Profile"
                      : "Start Insurance Analysis"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Questionnaire Step-by-Step */}
            {showQuestionnaire && !insuranceProfileCompleted && (
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Gap Analysis Questionnaire</CardTitle>
                  <CardDescription>
                    Step-by-step analysis to identify your coverage needs
                  </CardDescription>
                  <div className="mt-4">
                    <Progress
                      value={
                        ((currentQuestionIdx + 1) /
                          INSURANCE_QUESTIONNAIRE.length) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Question {currentQuestionIdx + 1} of{" "}
                      {INSURANCE_QUESTIONNAIRE.length}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {INSURANCE_QUESTIONNAIRE[currentQuestionIdx].title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {INSURANCE_QUESTIONNAIRE[currentQuestionIdx].guidance}
                      </p>
                    </div>
                    <RadioGroup
                      value={
                        questionnaire[
                          INSURANCE_QUESTIONNAIRE[currentQuestionIdx]
                            .id as keyof typeof questionnaire
                        ] as string
                      }
                      onValueChange={(value) =>
                        setQuestionnaire({
                          ...questionnaire,
                          [INSURANCE_QUESTIONNAIRE[currentQuestionIdx].id]:
                            value,
                        })
                      }
                    >
                      <div className="space-y-2">
                        {INSURANCE_QUESTIONNAIRE[
                          currentQuestionIdx
                        ].options.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <RadioGroupItem value={option} id={`q-${option}`} />
                            <Label
                              htmlFor={`q-${option}`}
                              className="cursor-pointer flex-1"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {currentQuestionIdx > 0 && (
                      <Button
                        onClick={() =>
                          setCurrentQuestionIdx(currentQuestionIdx - 1)
                        }
                        variant="outline"
                        className="flex-1"
                        data-testid="button-questionnaire-prev"
                      >
                        Back
                      </Button>
                    )}
                    {currentQuestionIdx < INSURANCE_QUESTIONNAIRE.length - 1 ? (
                      <Button
                        onClick={handleQuestionnaireNext}
                        className="flex-1"
                        data-testid="button-questionnaire-next"
                      >
                        Next <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleQuestionnaireComplete}
                        disabled={loading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        data-testid="button-questionnaire-complete"
                      >
                        Complete <CheckCircle2 className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Editable Form with Pre-filled Data */}
            {insuranceProfileCompleted && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Your Insurance Profile
                    </CardTitle>
                    <CardDescription>
                      Edit and update your insurance information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-emerald-50 border-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-700">
                        Profile complete! We're analyzing your coverage needs to
                        provide personalized recommendations.
                      </AlertDescription>
                    </Alert>

                    {/* Editable Form Fields - Grid Layout */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Age Group *</Label>
                          <Select
                            value={questionnaire.ageGroup}
                            onValueChange={(val) =>
                              handleEditField("ageGroup", val)
                            }
                          >
                            <SelectTrigger data-testid="select-age-group">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["18-30", "31-45", "46-60", "60+"].map((age) => (
                                <SelectItem key={age} value={age}>
                                  {age}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('profile.familyStatus')} *</Label>
                          <Select
                            value={questionnaire.familyStatus}
                            onValueChange={(val) =>
                              handleEditField("familyStatus", val)
                            }
                          >
                            <SelectTrigger data-testid="select-family-status">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                {label: t("familyStatus.single"), val: "Single"},
                                {label: t("familyStatus.married"), val: "Married"},
                                {label: t("familyStatus.domesticPartner"), val: "Domestic Partner"},
                                {label: t("familyStatus.widowedDivorced"), val: "Widowed/Divorced"},
                              ].map(({label, val}) => (
                                <SelectItem key={val} value={val}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('profile.dependents')} *</Label>
                          <Select
                            value={questionnaire.dependents}
                            onValueChange={(val) =>
                              handleEditField("dependents", val)
                            }
                          >
                            <SelectTrigger data-testid="select-dependents">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["0", "1-2", "3+"].map((num) => (
                                <SelectItem key={num} value={num}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Income Range *</Label>
                          <Select
                            value={questionnaire.incomeRange}
                            onValueChange={(val) =>
                              handleEditField("incomeRange", val)
                            }
                          >
                            <SelectTrigger data-testid="select-income">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "<€30k",
                                "€30-60k",
                                "€60-100k",
                                "€100-150k",
                                ">€150k",
                              ].map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('profile.healthStatus')} *</Label>
                          <Select
                            value={questionnaire.healthStatus}
                            onValueChange={(val) =>
                              handleEditField("healthStatus", val)
                            }
                          >
                            <SelectTrigger data-testid="select-health">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Excellent",
                                "Good",
                                "Fair",
                                "Has chronic conditions",
                              ].map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('profile.emergencyFund')} *</Label>
                          <Select
                            value={questionnaire.emergencyFund}
                            onValueChange={(val) =>
                              handleEditField("emergencyFund", val)
                            }
                          >
                            <SelectTrigger data-testid="select-emergency-fund">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Yes, well covered",
                                "Partially covered",
                                "Minimal or none",
                              ].map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('profile.travelFrequency')} *</Label>
                          <Select
                            value={questionnaire.travelFrequency}
                            onValueChange={(val) =>
                              handleEditField("travelFrequency", val)
                            }
                          >
                            <SelectTrigger data-testid="select-travel">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Never",
                                "1-2 times/year",
                                "3-6 times/year",
                                "Monthly+",
                              ].map((freq) => (
                                <SelectItem key={freq} value={freq}>
                                  {freq}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('profile.occupationRisk')} *</Label>
                          <Select
                            value={questionnaire.occupationRisk}
                            onValueChange={(val) =>
                              handleEditField("occupationRisk", val)
                            }
                          >
                            <SelectTrigger data-testid="select-occupation-risk">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Low risk (office work)",
                                "Medium risk (mixed activities)",
                                "High risk (physical/travel intensive)",
                              ].map((risk) => (
                                <SelectItem key={risk} value={risk}>
                                  {risk}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          data-testid="button-save-profile"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setShowQuestionnaire(true)}
                          variant="outline"
                          className="flex-1"
                          data-testid="button-retake-questionnaire"
                        >
                          Retake Analysis
                        </Button>
                      </div>
                    </div>

                    <Alert className="bg-blue-50 border-blue-200">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700 text-sm">
                        Your profile is used to identify coverage gaps and
                        provide personalized insurance recommendations. Update
                        it whenever your situation changes.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
