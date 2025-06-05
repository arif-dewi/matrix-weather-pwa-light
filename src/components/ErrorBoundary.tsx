import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-matrix-green font-mono flex items-center justify-center p-8">
          <div className="bg-black/90 border-2 border-red-500 rounded-xl p-8 text-center max-w-md">
            <div className="text-2xl font-bold mb-4 text-red-500">
              ⚠️ MATRIX ERROR
            </div>
            <div className="text-red-400 mb-4">
              React component crashed
            </div>
            <div className="text-sm text-red-300 mb-6 font-mono bg-red-900/20 p-3 rounded">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-800 border border-red-500 text-red-100 px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              🔄 RELOAD MATRIX
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}