import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertCircle, Clock, CheckCircle2, X, Archive, ArchiveX, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const notificationsData = [
  {
    id: 1,
    type: "renewal",
    priority: "high",
    title: "Auto Insurance Renewal Due",
    message: "Your Generali auto insurance renews in 18 days. Review and renew now.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    icon: Clock,
    link: "/renewals"
  },
  {
    id: 2,
    type: "payment",
    priority: "high",
    title: "Payment Due",
    message: "€145 payment for NN Hellas health insurance due December 1st.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
    icon: AlertCircle,
    link: "/billing"
  },
  {
    id: 3,
    type: "recommendation",
    priority: "medium",
    title: "New Coverage Gap Identified",
    message: "AI analysis found you lack dental coverage. See recommendations.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    icon: Bell,
    link: "/recommendations"
  },
  {
    id: 4,
    type: "claim",
    priority: "medium",
    title: "Claim Status Updated",
    message: "Your medical claim CLM-NN-001 has been approved for €450.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    icon: CheckCircle2,
    link: "/claims"
  },
  {
    id: 5,
    type: "appointment",
    priority: "medium",
    title: "Appointment Reminder",
    message: "Your annual checkup with Dr. Makris is tomorrow at 10:00 AM.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    icon: Clock,
    link: "/appointments"
  },
  {
    id: 6,
    type: "security",
    priority: "high",
    title: "New Login Detected",
    message: "Your account was accessed from Chrome on MacOS. If not you, change password.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    icon: AlertCircle,
    link: "/settings"
  },
  {
    id: 7,
    type: "offer",
    priority: "low",
    title: "Special Offer",
    message: "Get 10% off when you bundle your home and auto policies.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: true,
    icon: Bell,
    link: "/billing"
  }
];

export default function NotificationsCenterPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "high") return n.priority === "high";
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const archiveNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "medium": return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return t('common.now');
    if (hours < 24) return `${hours}${t('common.hours')} ${t('common.ago')}`;
    if (days < 7) return `${days}${t('common.days')} ${t('common.ago')}`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            {t('notifications.notificationsCenter')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('notifications.stayUpdated')}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} size="sm">
            {t('notifications.markAllAsRead')}
          </Button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium uppercase">{t('notifications.highPriority')}</p>
                <p className="text-3xl font-bold text-red-900 mt-1">{highPriorityCount}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium uppercase">{t('notifications.unread')}</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">{unreadCount}</p>
              </div>
              <Bell className="h-12 w-12 text-amber-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium uppercase">{t('notifications.total')}</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{notifications.length}</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-emerald-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setFilter} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="all">{t('notifications.allNotifications')} ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            <Badge variant="destructive" className="mr-2">{unreadCount}</Badge>
            {t('notifications.unread')}
          </TabsTrigger>
          <TabsTrigger value="high" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {t('notifications.highPriority')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-all border-l-4 ${
                    !notification.read
                      ? "border-l-primary bg-primary/5"
                      : "border-l-muted"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="mt-1 flex-shrink-0">
                        {getPriorityIcon(notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base">
                                {t(notification.titleKey || 'notifications.title')}
                              </h3>
                              {!notification.read && (
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {t('notifications.highPriority')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t(notification.messageKey || 'notifications.stayUpdated')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={notification.link}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            data-testid={`button-view-notification-${notification.id}`}
                          >
                            View
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            data-testid={`button-read-notification-${notification.id}`}
                          >
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveNotification(notification.id)}
                          data-testid={`button-archive-notification-${notification.id}`}
                        >
                          <ArchiveX className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
