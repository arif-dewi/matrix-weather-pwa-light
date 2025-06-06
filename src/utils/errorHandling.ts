import { logger } from '@/services/MatrixLogger';

export function setupGlobalErrorHandlers() {
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleGlobalError);
}

export function cleanupGlobalHandlers() {
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  window.removeEventListener('error', handleGlobalError);
}

export function cleanUp() {
  window.addEventListener('beforeunload', cleanupGlobalHandlers);
}

function handleUnhandledRejection(event: PromiseRejectionEvent) {
  logger.error('Unhandled Promise Rejection', event.reason);
  event.preventDefault();
  console.error('🚨 Matrix Weather: Unhandled rejection:', event.reason);
}

function handleGlobalError(event: ErrorEvent) {
  logger.error('Global Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  console.error('🚨 Matrix Weather: Global error:', event.error);
}
