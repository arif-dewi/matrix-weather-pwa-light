import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { initializePWA } from '@/services/ServiceWorkerManager';
import { logger } from '@/services/MatrixLogger';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { setupGlobalErrorHandlers, cleanUp } from '@/utils/errorHandling';
import {ErrorFallback} from "@/components/shared/ErrorFallback";

// Setup
setupGlobalErrorHandlers();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  root.render(
    <ErrorFallback error={error} />
  );
}

initializePWA().catch((err) => logger.error('PWA init failed', err));

export default cleanUp;
