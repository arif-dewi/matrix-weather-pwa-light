import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MatrixEffectType } from '@/types/weather';
import { MATRIX_CONFIG, WEATHER_VISUAL_SETTINGS } from '@/constants/matrix';

interface MatrixParticleProps {
  character: string;
  position: [number, number, number];
  effectType: MatrixEffectType;
}

export function MatrixParticle({ character, position, effectType }: MatrixParticleProps) {
  const meshRef = useRef<THREE.Sprite>(null);
  const settings = WEATHER_VISUAL_SETTINGS[effectType];

  // Create texture for the character
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = canvas.height = MATRIX_CONFIG.CANVAS_SIZE;
    ctx.scale(2, 2);
    ctx.font = `bold ${MATRIX_CONFIG.FONT_SIZE}px ${MATRIX_CONFIG.FONT_FAMILY}`;
    ctx.fillStyle = settings.color;
    ctx.shadowColor = settings.color;
    ctx.shadowBlur = MATRIX_CONFIG.SHADOW_BLUR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, MATRIX_CONFIG.CANVAS_SIZE / 4, MATRIX_CONFIG.CANVAS_SIZE / 4);

    return new THREE.CanvasTexture(canvas);
  }, [character, settings.color]);

  // Animation state
  const animationData = useRef({
    originalPosition: position,
    floatPhase: Math.random() * Math.PI * 2,
    floatSpeed: MATRIX_CONFIG.FLOAT_FREQUENCY,
    fallSpeed: 0,
    isDroppingType: ['rain', 'snow'].includes(effectType)
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const data = animationData.current;
    const speed = settings.speedFactor;

    switch (effectType) {
      case 'sun':
        // Orbital motion
        meshRef.current.position.x = data.originalPosition[0] + Math.sin(time * 0.5 + data.floatPhase) * 2;
        meshRef.current.position.y = data.originalPosition[1] + Math.cos(time * 0.7 + data.floatPhase) * 1.5;
        break;

      case 'rain':
        // Vertical fall
        meshRef.current.position.y -= 0.3 * speed;
        if (meshRef.current.position.y < MATRIX_CONFIG.BOUNDS.Y_BOTTOM) {
          meshRef.current.position.y = MATRIX_CONFIG.BOUNDS.Y_TOP;
        }
        break;

      case 'snow':
        // Slow fall with drift
        meshRef.current.position.y -= 0.1 * speed;
        meshRef.current.position.x += Math.sin(time + data.floatPhase) * 0.02;
        if (meshRef.current.position.y < MATRIX_CONFIG.BOUNDS.Y_BOTTOM) {
          meshRef.current.position.y = MATRIX_CONFIG.BOUNDS.Y_TOP;
        }
        break;

      case 'wind':
        // Horizontal motion with turbulence
        meshRef.current.position.x = data.originalPosition[0] + Math.sin(time * 2 + data.floatPhase) * 3;
        meshRef.current.position.y = data.originalPosition[1] + Math.cos(time * 1.5 + data.floatPhase) * 2;
        break;

      case 'storm':
        // Chaotic motion
        meshRef.current.position.x = data.originalPosition[0] + Math.sin(time * 3 + data.floatPhase) * 4;
        meshRef.current.position.y = data.originalPosition[1] + Math.cos(time * 2.5 + data.floatPhase) * 3;
        meshRef.current.position.z = data.originalPosition[2] + Math.sin(time * 2 + data.floatPhase) * 2;
        break;

      default:
        // Gentle floating
        meshRef.current.position.x = data.originalPosition[0] + Math.sin(time * data.floatSpeed + data.floatPhase) * MATRIX_CONFIG.FLOAT_AMPLITUDE;
        meshRef.current.position.y = data.originalPosition[1] + Math.cos(time * data.floatSpeed * 0.7 + data.floatPhase) * 1.0;
        meshRef.current.position.z = data.originalPosition[2] + Math.sin(time * data.floatSpeed * 0.5 + data.floatPhase) * 0.8;
        break;
    }
  });

  // Cleanup texture
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <sprite
      ref={meshRef}
      position={position}
      scale={[settings.symbolScale, settings.symbolScale, settings.symbolScale]}
    >
      <spriteMaterial
        map={texture}
        transparent
        opacity={MATRIX_CONFIG.OPACITY}
        depthTest={false}
      />
    </sprite>
  );
}