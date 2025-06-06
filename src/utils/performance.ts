import { logger } from '@/services/MatrixLogger';

let perfObserver: PerformanceObserver | null = null;

export function setupPerformanceObserver() {
  if (!('PerformanceObserver' in window)) {
    logger.warn('PerformanceObserver not supported');
    return;
  }

  try {
    perfObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          logger.info(
            `Page load: ${Math.round(navEntry.loadEventEnd - navEntry.fetchStart)}ms`
          );
        }
      });
    });

    perfObserver.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    logger.warn('Failed to initialize PerformanceObserver', error);
  }
}

export function getPerformanceMetrics() {
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) throw new Error('Navigation timing unavailable');

    const paints = performance.getEntriesByType('paint');
    const firstPaint = paints.find(p => p.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paints.find(p => p.name === 'first-contentful-paint')?.startTime || 0;

    return {
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
      loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      firstPaint: Math.round(firstPaint),
      firstContentfulPaint: Math.round(firstContentfulPaint),
      dnsLookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
      tcpConnect: Math.round(navigation.connectEnd - navigation.connectStart),
      serverResponse: Math.round(navigation.responseEnd - navigation.requestStart),
      domProcessing: Math.round(navigation.domContentLoadedEventStart - navigation.responseEnd)
    };
  } catch (error) {
    logger.warn('Failed to get perf metrics', error);
    return { error: 'Perf metrics unavailable' };
  }
}

export function registerDebugInfo() {
  if (import.meta.env.DEV) {
    (window as any).__MATRIX_WEATHER__ = {
      logger,
      clearStorage: () => {
        localStorage.clear();
        sessionStorage.clear();
        logger.info('Storage cleared');
      },
      performance: getPerformanceMetrics,
      getMemoryUsage: () => {
        const memory = (performance as any).memory;
        return memory ? {
          usedJSHeapSize: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
          totalJSHeapSize: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
          jsHeapSizeLimit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`
        } : { error: 'Memory API unavailable' };
      },
      getDeviceInfo: () => ({
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency ?? 'unknown',
        deviceMemory: (navigator as any).deviceMemory ?? 'unknown',
        connection: (navigator as any).connection?.effectiveType ?? 'unknown',
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      })
    };
    logger.info('🛠️ Dev tools available on window.__MATRIX_WEATHER__');
  }
}