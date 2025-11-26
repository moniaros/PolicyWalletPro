import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
}

export function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  showHandle = true,
}: BottomSheetModalProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
      currentYRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sheetRef.current) return;
      currentYRef.current = e.touches[0].clientY - startYRef.current;

      if (currentYRef.current > 0) {
        sheetRef.current.style.transform = `translateY(${currentYRef.current}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!sheetRef.current) return;

      // Close if dragged more than 100px down or more than 30% of sheet height
      const sheetHeight = sheetRef.current.offsetHeight;
      if (currentYRef.current > 100 || currentYRef.current > sheetHeight * 0.3) {
        onClose();
      } else {
        sheetRef.current.style.transform = "translateY(0)";
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        data-testid="bottom-sheet-backdrop"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-xl z-50 md:hidden transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto"
        style={{ transform: "translateY(0)" }}
        data-testid="bottom-sheet-modal"
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-12 rounded-full bg-muted" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-background">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-sheet"
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 pb-8">{children}</div>
      </div>
    </>
  );
}
