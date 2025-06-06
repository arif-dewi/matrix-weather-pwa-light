import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { initializePWA } from '@/services/ServiceWorkerManager';
import './index.css';

// Initialize the app
const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Root element not found');

// Render the React app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);


// Initialize PWA
initializePWA();