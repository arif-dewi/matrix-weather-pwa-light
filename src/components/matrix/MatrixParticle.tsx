import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MATRIX_CONFIG, WEATHER_VISUAL_SETTINGS } from '@/constants/matrix';
import {
  MatrixEffectType,
  CANVAS_SETTINGS,
  FRAME_RATES,
  ANIMATION_SPEEDS,
  OPACITY,
  MOVEMENT_BOUNDS
} from '@/constants/weather';
import { isMobileDevice, getOptimalPixelRatio } from '@/utils/device';

interface MatrixParticleProps {
  character: string;
  position: [number, number, number];
  effectType: MatrixEffectType;
}

interface AnimationData {
  originalPosition: [number, number, number];
  floatPhase: number;
  floatSpeed: number;
  fallSpeed: number;
  isDroppingType: boolean;
  lastUpdateTime: number;
  updateInterval: number;
}

export function MatrixParticle({ character, position, effectType }: MatrixParticleProps) {
  const meshRef = useRef<THREE.Sprite>(null);
  const settings = WEATHER_VISUAL_SETTINGS[effectType];
  const isMobile = isMobileDevice();

  // Create texture for the character with mobile optimization
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const canvasSize = isMobile ? CANVAS_SETTINGS.SIZE.MOBILE : CANVAS_SETTINGS.SIZE.DESKTOP;
    const fontSize = isMobile ? CANVAS_SETTINGS.FONT_SIZE.MOBILE : CANVAS_SETTINGS.FONT_SIZE.DESKTOP;
    const shadowBlur = isMobile ? 8 : MATRIX_CONFIG.SHADOW_BLUR; // Increased from 5

    canvas.width = canvas.height = canvasSize;

    // Scale for high DPI displays but keep texture size reasonable
    const scale = Math.min(getOptimalPixelRatio(), CANVAS_SETTINGS.SCALE_FACTOR.MAX_DPI);
    ctx.scale(scale, scale);

    ctx.font = `bold ${fontSize / scale}px ${MATRIX_CONFIG.FONT_FAMILY}`;
    ctx.fillStyle = settings.color;
    ctx.shadowColor = settings.color;
    ctx.shadowBlur = shadowBlur;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, canvasSize / (2 * scale), canvasSize / (2 * scale));

    const texture = new THREE.CanvasTexture(canvas);

    // Optimize texture settings for mobile
    if (isMobile) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }

    return texture;
  }, [character, settings.color, isMobile]);

  // Animation state with mobile-optimized performance
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

    // Performance optimization: Skip frames on mobile for smoother experience
    if (isMobile && time - data.lastUpdateTime < data.updateInterval / 1000) {
      return;
    }
    data.lastUpdateTime = time;

    const speed = settings.speedFactor * 1.5;
    const dampening = 1;

    switch (effectType) {
      case MatrixEffectType.SUN:
        // Orbital motion
        meshRef.current.position.x = data.originalPosition[0] +
          Math.sin(data.floatPhase + time * ANIMATION_SPEEDS.SLOW) * 2 * dampening;

        meshRef.current.position.y = data.originalPosition[1] +
          Math.cos(data.floatPhase + time * 0.7) * 1.5 * dampening;
        break;

      case MatrixEffectType.RAIN:
        // Vertical fall
        meshRef.current.position.y -= 5 * delta * speed;

        if (meshRef.current.position.y < MOVEMENT_BOUNDS.Y_BOTTOM) {
          meshRef.current.position.y = MOVEMENT_BOUNDS.Y_TOP;
          meshRef.current.position.x = (Math.random() - 0.5) * MOVEMENT_BOUNDS.X;
          meshRef.current.position.z = (Math.random() - 0.5) * MOVEMENT_BOUNDS.Z;
        }
        break;

      case MatrixEffectType.SNOW:
        // Slow fall with drift
        meshRef.current.position.y -= 0.6 * delta * speed;
        meshRef.current.position.x += Math.sin(time + data.floatPhase) * 0.01 * dampening;

        if (meshRef.current.position.y < MOVEMENT_BOUNDS.Y_BOTTOM) {
          meshRef.current.position.y = MOVEMENT_BOUNDS.Y_TOP;
          meshRef.current.position.x = (Math.random() - 0.5) * MOVEMENT_BOUNDS.X;
          meshRef.current.position.z = (Math.random() - 0.5) * MOVEMENT_BOUNDS.Z;
        }
        break;

      case MatrixEffectType.WIND:
        // Horizontal motion with turbulence
        meshRef.current.position.x = data.originalPosition[0] +
          Math.sin(time * ANIMATION_SPEEDS.FAST + data.floatPhase) * 3 * dampening;
        meshRef.current.position.y = data.originalPosition[1] +
          Math.cos(time * 1.5 + data.floatPhase) * 2 * dampening;
        break;

      case MatrixEffectType.STORM:
        // Chaotic motion (reduced intensity on mobile)
        const stormIntensity = isMobile ? 0.6 : 1;
        meshRef.current.position.x = data.originalPosition[0] +
          Math.sin(time * ANIMATION_SPEEDS.CHAOTIC + data.floatPhase) * 4 * stormIntensity;

        meshRef.current.position.y = data.originalPosition[1] +
          Math.cos(time * 2.5 + data.floatPhase) * 3 * stormIntensity;

        meshRef.current.position.z = data.originalPosition[2] +
          Math.sin(time * ANIMATION_SPEEDS.FAST + data.floatPhase) * 2 * stormIntensity;
        break;

      case MatrixEffectType.FOG:
        // Slow drifting motion
        meshRef.current.position.x = data.originalPosition[0] +
          Math.sin(time * ANIMATION_SPEEDS.VERY_SLOW + data.floatPhase) * 1.5 * dampening;

        meshRef.current.position.y = data.originalPosition[1] +
          Math.cos(time * ANIMATION_SPEEDS.VERY_SLOW * 0.7 + data.floatPhase) * 0.8 * dampening;
        break;

      case MatrixEffectType.CLOUD:
        // Gentle floating with some drift
        meshRef.current.position.x = data.originalPosition[0] +
          Math.sin(time * data.floatSpeed + data.floatPhase) * MATRIX_CONFIG.FLOAT_AMPLITUDE * dampening;

        meshRef.current.position.y = data.originalPosition[1] +
          Math.cos(time * data.floatSpeed * 0.7 + data.floatPhase) * dampening;
        break;

      case MatrixEffectType.DEFAULT:
      default:
        // Gentle floating
        meshRef.current.position.x = data.originalPosition[0] +
          Math.sin(data.floatPhase += delta * data.floatSpeed) * MATRIX_CONFIG.FLOAT_AMPLITUDE * dampening;
        meshRef.current.position.y = data.originalPosition[1] +
          Math.cos(time * data.floatSpeed * 0.7 + data.floatPhase) * dampening;
        meshRef.current.position.z = data.originalPosition[2] +
          Math.sin(time * data.floatSpeed * 0.5 + data.floatPhase) * 0.8 * dampening;
        break;
    }
  });

  // Cleanup texture
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  // Mobile-optimized scale - but keep particles visible
  const scale = settings.symbolScale * (isMobile ? 2 : 2.0); // Removed mobile reduction
  const opacity = isMobile ? OPACITY.STRONG : MATRIX_CONFIG.OPACITY;

  return (
    <sprite
      ref={meshRef}
      position={position}
      scale={[scale, scale, scale]}
    >
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthTest={false}
      />
    </sprite>
  );
}
