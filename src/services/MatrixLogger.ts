declare global {
  interface Window {
    workbox?: {
      logger?: {
        debug: (message: string) => void;
        log: (message: string) => void;
        warn: (message: string) => void;
        error: (message: string) => void;
        groupCollapsed: (title: string) => void;
        groupEnd: () => void;
      };
    };
  }
}

class MatrixLogger {
  private workboxLogger = window.workbox?.logger;

  debug(message: string, data?: any) {
    const formatted = `🔍 MATRIX DEBUG: ${message}`;
    if (this.workboxLogger) {
      this.workboxLogger.debug(formatted);
    } else {
      console.debug(formatted, data);
    }
  }

  info(message: string, data?: any) {
    const formatted = `ℹ️ MATRIX INFO: ${message}`;
    if (this.workboxLogger) {
      this.workboxLogger.log(formatted);
    } else {
      console.log(formatted, data);
    }
  }

  warn(message: string, data?: any) {
    const formatted = `⚠️ MATRIX WARNING: ${message}`;
    if (this.workboxLogger) {
      this.workboxLogger.warn(formatted);
    } else {
      console.warn(formatted, data);
    }
  }

  error(message: string, data?: any) {
    const formatted = `❌ MATRIX ERROR: ${message}`;
    if (this.workboxLogger) {
      this.workboxLogger.error(formatted);
    } else {
      console.error(formatted, data);
    }
  }

  success(message: string, data?: any) {
    const formatted = `✅ MATRIX SUCCESS: ${message}`;
    if (this.workboxLogger) {
      this.workboxLogger.log(formatted);
    } else {
      console.log(formatted, data);
    }
  }

  group(title: string) {
    const formatted = `🚀 MATRIX GROUP: ${title}`;
    if (this.workboxLogger) {
      this.workboxLogger.groupCollapsed(formatted);
    } else {
      console.groupCollapsed(formatted);
    }
  }

  groupEnd() {
    if (this.workboxLogger) {
      this.workboxLogger.groupEnd();
    } else {
      console.groupEnd();
    }
  }
}

export const logger = new MatrixLogger();
