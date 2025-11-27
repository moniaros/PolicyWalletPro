import { useState } from "react";
import { useTranslation } from "react-i18next";
import { policies } from "@/lib/mockData";
import PolicyCard from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UploadCloud, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredPolicies = policies.filter(p => 
    p.provider.toLowerCase().includes(search.toLowerCase()) || 
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('policies.myPolicies')}</h1>
          <p className="text-muted-foreground mt-1">{t('policies.manageOrganize')}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20">
              <UploadCloud className="h-4 w-4 mr-2" />
              {t('policies.uploadPolicy')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('policies.uploadNewPolicy')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">{t('policies.policyDocument')}</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl h-32 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                   <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
                   <span className="text-sm">{t('policies.clickOrDrag')}</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t('policies.insuranceType')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('policies.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">{t('policyTypes.health')}</SelectItem>
                    <SelectItem value="auto">{t('policyTypes.auto')}</SelectItem>
                    <SelectItem value="home">{t('policyTypes.home')}</SelectItem>
                    <SelectItem value="life">{t('policyTypes.life')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{t('policies.savePolicy')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder={t('policies.searchPolicies')} 
          className="border-0 shadow-none focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.map((policy, i) => (
          <PolicyCard key={policy.id} policy={policy} index={i} />
        ))}
      </div>
    </div>
  );
}
