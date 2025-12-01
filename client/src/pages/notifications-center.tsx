import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Calendar,
  CreditCard,
  Shield,
  Gift,
  ChevronRight,
  Check,
  Trash2,
  BellOff,
  Filter,
  Settings
} from "lucide-react";
import { Link } from "wouter";

interface Notification {
  id: number;
  type: "renewal" | "payment" | "claim" | "recommendation" | "appointment" | "security" | "offer";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link: string;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    type: "renewal",
    priority: "high",
    title: "Auto Insurance Renewal Due",
    message: "Your Generali auto insurance renews in 18 days. Review and renew now to avoid coverage gaps.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    link: "/renewals"
  },
  {
    id: 2,
    type: "payment",
    priority: "high",
    title: "Payment Due Tomorrow",
    message: "€145 payment for NN Hellas health insurance due December 1st.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
    link: "/billing"
  },
  {
    id: 3,
    type: "recommendation",
    priority: "medium",
    title: "Coverage Gap Identified",
    message: "Our analysis found you lack dental coverage. See personalized recommendations.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    link: "/recommendations"
  },
  {
    id: 4,
    type: "claim",
    priority: "medium",
    title: "Claim Approved",
    message: "Your medical claim CLM-NN-001 has been approved. €450 will be deposited within 3 business days.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/claims"
  },
  {
    id: 5,
    type: "appointment",
    priority: "medium",
    title: "Appointment Tomorrow",
    message: "Annual checkup with Dr. Makris at Hygeia Hospital, 10:00 AM.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/appointments"
  },
  {
    id: 6,
    type: "security",
    priority: "high",
    title: "New Device Login",
    message: "Your account was accessed from a new device. If this wasn't you, secure your account now.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/settings"
  },
  {
    id: 7,
    type: "offer",
    priority: "low",
    title: "Bundle & Save 10%",
    message: "Combine your home and auto policies to save up to 10% on premiums.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/recommendations"
  }
];

const getTypeConfig = (type: Notification["type"]) => {
  const configs = {
    renewal: { 
      icon: Clock, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-100 dark:bg-amber-900/30",
      label: "Renewal"
    },
    payment: { 
      icon: CreditCard, 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-100 dark:bg-red-900/30",
      label: "Payment"
    },
    claim: { 
      icon: CheckCircle2, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      label: "Claim"
    },
    recommendation: { 
      icon: Shield, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-100 dark:bg-blue-900/30",
      label: "Insight"
    },
    appointment: { 
      icon: Calendar, 
      color: "text-purple-600 dark:text-purple-400", 
      bg: "bg-purple-100 dark:bg-purple-900/30",
      label: "Appointment"
    },
    security: { 
      icon: AlertCircle, 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-100 dark:bg-red-900/30",
      label: "Security"
    },
    offer: { 
      icon: Gift, 
      color: "text-indigo-600 dark:text-indigo-400", 
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      label: "Offer"
    }
  };
  return configs[type];
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const groups: { label: string; notifications: Notification[] }[] = [
    { label: "Today", notifications: [] },
    { label: "Yesterday", notifications: [] },
    { label: "Earlier", notifications: [] }
  ];
  
  notifications.forEach(n => {
    const nDate = new Date(n.timestamp);
    nDate.setHours(0, 0, 0, 0);
    
    if (nDate.getTime() === today.getTime()) {
      groups[0].notifications.push(n);
    } else if (nDate.getTime() === yesterday.getTime()) {
      groups[1].notifications.push(n);
    } else {
      groups[2].notifications.push(n);
    }
  });
  
  return groups.filter(g => g.notifications.length > 0);
};

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showHighPriorityOnly, setShowHighPriorityOnly] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityUnread = notifications.filter(n => n.priority === "high" && !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread" && n.read) return false;
    if (showHighPriorityOnly && n.priority !== "high") return false;
    return true;
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Notifications</h1>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                  data-testid="button-mark-all-read"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Link href="/settings">
                <Button variant="ghost" size="icon" data-testid="button-notification-settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        {unreadCount > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border border-border/50 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{highPriorityUnread}</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">Urgent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border border-border/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{unreadCount}</p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Unread</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              data-testid="filter-all"
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
              data-testid="filter-unread"
            >
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="high-priority" className="text-xs text-muted-foreground">
              Urgent only
            </label>
            <Switch
              id="high-priority"
              checked={showHighPriorityOnly}
              onCheckedChange={setShowHighPriorityOnly}
              data-testid="switch-high-priority"
            />
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <BellOff className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === "unread" 
                ? "You're all caught up! Check back later." 
                : "When you receive notifications, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <div key={group.label}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                  {group.label}
                </h2>
                <div className="space-y-2">
                  {group.notifications.map((notification) => {
                    const config = getTypeConfig(notification.type);
                    const Icon = config.icon;
                    
                    return (
                      <Card
                        key={notification.id}
                        className={`p-4 border transition-all ${
                          !notification.read 
                            ? "bg-primary/5 border-primary/20 dark:bg-primary/10" 
                            : "border-border/50 hover:bg-muted/30"
                        }`}
                        data-testid={`notification-${notification.id}`}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`h-10 w-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className={`font-semibold text-sm ${!notification.read ? "text-foreground" : "text-foreground/80"}`}>
                                    {notification.title}
                                  </h3>
                                  {notification.priority === "high" && !notification.read && (
                                    <Badge variant="destructive" className="text-xs px-1.5 py-0">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs px-2 py-0 font-normal">
                                    {config.label}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3">
                              <Link href={notification.link}>
                                <Button 
                                  size="sm" 
                                  className="h-8 text-xs"
                                  data-testid={`button-view-${notification.id}`}
                                >
                                  View Details
                                  <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </Link>
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                  data-testid={`button-read-${notification.id}`}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => deleteNotification(notification.id)}
                                data-testid={`button-delete-${notification.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear All */}
        {notifications.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={clearAll}
              data-testid="button-clear-all"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
