import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PolicyCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-border/50 overflow-hidden">
      <CardContent className="p-5">
        {/* Header: Icon + Provider + Status Badge */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Essential Info: Premium + Expiry */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-3 w-20 ml-auto" />
            <Skeleton className="h-5 w-28 ml-auto" />
          </div>
        </div>
        
        {/* Footer hint */}
        <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-border/30">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="h-32 bg-gradient-to-r from-muted to-muted/50 rounded-2xl animate-pulse" />
      
      {/* Quick Actions skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-10 w-10 rounded-xl mb-3" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </Card>
          ))}
        </div>
      </div>
      
      {/* Widgets skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </Card>
        ))}
      </div>
      
      {/* Policies skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <PolicyCardSkeleton key={i} />
          ))}
        </div>
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

export function InsuranceHealthSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      {/* Health Score Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </Card>
      
      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PoliciesListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <PolicyCardSkeleton key={i} />
      ))}
    </div>
  );
}
