import { analysisData } from "@/lib/mockData";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck, TrendingUp } from "lucide-react";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">Visualize your coverage and identify potential risks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-lg bg-gradient-to-br from-white to-blue-50/50">
          <CardHeader>
            <CardTitle>Coverage vs. Risk Exposure</CardTitle>
            <CardDescription>A comparative view of how well you are covered against estimated risks.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Coverage"
                  dataKey="coverage"
                  stroke="hsl(221 83% 53%)"
                  strokeWidth={3}
                  fill="hsl(221 83% 53%)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Risk Level"
                  dataKey="risk"
                  stroke="hsl(346 84% 61%)"
                  strokeWidth={2}
                  fill="hsl(346 84% 61%)"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                />
                <Legend />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-emerald-50 border-emerald-100">
             <CardHeader>
               <div className="flex items-center gap-2">
                 <ShieldCheck className="h-6 w-6 text-emerald-600" />
                 <CardTitle className="text-emerald-900">Strong Protection</CardTitle>
               </div>
             </CardHeader>
             <CardContent>
               <p className="text-emerald-800 text-sm">Your <span className="font-bold">Health</span> and <span className="font-bold">Home</span> coverage exceeds recommended levels by 15%.</p>
             </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-100">
             <CardHeader>
               <div className="flex items-center gap-2">
                 <AlertCircle className="h-6 w-6 text-amber-600" />
                 <CardTitle className="text-amber-900">Attention Needed</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium text-amber-900">Disability Gap</span>
                   <span className="text-amber-700">40% gap</span>
                 </div>
                 <Progress value={40} className="h-2 bg-amber-200" />
               </div>
               <p className="text-amber-800 text-xs">You are currently under-insured for long-term disability based on your income.</p>
             </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-primary" />
               Projected Savings
             </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">By bundling your Auto and Home policies, you could save approximately <span className="font-bold text-foreground">$450/year</span>.</p>
            <div className="flex gap-3">
              <div className="h-24 flex-1 bg-secondary/50 rounded-lg flex flex-col items-center justify-center border border-dashed border-muted-foreground/30">
                 <span className="text-xs text-muted-foreground">Current</span>
                 <span className="text-xl font-bold">$2,400/yr</span>
              </div>
              <div className="h-24 flex-1 bg-primary/10 rounded-lg flex flex-col items-center justify-center border border-primary/20">
                 <span className="text-xs text-primary font-medium">With Bundle</span>
                 <span className="text-xl font-bold text-primary">$1,950/yr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
