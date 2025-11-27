import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, AlertTriangle, TrendingUp } from "lucide-react";

interface DetailedViewProps {
  policy: any;
  metadata?: Record<string, any>;
}

export function HealthDetailedView({ policy, metadata = {} }: DetailedViewProps) {
  const safeMetadata = metadata || {};
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏥 Συνδεδεμένα Νοσοκομεία (Network Hospitals)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Απαλλαγή (Deductible)</p>
              <p className="font-bold text-lg text-purple-900">{safeMetadata.deductible || "€1,500"}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Όριο Ετήσιας Κάλυψης</p>
              <p className="font-bold text-lg text-blue-900">{safeMetadata.annualLimit || "€1,000,000"}</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-emerald-700" />
              <p className="font-semibold text-emerald-900">☎️ Συντονιστικό Κέντρο (Coordination)</p>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9">
              Καλέστε {safeMetadata.preAuthNumber || "+30 210 6849000"}
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <p className="font-semibold text-amber-900 mb-1 text-sm">✓ Δωρεάν Ετήσιος Έλεγχος</p>
            <p className="text-xs text-amber-800">{safeMetadata.annualCheckup || "Περιλαμβάνεται - Αιματολογικές εξετάσεις"}</p>
          </div>

          {Array.isArray(safeMetadata.excludedProviders) && safeMetadata.excludedProviders.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="font-semibold text-red-900 mb-2 text-sm">⚠️ Εξαιρούμενοι Πάροχοι</p>
              <ul className="text-xs text-red-800 space-y-1">
                {(safeMetadata.excludedProviders as string[]).map((p: string, i: number) => <li key={i}>• {p}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AutoDetailedView({ policy, metadata = {} }: DetailedViewProps) {
  const safeMetadata = metadata || {};
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🚗 Νόμιμα & Δρόμος (Legal & Road)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-xs text-blue-600 uppercase font-semibold mb-2">Πινακίδα & Μοντέλο</p>
            <p className="font-mono text-2xl font-bold text-blue-900">{safeMetadata.licensePlate || "YZA-1234"} | {safeMetadata.carModel || "Toyota Yaris"}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Κάλυψη</p>
              <p className="font-bold text-slate-900">{safeMetadata.coverageTier || "Πλήρες Kasko"}</p>
            </div>
            <div className={`p-3 rounded-lg ${safeMetadata.greenCardStatus === "Valid" ? "bg-emerald-50" : "bg-red-50"}`}>
              <p className="text-xs uppercase font-semibold mb-1" style={{color: safeMetadata.greenCardStatus === "Valid" ? "#047857" : "#dc2626"}}>Πράσινη Κάρτα</p>
              <p className="font-bold text-sm" style={{color: safeMetadata.greenCardStatus === "Valid" ? "#065f46" : "#7f1d1d"}}>{safeMetadata.greenCardStatus === "Valid" ? "✓ Ισχυρή" : "Ανανέωση"}</p>
            </div>
          </div>

          {Array.isArray(safeMetadata.namedDrivers) && safeMetadata.namedDrivers.length > 0 && (
            <div>
              <p className="font-semibold mb-2 text-sm">👥 Εξουσιοδοτημένοι Οδηγοί</p>
              <div className="space-y-2">
                {(safeMetadata.namedDrivers as string[]).map((driver: string, i: number) => (
                  <div key={i} className="bg-gray-100 p-2 rounded text-sm">✓ {driver}</div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="font-semibold text-red-900 text-xs mb-2">🚨 Δήλωση Ατυχήματος</p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-8">
                {safeMetadata.accidentCarePhone || "+30 18118"}
              </Button>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p className="font-semibold text-orange-900 text-xs mb-2">🚙 Οδική Βοήθεια</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs h-8">
                {safeMetadata.roadsidePhone || "+30 18180"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HomeDetailedView({ policy, metadata = {} }: DetailedViewProps) {
  const safeMetadata = metadata || {};
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏠 Ενυπόθηκη & Φόρος (Mortgage & Tax)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
            <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Διεύθυνση Ιδιοκτησίας</p>
            <p className="font-semibold text-amber-900">{safeMetadata.propertyAddress || "Ακαδημίας 10, Αθήνα"}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Συνολική Ασφάλιση</p>
            <p className="font-bold text-lg text-blue-900">{safeMetadata.sumInsured || "€465,000"}</p>
          </div>

          {safeMetadata.enfiaBadge && (
            <div className="bg-green-100 border-2 border-green-400 p-3 rounded-lg">
              <p className="font-bold text-green-900 text-sm">{safeMetadata.enfiaBadge}</p>
            </div>
          )}

          <div>
            <p className="font-semibold mb-2 text-sm">🛡️ Κατάσταση Καλύψεων</p>
            <div className="grid grid-cols-3 gap-2">
              {["seismos", "pirkagia", "plimmira"].map((type) => {
                const labels: Record<string, {icon: string; label: string}> = {
                  seismos: { icon: "🌍", label: "Σεισμός" },
                  pirkagia: { icon: "🔥", label: "Πυρκαγιά" },
                  plimmira: { icon: "💧", label: "Πλημμύρα" }
                };
                const info = labels[type] || { icon: "?", label: type };
                return (
                  <div key={type} className={`p-2 rounded text-center text-sm font-medium ${(safeMetadata.catastropheCover?.[type as keyof typeof safeMetadata.catastropheCover] as boolean) ? "bg-emerald-100 text-emerald-900" : "bg-gray-100 text-gray-600"}`}>
                    {info.icon} {info.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Απαλλαγή</p>
              <p className="font-bold text-slate-900">{safeMetadata.deductible || "€500"}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Ενυπόθηκη Τράπεζα</p>
              <p className="font-bold text-slate-900">{safeMetadata.mortgagee || "Alpha Bank"}</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <p className="font-semibold text-orange-900 text-sm mb-2">🔧 Τεχνική Βοήθεια 24/7</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs h-8">
              Καλέστε {safeMetadata.emergencyServices || "+30 214 2000214"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
    <>
      <Card className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg">📌 Διαθέσιμες Ενέργειες</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              💳 Πληρώστε Τώρα
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              📋 Αναφορά Ζημιάς
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              ✏️ Τροποποίηση
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg">☎️ Επικοινωνήστε με τον Πράκτορα</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Για άμεση βοήθεια, επικοινωνήστε με τον Νικόλαο (Agent):</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10">
              📞 Καλέστε Νικόλαο - +30 694 123 4567
            </Button>
            <p className="text-xs text-gray-600 text-center">Διαθέσιμος 24/7 για ερωτήσεις και αποζημιώσεις</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-amber-500">
        <CardHeader>
          <CardTitle className="text-lg">📄 Έγγραφα & Πιστοποιητικά</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" className="text-xs h-9">
              📋 Κάρτα ENFIA
            </Button>
            <Button variant="outline" className="text-xs h-9">
              🛂 Πράσινη Κάρτα
            </Button>
            <Button variant="outline" className="text-xs h-9">
              🏥 Έντυπο Νοσοκομείου
            </Button>
            <Button variant="outline" className="text-xs h-9">
              ✓ Πιστοποιητικό
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
