import * as THREE from "three";
import {
  ANIMATION_SPEEDS,
  CANVAS_SETTINGS,
  EFFECT_MULTIPLIERS,
  MOVEMENT_BOUNDS,
  PARTICLE_COUNTS
} from "@/constants/weather.ts";
import { MATRIX_CONFIG } from "@/constants/matrix.ts";
import { getOptimalPixelRatio } from "@/utils/device.ts";
import {MatrixEffectType, PerformanceTier} from "@/types/weather.ts";
import { AnimationData } from "./types.ts";

export function createCharacterTexture(character: string, color: string, isMobile: boolean): THREE.Texture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const canvasSize = isMobile ? CANVAS_SETTINGS.SIZE.MOBILE : CANVAS_SETTINGS.SIZE.DESKTOP;
  const fontSize = isMobile ? CANVAS_SETTINGS.FONT_SIZE.MOBILE : CANVAS_SETTINGS.FONT_SIZE.DESKTOP;
  const shadowBlur = isMobile ? 8 : MATRIX_CONFIG.SHADOW_BLUR;

  canvas.width = canvas.height = canvasSize;
  const scale = Math.min(getOptimalPixelRatio(), CANVAS_SETTINGS.SCALE_FACTOR.MAX_DPI);
  ctx.scale(scale, scale);

  ctx.font = `bold ${fontSize / scale}px ${MATRIX_CONFIG.FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = shadowBlur;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(character, canvasSize / (2 * scale), canvasSize / (2 * scale));

  const texture = new THREE.CanvasTexture(canvas);
  if (isMobile) {
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }
  return texture;
}

export function updateParticlePosition(
  mesh: THREE.Sprite,
  data: AnimationData,
  effectType: MatrixEffectType,
  settings: any,
  time: number,
  delta: number,
  isMobile: boolean
) {
  const speed = settings.speedFactor * 1.5;
  const dampening = 1;

  const randomizePosition = () => {
    mesh.position.y = MOVEMENT_BOUNDS.Y_TOP;
    mesh.position.x = (Math.random() - 0.5) * MOVEMENT_BOUNDS.X;
    mesh.position.z = (Math.random() - 0.5) * MOVEMENT_BOUNDS.Z;
  };

  switch (effectType) {
    case MatrixEffectType.SUN:
      mesh.position.x = data.originalPosition[0] + Math.sin(data.floatPhase + time * ANIMATION_SPEEDS.SLOW) * 2 * dampening;
      mesh.position.y = data.originalPosition[1] + Math.cos(data.floatPhase + time * 0.7) * 1.5 * dampening;
      break;
    case MatrixEffectType.RAIN:
      mesh.position.y -= 5 * delta * speed;
      if (mesh.position.y < MOVEMENT_BOUNDS.Y_BOTTOM) randomizePosition();
      break;
    case MatrixEffectType.SNOW:
      mesh.position.y -= 0.6 * delta * speed;
      mesh.position.x += Math.sin(time + data.floatPhase) * 0.01 * dampening;
      if (mesh.position.y < MOVEMENT_BOUNDS.Y_BOTTOM) randomizePosition();
      break;
    case MatrixEffectType.WIND:
      mesh.position.x = data.originalPosition[0] + Math.sin(time * ANIMATION_SPEEDS.FAST + data.floatPhase) * 3 * dampening;
      mesh.position.y = data.originalPosition[1] + Math.cos(time * 1.5 + data.floatPhase) * 2 * dampening;
      break;
    case MatrixEffectType.STORM:
      const stormIntensity = isMobile ? 0.6 : 1;
      mesh.position.x = data.originalPosition[0] + Math.sin(time * ANIMATION_SPEEDS.CHAOTIC + data.floatPhase) * 4 * stormIntensity;
      mesh.position.y = data.originalPosition[1] + Math.cos(time * 2.5 + data.floatPhase) * 3 * stormIntensity;
      mesh.position.z = data.originalPosition[2] + Math.sin(time * ANIMATION_SPEEDS.FAST + data.floatPhase) * 2 * stormIntensity;
      break;
    case MatrixEffectType.FOG:
      mesh.position.x = data.originalPosition[0] + Math.sin(time * ANIMATION_SPEEDS.VERY_SLOW + data.floatPhase) * 1.5 * dampening;
      mesh.position.y = data.originalPosition[1] + Math.cos(time * ANIMATION_SPEEDS.VERY_SLOW * 0.7 + data.floatPhase) * 0.8 * dampening;
      break;
    case MatrixEffectType.CLOUD:
      mesh.position.x = data.originalPosition[0] + Math.sin(time * data.floatSpeed + data.floatPhase) * MATRIX_CONFIG.FLOAT_AMPLITUDE * dampening;
      mesh.position.y = data.originalPosition[1] + Math.cos(time * data.floatSpeed * 0.7 + data.floatPhase) * dampening;
      break;
    case MatrixEffectType.DEFAULT:
    default:
      mesh.position.x = data.originalPosition[0] + Math.sin(data.floatPhase += delta * data.floatSpeed) * MATRIX_CONFIG.FLOAT_AMPLITUDE * dampening;
      mesh.position.y = data.originalPosition[1] + Math.cos(time * data.floatSpeed * 0.7 + data.floatPhase) * dampening;
      mesh.position.z = data.originalPosition[2] + Math.sin(time * data.floatSpeed * 0.5 + data.floatPhase) * 0.8 * dampening;
      break;
  }
}

export function getParticleCount(effectType: MatrixEffectType, tier: PerformanceTier): number {
  const base = {
    [PerformanceTier.LOW]: PARTICLE_COUNTS.LOW_END,
    [PerformanceTier.MEDIUM]: PARTICLE_COUNTS.MEDIUM,
    [PerformanceTier.HIGH]: PARTICLE_COUNTS.BASE
  }[tier];

  const multiplier = EFFECT_MULTIPLIERS[effectType] ?? 1;
  return Math.floor(base * multiplier);
}

export function getRandomPosition(bounds: {
  X: number;
  Y_TOP: number;
  Y_BOTTOM: number;
  Z: number;
}): [number, number, number] {
  return [
    (Math.random() - 0.5) * bounds.X,
    Math.random() * (bounds.Y_TOP - bounds.Y_BOTTOM) + bounds.Y_BOTTOM,
    (Math.random() - 0.5) * bounds.Z
  ];
}
