import { useState, useEffect } from 'react';
import { useWeatherStore } from '@/stores/weatherStore';
import { useWeather } from '@/hooks/useWeather';
import { env } from '@/config/env';

export function WeatherSetup() {
  const {
    apiKey,
    location,
    isLoading,
    error,
    setError
  } = useWeatherStore();

  const { getCurrentLocationAndFetchWeather, fetchWeatherWithLocation } = useWeather();
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

  const handleGetCurrentLocation = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setStatus('Getting your location...');
    try {
      await getCurrentLocationAndFetchWeather(apiKey);
      setStatus('Weather matrix initialized!');
    } catch (err) {
      // Error is already handled in the hook
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

    setStatus('Fetching weather data...');
    try {
      await fetchWeatherWithLocation(apiKey, locationData, cityOverride);
      setStatus('Weather matrix initialized!');
      setShowSetup(false); // Hide setup after successful initialization
    } catch (err) {
      // Error is already handled in the hook
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
