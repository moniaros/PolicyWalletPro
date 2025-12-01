import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  TrendingUp, 
  Bell, 
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface OnboardingPageProps {
  onComplete: () => void;
  onSignIn: () => void;
}

interface OnboardingSlide {
  id: string;
  icon: typeof Shield;
  iconBg: string;
  iconColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "hub",
    icon: Shield,
    iconBg: "from-orange-500 to-orange-600",
    iconColor: "text-white"
  },
  {
    id: "organize",
    icon: FileText,
    iconBg: "from-amber-400 to-orange-500",
    iconColor: "text-white"
  },
  {
    id: "compare",
    icon: TrendingUp,
    iconBg: "from-teal-400 to-emerald-500",
    iconColor: "text-white"
  },
  {
    id: "alerts",
    icon: Bell,
    iconBg: "from-blue-400 to-indigo-500",
    iconColor: "text-white"
  },
  {
    id: "wellness",
    icon: Heart,
    iconBg: "from-rose-400 to-pink-500",
    iconColor: "text-white"
  }
];

export default function OnboardingPage({ onComplete, onSignIn }: OnboardingPageProps) {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 flex flex-col" data-testid="page-onboarding">
      {/* Navigation arrows for desktop */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Carousel */}
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => {
            const IconComponent = slide.icon;
            return (
              <div
                key={slide.id}
                className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-8 pt-16 pb-8"
                data-testid={`slide-${slide.id}`}
              >
                {/* Illustration area */}
                <div className="flex-1 flex items-center justify-center max-h-[45vh]">
                  <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -left-8 w-4 h-4 rounded-full bg-orange-400/30 animate-pulse" />
                    <div className="absolute -top-4 right-0 w-3 h-3 rounded-full bg-teal-400/40 animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute -bottom-6 -right-6 w-5 h-5 rounded-full bg-amber-400/30 animate-pulse" style={{ animationDelay: "1s" }} />
                    
                    {/* Main icon container */}
                    <div className={`h-40 w-40 md:h-48 md:w-48 rounded-3xl bg-gradient-to-br ${slide.iconBg} flex items-center justify-center shadow-2xl shadow-orange-500/20`}>
                      <IconComponent className={`h-20 w-20 md:h-24 md:w-24 ${slide.iconColor}`} strokeWidth={1.5} />
                    </div>
                    
                    {/* Secondary decorative icons */}
                    {index === 0 && (
                      <>
                        <div className="absolute -top-4 -right-8 h-12 w-12 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg rotate-12">
                          <FileText className="h-6 w-6 text-amber-900" />
                        </div>
                        <div className="absolute -bottom-4 -left-8 h-10 w-10 rounded-lg bg-teal-400 flex items-center justify-center shadow-lg -rotate-12">
                          <TrendingUp className="h-5 w-5 text-teal-900" />
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="absolute -top-6 right-4 h-10 w-10 rounded-lg bg-blue-400 flex items-center justify-center shadow-lg rotate-6">
                          <Shield className="h-5 w-5 text-blue-900" />
                        </div>
                        <div className="absolute -bottom-2 -left-6 h-8 w-8 rounded-md bg-emerald-400 flex items-center justify-center shadow-lg -rotate-6">
                          <Heart className="h-4 w-4 text-emerald-900" />
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <div className="absolute -bottom-4 right-0 h-12 w-12 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg rotate-12">
                        <span className="text-orange-900 font-bold text-lg">%</span>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="absolute -top-2 -left-6 h-10 w-10 rounded-lg bg-rose-400 flex items-center justify-center shadow-lg -rotate-12">
                        <span className="text-rose-900 font-bold text-sm">!</span>
                      </div>
                    )}
                    {index === 4 && (
                      <>
                        <div className="absolute -top-4 -right-4 h-8 w-8 rounded-md bg-teal-400 flex items-center justify-center shadow-lg rotate-12">
                          <TrendingUp className="h-4 w-4 text-teal-900" />
                        </div>
                        <div className="absolute -bottom-6 left-4 h-10 w-10 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg -rotate-6">
                          <Bell className="h-5 w-5 text-amber-900" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Text content */}
                <div className="text-center space-y-4 mt-8 max-w-sm mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight" data-testid={`text-slide-title-${slide.id}`}>
                    {t(`onboarding.slides.${slide.id}.title`)}
                  </h2>
                  <p className="text-base md:text-lg text-slate-300 leading-relaxed" data-testid={`text-slide-desc-${slide.id}`}>
                    {t(`onboarding.slides.${slide.id}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section with dots and buttons */}
      <div className="px-6 pb-8 pt-4 space-y-6">
        {/* Pagination dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-6 bg-orange-400"
                  : "w-2 bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`dot-${index}`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Button
            onClick={onComplete}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-orange-500/30"
            data-testid="button-get-started"
          >
            {t("onboarding.getStarted")}
          </Button>
          <Button
            onClick={onSignIn}
            variant="outline"
            className="w-full h-12 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold text-base rounded-xl"
            data-testid="button-sign-in"
          >
            {t("onboarding.signIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
