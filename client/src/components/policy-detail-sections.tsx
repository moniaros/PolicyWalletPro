import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, AlertTriangle, TrendingUp } from "lucide-react";

interface DetailedViewProps {
  policy: any;
  metadata?: Record<string, any>;
}

export function HealthDetailedView({ policy, metadata }: DetailedViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coverage Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Deductible</p>
              <p className="font-bold text-lg text-purple-900">{metadata?.deductible || "€1,500"}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Annual Limit</p>
              <p className="font-bold text-lg text-blue-900">{metadata?.annualLimit || "€1,000,000"}</p>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-emerald-700" />
              <p className="font-semibold text-emerald-900">Pre-Auth for Hospital</p>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Call {metadata?.preAuthNumber || "+30 210 6849000"}
            </Button>
          </div>

          {metadata?.excludedProviders?.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="font-semibold text-red-900 mb-2 text-sm">⚠️ Excluded Providers</p>
              <ul className="text-xs text-red-800 space-y-1">
                {metadata.excludedProviders.map((p: string, i: number) => <li key={i}>• {p}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AutoDetailedView({ policy, metadata }: DetailedViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehicle & Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-xs text-blue-600 uppercase font-semibold mb-2">License Plate</p>
            <p className="font-mono text-2xl font-bold text-blue-900">{metadata?.licensePlate || "YZA-1234"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Coverage Tier</p>
              <p className="font-bold text-slate-900">{metadata?.coverageTier || "Full Casco"}</p>
            </div>
            <div className={`p-3 rounded-lg ${metadata?.greenCardStatus === "Valid" ? "bg-emerald-50" : "bg-red-50"}`}>
              <p className="text-xs uppercase font-semibold mb-1" style={{color: metadata?.greenCardStatus === "Valid" ? "#047857" : "#dc2626"}}>Green Card</p>
              <p className="font-bold" style={{color: metadata?.greenCardStatus === "Valid" ? "#065f46" : "#7f1d1d"}}>{metadata?.greenCardStatus || "Valid"}</p>
            </div>
          </div>

          {metadata?.namedDrivers?.length > 0 && (
            <div>
              <p className="font-semibold mb-2 text-sm">Named Drivers</p>
              <div className="space-y-2">
                {metadata.namedDrivers.map((driver: string, i: number) => (
                  <div key={i} className="bg-gray-100 p-2 rounded text-sm">✓ {driver}</div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm mb-2">Accident Care Line</p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-8">
                Call {metadata?.accidentCarePhone || "+30 18118"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HomeDetailedView({ policy, metadata }: DetailedViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
            <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Property Address</p>
            <p className="font-semibold text-amber-900">{metadata?.propertyAddress || "Akadimias 10, Athens"}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Sum Insured</p>
            <p className="font-bold text-lg text-blue-900">{metadata?.sumInsured || "€465,000"}</p>
          </div>

          <div>
            <p className="font-semibold mb-2 text-sm">Catastrophe Coverage</p>
            <div className="grid grid-cols-3 gap-2">
              {["fire", "flood", "earthquake"].map((type) => (
                <div key={type} className={`p-2 rounded text-center text-sm font-medium ${metadata?.catastropheCover?.[type] ? "bg-emerald-100 text-emerald-900" : "bg-gray-100 text-gray-600"}`}>
                  {type === "fire" ? "🔥" : type === "flood" ? "💧" : "🌍"} {type === "fire" ? "Fire" : type === "flood" ? "Flood" : "Earthquake"}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Deductible</p>
              <p className="font-bold text-slate-900">{metadata?.deductible || "€500"}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Mortgagee</p>
              <p className="font-bold text-slate-900">{metadata?.mortgagee || "Alpha Bank"}</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <p className="font-semibold text-orange-900 text-sm mb-2">24/7 Emergency Services</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs h-8">
              Call {metadata?.emergencyServices || "+30 214 2000214"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InvestmentLifeDetailedView({ policy, metadata }: DetailedViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Fund Value</p>
              <p className="font-bold text-lg text-blue-900">{metadata?.fundValue || "€45,200"}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-xs text-emerald-600 uppercase font-semibold mb-1">Surrender Value</p>
              <p className="font-bold text-lg text-emerald-900">{metadata?.surrenderValue || "€44,800"}</p>
            </div>
          </div>

          <div className="bg-emerald-100 p-3 rounded-lg border border-emerald-300">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-700" />
              <p className="font-bold text-emerald-900">YTD Performance: {metadata?.ytdGrowth || "+5.2%"}</p>
            </div>
          </div>

          {metadata?.fundAllocation && (
            <div>
              <p className="font-semibold mb-2 text-sm">Fund Allocation</p>
              <div className="space-y-2">
                {Object.entries(metadata.fundAllocation).map(([fund, pct]) => (
                  <div key={fund}>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="capitalize font-medium">{fund}</span>
                      <span className="font-bold">{pct}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: pct}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {metadata?.lastPremiumDate && (
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Last Premium</p>
              <p className="font-medium text-slate-900">{metadata.lastPremiumDate} - {metadata.lastPremiumAmount}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function PetDetailedView({ policy, metadata }: DetailedViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pet Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Pet Details</p>
            <p className="font-bold text-amber-900">{metadata?.petName || "Max"} - {metadata?.petType || "Golden Retriever"}</p>
            {metadata?.microchipNumber && (
              <p className="text-xs text-amber-700 mt-1">Microchip: {metadata.microchipNumber}</p>
            )}
          </div>

          <div>
            <p className="font-semibold mb-2 text-sm">Annual Limit</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full" style={{width: metadata?.limitUsedPercent || "40%"}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metadata?.limitUsed || "€400"} / {metadata?.limitTotal || "€1,000"} used</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Co-Pay</p>
              <p className="font-bold text-purple-900">{metadata?.coPay || "20%"}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Waiting Periods</p>
              <p className="font-bold text-slate-900 text-sm">{metadata?.waitingPeriods || "Covered"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function UniversalBrokerActions({ policy }: { policy: any }) {
  return (
    <Card className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-lg">Available Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            💳 Pay Now
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            📋 File Claim
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            ✏️ Modify Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
