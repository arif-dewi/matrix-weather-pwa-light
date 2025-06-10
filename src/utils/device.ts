import { PERFORMANCE_DEFAULT, PERFORMANCE_THRESHOLDS } from '@/constants/device';
import { PerformanceTier } from '@/types/device';

/**
 * Device detection utilities using proper enums and constants
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getPerformanceTier = (): PerformanceTier => {
  const isMobile = isMobileDevice();
  const hardwareConcurrency = navigator.hardwareConcurrency || PERFORMANCE_DEFAULT.HARDWARE_CONCURRENCY;
  const deviceMemory: number = 'deviceMemory' in navigator ? navigator.deviceMemory as number : PERFORMANCE_DEFAULT.MEMORY;

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
