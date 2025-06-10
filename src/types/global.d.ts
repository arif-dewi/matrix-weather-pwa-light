import { ServiceWorkerManagerInterface } from '@/types/serviceWorker';

interface WorkboxLogger {
  debug: (message: string) => void;
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  groupCollapsed: (title: string) => void;
  groupEnd: () => void;
}

declare global {
  interface Window {
    deferredInstallPrompt: Event | null;
    serviceWorkerManager: ServiceWorkerManagerInterface,
    workbox?: {
      logger?: WorkboxLogger;
    };
  }
}

declare global {
  interface Navigator {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
    };
  }

  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}