// src/services/WeatherQueryService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WeatherData, LocationData } from '@/types/weather';
import { weatherService } from './WeatherService';

// Query Keys Factory Pattern
export const weatherQueryKeys = {
  all: ['weather'] as const,
  current: () => [...weatherQueryKeys.all, 'current'] as const,
  byCoords: (lat: number, lon: number) => [...weatherQueryKeys.current(), 'coords', lat, lon] as const,
  byCity: (city: string) => [...weatherQueryKeys.current(), 'city', city] as const,
  location: () => ['location'] as const,
} as const;

// Custom Hook for Weather by Coordinates
export const useWeatherByCoords = (
  lat: number | null,
  lon: number | null,
  apiKey: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number | false;
  }
) => {
  return useQuery({
    queryKey: lat && lon ? weatherQueryKeys.byCoords(lat, lon) : [],
    queryFn: async (): Promise<WeatherData> => {
      if (!lat || !lon) throw new Error('Coordinates are required');
      if (!weatherService.validateApiKey(apiKey)) {
        throw new Error('Invalid API key format');
      }
      return weatherService.fetchWeatherByCoords(lat, lon, apiKey);
    },
    enabled: Boolean(lat && lon && apiKey && options?.enabled !== false),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval ?? 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    meta: {
      errorMessage: 'Failed to fetch weather data by coordinates',
    },
  });
};

// Custom Hook for Weather by City
export const useWeatherByCity = (
  city: string,
  apiKey: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: city ? weatherQueryKeys.byCity(city) : [],
    queryFn: async (): Promise<WeatherData> => {
      if (!city.trim()) throw new Error('City name is required');
      if (!weatherService.validateApiKey(apiKey)) {
        throw new Error('Invalid API key format');
      }
      return weatherService.fetchWeatherByCity(city, apiKey);
    },
    enabled: Boolean(city && apiKey && options?.enabled !== false),
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    gcTime: 15 * 60 * 1000,
    meta: {
      errorMessage: 'Failed to fetch weather data by city',
    },
  });
};

// Custom Hook for Current Location
export const useCurrentLocation = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: weatherQueryKeys.location(),
    queryFn: async (): Promise<LocationData> => {
      return weatherService.getCurrentLocation();
    },
    enabled: options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes - location doesn't change often
    retry: false, // Don't retry location requests
    gcTime: 60 * 60 * 1000, // 1 hour cache
    meta: {
      errorMessage: 'Failed to get current location',
    },
  });
};

// Mutation for Fetching Weather (for manual triggers)
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
      if (!weatherService.validateApiKey(apiKey)) {
        throw new Error('Invalid API key format');
      }

      if (cityOverride?.trim()) {
        return weatherService.fetchWeatherByCity(cityOverride, apiKey);
      } else {
        return weatherService.fetchWeatherByCoords(
          location.latitude,
          location.longitude,
          apiKey
        );
      }
    },
    onSuccess: (data, variables) => {
      // Update relevant caches
      const { location, cityOverride } = variables;

      if (cityOverride) {
        queryClient.setQueryData(
          weatherQueryKeys.byCity(cityOverride),
          data
        );
      } else {
        queryClient.setQueryData(
          weatherQueryKeys.byCoords(location.latitude, location.longitude),
          data
        );
      }

      // Invalidate all weather queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: weatherQueryKeys.all,
        refetchType: 'none', // Don't refetch, just mark as stale
      });
    },
    meta: {
      errorMessage: 'Failed to fetch weather data',
    },
  });
};

// Utility Hook for Weather Cache Management
export const useWeatherCache = () => {
  const queryClient = useQueryClient();

  const clearWeatherCache = () => {
    queryClient.removeQueries({
      queryKey: weatherQueryKeys.all,
    });
  };

  const invalidateWeatherCache = () => {
    queryClient.invalidateQueries({
      queryKey: weatherQueryKeys.all,
    });
  };

  const getWeatherFromCache = (lat: number, lon: number): WeatherData | undefined => {
    return queryClient.getQueryData(weatherQueryKeys.byCoords(lat, lon));
  };

  const getCityWeatherFromCache = (city: string): WeatherData | undefined => {
    return queryClient.getQueryData(weatherQueryKeys.byCity(city));
  };

  return {
    clearWeatherCache,
    invalidateWeatherCache,
    getWeatherFromCache,
    getCityWeatherFromCache,
  };
};
