// src/services/ServiceWorkerManager.ts
import { useNotificationStore } from '@/stores/notificationStore';

export class ServiceWorkerManager {
  private updateAvailable = false;
  private registration: ServiceWorkerRegistration | null = null;
  private checkInterval: NodeJS.Timeout | null = null;

  async initialize() {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Workers not supported in this browser');
      this.showNotification('Service Workers not supported in this browser', 'warning');
      return;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('🚀 Matrix Weather Service Worker registered');

      // Set up event listeners
      this.setupEventListeners();

      // Check for existing updates
      if (this.registration.waiting) {
        this.handleUpdate();
      }

      // Start periodic update checks (every 5 minutes)
      this.startPeriodicUpdateChecks();

      // Show offline ready notification
      this.showNotification('Matrix Weather ready to work offline!', 'success');

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      this.showNotification('Service Worker registration failed', 'error');
    }
  }

  private setupEventListeners() {
    if (!this.registration) return;

    // Listen for updates
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration?.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
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
    this.updateAvailable = true;
    this.showUpdatePrompt();
  }

  private showUpdatePrompt() {
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
      this.applyUpdate();
    } else {
      this.showNotification('Update postponed. Refresh manually to update later.', 'info');
    }
  }

  private applyUpdate() {
    if (!this.registration?.waiting) return;

    this.showNotification('Applying Matrix Weather update...', 'info');

    // Tell the waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Listen for the controlling change and reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
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
      console.log('🔄 Checked for updates');
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }

  private startPeriodicUpdateChecks() {
    // Check for updates every 5 minutes
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, 5 * 60 * 1000);
  }

  private stopPeriodicUpdateChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private handleOnline() {
    console.log('🌐 Matrix Weather back online');
    this.showNotification('Connection restored - Matrix Weather back online', 'success');
  }

  private handleOffline() {
    console.log('📡 Matrix Weather working offline');
    this.showNotification('Working offline - Using cached data', 'info');
  }

  private handleBeforeInstallPrompt(e: Event) {
    e.preventDefault();
    console.log('💾 Matrix Weather can be installed');
    this.showNotification('Matrix Weather can be installed as an app!', 'info', 6000);

    // Store the event for later use (could be used for custom install button)
    (window as any).deferredInstallPrompt = e;
  }

  private handleAppInstalled() {
    console.log('🎉 Matrix Weather installed successfully');
    this.showNotification('Matrix Weather installed successfully!', 'success');
    (window as any).deferredInstallPrompt = null;
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { data } = event;

    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log(`Cache updated: ${data.payload.updatedURL}`);
        break;
      case 'OFFLINE_FALLBACK':
        this.showNotification('Using cached weather data', 'info');
        break;
      default:
        console.log('Service Worker message:', data);
    }
  }

  private showNotification(
    message: string,
    type: 'success' | 'info' | 'warning' | 'error',
    duration?: number
  ) {
    // Use React notification store
    const { addNotification } = useNotificationStore.getState();
    addNotification(message, type, duration);

    // Also log to console with Matrix-style formatting
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    };
    console.log(`${icons[type]} MATRIX SYSTEM: ${message}`);
  }

  // Public methods for external use
  public async manualUpdate() {
    await this.checkForUpdates();
  }

  public forceUpdate() {
    if (this.updateAvailable && this.registration?.waiting) {
      this.applyUpdate();
    } else {
      this.showNotification('No updates available', 'info');
    }
  }

  public getStatus() {
    return {
      updateAvailable: this.updateAvailable,
      registration: this.registration,
      isSupported: 'serviceWorker' in navigator
    };
  }

  public async unregister() {
    if (this.registration) {
      this.stopPeriodicUpdateChecks();
      const success = await this.registration.unregister();
      if (success) {
        this.showNotification('Service Worker unregistered', 'info');
      }
      return success;
    }
    return false;
  }

  public destroy() {
    this.stopPeriodicUpdateChecks();

    // Remove event listeners
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));
    window.removeEventListener('appinstalled', this.handleAppInstalled.bind(this));

    this.registration = null;
    this.updateAvailable = false;
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Initialize PWA features after app renders
export const initializePWA = async () => {
  try {
    await serviceWorkerManager.initialize();
    console.log('🚀 PWA initialized successfully');

    // Export for debugging in development
    if (import.meta.env.DEV) {
      (window as any).serviceWorkerManager = serviceWorkerManager;
    }
  } catch (error) {
    console.error('❌ PWA initialization failed:', error);
  }
};