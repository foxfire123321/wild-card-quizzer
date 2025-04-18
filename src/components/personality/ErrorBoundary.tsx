
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Poker personality quiz error:", error, errorInfo);
  }

  handleRetry = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
          <div className="text-center mb-8 max-w-md">
            <h1 className="text-red-500 text-2xl font-bold mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-700 mb-6">
              Try refreshing the app.
            </p>
            <Button onClick={this.handleRetry} className="bg-poker-gold hover:bg-amber-600">
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
