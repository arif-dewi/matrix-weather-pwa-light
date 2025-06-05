import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

console.log('✅ React render called!');