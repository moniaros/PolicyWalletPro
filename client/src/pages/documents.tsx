import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Grid3X3,
  List,
  X,
  Clock,
  Shield,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Document {
  id: number;
  name: string;
  type: "Policy" | "Claim" | "ID Card" | "Tax";
  date: string;
  size: string;
  provider?: string;
}

const documentsData: Document[] = [
  { id: 1, name: "NN Health Policy Schedule 2025", type: "Policy", date: "2025-01-01", size: "1.2 MB", provider: "NN Hellas" },
  { id: 2, name: "NN Tax Certificate 2024", type: "Tax", date: "2025-02-15", size: "0.8 MB", provider: "NN Hellas" },
  { id: 3, name: "Generali Green Card (EU)", type: "ID Card", date: "2025-06-15", size: "0.5 MB", provider: "Generali" },
  { id: 4, name: "Generali Auto Contract", type: "Policy", date: "2025-06-15", size: "2.4 MB", provider: "Generali" },
  { id: 5, name: "Ergo Home Insurance Schedule", type: "Policy", date: "2024-09-01", size: "1.5 MB", provider: "Ergo" },
  { id: 6, name: "Claim Report #CLM-NN-001", type: "Claim", date: "2025-09-12", size: "3.1 MB", provider: "NN Hellas" },
  { id: 7, name: "Interamerican Life Policy", type: "Policy", date: "2024-03-15", size: "1.8 MB", provider: "Interamerican" },
  { id: 8, name: "Pet Insurance Card - Max", type: "ID Card", date: "2025-01-10", size: "0.3 MB", provider: "Petplan" },
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
    label: "Tax Documents"
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

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredDocs = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                          doc.provider?.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeFilter === "all" || doc.type === activeFilter;
    return matchesSearch && matchesType;
  });

  const recentDocs = documentsData.filter(doc => isRecent(doc.date)).slice(0, 3);

  const typeCounts = {
    all: documentsData.length,
    Policy: documentsData.filter(d => d.type === "Policy").length,
    Claim: documentsData.filter(d => d.type === "Claim").length,
    "ID Card": documentsData.filter(d => d.type === "ID Card").length,
    Tax: documentsData.filter(d => d.type === "Tax").length,
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.name}...`);
  };

  const handlePreview = (doc: Document) => {
    toast.info(`Opening preview for ${doc.name}`);
  };

  const handleShare = (doc: Document) => {
    toast.success("Share link copied to clipboard");
  };

  const handleDelete = (doc: Document) => {
    toast.error(`Delete functionality coming soon`);
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
                <h1 className="text-xl font-bold text-foreground">Documents</h1>
                <p className="text-xs text-muted-foreground">{documentsData.length} files stored securely</p>
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
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((type) => {
            const config = typeConfig[type];
            const Icon = config.icon;
            const count = typeCounts[type];
            const isActive = activeFilter === type;
            
            return (
              <Card 
                key={type}
                className={`p-3 cursor-pointer transition-all border ${
                  isActive 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                    : "border-border/50 hover:bg-muted/30"
                }`}
                onClick={() => setActiveFilter(isActive ? "all" : type)}
                data-testid={`filter-${type.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Documents */}
        {activeFilter === "all" && !search && recentDocs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground">Recently Added</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {recentDocs.map((doc) => {
                const config = typeConfig[doc.type];
                const Icon = config.icon;
                
                return (
                  <Card 
                    key={doc.id} 
                    className="p-3 min-w-[200px] flex-shrink-0 border border-border/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handlePreview(doc)}
                    data-testid={`recent-doc-${doc.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents List Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {activeFilter === "all" ? "All Documents" : typeConfig[activeFilter as keyof typeof typeConfig]?.label}
            </h2>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {filteredDocs.length}
            </Badge>
            {activeFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground"
                onClick={() => setActiveFilter("all")}
              >
                Clear filter
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Documents Grid/List */}
        {filteredDocs.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No documents found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search ? `No results for "${search}"` : "Upload your first document to get started"}
            </p>
            <Button variant="outline" onClick={() => { setSearch(""); setActiveFilter("all"); }}>
              {search ? "Clear search" : "Upload Document"}
            </Button>
          </Card>
        ) : viewMode === "list" ? (
          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const config = typeConfig[doc.type];
              const Icon = config.icon;
              
              return (
                <Card 
                  key={doc.id} 
                  className="p-4 border border-border/50 hover:shadow-md transition-all"
                  data-testid={`document-${doc.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
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
                            {doc.provider && (
                              <span className="text-xs text-muted-foreground">{doc.provider}</span>
                            )}
                            <span className="text-xs text-muted-foreground">{formatDate(doc.date)}</span>
                            <span className="text-xs text-muted-foreground">{doc.size}</span>
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
                          <DropdownMenuItem onClick={() => handleDelete(doc)} className="text-red-600">
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => {
              const config = typeConfig[doc.type];
              const Icon = config.icon;
              
              return (
                <Card 
                  key={doc.id} 
                  className="p-4 border border-border/50 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handlePreview(doc)}
                  data-testid={`document-grid-${doc.id}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`h-16 w-16 rounded-2xl ${config.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`h-8 w-8 ${config.color}`} />
                    </div>
                    <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                        onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

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
                All files are encrypted and stored securely. Only you can access your insurance documents.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
