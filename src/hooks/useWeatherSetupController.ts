import { useCallback, useRef, useState, useEffect } from 'react';
import { useWeatherSetup } from '@/stores/weatherStore';
import {
  useCurrentLocation,
  useWeatherByCoords,
  useWeatherByCity,
  useWeatherMutation,
  useWeatherCache
} from '@/services/WeatherQueryService';
import { useMatrixNotifications } from '@/stores/notificationStore';
import { env } from '@/config/env';
import type { LocationData } from '@/types/weather';

export function useWeatherSetupController() {
  const { apiKey, location, setLocation, setWeatherData } = useWeatherSetup();
  const notifications = useMatrixNotifications();
  const { getWeatherFromCache } = useWeatherCache();

  const [formState, setFormState] = useState({
    showSetup: false,
    showManualLocation: false,
    cityName: '',
    latitude: '',
    longitude: '',
  });

  const updateFormState = useCallback((updates: Partial<typeof formState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  // Query hooks
  const locationQuery = useCurrentLocation(false);
  const weatherMutation = useWeatherMutation();

  const autoWeatherQuery = useWeatherByCoords(
    location?.latitude || null,
    location?.longitude || null,
    apiKey,
    Boolean(apiKey && location?.latitude && location?.longitude)
  );

  const cityWeatherQuery = useWeatherByCity(
    formState.cityName,
    apiKey,
    false
  );

  useEffect(() => {
    if (cityWeatherQuery.data) {
      updateLocationAndWeather(cityWeatherQuery.data);
      notifications.showSuccess('Weather fetched successfully!');
      updateFormState({
        showSetup: false,
        showManualLocation: false,
        cityName: '',
      });
    }
  }, [cityWeatherQuery.data]);

  useEffect(() => {
    if (cityWeatherQuery.error) {
      notifications.showError(
        cityWeatherQuery.error.message || 'Failed to fetch weather for city'
      );
    }
  }, [cityWeatherQuery.error]);

  const showedInitMessage = useRef(false);

  const updateLocationAndWeather = useCallback((weatherData: any) => {
    const locationData: LocationData = {
      latitude: weatherData.coord.lat,
      longitude: weatherData.coord.lon,
      city: weatherData.name,
      country: weatherData.sys.country
    };

    setLocation(locationData);
    setWeatherData(weatherData);

    if (!showedInitMessage.current) {
      notifications.showSuccess('Weather matrix initialized!');
      showedInitMessage.current = true;
    }
  }, [setLocation, setWeatherData, notifications]);

  const handleManualLocation = useCallback(() => {
    updateFormState({ showManualLocation: true });
  }, [updateFormState]);

  const handleFetchWeather = useCallback(async (locationOverride?: LocationData) => {
    if (!apiKey.trim()) {
      notifications.showError('API key is required');
      return;
    }

    let targetLocation = locationOverride || location;

    if (formState.showManualLocation && !locationOverride) {
      if (formState.cityName.trim()) {
        notifications.showInfo(`Searching weather for ${formState.cityName.trim()}...`);
        cityWeatherQuery.refetch();
        return;
      }

      if (formState.latitude && formState.longitude) {
        targetLocation = {
          latitude: parseFloat(formState.latitude),
          longitude: parseFloat(formState.longitude)
        };
      } else {
        notifications.showError('Please provide either a city name or coordinates');
        return;
      }
    }

    if (!targetLocation) {
      notifications.showError('Location is required');
      return;
    }

    const cachedData = getWeatherFromCache(targetLocation.latitude, targetLocation.longitude);
    if (cachedData) {
      notifications.showInfo('Using cached weather data');
      setWeatherData(cachedData);
      updateFormState({ showSetup: false });
      return;
    }

    notifications.showInfo('Fetching weather data...');

    try {
      const result = await weatherMutation.mutateAsync({
        location: targetLocation,
        apiKey
      });

      updateLocationAndWeather(result);
      updateFormState({ showSetup: false, showManualLocation: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch weather';
      notifications.showError(message);
    }
  }, [
    apiKey,
    location,
    formState,
    cityWeatherQuery,
    getWeatherFromCache,
    setWeatherData,
    weatherMutation,
    updateLocationAndWeather,
    updateFormState,
    notifications
  ]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!apiKey.trim()) {
      notifications.showError('API key is required');
      return;
    }

    notifications.showInfo('Getting your location...');

    locationQuery.refetch()
      .then(({ data }) => {
        if (data) {
          setLocation(data);
          handleFetchWeather(data);
        } else {
          notifications.showError('Failed to get current location');
        }
      })
      .catch(error => {
        notifications.showError(`Error fetching location: ${error.message}`);
      });
  }, [apiKey, notifications, locationQuery, setLocation, handleFetchWeather]);

  const isLoading = locationQuery.isLoading ||
    autoWeatherQuery.isLoading ||
    cityWeatherQuery.isLoading ||
    weatherMutation.isPending;

  const getStatusText = (): string => {
    if (locationQuery.isLoading) return 'Getting location...';
    if (autoWeatherQuery.isLoading || cityWeatherQuery.isLoading || weatherMutation.isPending) return 'Loading weather...';
    if (autoWeatherQuery.error || locationQuery.error || cityWeatherQuery.error) {
      return `Error: ${autoWeatherQuery.error?.message || locationQuery.error?.message || cityWeatherQuery.error?.message}`;
    }
    if (apiKey && location) return 'Ready';
    if (apiKey) return 'API key loaded';
    return 'Waiting for setup...';
  };

  const isError = Boolean(
    autoWeatherQuery.error ||
    locationQuery.error ||
    cityWeatherQuery.error ||
    weatherMutation.error
  );

  return {
    formState,
    updateFormState,
    handleFetchWeather,
    handleGetCurrentLocation,
    handleManualLocation,
    isLoading,
    isError,
    getStatusText,
    env,
    location,
    getWeatherFromCache
  };
}
