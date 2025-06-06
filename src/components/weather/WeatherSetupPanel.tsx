import React from 'react';
import type { LocationData } from '@/types/weather';

interface FormState {
  showSetup: boolean;
  showManualLocation: boolean;
  cityName: string;
  latitude: string;
  longitude: string;
}

interface WeatherSetupPanelProps {
  formState: {
    showManualLocation: boolean;
    cityName: string;
    latitude: string;
    longitude: string;
  };
  updateFormState: (updates: Partial<FormState>) => void;
  handleFetchWeather: (locationOverride?: LocationData) => void;
  handleGetCurrentLocation: () => void;
  handleManualLocation: () => void;
  isLoading: boolean;
  isError: boolean;
  getStatusText: () => string;
  showCacheInfo?: boolean;
  isCacheAvailable?: boolean;
}

export const WeatherSetupPanel: React.FC<WeatherSetupPanelProps> = ({
  formState,
  updateFormState,
  handleFetchWeather,
  handleGetCurrentLocation,
  handleManualLocation,
  isLoading,
  isError,
  getStatusText,
  showCacheInfo = false,
  isCacheAvailable = false
}) => {
  return (
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

      {showCacheInfo && (
        <div className="status-text">
          Cache: {isCacheAvailable ? 'Available' : 'Empty'}
        </div>
      )}
    </div>
  );
};
