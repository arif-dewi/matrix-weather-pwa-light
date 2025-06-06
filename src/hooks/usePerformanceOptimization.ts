// src/hooks/usePerformanceOptimization.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPerformanceTier, isMobileDevice } from '@/utils/device';
import { PerformanceTier } from '@/types/weather';
import { logger } from '@/services/MatrixLogger';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

interface PerformanceConfig {
  targetFPS: number;
  maxParticles: number;
  enableAnimations: boolean;
  enableShadows: boolean;
  enableAntialiasing: boolean;
  particleUpdateInterval: number;
}

const PERFORMANCE_CONFIGS: Record<PerformanceTier, PerformanceConfig> = {
  [PerformanceTier.HIGH]: {
    targetFPS: 60,
    maxParticles: 150,
    enableAnimations: true,
    enableShadows: true,
    enableAntialiasing: true,
    particleUpdateInterval: 16,
  },
  [PerformanceTier.MEDIUM]: {
    targetFPS: 45,
    maxParticles: 100,
    enableAnimations: true,
    enableShadows: false,
    enableAntialiasing: true,
    particleUpdateInterval: 33,
  },
  [PerformanceTier.LOW]: {
    targetFPS: 30,
    maxParticles: 75,
    enableAnimations: true,
    enableShadows: false,
    enableAntialiasing: false,
    particleUpdateInterval: 50,
  },
};

export const usePerformanceOptimization = () => {
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>(getPerformanceTier());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const animationFrameId = useRef<number>();

  // Dynamic performance adjustment
  const adjustPerformance = useCallback((currentFPS: number) => {
    const targetFPS = PERFORMANCE_CONFIGS[performanceTier].targetFPS;

    if (currentFPS < targetFPS * 0.7) {
      // Performance is poor, downgrade tier
      if (performanceTier === PerformanceTier.HIGH) {
        setPerformanceTier(PerformanceTier.MEDIUM);
        logger.warn('Performance downgraded to MEDIUM tier');
      } else if (performanceTier === PerformanceTier.MEDIUM) {
        setPerformanceTier(PerformanceTier.LOW);
        logger.warn('Performance downgraded to LOW tier');
      }
    } else if (currentFPS > targetFPS * 1.2 && performanceTier !== PerformanceTier.HIGH) {
      // Performance is good, potentially upgrade tier
      if (performanceTier === PerformanceTier.LOW) {
        setPerformanceTier(PerformanceTier.MEDIUM);
        logger.info('Performance upgraded to MEDIUM tier');
      } else if (performanceTier === PerformanceTier.MEDIUM) {
        setPerformanceTier(PerformanceTier.HIGH);
        logger.info('Performance upgraded to HIGH tier');
      }
    }
  }, [performanceTier]);

  // FPS monitoring
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCount.current++;

    const elapsed = now - lastTime.current;

    if (elapsed >= 1000) { // Update every second
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      const frameTime = elapsed / frameCount.current;

      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 10) {
        fpsHistory.current.shift();
      }

      const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;

      setMetrics({
        fps: Math.round(avgFPS),
        frameTime: Math.round(frameTime * 100) / 100,
        memoryUsage: getMemoryUsage(),
      });

      // Adjust performance based on FPS
      adjustPerformance(avgFPS);

      frameCount.current = 0;
      lastTime.current = now;
    }

    animationFrameId.current = requestAnimationFrame(measureFPS);
  }, [adjustPerformance]);

  // Memory usage monitoring
  const getMemoryUsage = (): number | undefined => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return undefined;
  };

  // Start monitoring on mount
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [measureFPS]);

  // Detect performance tier changes due to thermal throttling or battery state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App is in background, reduce performance
        if (performanceTier !== PerformanceTier.LOW) {
          logger.info('App backgrounded, reducing performance');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [performanceTier]);

  const config = PERFORMANCE_CONFIGS[performanceTier];

  return {
    performanceTier,
    metrics,
    config,
    isMobile: isMobileDevice(),
  };
};
