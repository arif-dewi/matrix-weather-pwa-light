import { useState, useEffect } from 'react';
import { useWeatherStore } from '@/stores/weatherStore';
import { weatherService } from '@/services/WeatherService';
import { env } from '@/config/env';
import type { LocationData } from '@/types/weather';

export function WeatherSetup() {
  const {
    apiKey,
    location,
    isLoading,
    error,
    setError,
    setLocation,
    setWeatherData,
    setLoading,
    setApiKey
  } = useWeatherStore();

  const [showSetup, setShowSetup] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [cityName, setCityName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('Waiting for setup...');

  // Auto-initialize if we have API key and location from env
  useEffect(() => {
    if (env.apiKey && location && !isLoading && !error) {
      setStatus('Auto-initializing with environment settings...');
      handleFetchWeather();
    }
  }, []);

  useEffect(() => {
    if (error) {
      setStatus(`Error: ${error}`);
    } else if (isLoading) {
      setStatus('Loading...');
    } else if (apiKey) {
      setStatus('API key loaded from environment');
    }
  }, [error, isLoading]);

  // Submit on enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showSetup) {
        event.preventDefault();
        handleFetchWeather();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSetup, cityName, latitude, longitude, apiKey]);

  const fetchWeatherData = async (
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
  };

  const handleGetCurrentLocation = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('Getting your location...');

    try {
      const currentLocation = await weatherService.getCurrentLocation();
      await fetchWeatherData(apiKey, currentLocation);
      setStatus('Weather matrix initialized!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get location';
      setError(message);
      setStatus(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocation = () => {
    setShowManualLocation(true);
  };

  const handleFetchWeather = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    let locationData = location;
    let cityOverride = '';

    // Use manual location if provided
    if (showManualLocation) {
      if (cityName.trim()) {
        cityOverride = cityName.trim();
        locationData = { latitude: 0, longitude: 0 }; // Will be updated by API
      } else if (latitude && longitude) {
        locationData = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        };
      } else {
        setError('Please provide either a city name or coordinates');
        return;
      }
    }

    if (!locationData) {
      setError('Location is required');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('Fetching weather data...');

    try {
      await fetchWeatherData(apiKey, locationData, cityOverride);
      setStatus('Weather matrix initialized!');
      setShowSetup(false); // Hide setup after successful initialization
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch weather';
      setError(message);
      setStatus(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Gear Icon Button - Always visible */}
      <button
        onClick={() => setShowSetup(!showSetup)}
        className="gear-button"
        title="Weather Matrix Settings"
      >
        ⚙️
      </button>

      {/* Setup Panel - Conditionally visible */}
      {showSetup && (
        <div className="setup-panel">
          <div className="setup-panel-header">
            <div className="setup-panel-title">⚡ WEATHER MATRIX SETUP</div>
            <button
              onClick={() => setShowSetup(false)}
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

          {showManualLocation && (
            <div className="setup-inputs">
              <input
                type="text"
                placeholder="City name (optional)"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="setup-input"
              />
              <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                step="any"
                className="setup-input"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                step="any"
                className="setup-input"
              />
            </div>
          )}

          <button
            onClick={handleFetchWeather}
            disabled={isLoading}
            className="initialize-button"
          >
            {isLoading ? '⚡ INITIALIZING...' : '🚀 INITIALIZE MATRIX'}
          </button>

          <div className={`status-text ${error ? 'status-error' : ''}`}>
            Status: {status}
          </div>
        </div>
      )}
    </>
  );
}