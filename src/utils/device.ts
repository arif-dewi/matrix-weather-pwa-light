import { BREAKPOINTS, PERFORMANCE_THRESHOLDS } from '@/constants/device.ts';
import { DeviceType, PerformanceTier } from '@/types/device.ts';

/**
 * Device detection utilities using proper enums and constants
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getDeviceType = (): DeviceType => {
  const width = window.innerWidth;

  if (width <= BREAKPOINTS.MOBILE) {
    return DeviceType.MOBILE;
  } else if (width <= BREAKPOINTS.TABLET) {
    return DeviceType.TABLET;
  }
  return DeviceType.DESKTOP;
};

export const getPerformanceTier = (): PerformanceTier => {
  const isMobile = isMobileDevice();
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as any).deviceMemory || 4;

  if (isMobile && (hardwareConcurrency <= PERFORMANCE_THRESHOLDS.LOW_CORES || deviceMemory <= PERFORMANCE_THRESHOLDS.LOW_MEMORY)) {
    return PerformanceTier.LOW;
  } else if (isMobile || hardwareConcurrency <= PERFORMANCE_THRESHOLDS.HIGH_CORES) {
    return PerformanceTier.MEDIUM;
  }
  return PerformanceTier.HIGH;
};

export const getOptimalPixelRatio = (): number => {
  return Math.min(window.devicePixelRatio || 1, 2);
};

// Additional device capability detection
export const getDeviceCapabilities = () => {
  const deviceType = getDeviceType();
  const performanceTier = getPerformanceTier();

  return {
    type: deviceType,
    performanceTier,
    pixelRatio: getOptimalPixelRatio(),
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    deviceMemory: (navigator as any).deviceMemory,
    isMobile: isMobileDevice(),
    isTouch: 'ontouchstart' in window,
    supportsWebGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),
    supportsWebGL2: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!canvas.getContext('webgl2');
      } catch {
        return false;
      }
    })(),
    maxTextureSize: (() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048;
      } catch {
        return 2048;
      }
    })(),
  };
};
