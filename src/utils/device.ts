import { DeviceType, PerformanceTier, BREAKPOINTS } from '@/constants/weather';

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

  if (isMobile && (hardwareConcurrency <= 4 || deviceMemory <= 2)) {
    return PerformanceTier.LOW;
  } else if (isMobile) {
    return PerformanceTier.MEDIUM;
  }
  return PerformanceTier.HIGH;
};

export const getOptimalPixelRatio = (): number => {
  return Math.min(window.devicePixelRatio || 1, 2);
};
