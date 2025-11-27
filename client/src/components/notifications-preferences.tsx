import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const notificationPreferences = {
  email: {
    enabled: true,
    frequency: "daily",
    categories: [
      {
        id: "renewals",
        name: "Policy Renewals",
        description: "Reminders about upcoming policy renewals",
        enabled: true,
        icon: Clock
      },
      {
        id: "payments",
        name: "Payment Reminders",
        description: "Notifications for upcoming or missed payments",
        enabled: true,
        icon: AlertCircle
      },
      {
        id: "claims",
        name: "Claims Updates",
        description: "Status updates on your active claims",
        enabled: true,
        icon: CheckCircle2
      },
      {
        id: "coverage",
        name: "Coverage Changes",
        description: "Notifications when coverage details change",
        enabled: false,
        icon: Bell
      },
      {
        id: "recommendations",
        name: "Policy Recommendations",
        description: "AI-powered suggestions to improve your coverage",
        enabled: true,
        icon: Bell
      },
      {
        id: "appointments",
        name: "Appointment Reminders",
        description: "Reminders for scheduled appointments",
        enabled: true,
        icon: Clock
      },
      {
        id: "offers",
        name: "Special Offers",
        description: "Exclusive deals and promotions from our partners",
        enabled: false,
        icon: Bell
      },
      {
        id: "security",
        name: "Security Alerts",
        description: "Important security and account alerts (always on)",
        enabled: true,
        icon: AlertCircle,
        locked: true
      }
    ]
  },
  inApp: {
    enabled: true,
    categories: [
      {
        id: "renewals",
        name: "Policy Renewals",
        enabled: true
      },
      {
        id: "payments",
        name: "Payment Reminders",
        enabled: true
      },
      {
        id: "claims",
        name: "Claims Updates",
        enabled: true
      },
      {
        id: "recommendations",
        name: "Policy Recommendations",
        enabled: true
      }
    ]
  },
  sms: {
    enabled: false,
    categories: [
      {
        id: "critical",
        name: "Critical Alerts Only",
        description: "Only receive SMS for urgent matters (renewals due, payment failed)",
        enabled: false
      },
      {
        id: "claims",
        name: "Claims Status",
        description: "SMS updates on claims progress",
        enabled: false
      }
    ]
  },
  doNotDisturb: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00"
  }
};

export function NotificationsPreferences() {
  const [preferences, setPreferences] = useState(notificationPreferences);
  const [saved, setSaved] = useState(false);

  const handleEmailCategoryToggle = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        categories: prev.email.categories.map(cat =>
          cat.id === categoryId && !cat.locked ? { ...cat, enabled: !cat.enabled } : cat
        )
      }
    }));
    setSaved(false);
  };

  const handleInAppCategoryToggle = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        categories: prev.inApp.categories.map(cat =>
          cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
        )
      }
    }));
    setSaved(false);
  };

  const handleSMSCategoryToggle = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        categories: prev.sms.categories.map(cat =>
          cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
        )
      }
    }));
    setSaved(false);
  };

  const handleEmailToggle = () => {
    setPreferences(prev => ({
      ...prev,
      email: { ...prev.email, enabled: !prev.email.enabled }
    }));
    setSaved(false);
  };

  const handleInAppToggle = () => {
    setPreferences(prev => ({
      ...prev,
      inApp: { ...prev.inApp, enabled: !prev.inApp.enabled }
    }));
    setSaved(false);
  };

  const handleSMSToggle = () => {
    setPreferences(prev => ({
      ...prev,
      sms: { ...prev.sms, enabled: !prev.sms.enabled }
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("notificationPreferences", JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notification Preferences
        </h2>
        <p className="text-muted-foreground">
          Control how and when you receive updates about your policies and account
        </p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="email">{ t("notifications.email") }</TabsTrigger>
          <TabsTrigger value="in-app">In-App</TabsTrigger>
          <TabsTrigger value="sms">{ t("ui.sms") }</TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Receive notifications via email at {preferences.email.enabled ? "your registered email address" : "disabled"}
                  </CardDescription>
                </div>
                <Switch
                  checked={preferences.email.enabled}
                  onCheckedChange={handleEmailToggle}
                  data-testid="toggle-email-notifications"
                />
              </div>
            </CardHeader>
            {preferences.email.enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Email Frequency</Label>
                  <select className="w-full px-3 py-2 border rounded-lg bg-background">
                    <option value="instant">{ t("notifications.instant") }</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>

                <div className="space-y-3 border-t pt-4">
                  {preferences.email.categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          {category.locked && (
                            <Badge variant="secondary" className="text-xs">
                              Always On
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <Switch
                        checked={category.enabled}
                        onCheckedChange={() => handleEmailCategoryToggle(category.id)}
                        disabled={category.locked}
                        data-testid={`email-${category.id}-toggle`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* In-App Tab */}
        <TabsContent value="in-app" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    In-App Notifications
                  </CardTitle>
                  <CardDescription>
                    Receive notifications within the PolicyWallet app
                  </CardDescription>
                </div>
                <Switch
                  checked={preferences.inApp.enabled}
                  onCheckedChange={handleInAppToggle}
                  data-testid="toggle-inapp-notifications"
                />
              </div>
            </CardHeader>
            {preferences.inApp.enabled && (
              <CardContent className="space-y-3">
                {preferences.inApp.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <span className="font-medium">{category.name}</span>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={() => handleInAppCategoryToggle(category.id)}
                      data-testid={`inapp-${category.id}-toggle`}
                    />
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{ t('settings.smsNotifications') }</CardTitle>
                  <CardDescription>
                    Receive critical alerts via SMS (additional charges may apply)
                  </CardDescription>
                </div>
                <Switch
                  checked={preferences.sms.enabled}
                  onCheckedChange={handleSMSToggle}
                  data-testid="toggle-sms-notifications"
                />
              </div>
            </CardHeader>
            {preferences.sms.enabled && (
              <CardContent className="space-y-3">
                {preferences.sms.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Switch
                      checked={category.enabled}
                      onCheckedChange={() => handleSMSCategoryToggle(category.id)}
                      data-testid={`sms-${category.id}-toggle`}
                    />
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Do Not Disturb */}
      <Card>
        <CardHeader>
          <CardTitle>{ t('settings.doNotDisturb') }</CardTitle>
          <CardDescription>
            Pause notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div>
              <p className="font-medium">Enable Do Not Disturb</p>
              <p className="text-sm text-muted-foreground">
                {preferences.doNotDisturb.enabled
                  ? `From ${preferences.doNotDisturb.startTime} to ${preferences.doNotDisturb.endTime}`
                  : "Disabled"}
              </p>
            </div>
            <Switch
              checked={preferences.doNotDisturb.enabled}
              data-testid="toggle-dnd"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          size="lg"
          data-testid="save-notifications"
        >
          Save Preferences
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
