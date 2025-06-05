import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MatrixParticle } from './MatrixParticle';
import { useWeatherStore } from '@/stores/weatherStore';
import { MATRIX_CHARS, MATRIX_CONFIG } from '@/constants/matrix';
import type { MatrixEffectType } from '@/types/weather';

function MatrixField({ effectType }: { effectType: MatrixEffectType }) {
  const particles = useMemo(() => {
    const chars = MATRIX_CHARS[effectType] || MATRIX_CHARS.default;
    const particleCount = Math.floor(MATRIX_CONFIG.PARTICLE_COUNT_BASE *
      (effectType === 'storm' ? 3.5 : effectType === 'rain' ? 3 : 2));

    return Array.from({ length: particleCount }, (_, i) => {
      const character = chars[Math.floor(Math.random() * chars.length)];
      const position: [number, number, number] = [
        (Math.random() - 0.5) * MATRIX_CONFIG.BOUNDS.X,
        Math.random() * (MATRIX_CONFIG.BOUNDS.Y_TOP - MATRIX_CONFIG.BOUNDS.Y_BOTTOM) + MATRIX_CONFIG.BOUNDS.Y_BOTTOM,
        (Math.random() - 0.5) * MATRIX_CONFIG.BOUNDS.Z
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
  <div className="fixed inset-0 flex items-center justify-center bg-black">
    <div className="text-matrix-green text-2xl">Loading Matrix...</div>
  </div>
);

export function MatrixScene() {
  const { matrixEffect, isLoading, weatherData } = useWeatherStore();

  if (isLoading || !weatherData) return <LoadingFallback />;

  return (
    <div className="fixed inset-0 w-full h-full z-10">
      <Canvas
        camera={{
          position: [0, 0, 20],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <MatrixField effectType={matrixEffect} />
        </Suspense>
      </Canvas>
    </div>
  );
}