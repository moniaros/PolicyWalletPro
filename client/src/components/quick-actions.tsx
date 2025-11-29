import { useTranslation } from "react-i18next";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import { Link } from "wouter";
import { Plus, Clock, AlertCircle, Phone, Heart, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";

export function QuickActions() {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const actions = [
    {
      icon: Plus,
      labelKey: "quickActions.addPolicy",
      href: "/policies",
      color: "bg-blue-100 text-blue-700",
      accentColor: "from-blue-200 to-blue-100",
      testId: "quick-add-policy"
    },
    {
      icon: Clock,
      labelKey: "quickActions.renewPolicy",
      href: "/renewals",
      color: "bg-amber-100 text-amber-700",
      accentColor: "from-amber-200 to-amber-100",
      testId: "quick-renew-policy"
    },
    {
      icon: ShieldAlert,
      labelKey: "quickActions.fileClaim",
      href: "/claims",
      color: "bg-red-100 text-red-700",
      accentColor: "from-red-200 to-red-100",
      testId: "quick-file-claim"
    },
    {
      icon: Heart,
      labelKey: "quickActions.bookAppointment",
      href: "/appointments",
      color: "bg-emerald-100 text-emerald-700",
      accentColor: "from-emerald-200 to-emerald-100",
      testId: "quick-book-appointment"
    },
    {
      icon: AlertCircle,
      labelKey: "quickActions.viewRecommendations",
      href: "/recommendations",
      color: "bg-purple-100 text-purple-700",
      accentColor: "from-purple-200 to-purple-100",
      testId: "quick-recommendations"
    },
    {
      icon: Phone,
      labelKey: "quickActions.contactAgent",
      href: "/agents",
      color: "bg-indigo-100 text-indigo-700",
      accentColor: "from-indigo-200 to-indigo-100",
      testId: "quick-contact-agent"
    },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    const index = emblaApi.slidesInView()[0] || 0;
    setActiveIndex(index);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleActionTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
  };

  const handleActionTouchEnd = (e: React.TouchEvent) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {}, 300);
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h2 className="text-lg font-bold" id="quick-actions-heading">
          {t('quickActions.quickActions')}
        </h2>
        <div className="flex gap-2 md:hidden">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label={t('common.back') || 'Scroll previous'}
            className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="carousel-prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={t('common.next') || 'Scroll next'}
            className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="carousel-next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-background via-background to-background/50"
        role="region"
        aria-labelledby="quick-actions-heading"
        aria-live="polite"
      >
        <div 
          ref={emblaRef}
          className="overflow-hidden"
        >
          <div className="flex gap-3 md:gap-4 px-4 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-6">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.testId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex-shrink-0 w-28 md:w-auto md:flex-shrink"
                >
                  <Link href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTouchStart={handleActionTouchStart}
                      onTouchEnd={handleActionTouchEnd}
                      className="h-full"
                    >
                      <motion.button
                        className={`w-full h-24 md:h-28 flex flex-col items-center justify-center gap-2 rounded-2xl font-medium text-sm transition-all relative overflow-hidden group ${action.color}`}
                        data-testid={action.testId}
                        aria-label={t(action.labelKey)}
                        whileHover={{ 
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
                        }}
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                        
                        {/* Animated background on press */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${action.accentColor} opacity-0`}
                          initial={{ opacity: 0 }}
                          whileTap={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Content */}
                        <motion.div 
                          className="relative z-10 flex flex-col items-center justify-center gap-2 pointer-events-none"
                          initial={{ scale: 1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.div
                            whileTap={{ rotate: 10 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                          </motion.div>
                          <span className="text-xs md:text-sm font-semibold text-center leading-tight px-1">
                            {t(action.labelKey)}
                          </span>
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carousel Indicators - Mobile Only */}
      <div className="flex gap-1.5 justify-center md:hidden" role="tablist" aria-label="Carousel progress">
        {actions.map((_, index) => (
          <motion.button
            key={`indicator-${index}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index 
                ? "bg-primary w-6" 
                : "bg-primary/30 w-1.5"
            }`}
            role="tab"
            aria-label={`Go to action ${index + 1}`}
            aria-selected={activeIndex === index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Accessibility hint */}
      <div className="text-xs text-muted-foreground text-center md:hidden">
        {t('common.swipeToScroll') || 'Swipe to explore more'}
      </div>
    </div>
  );
}
