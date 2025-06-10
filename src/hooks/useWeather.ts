import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/WeatherService';
import { QUERY_CONFIG } from '@/constants/weather';
import { useWeatherStore, useCity, useMatrixEffect } from '@/stores/weatherStore';
import { WeatherData } from "@/types/weather";

export const useWeather = () => {
  const city = useCity()
  const matrixEffect = useMatrixEffect()
  const updateMatrixEffect = useWeatherStore((s) => s.updateMatrixEffect);

  const enabled = Boolean(city);

  const query = useQuery({
    queryKey: city ? ['weather', city] : ['weather-disabled'],
    queryFn: () => weatherService.fetchWeatherByCity(city!),
    enabled,
    staleTime: QUERY_CONFIG.STALE_TIME.WEATHER,
    refetchOnWindowFocus: true,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL.ACTIVE,
  });

  useEffect(() => {
    if (query.data) {
      updateMatrixEffect(query.data);
    }
  }, [query.data]);

  return {
    weatherData: query.data as WeatherData,
    matrixEffect,
    isLoading: query.isLoading,
    isError: query.isError || Boolean(query.error),
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    refreshError: query.error as Error | null,
    lastFetchTime: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
};