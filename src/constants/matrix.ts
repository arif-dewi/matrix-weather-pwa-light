import type { MatrixEffectType, WeatherVisualSettings } from '@/types/weather';

export const MATRIX_CHARS = {
  rain: [
    '0','1','2','3','4','5','6','7','8','9',
    'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ',
    '💧', '╱', '╲', '|', '/', '\\', '_'
  ],
  sun: [
    '0','1','2','3','4','5','6','7','8','9',
    'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ',
    '☀', '★', '✦', '✧', '◉', '◎', '⊙', '◯', '○', '●', '◊', '◈'
  ],
  cloud: [
    '0','1','2','3','4','5','6','7','8','9',
    'サ','シ','ス','セ','ソ','タ','チ','ツ','ナ','ニ',
    '▓', '▒', '░', '≡', '≈', '~', '-', '='
  ],
  snow: [
    '0','1','2','3','4','5','6','7','8','9',
    'ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ',
    '◦', '○', '°', '·', '⋅', '*', '+'
  ],
  wind: [
    '0','1','2','3','4','5','6','7','8','9',
    'ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ',
    '~', '≈', '∼', '→', '↗', '↘', '⇢'
  ],
  storm: [
    '0','1','2','3','4','5','6','7','8','9',
    'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ',
    '⚡', '☁', '💥', '⛈', '❗', '╳', '✖'
  ],
  fog: [
    '0','1','2','3','4','5','6','7','8','9',
    'サ','シ','ス','セ','ソ','タ','チ','ツ','ナ','ニ',
    '▒', '░', '≡', '…', '.', ',', '`'
  ],
  default: [
    '0','1','2','3','4','5','6','7','8','9',
    'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ',
    'サ','シ','ス','セ','ソ','タ','チ','ツ','ナ','ニ',
    'ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ',
    '|','/','\\','-','_','=','+','*','.',',','░','▒','▓'
  ]
} as const;

export const WEATHER_VISUAL_SETTINGS: Record<MatrixEffectType, WeatherVisualSettings> = {
  sun: {
    speedFactor: 0.5,
    symbolScale: 1.2,
    countMultiplier: 2,
    color: '#ffdd00'
  },
  cloud: {
    speedFactor: 0.8,
    symbolScale: 1,
    countMultiplier: 2.5,
    color: '#aaaaaa'
  },
  wind: {
    speedFactor: 1.4,
    symbolScale: 1,
    countMultiplier: 2.5,
    color: '#88ffaa'
  },
  rain: {
    speedFactor: 1.3,
    symbolScale: 0.8,
    countMultiplier: 3,
    color: '#4488ff'
  },
  snow: {
    speedFactor: 1.2,
    symbolScale: 0.9,
    countMultiplier: 2.5,
    color: '#ffffff'
  },
  fog: {
    speedFactor: 0.6,
    symbolScale: 1,
    countMultiplier: 2.2,
    color: '#888888'
  },
  storm: {
    speedFactor: 2,
    symbolScale: 1.1,
    countMultiplier: 3.5,
    color: '#ff4444'
  },
  default: {
    speedFactor: 1.0,
    symbolScale: 1,
    countMultiplier: 2,
    color: '#00ff00'
  }
};

export const MATRIX_CONFIG = {
  PARTICLE_COUNT_BASE: 100,
  CANVAS_SIZE: 256,
  FONT_SIZE: 64,
  FONT_FAMILY: 'Courier New',
  OPACITY: 0.7,
  SHADOW_BLUR: 10,
  FLOAT_AMPLITUDE: 1.5,
  FLOAT_FREQUENCY: 0.3,
  BOUNDS: {
    X: 40,
    Y_TOP: 15,
    Y_BOTTOM: -15,
    Z: 20
  }
} as const;