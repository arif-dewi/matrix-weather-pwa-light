// Weather condition enums
export enum WeatherCondition {
  THUNDERSTORM = 'Thunderstorm',
  DRIZZLE = 'Drizzle',
  RAIN = 'Rain',
  SNOW = 'Snow',
  MIST = 'Mist',
  SMOKE = 'Smoke',
  HAZE = 'Haze',
  DUST = 'Dust',
  FOG = 'Fog',
  SAND = 'Sand',
  ASH = 'Ash',
  SQUALL = 'Squall',
  TORNADO = 'Tornado',
  CLEAR = 'Clear',
  CLOUDS = 'Clouds'
}

export enum MatrixEffectType {
  RAIN = 'rain',
  SNOW = 'snow',
  SUN = 'sun',
  WIND = 'wind',
  CLOUD = 'cloud',
  STORM = 'storm',
  FOG = 'fog',
  DEFAULT = 'default'
}

// Performance tiers
export enum PerformanceTier {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Device types
export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop'
}

// Animation constants
export const ANIMATION_SPEEDS = {
  VERY_SLOW: 0.3,
  SLOW: 0.5,
  NORMAL: 1.0,
  FAST: 1.3,
  VERY_FAST: 2.0,
  CHAOTIC: 2.5
} as const;

export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
} as const;

// UI Dimensions
export const UI_DIMENSIONS = {
  TOUCH_TARGET_MIN: 44,
  TOUCH_TARGET_COMFORTABLE: 48,
  GEAR_ICON_SIZE: {
    MOBILE: 40,
    DESKTOP: 48
  },
  PANEL_WIDTH: {
    MOBILE: 'calc(100vw - 5rem)',
    DESKTOP: 320
  },
  PANEL_MAX_WIDTH: 384
} as const;

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE_SMALL: 375,
  MOBILE: 480,
  TABLET: 640,
  DESKTOP: 1024,
  DESKTOP_LARGE: 1280
} as const;

// Matrix particle counts
export const PARTICLE_COUNTS = {
  LOW_END: 30,
  MEDIUM: 50,
  BASE: 90,
  HIGH: 150,
  MAXIMUM: 200
} as const;

// Matrix visual multipliers
export const EFFECT_MULTIPLIERS = {
  [MatrixEffectType.STORM]: 3.5,
  [MatrixEffectType.RAIN]: 3.0,
  [MatrixEffectType.SNOW]: 2.5,
  [MatrixEffectType.WIND]: 2.5,
  [MatrixEffectType.CLOUD]: 2.5,
  [MatrixEffectType.FOG]: 2.2,
  [MatrixEffectType.SUN]: 2.0,
  [MatrixEffectType.DEFAULT]: 2.0
} as const;

// Canvas and texture settings
export const CANVAS_SETTINGS = {
  SIZE: {
    DESKTOP: 256,
    MOBILE: 256  // Increased from 128 to keep particles visible
  },
  FONT_SIZE: {
    DESKTOP: 64,
    MOBILE: 64   // Increased from 32 to keep particles readable
  },
  SCALE_FACTOR: {
    MAX_DPI: 2,
    DEFAULT: 1
  }
} as const;

// Frame rate targets
export const FRAME_RATES = {
  DESKTOP: 60,
  MOBILE_HIGH: 60,
  MOBILE_LOW: 30,
  UPDATE_INTERVAL_MS: {
    HIGH_PERFORMANCE: 8.33,  // ~120fps max
    NORMAL: 16.67,           // ~60fps
    LOW_PERFORMANCE: 33.33   // ~30fps
  }
} as const;

// Opacity values
export const OPACITY = {
  HIDDEN: 0,
  BARELY_VISIBLE: 0.1,
  SUBTLE: 0.3,
  MEDIUM: 0.5,
  VISIBLE: 0.7,
  STRONG: 0.8,
  ALMOST_OPAQUE: 0.9,
  OPAQUE: 1.0
} as const;

// Movement bounds
export const MOVEMENT_BOUNDS = {
  X: 40,
  Y_TOP: 15,
  Y_BOTTOM: -15,
  Z: 20,
  MOBILE_SCALE: 0.8,
  Z_MOBILE_SCALE: 0.6
} as const;

// Weather effect mapping
export const WEATHER_TO_EFFECT_MAP = {
  [WeatherCondition.THUNDERSTORM]: MatrixEffectType.STORM,
  [WeatherCondition.TORNADO]: MatrixEffectType.STORM,
  [WeatherCondition.DRIZZLE]: MatrixEffectType.RAIN,
  [WeatherCondition.RAIN]: MatrixEffectType.RAIN,
  [WeatherCondition.SNOW]: MatrixEffectType.SNOW,
  [WeatherCondition.CLEAR]: MatrixEffectType.SUN,
  [WeatherCondition.CLOUDS]: MatrixEffectType.CLOUD,
  [WeatherCondition.MIST]: MatrixEffectType.FOG,
  [WeatherCondition.FOG]: MatrixEffectType.FOG,
  [WeatherCondition.HAZE]: MatrixEffectType.FOG,
  [WeatherCondition.SMOKE]: MatrixEffectType.FOG,
  [WeatherCondition.DUST]: MatrixEffectType.FOG,
  [WeatherCondition.SAND]: MatrixEffectType.FOG,
  [WeatherCondition.ASH]: MatrixEffectType.FOG,
  [WeatherCondition.SQUALL]: MatrixEffectType.WIND
} as const;

// API validation
export const API_VALIDATION = {
  MIN_KEY_LENGTH: 32,
  KEY_PATTERN: /^[a-zA-Z0-9]+$/,
  TIMEOUT_MS: 10000,
  MAX_AGE_MS: 300000 // 5 minutes
} as const;
