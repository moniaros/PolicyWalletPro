import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PolicyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="h-6 w-full sm:w-1/3 bg-muted rounded-md animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full sm:w-1/2 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
          <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="h-40 bg-gradient-to-r from-muted to-muted/50 rounded-3xl animate-pulse" />
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
