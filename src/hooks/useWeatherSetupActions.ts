// src/hooks/useWeatherSetupActions.ts
import { useCallback } from 'react';
import type { LocationData } from '@/types/weather';
import { WeatherSetupLogicReturn } from "@/hooks/useWeatherSetupLogic";

export const useWeatherSetupActions = (logic: WeatherSetupLogicReturn) => {
  const {
    formState,
    apiKey,
    location,
    processFlags,
    cityWeatherQuery,
    weatherMutation,
    updateFormState,
    setLocation,
    setWeatherData,
    getWeatherFromCache,
    notifications,
    triggerLocationQuery,
  } = logic;

  const handleGetCurrentLocation = useCallback(async () => {
    if (!apiKey.trim()) {
      notifications.showError('API key is required');
      return;
    }

    notifications.showInfo('Getting your location...');

    // **FIX: Use the trigger method to force location query**
    try {
      await triggerLocationQuery();
    } catch (error) {
      console.error('Location query failed:', error);
    }
  }, [apiKey, notifications, triggerLocationQuery]);

  const handleManualLocation = useCallback(() => {
    // Reset flags when switching to manual mode
    processFlags.current.locationData = false;
    processFlags.current.autoWeather = false;
    processFlags.current.cityWeather = false;

    updateFormState({ showManualLocation: true });
  }, [updateFormState, processFlags]);

  const handleFetchWeather = useCallback(async (locationOverride?: LocationData) => {
    if (!apiKey.trim()) {
      notifications.showError('API key is required');
      return;
    }

    if (!processFlags.current.matrixInitialized) {
      notifications.showSuccess('Weather matrix initialized!');
      processFlags.current.matrixInitialized = true;
    }

    let targetLocation = locationOverride || location;
    let cityOverride = '';

    // Handle manual location input
    if (formState.showManualLocation && !locationOverride) {
      if (formState.cityName.trim()) {
        cityOverride = formState.cityName.trim();
        notifications.showInfo(`Searching weather for ${cityOverride}...`);

        processFlags.current.cityWeather = false;
        processFlags.current.autoWeather = false;

        cityWeatherQuery.refetch();
        return;
      } else if (formState.latitude && formState.longitude) {
        targetLocation = {
          latitude: parseFloat(formState.latitude),
          longitude: parseFloat(formState.longitude)
        };

        processFlags.current.locationData = false;
        processFlags.current.autoWeather = false;
        processFlags.current.cityWeather = false;
      } else {
        notifications.showError('Please provide either a city name or coordinates');
        return;
      }
    }

    if (!targetLocation) {
      notifications.showError('Location is required');
      return;
    }

    // Check cache first
    const cachedData = getWeatherFromCache(targetLocation.latitude, targetLocation.longitude);
    if (cachedData) {
      notifications.showInfo('Using cached weather data');
      setWeatherData(cachedData);
      updateFormState({ showSetup: false });
      return;
    }

    notifications.showInfo('Fetching weather data...');

    try {
      processFlags.current.autoWeather = false;
      processFlags.current.cityWeather = false;

      const result = await weatherMutation.mutateAsync({
        location: targetLocation,
        apiKey,
        cityOverride
      });

      const updatedLocation: LocationData = {
        latitude: result.coord.lat,
        longitude: result.coord.lon,
        city: result.name,
        country: result.sys.country
      };

      setLocation(updatedLocation);
      setWeatherData(result);
      notifications.showSuccess('Weather matrix initialized!');
      updateFormState({
        showSetup: false,
        showManualLocation: false,
        cityName: '',
        latitude: '',
        longitude: ''
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch weather';
      notifications.showError(message);

      processFlags.current.autoWeather = false;
      processFlags.current.cityWeather = false;
    }
  }, [
    apiKey,
    location,
    formState,
    weatherMutation,
    setLocation,
    setWeatherData,
    getWeatherFromCache,
    notifications,
    updateFormState,
    processFlags,
    cityWeatherQuery
  ]);

  return {
    handleGetCurrentLocation,
    handleManualLocation,
    handleFetchWeather,
  };
};