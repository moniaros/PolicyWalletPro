import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error tracking service in production
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-6 w-6" />
              <AlertTitle className="text-lg">Something Went Wrong</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground max-h-32 overflow-auto font-mono">
              {this.state.error?.stack}
            </div>

            <Button
              onClick={this.resetError}
              className="w-full"
              size="lg"
              data-testid="button-error-retry"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
