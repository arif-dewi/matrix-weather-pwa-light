// src/components/weather/WeatherSetup.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWeatherSetup, useWeatherPreferences } from '@/stores/weatherStore';
import {
  useCurrentLocation,
  useWeatherMutation,
  useWeatherByCoords,
  useWeatherByCity,
  useWeatherCache
} from '@/services/WeatherQueryService';
import { useMatrixNotifications } from '@/stores/notificationStore';
import { env } from '@/config/env';
import type { LocationData } from '@/types/weather';

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

export function WeatherSetup() {
  const { apiKey, location, setLocation, setWeatherData } = useWeatherSetup();
  const preferences = useWeatherPreferences();
  const notifications = useMatrixNotifications();
  const { getWeatherFromCache } = useWeatherCache();
  const [formState, setFormState] = useState<SetupFormState>(INITIAL_FORM_STATE);

  const hasShownMatrixInitializedRef = useRef(false);
  // Add refs to track if we've already processed certain events
  const hasProcessedAutoWeather = useRef(false);
  const hasProcessedLocationData = useRef(false);
  const hasProcessedCityWeather = useRef(false);

  // TanStack Query hooks
  const {
    data: currentLocationData,
    isLoading: isLocationLoading,
    error: locationError,
    refetch: refetchLocation,
  } = useCurrentLocation({ enabled: false });

  const weatherMutation = useWeatherMutation();

  // Auto-query weather if we have coordinates and API key
  const {
    data: autoWeatherData,
    isLoading: isAutoWeatherLoading,
    error: autoWeatherError,
  } = useWeatherByCoords(
    location?.latitude || null,
    location?.longitude || null,
    apiKey,
    {
      enabled: Boolean(apiKey && location?.latitude && location?.longitude),
      staleTime: preferences.refreshInterval * 60 * 1000,
      refetchInterval: preferences.autoRefresh ? preferences.refreshInterval * 60 * 1000 : false,
    }
  );

  // Manual city query
  const {
    data: cityWeatherData,
    isLoading: isCityWeatherLoading,
    error: cityWeatherError,
    refetch: refetchCityWeather,
  } = useWeatherByCity(
    formState.cityName,
    apiKey,
    { enabled: false } // Only trigger manually
  );

  // Update form state helper
  const updateFormState = useCallback((updates: Partial<SetupFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  // Auto-initialize if we have API key and location from environment
  useEffect(() => {
    const shouldAutoInit = env.apiKey && location && !autoWeatherData && !isAutoWeatherLoading && !autoWeatherError && !hasProcessedAutoWeather.current;

    if (shouldAutoInit) {
      updateFormState({ isInitializing: true });
      notifications.showInfo('Auto-initializing with environment settings...');
    }
  }, [env.apiKey, location, autoWeatherData, isAutoWeatherLoading, autoWeatherError, notifications, updateFormState]);

  // Handle successful auto weather fetch - FIXED
  useEffect(() => {
    if (autoWeatherData && !hasProcessedAutoWeather.current) {
      hasProcessedAutoWeather.current = true;
      setWeatherData(autoWeatherData);

      if (!hasShownMatrixInitializedRef.current) {
        notifications.showSuccess('Weather matrix initialized!');
        hasShownMatrixInitializedRef.current = true;
      }

      updateFormState({ showSetup: false, isInitializing: false });
    }
  }, [autoWeatherData, setWeatherData, notifications, updateFormState]);

  // Reset the processed flag when relevant data changes
  useEffect(() => {
    if (!autoWeatherData) {
      hasProcessedAutoWeather.current = false;
    }
  }, [autoWeatherData]);

  // Handle weather errors
  useEffect(() => {
    if (autoWeatherError) {
      const errorMessage = autoWeatherError.message || 'Failed to fetch weather';
      notifications.showError(errorMessage);
      updateFormState({ isInitializing: false });
    }
  }, [autoWeatherError, notifications, updateFormState]);

  // Handle successful location fetch - FIXED
  useEffect(() => {
    if (currentLocationData && !hasProcessedLocationData.current) {
      hasProcessedLocationData.current = true;
      setLocation(currentLocationData);
      notifications.showSuccess('Location acquired successfully!');

      // Trigger weather fetch if we have API key
      if (apiKey) {
        handleFetchWeather(currentLocationData);
      }
    }
  }, [currentLocationData, apiKey, setLocation, notifications]);

  // Reset location processed flag when location data changes
  useEffect(() => {
    if (!currentLocationData) {
      hasProcessedLocationData.current = false;
    }
  }, [currentLocationData]);

  // Handle location errors
  useEffect(() => {
    if (locationError) {
      const errorMessage = locationError instanceof Error ? locationError.message : 'Failed to get location';
      notifications.showError(errorMessage);
    }
  }, [locationError, notifications]);

  // Handle successful city weather fetch - FIXED
  useEffect(() => {
    if (cityWeatherData && !hasProcessedCityWeather.current) {
      hasProcessedCityWeather.current = true;
      const updatedLocation: LocationData = {
        latitude: cityWeatherData.coord.lat,
        longitude: cityWeatherData.coord.lon,
        city: cityWeatherData.name,
        country: cityWeatherData.sys.country
      };

      setLocation(updatedLocation);
      setWeatherData(cityWeatherData);
      notifications.showSuccess(`Weather loaded for ${cityWeatherData.name}!`);
      updateFormState({ showSetup: false, showManualLocation: false, cityName: '' });
    }
  }, [cityWeatherData, setLocation, setWeatherData, notifications, updateFormState]);

  // Reset city weather processed flag when city weather data changes
  useEffect(() => {
    if (!cityWeatherData) {
      hasProcessedCityWeather.current = false;
    }
  }, [cityWeatherData]);

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && formState.showSetup) {
        event.preventDefault();
        handleFetchWeather();
      }

      // ESC to close setup
      if (event.key === 'Escape' && formState.showSetup) {
        event.preventDefault();
        updateFormState({ showSetup: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formState.showSetup, formState.cityName, formState.latitude, formState.longitude, apiKey]);

  const handleGetCurrentLocation = async () => {
    if (!apiKey.trim()) {
      notifications.showError('API key is required');
      return;
    }

    notifications.showInfo('Getting your location...');
    hasProcessedLocationData.current = false; // Reset flag before refetch
    refetchLocation();
  };

  const handleManualLocation = () => {
    updateFormState({ showManualLocation: true });
  };

  const handleFetchWeather = async (locationOverride?: LocationData) => {
    if (!apiKey.trim()) {
      notifications.showError('API key is required');
      return;
    }

    if (!hasShownMatrixInitializedRef.current) {
      notifications.showSuccess('Weather matrix initialized!');
      hasShownMatrixInitializedRef.current = true;
    }

    let targetLocation = locationOverride || location;
    let cityOverride = '';

    // Handle manual location input
    if (formState.showManualLocation && !locationOverride) {
      if (formState.cityName.trim()) {
        // Use city search
        cityOverride = formState.cityName.trim();
        notifications.showInfo(`Searching weather for ${cityOverride}...`);
        hasProcessedCityWeather.current = false; // Reset flag before refetch
        refetchCityWeather();
        return;
      } else if (formState.latitude && formState.longitude) {
        // Use manual coordinates
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

    // Check cache first for better UX
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
        apiKey,
        cityOverride
      });

      // Update location with actual coordinates from API response
      const updatedLocation: LocationData = {
        latitude: result.coord.lat,
        longitude: result.coord.lon,
        city: result.name,
        country: result.sys.country
      };

      setLocation(updatedLocation);
      setWeatherData(result);
      notifications.showSuccess('Weather matrix initialized!');
      updateFormState({ showSetup: false, showManualLocation: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch weather';
      notifications.showError(message);
    }
  };

  const isLoading = isLocationLoading || isAutoWeatherLoading || isCityWeatherLoading ||
    weatherMutation.isPending || formState.isInitializing;

  const getStatusText = (): string => {
    if (formState.isInitializing) return 'Auto-initializing...';
    if (isLocationLoading) return 'Getting location...';
    if (isAutoWeatherLoading || isCityWeatherLoading || weatherMutation.isPending) return 'Loading weather...';
    if (autoWeatherError || locationError || cityWeatherError) {
      return `Error: ${autoWeatherError?.message || locationError?.message || cityWeatherError?.message}`;
    }
    if (apiKey && location) return 'Ready';
    if (apiKey) return 'API key loaded';
    return 'Waiting for setup...';
  };

  const isError = Boolean(autoWeatherError || locationError || cityWeatherError || weatherMutation.error);

  return (
    <>
      {/* Gear Icon Button */}
      <button
        onClick={() => updateFormState({ showSetup: !formState.showSetup })}
        className="gear-button"
        title="Weather Matrix Settings"
        disabled={isLoading}
      >
        {isLoading ? '⚡' : '⚙️'}
      </button>

      {/* Setup Panel */}
      {formState.showSetup && (
        <div className="setup-panel">
          <div className="setup-panel-header">
            <div className="setup-panel-title">⚡ WEATHER MATRIX SETUP</div>
            <button
              onClick={() => updateFormState({ showSetup: false })}
              className="setup-panel-close"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="setup-button-group">
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="setup-button"
            >
              📍 Auto Location
            </button>
            <button
              onClick={handleManualLocation}
              disabled={isLoading}
              className="setup-button"
            >
              🌍 Manual
            </button>
          </div>

          {formState.showManualLocation && (
            <div className="setup-inputs">
              <input
                type="text"
                placeholder="City name (e.g., London, Tokyo)"
                value={formState.cityName}
                onChange={(e) => updateFormState({ cityName: e.target.value })}
                className="setup-input"
                disabled={isLoading}
              />
              <input
                type="number"
                placeholder="Latitude"
                value={formState.latitude}
                onChange={(e) => updateFormState({ latitude: e.target.value })}
                step="any"
                className="setup-input"
                disabled={isLoading}
              />
              <input
                type="number"
                placeholder="Longitude"
                value={formState.longitude}
                onChange={(e) => updateFormState({ longitude: e.target.value })}
                step="any"
                className="setup-input"
                disabled={isLoading}
              />
            </div>
          )}

          <button
            onClick={() => handleFetchWeather()}
            disabled={isLoading}
            className="initialize-button"
          >
            {isLoading ? '⚡ INITIALIZING...' : '🚀 INITIALIZE MATRIX'}
          </button>

          <div className={`status-text ${isError ? 'status-error' : ''}`}>
            Status: {getStatusText()}
          </div>

          {/* Cache info for debugging in development */}
          {env.isDevelopment && location && (
            <div className="status-text">
              Cache: {getWeatherFromCache(location.latitude, location.longitude) ? 'Available' : 'Empty'}
            </div>
          )}
        </div>
      )}
    </>
  );
}