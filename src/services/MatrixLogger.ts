import { env } from '@/config/env';

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

type Operation = 'debug' | 'info' | 'warn' | 'error' | 'success';
type ConsoleFunction = 'debug' | 'log' | 'warn' | 'error';


const emojiPrefixMap: Record<Operation, string> = {
  debug: '🔍 MATRIX DEBUG:',
  info: 'ℹ️ MATRIX INFO:',
  warn: '⚠️ MATRIX WARNING:',
  error: '❌ MATRIX ERROR:',
  success: '✅ MATRIX SUCCESS:',
};

const workboxFnMap: Record<Operation, ConsoleFunction> = {
  debug: 'debug',
  info: 'log',
  warn: 'warn',
  error: 'error',
  success: 'log',
};

const consoleFnMap: Record<Operation, ConsoleFunction> = {
  debug: 'debug',
  info: 'log',
  warn: 'warn',
  error: 'error',
  success: 'log',
};

class MatrixLogger {
  private get logger() {
    return window.workbox?.logger;
  }

  private log(operation: Operation, message: string, data?: any) {
    const formatted = `${emojiPrefixMap[operation]} ${message}`;

    const wbLogger = this.logger;
    const wbFunction = wbLogger?.[workboxFnMap[operation]];
    if (typeof wbFunction === 'function') {
      wbFunction(formatted);
      return;
    }

    if (env.isDevelopment) {
      const consoleFn = console[consoleFnMap[operation]];
      if (typeof consoleFn === 'function') {
        consoleFn(formatted, data);
      }
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  success(message: string, data?: any) {
    this.log('success', message, data);
  }

  group(title: string) {
    const formatted = `🚀 MATRIX GROUP: ${title}`;
    const wbGroup = this.logger?.groupCollapsed;

    if (typeof wbGroup === 'function') {
      wbGroup(formatted);
    } else if (env.isDevelopment) {
      console.groupCollapsed(formatted);
    }
  }

  groupEnd() {
    const wbEnd = this.logger?.groupEnd;

    if (typeof wbEnd === 'function') {
      wbEnd();
    } else if (env.isDevelopment) {
      console.groupEnd();
    }
  }
}

export const logger = new MatrixLogger();
