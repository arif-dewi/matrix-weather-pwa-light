// src/services/WeatherQueryService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WeatherData, LocationData } from '@/types/weather';
import { weatherService } from './WeatherService';
import {QUERY_CONFIG} from "@/constants/weather.ts";

// Simplified Query Keys
const queryKeys = {
  weather: (lat: number, lon: number) => ['weather', lat, lon],
  weatherByCity: (city: string) => ['weather', 'city', city],
  location: () => ['location'],
} as const;

// Weather by Coordinates Hook
export const useWeatherByCoords = (
  lat: number | null,
  lon: number | null,
  apiKey: string,
  enabled = true
) => {
  return useQuery({
    queryKey: lat && lon ? queryKeys.weather(lat, lon) : ['weather-disabled'],
    queryFn: () => weatherService.fetchWeatherByCoords(lat!, lon!, apiKey),
    enabled: Boolean(lat && lon && apiKey && enabled),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Weather by City Hook
export const useWeatherByCity = (
  city: string,
  apiKey: string,
  enabled = true
) => {
  return useQuery({
    queryKey: city ? queryKeys.weatherByCity(city) : ['weather-city-disabled'],
    queryFn: () => weatherService.fetchWeatherByCity(city, apiKey),
    enabled: Boolean(city && apiKey && enabled),
    staleTime: QUERY_CONFIG.STALE_TIME.WEATHER,
    retry: QUERY_CONFIG.RETRY.ATTEMPTS,
  });
};

// Current Location Hook
export const useCurrentLocation = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.location(),
    queryFn: () => weatherService.getCurrentLocation(),
    enabled,
    staleTime: QUERY_CONFIG.STALE_TIME.LOCATION,
    retry: false,
  });
};

// Weather Mutation Hook
export const useWeatherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ location, apiKey, cityOverride }: {
      location: LocationData;
      apiKey: string;
      cityOverride?: string;
    }) => {
      if (cityOverride) {
        return weatherService.fetchWeatherByCity(cityOverride, apiKey);
      }
      return weatherService.fetchWeatherByCoords(location.latitude, location.longitude, apiKey);
    },
    onSuccess: (data, { location, cityOverride }) => {
      // Update cache with new data
      if (cityOverride) {
        queryClient.setQueryData(queryKeys.weatherByCity(cityOverride), data);
      } else {
        queryClient.setQueryData(queryKeys.weather(location.latitude, location.longitude), data);
      }
    },
  });
};

// Simple Cache Management
export const useWeatherCache = () => {
  const queryClient = useQueryClient();

  return {
    clearWeatherCache: () => queryClient.removeQueries({ queryKey: ['weather'] }),
    getWeatherFromCache: (lat: number, lon: number) =>
      queryClient.getQueryData(queryKeys.weather(lat, lon)) as WeatherData | undefined,
    getCityWeatherFromCache: (city: string) =>
      queryClient.getQueryData(queryKeys.weatherByCity(city)) as WeatherData | undefined,
  };
};