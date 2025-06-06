// Device breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  LOW_MEMORY: 2, // GB
  LOW_CORES: 4,
  HIGH_MEMORY: 8, // GB
  HIGH_CORES: 8,
} as const;
