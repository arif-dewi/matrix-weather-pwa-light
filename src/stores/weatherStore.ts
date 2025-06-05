import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { env } from '@/config/env';
import { WeatherData, LocationData } from '@/types/weather';
import { MatrixEffectType, WeatherCondition, WEATHER_TO_EFFECT_MAP } from '@/constants/weather';

interface WeatherState {
  // Data
  weatherData: WeatherData | null;
  location: LocationData | null;
  apiKey: string;

  // UI State
  isLoading: boolean;
  error: string | null;
  matrixEffect: MatrixEffectType;

  // Actions
  setApiKey: (key: string) => void;
  setLocation: (location: LocationData) => void;
  setWeatherData: (data: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateMatrixEffect: (weather: WeatherData) => void;
  resetState: () => void;
}

const getMatrixEffectFromWeather = (weather: WeatherData): MatrixEffectType => {
  const mainCondition = weather.weather[0].main as WeatherCondition;

  // Use the mapping constant instead of string comparisons
  const effect = WEATHER_TO_EFFECT_MAP[mainCondition];

  return effect || MatrixEffectType.DEFAULT;
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      // Initial State
      weatherData: null,
      location: env.defaultLocation.latitude && env.defaultLocation.longitude
        ? {
          latitude: env.defaultLocation.latitude,
          longitude: env.defaultLocation.longitude,
          city: env.defaultLocation.city
        }
        : null,
      apiKey: env.apiKey,
      isLoading: false,
      error: null,
      matrixEffect: MatrixEffectType.DEFAULT,

      // Actions
      setApiKey: (key: string) => set({ apiKey: key }),

      setLocation: (location: LocationData) => set({ location }),

      setWeatherData: (data: WeatherData) => {
        const effect = getMatrixEffectFromWeather(data);

        set({
          weatherData: data,
          matrixEffect: effect,
          error: null,
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({
        error,
        isLoading: false,
      }),

      updateMatrixEffect: (weather: WeatherData) => {
        const effect = getMatrixEffectFromWeather(weather);
        set({ matrixEffect: effect });
      },

      resetState: () => set({
        weatherData: null,
        location: null,
        isLoading: false,
        error: null,
        matrixEffect: MatrixEffectType.DEFAULT
      })
    }),
    {
      name: 'matrix-weather-storage',
      partialize: (state) => ({
        location: state.location,
        weatherData: state.weatherData,
        matrixEffect: state.matrixEffect,
      })
    }
  )
);