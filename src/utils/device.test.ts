import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isMobileDevice, getPerformanceTier, getOptimalPixelRatio } from '@/utils/device';
import { PerformanceTier } from '@/types/device';
import { PERFORMANCE_THRESHOLDS } from '@/constants/device';

describe('device utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('isMobileDevice', () => {
    it('should detect a mobile user agent', () => {
      vi.stubGlobal('navigator', { userAgent: 'iPhone' });
      expect(isMobileDevice()).toBe(true);
    });

    it('should detect a desktop user agent', () => {
      vi.stubGlobal('navigator', { userAgent: 'Windows NT 10.0' });
      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('getPerformanceTier', () => {
    it('should return LOW for mobile with low specs', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'iPhone',
        hardwareConcurrency: 2,
        deviceMemory: 1,
      });
      expect(getPerformanceTier()).toBe(PerformanceTier.LOW);
    });

    it('should return MEDIUM for mobile with decent specs', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Android',
        hardwareConcurrency: 4,
        deviceMemory: 8,
      });
      expect(getPerformanceTier()).toBe(PerformanceTier.LOW);
    });

    it('should return MEDIUM for desktop with medium cores', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Windows NT',
        hardwareConcurrency: PERFORMANCE_THRESHOLDS.HIGH_CORES,
        deviceMemory: 16,
      });
      expect(getPerformanceTier()).toBe(PerformanceTier.MEDIUM);
    });

    it('should return HIGH for desktop with many cores', () => {
      vi.stubGlobal('navigator', {
        userAgent: 'Windows NT',
        hardwareConcurrency: 16,
        deviceMemory: 32,
      });
      expect(getPerformanceTier()).toBe(PerformanceTier.HIGH);
    });
  });

  describe('getOptimalPixelRatio', () => {
    it('should cap pixel ratio at 2', () => {
      vi.stubGlobal('window', { devicePixelRatio: 3 });
      expect(getOptimalPixelRatio()).toBe(2);
    });

    it('should return real ratio if <= 2', () => {
      vi.stubGlobal('window', { devicePixelRatio: 1.5 });
      expect(getOptimalPixelRatio()).toBe(1.5);
    });

    it('should fallback to 1 if devicePixelRatio is undefined', () => {
      vi.stubGlobal('window', {});
      expect(getOptimalPixelRatio()).toBe(1);
    });
  });
});