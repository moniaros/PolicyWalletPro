import { forwardRef, ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaPressed?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      ariaLabel,
      ariaDescribedBy,
      ariaPressed,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-pressed={ariaPressed}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";
