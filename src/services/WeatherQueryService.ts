// src/services/WeatherQueryService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weatherService } from './WeatherService';
import type { WeatherData, LocationData } from '@/types/weather';

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 15 * 60 * 1000;

export const weatherKeys = {
  all: ['weather'] as const,
  location: () => [...weatherKeys.all, 'location'] as const,
  coords: (lat: number, lon: number) => [...weatherKeys.all, 'coords', lat, lon] as const,
  city: (city: string) => [...weatherKeys.all, 'city', city] as const,
};

// Generic hook
const createWeatherQuery = <T>(
  key: any[],
  fetchFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number | false;
    retry?: boolean | ((count: number, error: unknown) => boolean);
  } = {}
) => {
  return useQuery({
    queryKey: key,
    queryFn: fetchFn,
    enabled: options.enabled !== false,
    staleTime: options.staleTime ?? STALE_TIME,
    refetchInterval: options.refetchInterval ?? false,
    retry: options.retry ?? false,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    gcTime: GC_TIME,
  });
};

export const useWeatherByCoords = (lat: number | null, lon: number | null, apiKey: string, options?: any) => {
  return createWeatherQuery(
    lat && lon ? [...weatherKeys.coords(lat, lon)] : [],
    async () => {
      if (!lat || !lon) throw new Error('Coordinates are required');
      if (!weatherService.validateApiKey(apiKey)) throw new Error('Invalid API key');
      return weatherService.fetchWeatherByCoords(lat, lon, apiKey);
    },
    { ...options, enabled: Boolean(lat && lon && apiKey) }
  );
};

export const useWeatherByCity = (city: string, apiKey: string, options?: any) => {
  return createWeatherQuery(
    city ? [...weatherKeys.city(city)] : [],
    async () => {
      if (!city.trim()) throw new Error('City name required');
      if (!weatherService.validateApiKey(apiKey)) throw new Error('Invalid API key');
      return weatherService.fetchWeatherByCity(city, apiKey);
    },
    { ...options, enabled: Boolean(city && apiKey) }
  );
};

export const useCurrentLocation = (options?: { enabled?: boolean }) => {
  return createWeatherQuery(
    [...weatherKeys.location()],
    () => weatherService.getCurrentLocation(),
    { staleTime: 30 * 60 * 1000, retry: false, ...options }
  );
};

export const useWeatherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      location,
      apiKey,
      cityOverride,
    }: {
      location: LocationData;
      apiKey: string;
      cityOverride?: string;
    }): Promise<WeatherData> => {
      if (!weatherService.validateApiKey(apiKey)) throw new Error('Invalid API key');
      return cityOverride
        ? weatherService.fetchWeatherByCity(cityOverride, apiKey)
        : weatherService.fetchWeatherByCoords(location.latitude, location.longitude, apiKey);
    },
    onSuccess: (data, { location, cityOverride }) => {
      if (cityOverride) {
        queryClient.setQueryData(weatherKeys.city(cityOverride), data);
      } else {
        queryClient.setQueryData(weatherKeys.coords(location.latitude, location.longitude), data);
      }

      queryClient.invalidateQueries({
        queryKey: weatherKeys.all,
        refetchType: 'none',
      });
    },
  });
};

export const useWeatherCache = () => {
  const queryClient = useQueryClient();

  return {
    clear: () => queryClient.removeQueries({ queryKey: weatherKeys.all }),
    invalidate: () => queryClient.invalidateQueries({ queryKey: weatherKeys.all }),
    getByCoords: (lat: number, lon: number) => queryClient.getQueryData<WeatherData>(weatherKeys.coords(lat, lon)),
    getByCity: (city: string) => queryClient.getQueryData<WeatherData>(weatherKeys.city(city)),
  };
};