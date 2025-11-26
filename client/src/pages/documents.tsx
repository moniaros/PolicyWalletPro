import { useState } from "react";
import { documents } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, FileText, FileCheck, Globe, FileBarChart, FolderOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeTab === "all" || doc.type.toLowerCase() === activeTab.toLowerCase().replace(" ", "");
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch(type) {
      case "Policy": return FileText;
      case "Claim": return FileCheck;
      case "ID Card": return Globe;
      case "Tax": return FileBarChart;
      default: return FileText;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case "Policy": return "bg-blue-50 text-blue-600";
      case "Claim": return "bg-orange-50 text-orange-600";
      case "ID Card": return "bg-emerald-50 text-emerald-600";
      case "Tax": return "bg-purple-50 text-purple-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Documents Vault</h1>
          <p className="text-muted-foreground mt-1">Secure repository for all your insurance documents.</p>
        </div>
        <Button>
          <FolderOpen className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-card p-2 rounded-xl border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search documents..." 
          className="border-0 shadow-none focus-visible:ring-0 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto overflow-x-auto flex justify-start h-auto p-1 bg-transparent md:bg-muted/50 md:rounded-lg gap-2">
          <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
          <TabsTrigger value="policy" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Policies</TabsTrigger>
          <TabsTrigger value="idcard" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">ID Cards</TabsTrigger>
          <TabsTrigger value="claim" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Claims</TabsTrigger>
          <TabsTrigger value="tax" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tax</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {filteredDocs.map((doc) => {
               const Icon = getIcon(doc.type);
               return (
                 <Card key={doc.id} className="group hover:shadow-md transition-all cursor-pointer">
                   <CardContent className="p-4 flex items-start gap-4">
                     <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${getColor(doc.type)}`}>
                       <Icon className="h-6 w-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-start justify-between gap-2">
                         <h4 className="font-semibold text-sm truncate pr-2" title={doc.name}>{doc.name}</h4>
                         <Badge variant="outline" className="text-[10px] h-5 shrink-0">{doc.type}</Badge>
                       </div>
                       <p className="text-xs text-muted-foreground mt-1">{doc.date} • {doc.size}</p>
                       <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 bg-secondary/50 hover:bg-secondary">
                             <Download className="h-3 w-3 mr-1" /> Download
                          </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               );
             })}
           </div>
           {filteredDocs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                 <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                 <p>No documents found.</p>
              </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
