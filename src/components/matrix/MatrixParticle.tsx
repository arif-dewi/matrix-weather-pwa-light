import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATRIX_CONFIG, WEATHER_VISUAL_SETTINGS } from '@/constants/matrix';
import { MatrixEffectType } from '@/types/weather';
import {
  FRAME_RATES,
  OPACITY,
} from '@/constants/weather';
import { isMobileDevice } from '@/utils/device';
import { createCharacterTexture, updateParticlePosition } from './helper';
import { AnimationData } from "./types";

export interface MatrixParticleProps {
  character: string;
  position: [number, number, number];
  effectType: MatrixEffectType;
}

export function MatrixParticle({ character, position, effectType }: MatrixParticleProps) {
  const meshRef = useRef<THREE.Sprite>(null);
  const settings = WEATHER_VISUAL_SETTINGS[effectType];
  const isMobile = isMobileDevice();

  const texture = useMemo(() => createCharacterTexture(character, settings.color, isMobile), [character, settings.color, isMobile]);

  const animationData = useRef<AnimationData>({
    originalPosition: position,
    floatPhase: Math.random() * Math.PI * 2,
    floatSpeed: MATRIX_CONFIG.FLOAT_FREQUENCY,
    fallSpeed: 0,
    isDroppingType: [MatrixEffectType.RAIN, MatrixEffectType.SNOW].includes(effectType),
    lastUpdateTime: 0,
    updateInterval: FRAME_RATES.UPDATE_INTERVAL_MS.NORMAL
  });

  const phaseRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    delta = Math.min(delta, 0.05);
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() + phaseRef.current;
    const data = animationData.current;

    if (isMobile && time - data.lastUpdateTime < data.updateInterval / 1000) return;
    data.lastUpdateTime = time;

    updateParticlePosition(meshRef.current, data, effectType, settings, time, delta, isMobile);
  });

  useEffect(() => () => texture.dispose(), [texture]);

  const scale = settings.symbolScale * (isMobile ? 1.8 : 2.0);
  const opacity = isMobile ? OPACITY.STRONG : MATRIX_CONFIG.OPACITY;

  return (
    <sprite ref={meshRef} position={position} scale={[scale, scale, scale]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthTest={false}
      />
    </sprite>
  );
}