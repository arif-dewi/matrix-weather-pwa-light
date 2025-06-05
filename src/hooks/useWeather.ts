import { useCallback } from 'react';
import { useWeatherStore } from '@/stores/weatherStore';
import { weatherService } from '@/services/weatherService';
import type { LocationData } from '@/types/weather';

export function useWeather() {
  const {
    setLocation,
    setWeatherData,
    setLoading,
    setError,
    setApiKey
  } = useWeatherStore();

  const fetchWeatherData = useCallback(async (
    apiKey: string,
    locationData: LocationData,
    cityOverride?: string
  ) => {
    if (!weatherService.validateApiKey(apiKey)) {
      throw new Error('Invalid API key format');
    }

    try {
      let weatherData;

      if (cityOverride?.trim()) {
        weatherData = await weatherService.fetchWeatherByCity(cityOverride, apiKey);
      } else {
        weatherData = await weatherService.fetchWeatherByCoords(
          locationData.latitude,
          locationData.longitude,
          apiKey
        );
      }

      // Update location with actual coordinates from API response
      const updatedLocation: LocationData = {
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
        city: weatherData.name,
        country: weatherData.sys.country
      };

      setLocation(updatedLocation);
      setWeatherData(weatherData);
      setApiKey(apiKey);

      return weatherData;
    } catch (error) {
      throw error;
    }
  }, [setLocation, setWeatherData, setApiKey]);

  const getCurrentLocationAndFetchWeather = useCallback(async (apiKey: string) => {
    setLoading(true);
    setError(null);

    try {
      const location = await weatherService.getCurrentLocation();
      await fetchWeatherData(apiKey, location);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get location';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWeatherData, setLoading, setError]);

  const fetchWeatherWithLocation = useCallback(async (
    apiKey: string,
    location: LocationData,
    city?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      await fetchWeatherData(apiKey, location, city);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch weather';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWeatherData, setLoading, setError]);

  return {
    getCurrentLocationAndFetchWeather,
    fetchWeatherWithLocation,
    fetchWeatherData
  };
}