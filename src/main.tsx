// src/main.tsx (Fixed with modern Performance API)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { initializePWA } from '@/services/ServiceWorkerManager';
import { logger } from '@/services/MatrixLogger';
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
import './index.css';

// Enhanced error handling for the entire application
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  logger.error('Unhandled Promise Rejection', event.reason);

  // Prevent default browser error handling
  event.preventDefault();

  // You could show a user-friendly notification here
  console.error('🚨 Matrix Weather: Unhandled promise rejection:', event.reason);
};

const handleGlobalError = (event: ErrorEvent) => {
  logger.error('Global Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });

  console.error('🚨 Matrix Weather: Global error:', event.error);
};

// Set up global error handlers
window.addEventListener('unhandledrejection', handleUnhandledRejection);
window.addEventListener('error', handleGlobalError);

// Modern performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      logger.info(`Page load performance: ${Math.round(navEntry.loadEventEnd - navEntry.fetchStart)}ms`);
    }
  });
});

if ('PerformanceObserver' in window) {
  try {
    perfObserver.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    logger.warn('Performance Observer not supported', error);
  }
}

// Initialize the app
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found - check your HTML template');
}

// Enhanced root creation with error boundaries
const root = ReactDOM.createRoot(rootElement);

try {
  logger.info('🚀 Initializing Matrix Weather Application');

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  logger.success('✅ Matrix Weather Application rendered successfully');
} catch (error) {
  logger.error('Failed to render Matrix Weather Application', error);

  // Fallback rendering
  root.render(
    <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center p-8">
      <div className="bg-black/90 border-2 border-red-500 rounded-xl p-8 text-center max-w-md">
        <div className="text-2xl font-bold mb-4">⚠️ FATAL ERROR</div>
        <div className="text-red-400 mb-4">Failed to initialize Matrix Weather</div>
        <div className="text-sm text-red-300 mb-6 font-mono bg-red-900/20 p-3 rounded">
          {error instanceof Error ? error.message : 'Unknown initialization error'}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-800 border border-red-500 text-red-100 px-6 py-2 rounded hover:bg-red-700 transition-colors"
        >
          🔄 RELOAD
        </button>
      </div>
    </div>
  );
}

// Initialize PWA features after app renders
initializePWA().catch((error) => {
  logger.error('PWA initialization failed', error);
  // PWA failure shouldn't break the app, just log it
});

// Modern performance measurement function
const getPerformanceMetrics = () => {
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!navigation) {
      return {
        domContentLoaded: 0,
        loadComplete: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        error: 'Navigation timing not available'
      };
    }

    // Get paint metrics
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    return {
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
      loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      firstPaint: Math.round(firstPaint),
      firstContentfulPaint: Math.round(firstContentfulPaint),
      dnsLookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
      tcpConnect: Math.round(navigation.connectEnd - navigation.connectStart),
      serverResponse: Math.round(navigation.responseEnd - navigation.requestStart),
      domProcessing: Math.round(navigation.domContentLoadedEventStart - navigation.responseEnd),
    };
  } catch (error) {
    logger.warn('Failed to get performance metrics', error);
    return {
      error: 'Performance metrics unavailable',
      domContentLoaded: 0,
      loadComplete: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
    };
  }
};

// Development helpers
if (import.meta.env.DEV) {
  // Expose useful debugging tools in development
  (window as any).__MATRIX_WEATHER__ = {
    logger,
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
      logger.info('Storage cleared');
    },
    performance: getPerformanceMetrics,
    // Additional debug helpers
    getMemoryUsage: () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
        };
      }
      return { error: 'Memory API not available' };
    },
    getDeviceInfo: () => ({
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    }),
  };

  logger.info('🛠️ Development mode - Debug tools available at window.__MATRIX_WEATHER__');
}

// Cleanup function for proper app shutdown
const cleanup = () => {
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  window.removeEventListener('error', handleGlobalError);
  if (perfObserver) {
    perfObserver.disconnect();
  }
  logger.info('Application cleanup completed');
};

// Register cleanup for page unload
window.addEventListener('beforeunload', cleanup);

export default cleanup;
