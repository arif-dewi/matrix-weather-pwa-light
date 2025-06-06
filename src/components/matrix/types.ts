export interface AnimationData {
  originalPosition: [number, number, number];
  floatPhase: number;
  floatSpeed: number;
  fallSpeed: number;
  isDroppingType: boolean;
  lastUpdateTime: number;
  updateInterval: number;
}
