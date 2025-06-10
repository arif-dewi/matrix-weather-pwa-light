import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MatrixEffectType, WeatherCondition, WeatherData } from '@/types/weather';
import { WEATHER_TO_EFFECT_MAP } from '@/constants/weather';

interface WeatherState {
  city: string | null;
  matrixEffect: MatrixEffectType;

  setCity: (city: string) => void;
  updateMatrixEffect: (data: WeatherData) => void;
  reset: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      city: null,
      matrixEffect: MatrixEffectType.DEFAULT,

      setCity: (city) => set({ city }),

      updateMatrixEffect: (weather) => {
        const condition = weather.weather[0].main as WeatherCondition;
        const effect = WEATHER_TO_EFFECT_MAP[condition] || MatrixEffectType.DEFAULT;
        set({ matrixEffect: effect });
      },

      reset: () =>
        set({
          city: null,
          matrixEffect: MatrixEffectType.DEFAULT,
        }),
    }),
    {
      name: 'weather-matrix-store',
      version: 2,
      partialize: (state) => ({
        city: state.city,
        matrixEffect: state.matrixEffect,
      }),
    }
  )
);

// Optional selectors
export const useCity = () => useWeatherStore((s) => s.city);
export const useMatrixEffect = () => useWeatherStore((s) => s.matrixEffect);