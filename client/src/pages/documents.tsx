import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Download, 
  FileText, 
  FileCheck, 
  CreditCard,
  FileBarChart, 
  FolderOpen,
  Upload,
  Eye,
  Share2,
  Trash2,
  MoreVertical,
  X,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Link } from "wouter";

interface Document {
  id: number;
  name: string;
  type: "Policy" | "Claim" | "ID Card" | "Tax";
  date: string;
  size: string;
  provider?: string;
  status: "verified" | "pending" | "needs_review";
  policyId?: number;
  expiryDate?: string;
}

const documentsData: Document[] = [
  { id: 1, name: "NN Health Policy Schedule 2025", type: "Policy", date: "2025-01-01", size: "1.2 MB", provider: "NN Hellas", status: "verified", policyId: 1, expiryDate: "2025-12-31" },
  { id: 2, name: "NN Tax Certificate 2024", type: "Tax", date: "2025-02-15", size: "0.8 MB", provider: "NN Hellas", status: "verified" },
  { id: 3, name: "Generali Green Card (EU)", type: "ID Card", date: "2025-06-15", size: "0.5 MB", provider: "Generali", status: "verified", policyId: 2, expiryDate: "2025-06-15" },
  { id: 4, name: "Generali Auto Contract", type: "Policy", date: "2025-06-15", size: "2.4 MB", provider: "Generali", status: "pending", policyId: 2 },
  { id: 5, name: "Ergo Home Insurance Schedule", type: "Policy", date: "2024-09-01", size: "1.5 MB", provider: "Ergo", status: "needs_review", policyId: 3 },
  { id: 6, name: "Claim Report #CLM-NN-001", type: "Claim", date: "2025-09-12", size: "3.1 MB", provider: "NN Hellas", status: "verified" },
  { id: 7, name: "Interamerican Life Policy", type: "Policy", date: "2024-03-15", size: "1.8 MB", provider: "Interamerican", status: "pending", policyId: 4 },
  { id: 8, name: "Pet Insurance Card - Max", type: "ID Card", date: "2025-01-10", size: "0.3 MB", provider: "Petplan", status: "verified", policyId: 5 },
];

const typeConfig = {
  Policy: { 
    icon: FileText, 
    color: "text-blue-600 dark:text-blue-400", 
    bg: "bg-blue-100 dark:bg-blue-900/40",
    label: "Policies"
  },
  Claim: { 
    icon: FileCheck, 
    color: "text-orange-600 dark:text-orange-400", 
    bg: "bg-orange-100 dark:bg-orange-900/40",
    label: "Claims"
  },
  "ID Card": { 
    icon: CreditCard, 
    color: "text-emerald-600 dark:text-emerald-400", 
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    label: "ID Cards"
  },
  Tax: { 
    icon: FileBarChart, 
    color: "text-purple-600 dark:text-purple-400", 
    bg: "bg-purple-100 dark:bg-purple-900/40",
    label: "Tax Docs"
  }
};

const statusConfig = {
  verified: {
    label: "Verified",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    icon: CheckCircle2
  },
  pending: {
    label: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    icon: Clock
  },
  needs_review: {
    label: "Needs Review",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/40",
    icon: AlertCircle
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const isRecent = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays < 30;
};

const isExpiringSoon = (dateStr?: string) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays < 30;
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredDocs = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                          doc.provider?.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeFilter === "all" || doc.type === activeFilter || doc.status === activeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate Document Health Score
  const verifiedCount = documentsData.filter(d => d.status === "verified").length;
  const pendingCount = documentsData.filter(d => d.status === "pending").length;
  const needsReviewCount = documentsData.filter(d => d.status === "needs_review").length;
  const totalDocs = documentsData.length;
  
  const documentHealthScore = Math.round((verifiedCount / totalDocs) * 100);
  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  const getHealthBg = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-emerald-600";
    if (score >= 50) return "from-amber-500 to-amber-600";
    return "from-red-500 to-red-600";
  };

  const expiringDocs = documentsData.filter(d => isExpiringSoon(d.expiryDate));
  const recentDocs = documentsData.filter(d => isRecent(d.date)).slice(0, 4);

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}...`);
  };

  const handlePreview = (doc: Document) => {
    toast.info(`Opening preview for ${doc.name}`);
  };

  const handleShare = (doc: Document) => {
    toast.success("Share link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Document Vault</h1>
                <p className="text-xs text-muted-foreground">{totalDocs} files stored securely</p>
              </div>
            </div>
            <Button size="sm" className="gap-2" data-testid="button-upload">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Document Health Score - Hero Widget */}
        <Card className="p-5 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-5">
            {/* Circular Progress */}
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted/20"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${documentHealthScore}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={documentHealthScore >= 80 ? "text-emerald-500" : documentHealthScore >= 50 ? "text-amber-500" : "text-red-500"} stopColor="currentColor" />
                    <stop offset="100%" className={documentHealthScore >= 80 ? "text-emerald-600" : documentHealthScore >= 50 ? "text-amber-600" : "text-red-600"} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${getHealthColor(documentHealthScore)}`}>{documentHealthScore}%</span>
              </div>
            </div>
            
            {/* Health Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">Document Health</h2>
                {documentHealthScore >= 80 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {documentHealthScore >= 80 
                  ? "Excellent! Most documents are verified." 
                  : documentHealthScore >= 50 
                    ? "Good progress. Some documents need attention."
                    : "Action needed. Review pending documents."}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">{verifiedCount} Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">{pendingCount} Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">{needsReviewCount} Review</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Card 
            className={`p-3 cursor-pointer transition-all border ${activeFilter === "all" ? "border-primary bg-primary/5" : "border-border/50 hover:bg-muted/30"}`}
            onClick={() => setActiveFilter("all")}
            data-testid="filter-all"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalDocs}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </Card>
          <Card 
            className={`p-3 cursor-pointer transition-all border ${activeFilter === "verified" ? "border-emerald-500 bg-emerald-500/5" : "border-border/50 hover:bg-muted/30"}`}
            onClick={() => setActiveFilter(activeFilter === "verified" ? "all" : "verified")}
            data-testid="filter-verified"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedCount}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
          </Card>
          <Card 
            className={`p-3 cursor-pointer transition-all border ${activeFilter === "pending" ? "border-amber-500 bg-amber-500/5" : "border-border/50 hover:bg-muted/30"}`}
            onClick={() => setActiveFilter(activeFilter === "pending" ? "all" : "pending")}
            data-testid="filter-pending"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </Card>
          <Card 
            className={`p-3 cursor-pointer transition-all border ${activeFilter === "needs_review" ? "border-red-500 bg-red-500/5" : "border-border/50 hover:bg-muted/30"}`}
            onClick={() => setActiveFilter(activeFilter === "needs_review" ? "all" : "needs_review")}
            data-testid="filter-review"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{needsReviewCount}</p>
              <p className="text-xs text-muted-foreground">Review</p>
            </div>
          </Card>
        </div>

        {/* Action Required Alert */}
        {(pendingCount > 0 || needsReviewCount > 0) && (
          <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">Action Required</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                  {pendingCount > 0 && `${pendingCount} document${pendingCount > 1 ? 's' : ''} pending verification. `}
                  {needsReviewCount > 0 && `${needsReviewCount} document${needsReviewCount > 1 ? 's' : ''} need${needsReviewCount === 1 ? 's' : ''} review.`}
                </p>
              </div>
              <Button size="sm" variant="outline" className="flex-shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300">
                Review Now
              </Button>
            </div>
          </Card>
        )}

        {/* Expiring Documents Alert */}
        {expiringDocs.length > 0 && (
          <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-red-800 dark:text-red-200">Documents Expiring Soon</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                  {expiringDocs.length} document{expiringDocs.length > 1 ? 's' : ''} will expire within 30 days.
                </p>
              </div>
              <Link href="/renewals">
                <Button size="sm" variant="outline" className="flex-shrink-0 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300">
                  View
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by name or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 h-11 bg-muted/50 border-border/50"
            data-testid="input-search"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Document Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((type) => {
            const config = typeConfig[type];
            const Icon = config.icon;
            const count = documentsData.filter(d => d.type === type).length;
            const isActive = activeFilter === type;
            
            return (
              <Button
                key={type}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`flex-shrink-0 gap-1.5 ${isActive ? "" : "border-border/50"}`}
                onClick={() => setActiveFilter(isActive ? "all" : type)}
                data-testid={`pill-${type.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Recently Added Section */}
        {activeFilter === "all" && !search && recentDocs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Recently Added</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {recentDocs.map((doc) => {
                const typeConf = typeConfig[doc.type];
                const statusConf = statusConfig[doc.status];
                const TypeIcon = typeConf.icon;
                const StatusIcon = statusConf.icon;
                
                return (
                  <Card 
                    key={doc.id} 
                    className="p-4 min-w-[220px] flex-shrink-0 border border-border/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handlePreview(doc)}
                    data-testid={`recent-doc-${doc.id}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className={`h-10 w-10 rounded-lg ${typeConf.bg} flex items-center justify-center`}>
                        <TypeIcon className={`h-5 w-5 ${typeConf.color}`} />
                      </div>
                      <Badge variant="outline" className={`text-xs px-1.5 py-0 ${statusConf.color} border-current`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConf.label}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm text-foreground line-clamp-2 mb-1">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.provider} - {doc.size}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {activeFilter === "all" ? "All Documents" : 
               activeFilter in typeConfig ? typeConfig[activeFilter as keyof typeof typeConfig].label :
               activeFilter in statusConfig ? `${statusConfig[activeFilter as keyof typeof statusConfig].label} Documents` : "Documents"}
            </h2>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {filteredDocs.length} {filteredDocs.length === 1 ? "file" : "files"}
            </Badge>
          </div>

          {filteredDocs.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No documents found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? `No results for "${search}"` : "No documents match your filter"}
              </p>
              <Button variant="outline" onClick={() => { setSearch(""); setActiveFilter("all"); }}>
                Clear filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => {
                const typeConf = typeConfig[doc.type];
                const statusConf = statusConfig[doc.status];
                const TypeIcon = typeConf.icon;
                const StatusIcon = statusConf.icon;
                
                return (
                  <Card 
                    key={doc.id} 
                    className="p-4 border border-border/50 hover:shadow-md transition-all"
                    data-testid={`document-${doc.id}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`h-12 w-12 rounded-xl ${typeConf.bg} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className={`h-6 w-6 ${typeConf.color}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate">{doc.name}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {doc.type}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-2 py-0 ${statusConf.color} border-current`}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConf.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                              {doc.provider && <span>{doc.provider}</span>}
                              <span>{formatDate(doc.date)}</span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleDownload(doc)}
                          data-testid={`button-download-${doc.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9" data-testid={`button-more-${doc.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreview(doc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(doc)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Storage Info Widget */}
        <Card className="p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Storage Usage</h3>
            </div>
            <span className="text-xs text-muted-foreground">12.6 MB / 100 MB</span>
          </div>
          <Progress value={12.6} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">87.4 MB available for new documents</p>
        </Card>

        {/* Security Note */}
        <Card className="p-4 bg-muted/30 border-border/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                Your documents are secure
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                All files are encrypted with AES-256 and stored in compliance with GDPR regulations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
