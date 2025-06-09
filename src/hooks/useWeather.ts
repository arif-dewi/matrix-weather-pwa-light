import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/WeatherService';
import { QUERY_CONFIG } from '@/constants/weather';
import { useWeatherStore, useCity, useApiKey, useMatrixEffect } from '@/stores/weatherStore';
import {WeatherData} from "@/types/weather.ts";

export const useWeather = () => {
  const city = useCity()
  const apiKey = useApiKey()
  const matrixEffect = useMatrixEffect()
  const updateMatrixEffect = useWeatherStore((s) => s.updateMatrixEffect);

  const enabled = Boolean(city && apiKey);

  const query = useQuery({
    queryKey: city ? ['weather', city] : ['weather-disabled'],
    queryFn: () => weatherService.fetchWeatherByCity(city!, apiKey),
    enabled,
    staleTime: QUERY_CONFIG.STALE_TIME.WEATHER,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 60 * 1000,
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