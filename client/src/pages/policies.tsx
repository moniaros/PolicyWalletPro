import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { policies } from "@/lib/mockData";
import PolicyCard from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UploadCloud, Filter, X, ChevronRight, Plus, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoliciesListSkeleton } from "@/components/skeleton-loader";
import { AddPolicyFlow } from "@/components/add-policy-flow";

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPolicies = policies.filter(p => {
    const matchesSearch = p.provider.toLowerCase().includes(search.toLowerCase()) || 
      p.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
      (activeFilter === "active" && p.status === "Active") ||
      (activeFilter === "expiring" && new Date(p.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesFilter;
  });

  const activePolicies = policies.filter(p => p.status === "Active").length;
  const expiringPolicies = policies.filter(p => 
    new Date(p.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const filterOptions = [
    { id: "all", label: t('common.all'), count: policies.length },
    { id: "active", label: t('common.active'), count: activePolicies },
    { id: "expiring", label: t('policies.expiringSoon'), count: expiringPolicies },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* iOS-Style Large Title Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-2 pb-3 space-y-3">
          {/* Title Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
                {t('policies.myPolicies')}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {policies.length} {t('policies.policiesCount')}
              </p>
            </div>
            
            {/* iOS-Style Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                size="icon" 
                className="h-11 w-11 rounded-full bg-primary shadow-lg shadow-primary/25"
                data-testid="button-add-policy"
                onClick={() => setShowAddPolicy(true)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* iOS-Style Search Bar */}
          <div className="relative">
            <div className={`flex items-center gap-2 bg-secondary/80 rounded-xl transition-all duration-200 ${
              isSearchFocused ? 'ring-2 ring-primary/50' : ''
            }`}>
              <Search className="h-4 w-4 text-muted-foreground ml-3 flex-shrink-0" />
              <Input 
                placeholder={t('policies.searchPolicies')} 
                className="border-0 shadow-none focus-visible:ring-0 h-11 bg-transparent text-base placeholder:text-muted-foreground/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                data-testid="input-search-policies"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2 mr-1 rounded-full hover:bg-muted/50 active:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    onClick={() => setSearch("")}
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* iOS-Style Segmented Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'bg-secondary/80 text-muted-foreground active:bg-secondary'
                }`}
                data-testid={`filter-${filter.id}`}
              >
                {filter.label}
                <Badge 
                  variant="secondary" 
                  className={`h-5 min-w-[20px] px-1.5 text-xs font-semibold ${
                    activeFilter === filter.id 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="px-4 py-4 pb-24">
        {isLoading ? (
          <PoliciesListSkeleton />
        ) : filteredPolicies.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t('policies.noPoliciesFound')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              {t('policies.tryDifferentSearch')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredPolicies.map((policy, i) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PolicyCard policy={policy} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Policy Flow */}
      <AddPolicyFlow
        isOpen={showAddPolicy}
        onClose={() => setShowAddPolicy(false)}
        onComplete={(policyData) => {
          console.log("Policy added:", policyData);
          // Here you would typically add the policy to your state/API
          setShowAddPolicy(false);
        }}
      />
    </div>
  );
}
