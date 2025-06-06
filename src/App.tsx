// src/App.tsx
import { ErrorInfo, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryProvider } from '@/providers/QueryProvider';
import { MatrixScene } from '@/components/matrix/MatrixScene';
import { WeatherSetup } from '@/components/weather/WeatherSetup';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { MatrixNotificationContainer } from '@/components/notifications/MatrixNotification';
import { ConnectionStatusBadge } from '@/components/status/ConnectionStatusBadge';
import { useNotificationStore } from '@/stores/notificationStore';
import { logger } from '@/services/MatrixLogger';

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  logger.error('Application Error Boundary triggered', error);

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center p-8">
      <div className="bg-black/90 border-2 border-red-500 rounded-xl p-8 text-center max-w-md backdrop-blur-sm">
        <div className="text-2xl font-bold mb-4">
          ⚠️ MATRIX ERROR
        </div>
        <div className="text-red-400 mb-4">
          Application encountered an error
        </div>
        <div className="text-sm text-red-300 mb-6 font-mono bg-red-900/20 p-3 rounded border">
          {error.message || 'Unknown error occurred'}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="bg-red-800 border border-red-500 text-red-100 px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-800 border border-gray-500 text-gray-100 px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            🌐 Reload App
          </button>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
      <div className="bg-black/90 border-2 border-green-500 rounded-xl p-8 text-center backdrop-blur-sm">
        <div className="text-xl font-bold mb-4 tracking-wider animate-pulse">
          INITIALIZING MATRIX...
        </div>
        <div className="text-sm opacity-70">
          Loading weather systems
        </div>
      </div>
    </div>
  );
}

// Main app content component
function AppContent() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono overflow-hidden relative">
      <Suspense fallback={<LoadingFallback />}>
        <MatrixScene />
      </Suspense>
      <WeatherSetup />
      <WeatherDisplay />
      <ConnectionStatusBadge />

      <MatrixNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: Error, errorInfo: ErrorInfo) => {
        logger.error('React Error Boundary caught error', { error, errorInfo });
      }}
      onReset={() => {
        logger.info('Error boundary reset - reloading application state');
        // Clear any corrupted state
        window.location.reload();
      }}
    >
      <QueryProvider>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;