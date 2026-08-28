import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null;
}

function DefaultErrorFallback({ error }: DefaultErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="space-y-4 max-w-md">
        <h2 className="text-xl font-bold text-text1">Something went wrong</h2>
        <p className="text-sm text-text2">
          An unexpected error occurred. Don't worry, your work is safe.
        </p>
        {error && (
          <details className="text-left text-xs bg-bg2 p-3 rounded border border-border1">
            <summary className="cursor-pointer font-medium text-text2 mb-2">Error details</summary>
            <pre className="overflow-auto text-red-600">{error.message}</pre>
          </details>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-dark rounded hover:opacity-90 transition-opacity"
        >
          Reload Extension
        </button>
      </div>
    </div>
  );
}