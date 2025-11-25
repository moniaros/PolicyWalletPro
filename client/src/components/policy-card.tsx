import { motion } from "framer-motion";
import { Download, Share2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PolicyProps {
  id: number;
  type: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  expiry: string;
  premium: string;
  icon: any;
  color: string;
  status: string;
  index?: number;
}

export default function PolicyCard({ policy, index = 0 }: { policy: PolicyProps, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted group bg-white">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${policy.color}`}>
              <policy.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-none">{policy.type} Insurance</h3>
              <p className="text-sm text-muted-foreground mt-1">{policy.provider}</p>
            </div>
          </div>
          <Badge variant={policy.status === "Active" ? "secondary" : "destructive"} className={`${policy.status === "Active" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : ""} font-normal`}>
            {policy.status === "Active" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {policy.status}
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Coverage</p>
              <p className="font-semibold text-foreground">{policy.coverage}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Premium</p>
              <p className="font-semibold text-foreground">{policy.premium}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Policy No.</p>
              <p className="font-mono text-xs text-foreground bg-secondary py-1 px-2 rounded inline-block">{policy.policyNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Renews</p>
              <p className="font-semibold text-foreground">{policy.expiry}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-3 flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs hover:bg-white hover:shadow-sm">
            <Download className="h-3.5 w-3.5 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs hover:bg-white hover:shadow-sm">
            <Share2 className="h-3.5 w-3.5 mr-2" />
            Share
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
