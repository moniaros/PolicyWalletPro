import { useEffect, useState } from "react";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/card";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
      // Trigger data sync when connection restored
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync?.register("sync-data");
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-amber-50 border-b border-amber-200 p-3 z-50 flex items-center gap-2">
        <WifiOff className="h-4 w-4 text-amber-600 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-amber-900">You're offline</p>
          <p className="text-xs text-amber-700">{t('ui.dataSyncWhenReconnect')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-emerald-50 border-b border-emerald-200 p-3 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <Wifi className="h-4 w-4 text-emerald-600 flex-shrink-0" />
      <p className="text-sm font-medium text-emerald-900">{t('ui.connectionRestored')}</p>
    </div>
  );
}
