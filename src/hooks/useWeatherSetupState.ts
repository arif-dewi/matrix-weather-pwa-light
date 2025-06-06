// src/hooks/useWeatherSetupState.ts
import { WeatherSetupLogicReturn } from "@/hooks/useWeatherSetupLogic.ts";

export const useWeatherSetupState = (logic: WeatherSetupLogicReturn) => {
  const { formState, locationQuery, autoWeatherQuery, cityWeatherQuery, weatherMutation, apiKey, location } = logic;

  const isLoading =
    locationQuery.isLoading ||
    autoWeatherQuery.isLoading ||
    cityWeatherQuery.isLoading ||
    weatherMutation.isPending ||
    formState.isInitializing;

  const getStatusText = (): string => {
    if (formState.isInitializing) return 'Auto-initializing...';
    if (locationQuery.isLoading) return 'Getting location...';
    if (autoWeatherQuery.isLoading || cityWeatherQuery.isLoading || weatherMutation.isPending) {
      return 'Loading weather...';
    }
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
    isLoading,
    isError,
    getStatusText,
  };
};