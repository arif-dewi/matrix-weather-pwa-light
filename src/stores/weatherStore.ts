import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { env } from '@/config/env';
import { MatrixEffectType, WeatherCondition, WeatherData } from '@/types/weather';
import { WEATHER_TO_EFFECT_MAP } from '@/constants/weather';

interface WeatherState {
  city: string | null;
  apiKey: string;
  matrixEffect: MatrixEffectType;

  setCity: (city: string) => void;
  setApiKey: (key: string) => void;
  updateMatrixEffect: (data: WeatherData) => void;
  reset: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      city: null,
      apiKey: env.apiKey,
      matrixEffect: MatrixEffectType.DEFAULT,

      setCity: (city) => set({ city }),
      setApiKey: (key) => set({ apiKey: key }),

      updateMatrixEffect: (weather) => {
        const condition = weather.weather[0].main as WeatherCondition;
        const effect = WEATHER_TO_EFFECT_MAP[condition] || MatrixEffectType.DEFAULT;
        set({ matrixEffect: effect });
      },

      reset: () =>
        set({
          city: null,
          apiKey: '',
          matrixEffect: MatrixEffectType.DEFAULT,
        }),
    }),
    {
      name: 'weather-matrix-store',
      version: 2,
      partialize: (state) => ({
        city: state.city,
        apiKey: state.apiKey,
        matrixEffect: state.matrixEffect,
      }),
    }
  )
);

// Optional selectors
export const useCity = () => useWeatherStore((s) => s.city);
export const useApiKey = () => useWeatherStore((s) => s.apiKey);
export const useMatrixEffect = () => useWeatherStore((s) => s.matrixEffect);