import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAUpdatePrompt() {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log("SW Registered:", swUrl);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const dismissUpdateBanner = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
          >
            <Card className="p-4 bg-primary text-primary-foreground shadow-lg">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{t("pwa.updateAvailable")}</p>
                  <p className="text-sm opacity-90 mt-1">{t("pwa.updateDescription")}</p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={dismissUpdateBanner}
                  className="flex-shrink-0 text-primary-foreground hover:bg-primary-foreground/20"
                  data-testid="button-dismiss-update"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleUpdate}
                  className="w-full"
                  data-testid="button-pwa-update"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("pwa.update")}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
          >
            <Card className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Download className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t("pwa.installTitle")}</p>
                  <p className="text-sm opacity-90 mt-1">{t("pwa.installDescription")}</p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={dismissInstallBanner}
                  className="flex-shrink-0 text-white hover:bg-white/20"
                  data-testid="button-dismiss-install"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleInstall}
                  className="flex-1 bg-white text-indigo-600 hover:bg-white/90"
                  data-testid="button-pwa-install"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("pwa.install")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={dismissInstallBanner}
                  className="text-white hover:bg-white/20"
                  data-testid="button-pwa-later"
                >
                  {t("pwa.later")}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
