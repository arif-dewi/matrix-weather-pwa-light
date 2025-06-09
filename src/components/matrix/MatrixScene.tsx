import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

import { PerformanceTier } from '@/types/weather';
import {getPerformanceTier, isMobileDevice} from '@/utils/device';
import { MatrixField } from './MatrixField';
import { useWeather } from '@/hooks/useWeather';

const CAMERA = {
  POSITION: {
    DESKTOP: [0, 0, 20],
    MOBILE: {
      PORTRAIT: [0, 0, 25],
      LANDSCAPE: [0, 0, 18]
    }
  },
  FOV: {
    DESKTOP: 75,
    MOBILE: {
      PORTRAIT: 85,
      LANDSCAPE: 65
    },
  },
  NEAR: {
    DESKTOP: 0.1,
    MOBILE: 0.1,
  },
  FAR: {
    DESKTOP: 1000,
    MOBILE: 1000,
  }
}

export function MatrixScene() {
  const { matrixEffect } = useWeather();
  const performanceTier = getPerformanceTier();
  const isMobile = isMobileDevice();

  // Canvas settings optimized for different performance tiers
  const canvasSettings = useMemo(() => {
    const baseSettings = {
      camera: {
        position: CAMERA.POSITION.DESKTOP as [number, number, number],
        fov: CAMERA.FOV.DESKTOP,
        near: CAMERA.NEAR.DESKTOP,
        far: CAMERA.FAR.DESKTOP
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
      baseSettings.camera.fov = isPortrait ? CAMERA.FOV.MOBILE.PORTRAIT : CAMERA.FOV.MOBILE.LANDSCAPE;
      baseSettings.camera.position = CAMERA.POSITION.MOBILE[isPortrait ? 'PORTRAIT' : 'LANDSCAPE'] as [number, number, number];
    }

    return baseSettings;
  }, [performanceTier, isMobile]);

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
