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
    } catch (err) {
      // Error is already handled in the hook
    }
  };


  return (
    <div className="fixed top-4 left-4 z-50
      bg-[#000000dd]
      text-green-500
      border border-matrix-green
      shadow-[0_0_20px_#00ff00cc]
      rounded-lg
      p-4 max-w-xs
      text-matrix-green
      font-mono text-[11px]
      backdrop-blur"
    >
      <div className="mb-3 font-bold text-sm">⚡ WEATHER MATRIX SETUP</div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="flex-1 bg-matrix-darkGreen border border-matrix-green text-matrix-green px-3 py-1 text-[10px] hover:bg-matrix-green transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          📍 Auto Location
        </button>
        <button
          onClick={handleManualLocation}
          disabled={isLoading}
          className="flex-1 bg-matrix-darkGreen border border-matrix-green text-matrix-green px-3 py-1 text-[10px] hover:bg-matrix-green transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          🌍 Manual
        </button>
      </div>

      {showManualLocation && (
        <div className="mb-3 space-y-2">
          <input
            type="text"
            placeholder="City name (optional)"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full bg-black/70 border border-matrix-green text-matrix-green p-2 font-mono text-[10px] rounded focus:outline-none focus:border-white transition-colors"
          />
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
              className="flex-1 bg-black/70 border border-matrix-green text-matrix-green p-2 font-mono text-[10px] rounded focus:outline-none focus:border-white transition-colors"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
              className="flex-1 bg-black/70 border border-matrix-green text-matrix-green p-2 font-mono text-[10px] rounded focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleFetchWeather}
        disabled={isLoading}
        className="w-full bg-matrix-darkGreen border border-matrix-green text-matrix-green px-3 py-2 font-bold hover:bg-matrix-green transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded animate-glow"
      >
        {isLoading ? '⚡ INITIALIZING...' : '🚀 INITIALIZE MATRIX'}
      </button>

      <div className="mt-3 text-[9px] opacity-60">
        Status: <span className={error ? 'text-red-400' : ''}>{status}</span>
      </div>
    </div>
  );
}