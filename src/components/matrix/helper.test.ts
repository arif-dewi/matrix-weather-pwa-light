import { describe, it, expect } from 'vitest';
import { MatrixEffectType, PerformanceTier } from '@/types/weather';
import { MOVEMENT_BOUNDS } from '@/constants/weather';
import {
  getParticleCount,
  getRandomPosition,
  updateParticlePosition
} from './helper';
import {Sprite} from "three";
import {AnimationData} from "@/components/matrix/types.ts";

describe('Matrix heler', () => {

  describe('getParticleCount', () => {
    const cases = [
      { effect: MatrixEffectType.SUN, tier: PerformanceTier.LOW, expected: 60 },
      { effect: MatrixEffectType.SUN, tier: PerformanceTier.MEDIUM, expected: 80 },
      { effect: MatrixEffectType.SUN, tier: PerformanceTier.HIGH, expected: 120 },

      { effect: MatrixEffectType.CLOUD, tier: PerformanceTier.LOW, expected: 90 },
      { effect: MatrixEffectType.CLOUD, tier: PerformanceTier.MEDIUM, expected: 120 },
      { effect: MatrixEffectType.CLOUD, tier: PerformanceTier.HIGH, expected: 180 },

      { effect: MatrixEffectType.WIND, tier: PerformanceTier.LOW, expected: 82 },
      { effect: MatrixEffectType.WIND, tier: PerformanceTier.MEDIUM, expected: 110 },
      { effect: MatrixEffectType.WIND, tier: PerformanceTier.HIGH, expected: 165 },

      { effect: MatrixEffectType.RAIN, tier: PerformanceTier.LOW, expected: 112 },
      { effect: MatrixEffectType.RAIN, tier: PerformanceTier.MEDIUM, expected: 150 },
      { effect: MatrixEffectType.RAIN, tier: PerformanceTier.HIGH, expected: 225 },

      { effect: MatrixEffectType.SNOW, tier: PerformanceTier.LOW, expected: 97 },
      { effect: MatrixEffectType.SNOW, tier: PerformanceTier.MEDIUM, expected: 130 },
      { effect: MatrixEffectType.SNOW, tier: PerformanceTier.HIGH, expected: 195 },

      { effect: MatrixEffectType.FOG, tier: PerformanceTier.LOW, expected: 75 },
      { effect: MatrixEffectType.FOG, tier: PerformanceTier.MEDIUM, expected: 100 },
      { effect: MatrixEffectType.FOG, tier: PerformanceTier.HIGH, expected: 150 },

      { effect: MatrixEffectType.STORM, tier: PerformanceTier.LOW, expected: 135 },
      { effect: MatrixEffectType.STORM, tier: PerformanceTier.MEDIUM, expected: 180 },
      { effect: MatrixEffectType.STORM, tier: PerformanceTier.HIGH, expected: 270 },

      { effect: MatrixEffectType.DEFAULT, tier: PerformanceTier.LOW, expected: 75 },
      { effect: MatrixEffectType.DEFAULT, tier: PerformanceTier.MEDIUM, expected: 100 },
      { effect: MatrixEffectType.DEFAULT, tier: PerformanceTier.HIGH, expected: 150 },
    ];

    for (const { effect, tier, expected } of cases) {
      it(`should return ${expected} for ${effect} at ${tier} tier`, () => {
        expect(getParticleCount(effect, tier)).toBe(expected);
      });
    }
  });

  describe('getRandomPosition', () => {
    const bounds = {
      X: 40,
      Y_TOP: 15,
      Y_BOTTOM: -15,
      Z: 20
    };

    it('should return a position within the specified bounds', () => {
      const position = getRandomPosition(bounds);
      expect(position[0]).toBeGreaterThanOrEqual(-bounds.X);
      expect(position[0]).toBeLessThanOrEqual(bounds.X);
      expect(position[1]).toBeGreaterThanOrEqual(bounds.Y_BOTTOM);
      expect(position[1]).toBeLessThanOrEqual(bounds.Y_TOP);
      expect(position[2]).toBeGreaterThanOrEqual(-bounds.Z);
      expect(position[2]).toBeLessThanOrEqual(bounds.Z);
    });

    it('should return a position with random values', () => {
      const position1 = getRandomPosition(bounds);
      const position2 = getRandomPosition(bounds);
      expect(position1).not.toEqual(position2);
    });

    it('should return a position with three elements', () => {
      const position = getRandomPosition(bounds);
      expect(position.length).toBe(3);
      expect(position.every(coord => typeof coord === 'number')).toBe(true);
    });

    it('should handle large bounds correctly', () => {
      const largeBounds = { X: 1000, Y_TOP: 500, Y_BOTTOM: -500, Z: 1000 };
      const position = getRandomPosition(largeBounds);
      expect(position[0]).toBeGreaterThanOrEqual(-1000);
      expect(position[0]).toBeLessThanOrEqual(1000);
      expect(position[1]).toBeGreaterThanOrEqual(-500);
      expect(position[1]).toBeLessThanOrEqual(500);
      expect(position[2]).toBeGreaterThanOrEqual(-1000);
      expect(position[2]).toBeLessThanOrEqual(1000);
    });

    it('should handle small bounds correctly', () => {
      const smallBounds = { X: 1, Y_TOP: 0.5, Y_BOTTOM: -0.5, Z: 1 };
      const position = getRandomPosition(smallBounds);
      expect(position[0]).toBeGreaterThanOrEqual(-1);
      expect(position[0]).toBeLessThanOrEqual(1);
      expect(position[1]).toBeGreaterThanOrEqual(-0.5);
      expect(position[1]).toBeLessThanOrEqual(0.5);
      expect(position[2]).toBeGreaterThanOrEqual(-1);
      expect(position[2]).toBeLessThanOrEqual(1);
    });

    it('should handle bounds with floating point numbers', () => {
      const floatBounds = { X: 10.5, Y_TOP: 5.5, Y_BOTTOM: -5.5, Z: 10.5 };
      const position = getRandomPosition(floatBounds);
      expect(position[0]).toBeGreaterThanOrEqual(-10.5);
      expect(position[0]).toBeLessThanOrEqual(10.5);
      expect(position[1]).toBeGreaterThanOrEqual(-5.5);
      expect(position[1]).toBeLessThanOrEqual(5.5);
      expect(position[2]).toBeGreaterThanOrEqual(-10.5);
      expect(position[2]).toBeLessThanOrEqual(10.5);
    });

    it('should handle bounds with large floating point numbers', () => {
      const largeFloatBounds = { X: 10000.5, Y_TOP: 5000.5, Y_BOTTOM: -5000.5, Z: 10000.5 };
      const position = getRandomPosition(largeFloatBounds);
      expect(position[0]).toBeGreaterThanOrEqual(-10000.5);
      expect(position[0]).toBeLessThanOrEqual(10000.5);
      expect(position[1]).toBeGreaterThanOrEqual(-5000.5);
      expect(position[1]).toBeLessThanOrEqual(5000.5);
      expect(position[2]).toBeGreaterThanOrEqual(-10000.5);
      expect(position[2]).toBeLessThanOrEqual(10000.5);
    });
  });

  describe('updateParticlePosition', () => {
    const createMockMesh = () => ({
      position: { x: 0, y: 0, z: 0 }
    }) as Sprite;

    const mockData = {
      originalPosition: [0, 0, 0],
      floatPhase: 0.5,
      floatSpeed: 1.0,
      fallSpeed: 1.0,
      isDroppingType: false,
      lastUpdateTime: 0,
      updateInterval: 1.0
    } as AnimationData;

    const mockSettings = {
      speedFactor: 1.0
    };

    describe('updateParticlePosition', () => {
      const time = 2.5;
      const delta = 0.016;
      const isMobile = false;

      it('SUN pattern moves in sine/cosine path', () => {
        const mesh = createMockMesh();
        updateParticlePosition(mesh, { ...mockData }, MatrixEffectType.SUN, mockSettings, time, delta, isMobile);
        expect(mesh.position.x).not.toBe(0);
        expect(mesh.position.y).not.toBe(0);
      });

      it('RAIN falls down and resets if below bounds', () => {
        const mesh = createMockMesh();
        mesh.position.y = MOVEMENT_BOUNDS.Y_BOTTOM - 1; // trigger randomizePosition
        updateParticlePosition(mesh, { ...mockData }, MatrixEffectType.RAIN, mockSettings, time, delta, isMobile);
        expect(mesh.position.y).toBe(MOVEMENT_BOUNDS.Y_TOP); // should reset
      });

      it('STORM shakes in x/y/z', () => {
        const mesh = createMockMesh();
        updateParticlePosition(mesh, { ...mockData }, MatrixEffectType.STORM, mockSettings, time, delta, isMobile);
        expect(mesh.position.x).not.toBe(0);
        expect(mesh.position.y).not.toBe(0);
        expect(mesh.position.z).not.toBe(0);
      });

      it('FOG moves slightly', () => {
        const mesh = createMockMesh();
        updateParticlePosition(mesh, { ...mockData }, MatrixEffectType.FOG, mockSettings, time, delta, isMobile);
        expect(Math.abs(mesh.position.x)).toBeLessThan(2);
        expect(Math.abs(mesh.position.y)).toBeLessThan(2);
      });

      it('DEFAULT includes z axis oscillation', () => {
        const mesh = createMockMesh();
        updateParticlePosition(mesh, { ...mockData }, MatrixEffectType.DEFAULT, mockSettings, time, delta, isMobile);
        expect(mesh.position.z).not.toBe(0);
      });
    });
  });
});

