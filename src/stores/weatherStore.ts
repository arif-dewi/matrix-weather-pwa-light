// src/stores/weatherStore.ts
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { env } from '@/config/env';
import { WeatherData, LocationData } from '@/types/weather';
import { WEATHER_TO_EFFECT_MAP } from '@/constants/weather';
import { MatrixEffectType, WeatherCondition } from '@/types/weather';
import { logger } from "@/services/MatrixLogger";

interface WeatherPreferences {
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  preferredUnits: 'metric' | 'imperial' | 'kelvin';
  notifications: boolean;
}

interface WeatherCache {
  lastFetch: number;
  lastLocation: LocationData | null;
  lastApiKey: string;
}

interface WeatherState {
  // Core Data
  weatherData: WeatherData | null;
  location: LocationData | null;
  apiKey: string;

  // UI State
  matrixEffect: MatrixEffectType;
  preferences: WeatherPreferences;
  cache: WeatherCache;

  // Actions
  setApiKey: (key: string) => void;
  setLocation: (location: LocationData | null) => void;
  setWeatherData: (data: WeatherData) => void;
  updateMatrixEffect: (weather: WeatherData) => void;
  updatePreferences: (preferences: Partial<WeatherPreferences>) => void;
  resetState: () => void;

  // New utility actions
  isDataStale: () => boolean;
  shouldAutoRefresh: () => boolean;
  getLastFetchTime: () => Date | null;
}

const DEFAULT_PREFERENCES: WeatherPreferences = {
  autoRefresh: true,
  refreshInterval: 10, // 10 minutes
  preferredUnits: 'metric',
  notifications: true,
};

const getMatrixEffectFromWeather = (weather: WeatherData): MatrixEffectType => {
  const mainCondition = weather.weather[0].main as WeatherCondition;
  const effect = WEATHER_TO_EFFECT_MAP[mainCondition];
  return effect || MatrixEffectType.DEFAULT;
};

const createInitialCache = (): WeatherCache => ({
  lastFetch: 0,
  lastLocation: null,
  lastApiKey: '',
});

export const useWeatherStore = create<WeatherState>()(
  subscribeWithSelector(
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
        apiKey: env.apiKey,
        matrixEffect: MatrixEffectType.DEFAULT,
        preferences: DEFAULT_PREFERENCES,
        cache: createInitialCache(),

        // Actions
        setApiKey: (key: string) => {
          set((state) => ({
            apiKey: key,
            cache: {
              ...state.cache,
              lastApiKey: key,
            },
          }));
        },

        setLocation: (location: LocationData) => {
          set((state) => ({
            location,
            cache: {
              ...state.cache,
              lastLocation: location,
            },
          }));
        },

        setWeatherData: (data: WeatherData) => {
          const effect = getMatrixEffectFromWeather(data);
          const now = Date.now();

          set((state) => ({
            weatherData: data,
            matrixEffect: effect,
            cache: {
              ...state.cache,
              lastFetch: now,
            },
          }));
        },

        updateMatrixEffect: (weather: WeatherData) => {
          const effect = getMatrixEffectFromWeather(weather);
          set({ matrixEffect: effect });
        },

        updatePreferences: (newPreferences: Partial<WeatherPreferences>) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...newPreferences,
            },
          }));
        },

        resetState: () => {
          set({
            weatherData: null,
            location: null,
            matrixEffect: MatrixEffectType.DEFAULT,
            cache: createInitialCache(),
          });
        },

        // Utility functions
        isDataStale: () => {
          const state = get();
          if (!state.weatherData || !state.cache.lastFetch) return true;

          const now = Date.now();
          const staleTime = state.preferences.refreshInterval * 60 * 1000; // Convert to ms

          return (now - state.cache.lastFetch) > staleTime;
        },

        shouldAutoRefresh: () => {
          const state = get();
          return state.preferences.autoRefresh && state.isDataStale();
        },

        getLastFetchTime: () => {
          const state = get();
          return state.cache.lastFetch ? new Date(state.cache.lastFetch) : null;
        },
      }),
      {
        name: 'matrix-weather-storage',
        version: 2, // Increment version for migration
        partialize: (state) => ({
          location: state.location,
          weatherData: state.weatherData,
          matrixEffect: state.matrixEffect,
          preferences: state.preferences,
          cache: state.cache,
        }),
        // Migration function for version updates
        migrate: (persistedState: any, version: number) => {
          if (version < 2) {
            // Add new preferences and cache if migrating from v1
            return {
              ...persistedState,
              preferences: {
                ...DEFAULT_PREFERENCES,
                ...persistedState.preferences,
              },
              cache: persistedState.cache || createInitialCache(),
            };
          }
          return persistedState;
        },
      }
    )
  )
);

// Selector hooks for better performance and reusability
export const useWeatherData = () => useWeatherStore((state) => state.weatherData);
export const useLocation = () => useWeatherStore((state) => state.location);
export const useApiKey = () => useWeatherStore((state) => state.apiKey);
export const useMatrixEffect = () => useWeatherStore((state) => state.matrixEffect);
export const useWeatherPreferences = () => useWeatherStore((state) => state.preferences);
export const useWeatherCache = () => useWeatherStore((state) => state.cache);

// Computed selectors
export const useIsDataStale = () => useWeatherStore((state) => state.isDataStale());
export const useShouldAutoRefresh = () => useWeatherStore((state) => state.shouldAutoRefresh());
export const useLastFetchTime = () => useWeatherStore((state) => state.getLastFetchTime());

// Combined selectors for components
export const useWeatherDisplay = () => useWeatherStore((state) => ({
  weatherData: state.weatherData,
  matrixEffect: state.matrixEffect,
  location: state.location,
}));

export const useWeatherSetup = () => useWeatherStore((state) => ({
  apiKey: state.apiKey,
  location: state.location,
  setApiKey: state.setApiKey,
  setLocation: state.setLocation,
  setWeatherData: state.setWeatherData,
  resetState: state.resetState,
}));

// Subscribe to weather data changes for side effects
useWeatherStore.subscribe(
  (state) => state.weatherData,
  (weatherData, previousWeatherData) => {
    if (weatherData && weatherData !== previousWeatherData) {
      // Log weather updates in development
      if (env.isDevelopment) {
        logger.info('🌤️ Weather data updated:', {
          location: weatherData.name,
          temperature: `${Math.round(weatherData.main.temp)}°C`,
          condition: weatherData.weather[0].main,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
);

// Subscribe to preference changes
useWeatherStore.subscribe(
  (state) => state.preferences,
  (preferences, previousPreferences) => {
    if (preferences !== previousPreferences && env.isDevelopment) {
      console.log('⚙️ Weather preferences updated:', preferences);
    }
  }
);
