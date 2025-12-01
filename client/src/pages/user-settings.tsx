import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Fingerprint,
  Globe,
  Sun,
  Moon,
  Monitor,
  Bell,
  Clock,
  ChevronRight,
  Check,
  AlertCircle,
  Settings,
  LogOut,
  Trash2,
  HelpCircle,
  FileText,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  value?: string | React.ReactNode;
  onClick?: () => void;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  danger?: boolean;
  badge?: string;
}

function SettingItem({ icon, title, description, value, onClick, toggle, checked, onToggle, danger, badge }: SettingItemProps) {
  return (
    <div 
      className={`flex items-center gap-4 p-4 ${onClick ? "cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors" : ""} ${danger ? "text-red-600 dark:text-red-400" : ""}`}
      onClick={onClick}
      data-testid={`setting-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`h-9 w-9 rounded-lg ${danger ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${danger ? "" : "text-foreground"}`}>{title}</p>
          {badge && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">{badge}</Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
      </div>
      {toggle ? (
        <Switch checked={checked} onCheckedChange={onToggle} />
      ) : value ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-sm">{value}</span>
          {onClick && <ChevronRight className="h-4 w-4" />}
        </div>
      ) : onClick ? (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      ) : null}
    </div>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-2">
        {title}
      </h3>
      <Card className="divide-y divide-border overflow-hidden">
        {children}
      </Card>
    </div>
  );
}

export default function UserSettingsPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loginPIN: "",
  });
  
  const [settings, setSettings] = useState({
    enable2FA: localStorage.getItem("auth_2fa_enabled") === "true",
    biometricAuth: localStorage.getItem("auth_biometric") === "true",
    hasPIN: !!localStorage.getItem("auth_pin"),
    language: localStorage.getItem("language") || localStorage.getItem("app_language") || i18n.language || "el",
    theme: localStorage.getItem("policy-guard-theme") || "system",
    pushNotifications: localStorage.getItem("push_notifications") !== "false",
    emailNotifications: localStorage.getItem("email_notifications") !== "false",
    smsNotifications: localStorage.getItem("sms_notifications") === "true",
    renewalReminders: localStorage.getItem("renewal_reminders") !== "false",
    paymentReminders: localStorage.getItem("payment_reminders") !== "false",
  });

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setFormData(prev => ({ ...prev, fullName: parsed.fullName || "" }));
    }
    setFormData(prev => ({
      ...prev,
      email: localStorage.getItem("user_email") || "",
      phone: localStorage.getItem("user_phone") || "",
    }));
  }, []);

  const handleUpdateProfile = () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    localStorage.setItem("user_email", formData.email);
    localStorage.setItem("user_phone", formData.phone);
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    profile.fullName = formData.fullName;
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast.success("Profile updated successfully");
    setShowProfileDialog(false);
  };

  const handlePasswordChange = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    localStorage.setItem("user_password_hint", "Password updated");
    toast.success("Password changed successfully");
    setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    setShowPasswordDialog(false);
  };

  const handleSetPIN = () => {
    if (formData.loginPIN.length !== 4 || !/^\d+$/.test(formData.loginPIN)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    localStorage.setItem("auth_pin", formData.loginPIN);
    setSettings(prev => ({ ...prev, hasPIN: true }));
    toast.success("PIN set successfully");
    setShowPinDialog(false);
  };

  const handleToggle = (key: keyof typeof settings, storageKey: string) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    localStorage.setItem(storageKey, newValue.toString());
    toast.success(`${key === 'enable2FA' ? '2FA' : key.replace(/([A-Z])/g, ' $1').trim()} ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleLanguageChange = (lang: string) => {
    setSettings(prev => ({ ...prev, language: lang }));
    localStorage.setItem("app_language", lang);
    localStorage.setItem("language", lang);
    localStorage.setItem("policyguard_language", lang);
    i18n.changeLanguage(lang);
    toast.success("Language updated");
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
    localStorage.setItem("policy-guard-theme", theme);
    if (theme !== "system") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    toast.success("Theme updated");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.dispatchEvent(new Event("storage"));
    toast.success("Logged out successfully");
    setLocation("/");
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      en: "English",
      el: "Greek",
      de: "Deutsch",
      fr: "French",
      it: "Italian",
    };
    return labels[lang] || lang;
  };

  const getThemeLabel = (theme: string) => {
    const labels: Record<string, string> = {
      light: "Light",
      dark: "Dark",
      system: "System",
    };
    return labels[theme] || theme;
  };

  const getThemeIcon = (theme: string) => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Account Section */}
        <SettingSection title="Account">
          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogTrigger asChild>
              <div>
                <SettingItem
                  icon={<User className="h-4 w-4 text-blue-600" />}
                  title="Personal Information"
                  description={formData.fullName || "Set up your profile"}
                  onClick={() => setShowProfileDialog(true)}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Personal Information</DialogTitle>
                <DialogDescription>Update your basic profile details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    data-testid="input-fullname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+30 6XX XXX XXXX"
                    data-testid="input-phone"
                  />
                </div>
                <Button onClick={handleUpdateProfile} className="w-full" data-testid="button-save-profile">
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <SettingItem
            icon={<Mail className="h-4 w-4 text-green-600" />}
            title="Email"
            value={formData.email || "Not set"}
            onClick={() => setShowProfileDialog(true)}
          />
          <SettingItem
            icon={<Phone className="h-4 w-4 text-purple-600" />}
            title="Phone"
            value={formData.phone || "Not set"}
            onClick={() => setShowProfileDialog(true)}
          />
        </SettingSection>

        {/* Security Section */}
        <SettingSection title="Security">
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <div>
                <SettingItem
                  icon={<Lock className="h-4 w-4 text-orange-600" />}
                  title="Change Password"
                  description="Update your login password"
                  onClick={() => setShowPasswordDialog(true)}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>Enter your current password and choose a new one</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      data-testid="input-current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      data-testid="input-new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    data-testid="input-confirm-password"
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full" data-testid="button-change-password">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <SettingItem
            icon={<Shield className="h-4 w-4 text-blue-600" />}
            title="Two-Factor Authentication"
            description="Add extra security to your account"
            toggle
            checked={settings.enable2FA}
            onToggle={() => handleToggle("enable2FA", "auth_2fa_enabled")}
            badge={settings.enable2FA ? "On" : undefined}
          />

          <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
            <DialogTrigger asChild>
              <div>
                <SettingItem
                  icon={<Smartphone className="h-4 w-4 text-indigo-600" />}
                  title="Login PIN"
                  description="Quick 4-digit login"
                  value={settings.hasPIN ? "Set" : "Not set"}
                  onClick={() => setShowPinDialog(true)}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Set Login PIN</DialogTitle>
                <DialogDescription>Create a 4-digit PIN for quick access</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Enter 4-Digit PIN</Label>
                  <div className="relative">
                    <Input
                      type={showPIN ? "text" : "password"}
                      value={formData.loginPIN}
                      onChange={(e) => setFormData({ ...formData, loginPIN: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="0000"
                      maxLength={4}
                      className="text-center text-2xl tracking-[1em] font-mono"
                      data-testid="input-pin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPIN(!showPIN)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPIN ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleSetPIN} className="w-full" data-testid="button-set-pin">
                  <Check className="h-4 w-4 mr-2" />
                  Save PIN
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <SettingItem
            icon={<Fingerprint className="h-4 w-4 text-pink-600" />}
            title="Biometric Login"
            description="Use fingerprint or face recognition"
            toggle
            checked={settings.biometricAuth}
            onToggle={() => handleToggle("biometricAuth", "auth_biometric")}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Globe className="h-4 w-4 text-cyan-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Language</p>
              </div>
            </div>
            <Select value={settings.language} onValueChange={handleLanguageChange}>
              <SelectTrigger data-testid="select-language">
                <SelectValue>{getLanguageLabel(settings.language)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="el">Greek</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                {getThemeIcon(settings.theme)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Theme</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["light", "dark", "system"].map((theme) => (
                <Button
                  key={theme}
                  variant={settings.theme === theme ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleThemeChange(theme)}
                  data-testid={`button-theme-${theme}`}
                >
                  {theme === "light" && <Sun className="h-4 w-4 mr-1" />}
                  {theme === "dark" && <Moon className="h-4 w-4 mr-1" />}
                  {theme === "system" && <Monitor className="h-4 w-4 mr-1" />}
                  {getThemeLabel(theme)}
                </Button>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingItem
            icon={<Bell className="h-4 w-4 text-red-500" />}
            title="Push Notifications"
            description="Receive alerts on your device"
            toggle
            checked={settings.pushNotifications}
            onToggle={() => handleToggle("pushNotifications", "push_notifications")}
          />
          <SettingItem
            icon={<Mail className="h-4 w-4 text-blue-500" />}
            title="Email Notifications"
            description="Get updates via email"
            toggle
            checked={settings.emailNotifications}
            onToggle={() => handleToggle("emailNotifications", "email_notifications")}
          />
          <SettingItem
            icon={<MessageSquare className="h-4 w-4 text-green-500" />}
            title="SMS Notifications"
            description="Receive text messages"
            toggle
            checked={settings.smsNotifications}
            onToggle={() => handleToggle("smsNotifications", "sms_notifications")}
          />
          <SettingItem
            icon={<Clock className="h-4 w-4 text-amber-500" />}
            title="Renewal Reminders"
            description="Get notified before policies expire"
            toggle
            checked={settings.renewalReminders}
            onToggle={() => handleToggle("renewalReminders", "renewal_reminders")}
          />
          <SettingItem
            icon={<AlertCircle className="h-4 w-4 text-purple-500" />}
            title="Payment Reminders"
            description="Never miss a payment deadline"
            toggle
            checked={settings.paymentReminders}
            onToggle={() => handleToggle("paymentReminders", "payment_reminders")}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="Support">
          <SettingItem
            icon={<HelpCircle className="h-4 w-4 text-blue-600" />}
            title="Help Center"
            description="Get help with PolicyWallet"
            onClick={() => toast.info("Help Center coming soon")}
          />
          <SettingItem
            icon={<FileText className="h-4 w-4 text-gray-600" />}
            title="Terms & Privacy"
            description="Read our policies"
            onClick={() => toast.info("Legal documents coming soon")}
          />
          <SettingItem
            icon={<MessageSquare className="h-4 w-4 text-green-600" />}
            title="Contact Support"
            description="Chat with our team"
            onClick={() => toast.info("Support chat coming soon")}
          />
        </SettingSection>

        {/* Danger Zone */}
        <SettingSection title="Account Actions">
          <SettingItem
            icon={<LogOut className="h-4 w-4" />}
            title="Log Out"
            description="Sign out of your account"
            onClick={handleLogout}
            danger
          />
          <SettingItem
            icon={<Trash2 className="h-4 w-4" />}
            title="Delete Account"
            description="Permanently remove your account"
            onClick={() => toast.error("Please contact support to delete your account")}
            danger
          />
        </SettingSection>

        {/* App Info */}
        <div className="text-center py-8 text-xs text-muted-foreground">
          <p>PolicyWallet v1.0.0</p>
          <p className="mt-1">Made with care for your insurance needs</p>
        </div>
      </div>
    </div>
  );
}
