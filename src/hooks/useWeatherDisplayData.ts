// hooks/useWeatherDisplayData.ts
import { useWeatherDisplay, useWeatherPreferences, useLastFetchTime, useApiKey } from '@/stores/weatherStore';
import { useWeatherByCoords } from '@/services/WeatherQueryService';

export const useWeatherDisplayData = () => {
  const { weatherData, matrixEffect, location } = useWeatherDisplay();
  const preferences = useWeatherPreferences();
  const lastFetchTime = useLastFetchTime();
  const apiKey = useApiKey();

  const {
    isLoading: isRefetching,
    error: refreshError,
  } = useWeatherByCoords(
    location?.latitude || null,
    location?.longitude || null,
    apiKey,
    Boolean(weatherData && preferences.autoRefresh && apiKey)
  );

  return {
    weatherData,
    matrixEffect,
    isRefetching,
    refreshError,
    lastFetchTime,
  };
};