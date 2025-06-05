export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: WeatherCondition;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number;
  wind: {
    speed: number;
    deg?: number;
    gust?: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export type WeatherCondition =
  | 'Thunderstorm'
  | 'Drizzle'
  | 'Rain'
  | 'Snow'
  | 'Mist'
  | 'Smoke'
  | 'Haze'
  | 'Dust'
  | 'Fog'
  | 'Sand'
  | 'Ash'
  | 'Squall'
  | 'Tornado'
  | 'Clear'
  | 'Clouds';

export type MatrixEffectType =
  | 'rain'
  | 'snow'
  | 'sun'
  | 'wind'
  | 'cloud'
  | 'storm'
  | 'fog'
  | 'default';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface WeatherVisualSettings {
  speedFactor: number;
  symbolScale: number;
  countMultiplier: number;
  color: string;
}

export interface ApiError {
  cod: string | number;
  message: string;
}

export interface WeatherApiConfig {
  apiKey: string;
  baseUrl: string;
  units: 'metric' | 'imperial' | 'kelvin';
}