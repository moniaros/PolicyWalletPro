import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <Card className={`bg-gradient-to-br from-muted/30 to-muted/10 border-dashed ${compact ? "border" : "border-2"}`}>
      <CardContent className={`flex flex-col items-center justify-center ${compact ? "py-8 px-6" : "py-16 px-8"}`}>
        <div className={`${compact ? "h-12 w-12" : "h-16 w-16"} mb-4 rounded-full bg-muted flex items-center justify-center`}>
          <Icon className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-muted-foreground`} />
        </div>
        
        <h3 className={`${compact ? "text-base" : "text-lg"} font-semibold text-foreground text-center`}>
          {title}
        </h3>
        
        <p className={`text-muted-foreground text-center mt-1 ${compact ? "text-sm" : "text-sm max-w-sm"}`}>
          {description}
        </p>

        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="mt-4"
            size={compact ? "sm" : "default"}
            data-testid="empty-state-action"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
