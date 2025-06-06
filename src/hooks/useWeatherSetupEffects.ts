// src/hooks/useWeatherSetupEffects.ts
import { useEffect } from 'react';
import { env } from '@/config/env';
import type { LocationData } from '@/types/weather';
import { WeatherSetupLogicReturn } from './useWeatherSetupLogic';

export const useWeatherSetupEffects = (logic: WeatherSetupLogicReturn) => {
  const {
    location,
    processFlags,
    locationQuery,
    autoWeatherQuery,
    cityWeatherQuery,
    updateFormState,
    setLocation,
    setWeatherData,
    notifications,
  } = logic;

  // Auto-initialize effect
  useEffect(() => {
    const shouldAutoInit =
      env.apiKey &&
      location &&
      !autoWeatherQuery.data &&
      !autoWeatherQuery.isLoading &&
      !autoWeatherQuery.error &&
      !processFlags.current.autoWeather;

    if (shouldAutoInit) {
      updateFormState({ isInitializing: true });
      notifications.showInfo('Auto-initializing with environment settings...');
    }
  }, [env.apiKey, location, autoWeatherQuery.data, autoWeatherQuery.isLoading, autoWeatherQuery.error]);

  // Handle auto weather success
  useEffect(() => {
    if (autoWeatherQuery.data && !processFlags.current.autoWeather) {
      processFlags.current.autoWeather = true;
      setWeatherData(autoWeatherQuery.data);

      if (!processFlags.current.matrixInitialized) {
        notifications.showSuccess('Weather matrix initialized!');
        processFlags.current.matrixInitialized = true;
      }

      updateFormState({ showSetup: false, isInitializing: false });
    }
  }, [autoWeatherQuery.data]);

  // Reset auto weather flag
  useEffect(() => {
    if (!autoWeatherQuery.data) {
      processFlags.current.autoWeather = false;
    }
  }, [autoWeatherQuery.data]);

  // Handle auto weather error
  useEffect(() => {
    if (autoWeatherQuery.error) {
      notifications.showError(autoWeatherQuery.error.message || 'Failed to fetch weather');
      updateFormState({ isInitializing: false });
    }
  }, [autoWeatherQuery.error]);

  // Handle location success
  useEffect(() => {
    if (locationQuery.data && !processFlags.current.locationData) {
      processFlags.current.locationData = true;
      setLocation(locationQuery.data);
      notifications.showSuccess('Location acquired successfully!');
    }
  }, [locationQuery.data]);

  // Reset location flag
  useEffect(() => {
    if (!locationQuery.data) {
      processFlags.current.locationData = false;
    }
  }, [locationQuery.data]);

  // Handle location error
  useEffect(() => {
    if (locationQuery.error) {
      notifications.showError(locationQuery.error.message || 'Failed to get location');
    }
  }, [locationQuery.error]);

  // Handle city weather success
  useEffect(() => {
    if (cityWeatherQuery.data && !processFlags.current.cityWeather) {
      processFlags.current.cityWeather = true;

      const updatedLocation: LocationData = {
        latitude: cityWeatherQuery.data.coord.lat,
        longitude: cityWeatherQuery.data.coord.lon,
        city: cityWeatherQuery.data.name,
        country: cityWeatherQuery.data.sys.country
      };

      setLocation(updatedLocation);
      setWeatherData(cityWeatherQuery.data);
      notifications.showSuccess(`Weather loaded for ${cityWeatherQuery.data.name}!`);
      updateFormState({ showSetup: false, showManualLocation: false, cityName: '' });
    }
  }, [cityWeatherQuery.data]);

  // Reset city weather flag
  useEffect(() => {
    if (!cityWeatherQuery.data) {
      processFlags.current.cityWeather = false;
    }
  }, [cityWeatherQuery.data]);
};