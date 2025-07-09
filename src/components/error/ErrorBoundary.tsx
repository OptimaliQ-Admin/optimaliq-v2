"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Here you would typically send to your error monitoring service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Here you would typically send to your error reporting service
    console.log("Error Report:", errorReport);
    
    // For now, we'll just show an alert
    alert("Error report generated. Please contact support with this information.");
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-md w-full"
          >
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ExclamationTriangleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600">
                We encountered an unexpected error. Don&apos;t worry, we&apos;re working to fix it.
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-700 space-y-2">
                <div>
                  <span className="font-medium">Error:</span> {this.state.error?.message || "Unknown error"}
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                      Show technical details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 bg-white p-3 rounded border overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <HomeIcon className="w-4 h-4" />
                Go to Homepage
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleReportError}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <EnvelopeIcon className="w-4 h-4" />
                Report Error
              </motion.button>
            </div>

            {/* Support Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error("Error caught by useErrorHandler:", error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

// Error Fallback Component
export function ErrorFallback({ 
  error: _error, 
  onRetry, 
  onReport 
}: { 
  error: Error; 
  onRetry: () => void; 
  onReport: () => void; 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ExclamationTriangleIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600">
            We&apos;re sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReport}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
          >
            Report Issue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 