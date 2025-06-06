// src/constants/weather.ts (Updated - remove duplicate enums)
import { MatrixEffectType, WeatherCondition } from '@/types/weather';

// API Configuration
export const API_VALIDATION = {
  MIN_KEY_LENGTH: 32,
  KEY_PATTERN: /^[a-f0-9]{32}$/i,
  TIMEOUT_MS: 10000,
  MAX_AGE_MS: 60000,
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
} as const;

// Weather condition to matrix effect mapping
export const WEATHER_TO_EFFECT_MAP: Record<WeatherCondition, MatrixEffectType> = {
  'Clear': MatrixEffectType.SUN,
  'Clouds': MatrixEffectType.CLOUD,
  'Rain': MatrixEffectType.RAIN,
  'Drizzle': MatrixEffectType.RAIN,
  'Thunderstorm': MatrixEffectType.STORM,
  'Snow': MatrixEffectType.SNOW,
  'Mist': MatrixEffectType.FOG,
  'Fog': MatrixEffectType.FOG,
  'Haze': MatrixEffectType.FOG,
  'Smoke': MatrixEffectType.FOG,
  'Dust': MatrixEffectType.WIND,
  'Sand': MatrixEffectType.WIND,
  'Ash': MatrixEffectType.FOG,
  'Squall': MatrixEffectType.STORM,
  'Tornado': MatrixEffectType.STORM,
} as const;

// Performance-based particle counts
export const PARTICLE_COUNTS = {
  BASE: 150,
  MEDIUM: 100,
  LOW_END: 75,
  MOBILE_MAX: 50,
} as const;

// Effect-specific multipliers
export const EFFECT_MULTIPLIERS: Record<MatrixEffectType, number> = {
  [MatrixEffectType.DEFAULT]: 1.0,
  [MatrixEffectType.SUN]: 0.8,
  [MatrixEffectType.CLOUD]: 1.2,
  [MatrixEffectType.WIND]: 1.1,
  [MatrixEffectType.RAIN]: 1.5,
  [MatrixEffectType.SNOW]: 1.3,
  [MatrixEffectType.FOG]: 1.0,
  [MatrixEffectType.STORM]: 1.8,
} as const;

// Animation speeds
export const ANIMATION_SPEEDS = {
  VERY_SLOW: 0.2,
  SLOW: 0.5,
  NORMAL: 1.0,
  FAST: 1.5,
  VERY_FAST: 2.0,
  CHAOTIC: 3.0,
} as const;

// Movement boundaries
export const MOVEMENT_BOUNDS = {
  X: 40,
  Y_TOP: 15,
  Y_BOTTOM: -15,
  Z: 20,
  MOBILE_SCALE: 0.8,
  Z_MOBILE_SCALE: 0.6,
} as const;

// Canvas settings
export const CANVAS_SETTINGS = {
  SIZE: {
    DESKTOP: 256,
    MOBILE: 128,
  },
  FONT_SIZE: {
    DESKTOP: 64,
    MOBILE: 48,
  },
  SCALE_FACTOR: {
    DEFAULT: 1,
    HIGH_DPI: 2,
    MAX_DPI: 3,
  },
} as const;

// Frame rate optimization
export const FRAME_RATES = {
  TARGET_FPS: 60,
  UPDATE_INTERVAL_MS: {
    HIGH_PERFORMANCE: 16, // 60fps
    NORMAL: 33, // 30fps
    LOW_PERFORMANCE: 50, // 20fps
  },
} as const;

// Opacity settings
export const OPACITY = {
  STRONG: 0.9,
  NORMAL: 0.7,
  WEAK: 0.5,
  MINIMAL: 0.3,
} as const;

// Query configuration
export const QUERY_CONFIG = {
  STALE_TIME: {
    WEATHER: 5 * 60 * 1000, // 5 minutes
    LOCATION: 30 * 60 * 1000, // 30 minutes
  },
  CACHE_TIME: {
    WEATHER: 15 * 60 * 1000, // 15 minutes
    LOCATION: 60 * 60 * 1000, // 1 hour
  },
  RETRY: {
    ATTEMPTS: 3,
    DELAY_MS: 1000,
    MAX_DELAY_MS: 30000,
  },
  REFETCH_INTERVAL: {
    ACTIVE: 10 * 60 * 1000, // 10 minutes
    BACKGROUND: false,
  },
} as const;

// Notification configuration
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SHORT: 3000,
    NORMAL: 4000,
    LONG: 6000,
    PERSISTENT: 10000,
  },
  SLIDE_IN_DELAY: 10,
  ANIMATION_DURATION: 300,
} as const;

// Matrix effect colors
export const MATRIX_COLORS = {
  DEFAULT: '#00ff00',
  SUCCESS: '#00ff00',
  WARNING: '#ffaa00',
  ERROR: '#ff4444',
  INFO: '#00aaff',
  MUTED: '#888888',
} as const;
