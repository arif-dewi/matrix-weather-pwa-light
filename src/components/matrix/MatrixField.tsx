import { useMemo } from 'react';
import { MatrixParticle } from './MatrixParticle';
import { MATRIX_CHARS } from '@/constants/matrix';
import { MOVEMENT_BOUNDS } from '@/constants/weather';
import { MatrixEffectType } from '@/types/weather';
import { isMobileDevice } from '@/utils/device';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { getRandomPosition, getParticleCount } from './helper';

export function MatrixField({ effectType }: { effectType: MatrixEffectType }) {
  const { performanceTier } = usePerformanceOptimization();
  const isMobile = useMemo(() => isMobileDevice(), []);

  const particles = useMemo(() => {
    const chars = MATRIX_CHARS[effectType] ?? MATRIX_CHARS[MatrixEffectType.DEFAULT];
    const count = getParticleCount(effectType, performanceTier);

    const bounds = {
      X: isMobile ? MOVEMENT_BOUNDS.X * MOVEMENT_BOUNDS.MOBILE_SCALE : MOVEMENT_BOUNDS.X,
      Y_TOP: MOVEMENT_BOUNDS.Y_TOP,
      Y_BOTTOM: MOVEMENT_BOUNDS.Y_BOTTOM,
      Z: isMobile ? MOVEMENT_BOUNDS.Z * MOVEMENT_BOUNDS.Z_MOBILE_SCALE : MOVEMENT_BOUNDS.Z
    };

    return Array.from({ length: count }, (_, i) => ({
      id: `particle-${i}`,
      character: chars[Math.floor(Math.random() * chars.length)],
      position: getRandomPosition(bounds),
      effectType
    }));
  }, [effectType, performanceTier, isMobile]);

  return (
    <>
      {particles.map((p) => (
        <MatrixParticle
          key={p.id}
          character={p.character}
          position={p.position}
          effectType={p.effectType}
        />
      ))}
    </>
  );
}