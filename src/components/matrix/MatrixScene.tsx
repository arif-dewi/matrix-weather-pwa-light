import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWeatherStore } from '@/stores/weatherStore';

import { PerformanceTier } from '@/types/weather';
import { isMobileDevice } from '@/utils/device';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { MatrixField } from './MatrixField';
import { LoadingFallback } from '@/components/shared/LoadingFallback';

export function MatrixScene() {
  const { weatherData } = useWeatherStore();
  const matrixEffect = useWeatherStore((s) => s.matrixEffect);
  const { performanceTier } = usePerformanceOptimization();
  const isMobile = isMobileDevice();

  // Canvas settings optimized for different performance tiers
  const canvasSettings = useMemo(() => {
    const baseSettings = {
      camera: {
        position: [0, 0, 20] as [number, number, number],
        fov: 75,
        near: 0.1,
        far: 1000
      },
      gl: {
        alpha: true,
        antialias: performanceTier === PerformanceTier.HIGH,
        powerPreference: performanceTier === PerformanceTier.HIGH ?
          "high-performance" as const :
          "low-power" as const
      },
      style: { background: 'transparent' }
    };

    // Adjust camera for mobile aspect ratios
    if (isMobile) {
      const isPortrait = window.innerHeight > window.innerWidth;
      baseSettings.camera.fov = isPortrait ? 85 : 65;
      baseSettings.camera.position = [0, 0, isPortrait ? 25 : 18];
    }

    return baseSettings;
  }, [performanceTier, isMobile]);

  if (!weatherData) return <LoadingFallback />;

  return (
    <div className="fixed inset-0 w-full h-full z-10">
      <Canvas {...canvasSettings}>
        <Suspense fallback={null}>
          <MatrixField effectType={matrixEffect} />
        </Suspense>
      </Canvas>
    </div>
  );
}
