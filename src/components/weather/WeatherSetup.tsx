import { useEffect, useState } from 'react';
import { WeatherSetupPanel } from './WeatherSetupPanel';
import { useWeather } from '@/hooks/useWeather';
import { useWeatherStore } from '@/stores/weatherStore';
import { weatherService } from '@/services/WeatherService';
import { useMatrixNotifications } from '@/stores/notificationStore';

const KEY = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
}

export function WeatherSetup() {
  const { city, setCity } = useWeatherStore();
  const notifications = useMatrixNotifications();
  const { weatherData, isLoading, isError } = useWeather();

  const [formState, setFormState] = useState({
    showSetup: false,
    showManualLocation: false,
    cityName: '',
  });

  // Automatically fetch weather for current location if no city is set
  useEffect(() => {
    if (!city) {
      weatherService.getCurrentLocation()
        .then((loc) => weatherService.fetchWeatherByCoords(loc.latitude, loc.longitude))
        .then((data) => {
          setCity(data.name);
          notifications.showInfo(`Location detected: ${data.name}`);
        })
        .catch((err) => {
          notifications.showError(err.message);
        });
    }
  }, []);

  const openForm = () => {
    setFormState((prev) => ({
      ...prev,
      showSetup: !prev.showSetup,
    }));
  };

  const handleManualLocation = () => {
    setFormState((prev) => ({
      ...prev,
      showManualLocation: !prev.showManualLocation,
    }));
  };

  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleFetchWeather = () => {
    const trimmedCity = formState.cityName.trim();

    if (!trimmedCity) {
      notifications.showError('Please enter a valid city name');
      return;
    }

    setCity(trimmedCity);
    setFormState({
      showSetup: false,
      showManualLocation: false,
      cityName: '',
    });
  };

  const getStatusText = () => {
    if (isLoading) return 'Fetching weather...';
    if (isError) return 'Error loading weather';
    if (weatherData) return `Weather loaded for: ${weatherData.name}`;
    return 'Idle';
  };

  const handleGetCurrentLocation = () => {
    weatherService.getCurrentLocation()
      .then((loc) => weatherService.fetchWeatherByCoords(loc.latitude, loc.longitude))
      .then((data) => {
        setCity(data.name);
        setFormState({
          showSetup: false,
          showManualLocation: false,
          cityName: '',
        });
        notifications.showInfo(`Auto-location: ${data.name}`);
      })
      .catch((err) => notifications.showError(err.message));
  }

  // Submit on Enter key press, close on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (formState.showSetup) {
        if (event.key === KEY.ENTER) {
          handleFetchWeather();
        } else if (event.key === KEY.ESCAPE) {
          setFormState((prev) => ({ ...prev, showSetup: false }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formState.showSetup, handleFetchWeather]);

  return (
    <>
      <button
        onClick={openForm}
        className="gear-button"
        title="Weather Matrix Settings"
        disabled={isLoading}
      >
        {isLoading ? '⚡' : '⚙️'}
      </button>

      {formState.showSetup && (
        <WeatherSetupPanel
          formState={formState}
          updateFormState={updateFormState}
          handleFetchWeather={handleFetchWeather}
          handleGetCurrentLocation={handleGetCurrentLocation}
          handleManualLocation={handleManualLocation}
          isLoading={isLoading}
          isError={isError}
          getStatusText={getStatusText}
        />
      )}
    </>
  );
}