import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MatrixParticle } from './MatrixParticle';
import { useWeatherStore } from '@/stores/weatherStore';
import { MATRIX_CHARS } from '@/constants/matrix';
import {
  PARTICLE_COUNTS,
  EFFECT_MULTIPLIERS,
  MOVEMENT_BOUNDS
} from '@/constants/weather';
import { MatrixEffectType, PerformanceTier } from '@/types/weather';
import { isMobileDevice } from '@/utils/device';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

function MatrixField({ effectType }: { effectType: MatrixEffectType }) {
  const { performanceTier } = usePerformanceOptimization();

  const particles = useMemo(() => {
    const chars = MATRIX_CHARS[effectType] || MATRIX_CHARS[MatrixEffectType.DEFAULT];

    // Get base particle count based on performance
    let baseCount: number;
    switch (performanceTier) {
      case PerformanceTier.LOW:
        baseCount = PARTICLE_COUNTS.LOW_END;
        break;
      case PerformanceTier.MEDIUM:
        baseCount = PARTICLE_COUNTS.MEDIUM;
        break;
      case PerformanceTier.HIGH:
      default:
        baseCount = PARTICLE_COUNTS.BASE;
        break;
    }

    // Apply effect-specific multiplier
    const multiplier = EFFECT_MULTIPLIERS[effectType];
    const particleCount = Math.floor(baseCount * multiplier);

    return Array.from({ length: particleCount }, (_, i) => {
      const character = chars[Math.floor(Math.random() * chars.length)];

      // Adjust bounds for mobile screens
      const isMobile = isMobileDevice();
      const bounds = {
        X: isMobile ? MOVEMENT_BOUNDS.X * MOVEMENT_BOUNDS.MOBILE_SCALE : MOVEMENT_BOUNDS.X,
        Y_TOP: MOVEMENT_BOUNDS.Y_TOP,
        Y_BOTTOM: MOVEMENT_BOUNDS.Y_BOTTOM,
        Z: isMobile ? MOVEMENT_BOUNDS.Z * MOVEMENT_BOUNDS.Z_MOBILE_SCALE : MOVEMENT_BOUNDS.Z
      };

      const position: [number, number, number] = [
        (Math.random() - 0.5) * bounds.X,
        Math.random() * (bounds.Y_TOP - bounds.Y_BOTTOM) + bounds.Y_BOTTOM,
        (Math.random() - 0.5) * bounds.Z
      ];

      return {
        id: `particle-${i}`,
        character,
        position,
        effectType
      };
    });
  }, [effectType]);

  return (
    <>
      {particles.map((particle) => (
        <MatrixParticle
          key={particle.id}
          character={particle.character}
          position={particle.position}
          effectType={particle.effectType}
        />
      ))}
    </>
  );
}

const LoadingFallback = () => (
  <div className="loading-display">
    <div className="loading-card">
      <div className="loading-title">Loading Matrix...</div>
    </div>
  </div>
);

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
