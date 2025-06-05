import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { env } from '@/config/env';
import type { WeatherData, LocationData, MatrixEffectType } from '@/types/weather';

interface WeatherState {
  // Data
  weatherData: WeatherData | null;
  location: LocationData | null;
  apiKey: string;

  // UI State
  isLoading: boolean;
  error: string | null;
  isSetupVisible: boolean;
  matrixEffect: MatrixEffectType;

  // Actions
  setApiKey: (key: string) => void;
  setLocation: (location: LocationData) => void;
  setWeatherData: (data: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSetupVisible: (visible: boolean) => void;
  updateMatrixEffect: (weather: WeatherData) => void;
  resetState: () => void;
}

const getMatrixEffectFromWeather = (weather: WeatherData): MatrixEffectType => {
  const main = weather.weather[0].main.toLowerCase();

  if (main.includes('thunderstorm') || main.includes('tornado')) return 'storm';
  if (main.includes('drizzle') || main.includes('rain')) return 'rain';
  if (main.includes('snow')) return 'snow';
  if (main.includes('clear')) return 'sun';
  if (main.includes('cloud')) return 'cloud';
  if (['mist', 'fog', 'haze', 'smoke', 'dust', 'sand', 'ash'].some(t => main.includes(t))) return 'fog';
  if (main.includes('squall')) return 'wind';

  return 'default';
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      // Initial State
      weatherData: null,
      location: env.defaultLocation.latitude && env.defaultLocation.longitude
        ? {
          latitude: env.defaultLocation.latitude,
          longitude: env.defaultLocation.longitude,
          city: env.defaultLocation.city
        }
        : null,
      apiKey: env.apiKey, // Use environment API key as default
      isLoading: false,
      error: null,
      isSetupVisible: !env.apiKey, // Hide setup if API key is provided via env
      matrixEffect: 'default',

      // Actions
      setApiKey: (key: string) => set({ apiKey: key }),

      setLocation: (location: LocationData) => set({ location }),

      setWeatherData: (data: WeatherData) => {
        const effect = getMatrixEffectFromWeather(data);
        set({
          weatherData: data,
          matrixEffect: effect,
          error: null,
          isSetupVisible: false
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({
        error,
        isLoading: false,
        isSetupVisible: error ? true : get().isSetupVisible
      }),

      setSetupVisible: (visible: boolean) => set({ isSetupVisible: visible }),

      updateMatrixEffect: (weather: WeatherData) => {
        const effect = getMatrixEffectFromWeather(weather);
        set({ matrixEffect: effect });
      },

      resetState: () => set({
        weatherData: null,
        location: null,
        isLoading: false,
        error: null,
        isSetupVisible: true,
        matrixEffect: 'default'
      })
    }),
    {
      name: 'matrix-weather-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        location: state.location,
        weatherData: state.weatherData
      })
    }
  )
);