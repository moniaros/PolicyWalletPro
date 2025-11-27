// Push notification utilities
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
    });
    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return null;
  }
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if ("Notification" in window && Notification.permission === "granted") {
    return new Notification(title, {
      icon: "/favicon.png",
      badge: "/favicon.png",
      ...options,
    });
  }
}

// Schedule appointment reminders
export function scheduleAppointmentReminder(appointmentDate: string, appointmentTitle: string) {
  const appointment = new Date(appointmentDate);
  const now = new Date();
  const oneHourBefore = new Date(appointment.getTime() - 60 * 60 * 1000);

  if (oneHourBefore > now) {
    const timeUntilReminder = oneHourBefore.getTime() - now.getTime();
    setTimeout(() => {
      sendLocalNotification(`Reminder: ${appointmentTitle}`, {
        body: `Your appointment is in 1 hour`,
        tag: `appointment-${appointmentDate}`,
        requireInteraction: true,
      });
    }, timeUntilReminder);
  }
}

// Schedule policy renewal reminders
export function schedulePolicyRenewalReminder(expiryDate: string, policyName: string) {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const twoWeeksBefore = new Date(expiry.getTime() - 14 * 24 * 60 * 60 * 1000);

  if (twoWeeksBefore > now) {
    const timeUntilReminder = twoWeeksBefore.getTime() - now.getTime();
    setTimeout(() => {
      sendLocalNotification(`Policy Renewal Reminder`, {
        body: `${policyName} expires in 2 weeks`,
        tag: `renewal-${expiryDate}`,
        requireInteraction: true,
      });
    }, timeUntilReminder);
  }
}
