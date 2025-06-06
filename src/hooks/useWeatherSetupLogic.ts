// src/hooks/useWeatherSetupLogic.ts
import { useState, useCallback, useRef } from 'react';
import { useWeatherSetup } from '@/stores/weatherStore';
import {
  useCurrentLocation,
  useWeatherMutation,
  useWeatherByCoords,
  useWeatherByCity,
  useWeatherCache
} from '@/services/WeatherQueryService';
import { useMatrixNotifications } from '@/stores/notificationStore';
import { LocationData, WeatherData } from "@/types/weather";

interface SetupFormState {
  showSetup: boolean;
  showManualLocation: boolean;
  cityName: string;
  latitude: string;
  longitude: string;
  isInitializing: boolean;
}

const INITIAL_FORM_STATE: SetupFormState = {
  showSetup: false,
  showManualLocation: false,
  cityName: '',
  latitude: '',
  longitude: '',
  isInitializing: false,
};

export interface WeatherSetupLogicReturn {
  formState: SetupFormState;
  apiKey: string;
  location: LocationData | null;
  processFlags: React.MutableRefObject<{
    autoWeather: boolean;
    locationData: boolean;
    cityWeather: boolean;
    matrixInitialized: boolean;
  }>;
  locationQuery: ReturnType<typeof useCurrentLocation>;
  autoWeatherQuery: ReturnType<typeof useWeatherByCoords>;
  cityWeatherQuery: ReturnType<typeof useWeatherByCity>;
  weatherMutation: ReturnType<typeof useWeatherMutation>;
  triggerAutoWeather: () => void;
  triggerLocationQuery: () => Promise<void>;
  updateFormState: (updates: Partial<SetupFormState>) => void;
  setLocation: (location: LocationData | null) => void;
  setWeatherData: (data: any) => void;
  getWeatherFromCache: (latitude: number, longitude: number) => WeatherData | undefined;
  notifications: ReturnType<typeof useMatrixNotifications>;
}

export const useWeatherSetupLogic = () => {
  const { apiKey, location, setLocation, setWeatherData } = useWeatherSetup();
  const notifications = useMatrixNotifications();
  const { getWeatherFromCache } = useWeatherCache();
  const [formState, setFormState] = useState<SetupFormState>(INITIAL_FORM_STATE);

  // Add a trigger state to force re-enable queries
  const [queryTrigger, setQueryTrigger] = useState(0);

  // Processing flags to prevent infinite loops
  const processFlags = useRef({
    autoWeather: false,
    locationData: false,
    cityWeather: false,
    matrixInitialized: false,
  });

  // Add the trigger to the dependency array to force re-evaluation
  const autoWeatherEnabled = Boolean(
    apiKey &&
    location?.latitude &&
    location?.longitude &&
    queryTrigger >= 0 // This will always be true but forces re-evaluation
  );

  // Query hooks - always create them but control enablement
  const locationQuery = useCurrentLocation(false); // Always start disabled
  const weatherMutation = useWeatherMutation();

  const autoWeatherQuery = useWeatherByCoords(
    location?.latitude || null,
    location?.longitude || null,
    apiKey,
    autoWeatherEnabled
  );

  const cityWeatherQuery = useWeatherByCity(
    formState.cityName,
    apiKey,
    false
  );

  // Form state updater
  const updateFormState = useCallback((updates: Partial<SetupFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  // Expose methods to force query re-evaluation
  const triggerAutoWeather = useCallback(() => {
    console.log('🔄 Triggering auto weather query');
    processFlags.current.autoWeather = false;
    setQueryTrigger(prev => prev + 1);
  }, []);

  const triggerLocationQuery = useCallback(() => {
    console.log('📍 Triggering location query');
    processFlags.current.locationData = false;
    return locationQuery.refetch();
  }, [locationQuery]);

  // Attach trigger methods to the logic object
  const logicWithTriggers = {
    // State
    formState,
    apiKey,
    location,
    processFlags,

    // Queries
    locationQuery,
    autoWeatherQuery,
    cityWeatherQuery,
    weatherMutation,

    // Actions
    updateFormState,
    setLocation,
    setWeatherData,
    getWeatherFromCache,
    notifications,

    // Trigger methods
    triggerAutoWeather,
    triggerLocationQuery,
  };

  return logicWithTriggers;
};