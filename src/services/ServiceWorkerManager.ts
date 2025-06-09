// src/services/ServiceWorkerManager.ts
import { useNotificationStore } from '@/stores/notificationStore';
import { logger } from './MatrixLogger';

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private checkInterval: NodeJS.Timeout | null = null;

  async initialize() {
    if (!('serviceWorker' in navigator)) {
      logger.warn('Service Workers not supported in this browser');
      this.showNotification('Service Workers not supported in this browser', 'warning');
      return;
    }

    logger.group('Service Worker Initialization');

    try {
      // Register service worker - let VitePWA handle the path
      this.registration = await navigator.serviceWorker.register(
        import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/sw.js',
        {
          scope: '/',
          type: 'classic'
        }
      );

      logger.success('Matrix Weather Service Worker registered');
      logger.debug(`Registration scope: ${this.registration.scope}`);

      // Set up event listeners
      this.setupEventListeners();

      // Check for existing updates
      if (this.registration.waiting) {
        logger.info('Update already waiting, handling immediately');
        this.handleUpdate();
      }

      // Start periodic update checks (every 5 minutes) - only in production
      if (import.meta.env.PROD) {
        this.startPeriodicUpdateChecks();
        logger.debug('Periodic update checks enabled (production mode)');
      } else {
        logger.debug('Periodic update checks disabled (development mode)');
      }

      // Show offline ready notification
      this.showNotification('Matrix Weather ready to work offline!', 'success');

    } catch (error) {
      logger.error('Service Worker registration failed', error);

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('MIME type')) {
          logger.warn('Service Worker MIME type issue - this is normal in development');
          if (import.meta.env.DEV) {
            this.showNotification('Service Worker disabled in development', 'info');
            return;
          }
        }
      }

      this.showNotification('Service Worker registration failed', 'error');
    } finally {
      logger.groupEnd();
    }
  }

  private setupEventListeners() {
    if (!this.registration) return;

    logger.debug('Setting up Service Worker event listeners');

    // Listen for updates
    this.registration.addEventListener('updatefound', () => {
      logger.info('Service Worker update found');
      const newWorker = this.registration?.installing;

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          logger.debug(`New worker state: ${newWorker.state}`);
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.handleUpdate();
          }
        });
      }
    });

    // Listen for network status changes
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Listen for app installation events
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));
    window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
  }

  private handleUpdate() {
    logger.info('Handling Service Worker update');
    this.showUpdatePrompt();
  }

  private showUpdatePrompt() {
    logger.group('Update Prompt');

    // Show notification about update availability
    this.showNotification(
      'New Matrix Weather version available! Click to update.',
      'info',
      10000
    );

    // Also show confirm dialog for immediate action
    const shouldUpdate = confirm(
      '🔄 Matrix Weather Update Available!\n\n' +
      '• Performance improvements\n' +
      '• Enhanced matrix effects\n' +
      '• Bug fixes\n\n' +
      'Update now to get the latest features?'
    );

    if (shouldUpdate) {
      logger.info('User accepted update');
      this.applyUpdate();
    } else {
      logger.info('User postponed update');
      this.showNotification('Update postponed. Refresh manually to update later.', 'info');
    }

    logger.groupEnd();
  }

  private applyUpdate() {
    if (!this.registration?.waiting) return;

    logger.info('Applying Matrix Weather update');
    this.showNotification('Applying Matrix Weather update...', 'info');

    // Tell the waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Listen for the controlling change and reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      logger.success('Matrix Weather updated successfully - reloading');
      this.showNotification('Matrix Weather updated successfully!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  private async checkForUpdates() {
    if (!this.registration) return;

    try {
      await this.registration.update();
      logger.debug('Update check completed');
    } catch (error) {
      logger.warn('Update check failed', error);
    }
  }

  private startPeriodicUpdateChecks() {
    // Check for updates every 5 minutes
    this.checkInterval = setInterval(() => {
      logger.debug('Running periodic update check');
      this.checkForUpdates();
    }, 5 * 60 * 1000);

    logger.info('Periodic update checks started (5 minute interval)');
  }

  private stopPeriodicUpdateChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.debug('Periodic update checks stopped');
    }
  }

  private handleOnline() {
    logger.success('Matrix Weather back online');
    this.showNotification('Connection restored - Matrix Weather back online', 'success');
  }

  private handleOffline() {
    logger.info('Matrix Weather working offline');
    this.showNotification('Working offline - Using cached data', 'info');
  }

  private handleBeforeInstallPrompt(e: Event) {
    e.preventDefault();
    logger.info('Matrix Weather can be installed as PWA');
    this.showNotification('Matrix Weather can be installed as an app!', 'info', 6000);

    // Store the event for later use (could be used for custom install button)
    (window as any).deferredInstallPrompt = e;
  }

  private handleAppInstalled() {
    logger.success('Matrix Weather PWA installed successfully');
    this.showNotification('Matrix Weather installed successfully!', 'success');
    (window as any).deferredInstallPrompt = null;
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { data } = event;

    logger.group('Service Worker Message');
    logger.debug(`Message type: ${data.type}`, data);

    switch (data.type) {
      case 'CACHE_UPDATED':
        logger.info(`Cache updated: ${data.payload.updatedURL}`);
        break;
      case 'OFFLINE_FALLBACK':
        logger.warn('Using offline fallback');
        this.showNotification('Using cached weather data', 'info');
        break;
      default:
        logger.debug('Unknown service worker message', data);
    }

    logger.groupEnd();
  }

  private showNotification(
    message: string,
    type: 'success' | 'info' | 'warning' | 'error',
    duration?: number
  ) {
    // Use React notification store
    const { addNotification } = useNotificationStore.getState();
    addNotification(message, type, duration);

    // Log the notification with appropriate level
    switch (type) {
      case 'success':
        logger.success(`Notification: ${message}`);
        break;
      case 'info':
        logger.info(`Notification: ${message}`);
        break;
      case 'warning':
        logger.warn(`Notification: ${message}`);
        break;
      case 'error':
        logger.error(`Notification: ${message}`);
        break;
    }
  }

  public destroy() {
    logger.info('Destroying Service Worker Manager');
    this.stopPeriodicUpdateChecks();

    // Remove event listeners
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));
    window.removeEventListener('appinstalled', this.handleAppInstalled.bind(this));

    this.registration = null;

    logger.success('Service Worker Manager destroyed');
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Initialize PWA features after app renders
export const initializePWA = async () => {
  try {
    await serviceWorkerManager.initialize();
    logger.success('PWA initialized successfully');

    // Export for debugging in development
    if (import.meta.env.DEV) {
      (window as any).serviceWorkerManager = serviceWorkerManager;
    }
  } catch (error) {
    logger.error('PWA initialization failed', error);
  }
};