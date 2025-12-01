import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { policies } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Search, X, ChevronRight, Plus } from "lucide-react";

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
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
    { id: "all", label: t("policies.allPolicies"), shortLabel: t("common.all"), count: policies.length },
    { id: "active", label: t("common.active"), shortLabel: t("common.active"), count: activePolicies },
    { id: "expiring", label: t("policies.expiringSoon"), shortLabel: t("policies.expiring"), count: expiringPolicies },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Your Policies</h1>
              <p className="text-sm text-muted-foreground mt-1">{policies.length} total policies</p>
            </div>
            <Button 
              size="icon" 
              className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              data-testid="button-add-policy"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className={`flex items-center gap-2 bg-secondary/80 rounded-xl transition-all ${
              isSearchFocused ? 'ring-2 ring-primary/50' : ''
            }`}>
              <Search className="h-4 w-4 text-muted-foreground ml-3 flex-shrink-0" />
              <Input 
                placeholder="Search policies..." 
                className="border-0 shadow-none focus-visible:ring-0 h-11 bg-transparent text-base"
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
                    className="p-2 mr-1 rounded-full hover:bg-muted/50 transition-colors"
                    onClick={() => setSearch("")}
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Filter Tabs - Mobile Optimized Segmented Control */}
          <div className="relative bg-secondary/60 rounded-xl p-1">
            <div className="grid grid-cols-3 gap-1">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative flex flex-col items-center justify-center min-h-[44px] px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`filter-${filter.id}`}
                >
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.shortLabel}</span>
                  <span className={`text-xs mt-0.5 ${
                    activeFilter === filter.id 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-40 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No policies found</p>
            <Button>Add Your First Policy</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map((policy) => (
              <Link key={policy.id} href={`/policies/${policy.id}`}>
                <Card className="p-6 border border-border/50 hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{policy.type}</h3>
                      <p className="text-sm text-muted-foreground">{policy.provider}</p>
                    </div>
                    <Badge 
                      className={policy.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
                    >
                      {policy.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Policy #</span>
                      <span className="font-medium">{policy.policyNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Premium</span>
                      <span className="font-medium">{policy.premium}/{policy.paymentFrequency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">{new Date(policy.expiry).toLocaleDateString("el-GR")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage</span>
                      <span className="font-medium">{policy.coverage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm text-primary font-medium hover:gap-2 transition-all">
                    View Details <ChevronRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
