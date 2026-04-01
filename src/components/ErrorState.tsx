import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title: string;
  description: string;
  suggestedToolSlug?: string;
  suggestedToolName?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Humanized Error State
 * Shows helpful, actionable errors instead of raw messages
 * Suggests related tools when applicable
 */
export function ErrorState({
  title,
  description,
  suggestedToolSlug,
  suggestedToolName,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-96 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[var(--error)] bg-opacity-10 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-[var(--error)]" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {suggestedToolSlug && suggestedToolName && (
            <button
              onClick={() => navigate(`/tools/${suggestedToolSlug}`)}
              className="
                flex items-center justify-center gap-2
                px-6 py-3
                bg-[var(--accent)] text-white
                rounded-lg font-medium
                hover:bg-[var(--accent-hover)]
                transition-all
                focus-visible:outline-4 focus-visible:outline-[var(--accent)]
              "
            >
              Try {suggestedToolName}
              <ArrowRight size={18} />
            </button>
          )}

          {showRetry && (
            <button
              onClick={onRetry || (() => window.location.reload())}
              className="
                flex items-center justify-center gap-2
                px-6 py-3
                bg-[var(--bg-tertiary)] text-[var(--text-primary)]
                border border-[var(--border-primary)]
                rounded-lg font-medium
                hover:bg-[var(--bg-hover)]
                transition-all
                focus-visible:outline-4 focus-visible:outline-[var(--accent)]
              "
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
          <p className="text-xs text-[var(--text-secondary)] text-center">
            Still having issues? Contact support or try a different tool.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Boundary Component
 * Catches React errors and displays humanized error state
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Could send to Sentry here
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Something went wrong"
          description="An unexpected error occurred while processing. Please try again or use a different tool."
          showRetry={true}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Specific Error States for Common Issues
 */

export function FileFormatError({
  supportedFormats,
  suggestedToolSlug,
}: {
  supportedFormats: string[];
  suggestedToolSlug?: string;
}) {
  return (
    <ErrorState
      title="File format not supported"
      description={`This tool only supports ${supportedFormats.join(', ')} files. Please convert your file first.`}
      suggestedToolSlug={suggestedToolSlug}
      suggestedToolName="Format Converter"
    />
  );
}

export function FileTooLargeError({
  maxSizeMB,
  suggestedToolSlug = 'compressor',
}: {
  maxSizeMB: number;
  suggestedToolSlug?: string;
}) {
  return (
    <ErrorState
      title="File too large"
      description={`Maximum file size is ${maxSizeMB}MB. Try compressing your file first.`}
      suggestedToolSlug={suggestedToolSlug}
      suggestedToolName="Compressor"
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection failed"
      description="Check your internet connection and try again. Some tools work offline too."
      showRetry={true}
      onRetry={onRetry}
    />
  );
}

export function NoPermissionError() {
  return (
    <ErrorState
      title="Permission denied"
      description="You don't have permission to access this resource. Please check your settings or try logging in again."
      showRetry={false}
    />
  );
}
