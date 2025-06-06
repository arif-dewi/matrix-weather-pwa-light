// src/components/weather/WeatherSetup.tsx
import { env } from '@/config/env';
import { useWeatherSetupLogic } from '@/hooks/useWeatherSetupLogic';
import { useWeatherSetupActions } from '@/hooks/useWeatherSetupActions';
import { useWeatherSetupEffects } from '@/hooks/useWeatherSetupEffects';
import { useWeatherSetupState } from '@/hooks/useWeatherSetupState';
import { useWeatherSetupKeyboard } from '@/hooks/useWeatherSetupKeyboard';

export function WeatherSetup() {
  const logic = useWeatherSetupLogic();
  const { formState, location, getWeatherFromCache, updateFormState } = logic;

  useWeatherSetupEffects(logic);
  useWeatherSetupKeyboard(formState.showSetup, updateFormState, () => handleFetchWeather());

  const { handleGetCurrentLocation, handleManualLocation, handleFetchWeather } = useWeatherSetupActions(logic);
  const { isLoading, isError, getStatusText } = useWeatherSetupState(logic);

  return (
    <>
      {/* Gear Button */}
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
            <button onClick={() => updateFormState({ showSetup: false })} className="setup-panel-close">✕</button>
          </div>

          <div className="setup-button-group">
            <button onClick={handleGetCurrentLocation} disabled={isLoading} className="setup-button">
              📍 Auto Location
            </button>
            <button onClick={handleManualLocation} disabled={isLoading} className="setup-button">
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
              <div className="coordinate-inputs">
                <input
                  type="number"
                  placeholder="Latitude"
                  value={formState.latitude}
                  onChange={(e) => updateFormState({ latitude: e.target.value })}
                  className="coordinate-input"
                  disabled={isLoading}
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={formState.longitude}
                  onChange={(e) => updateFormState({ longitude: e.target.value })}
                  className="coordinate-input"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <button onClick={() => handleFetchWeather()} disabled={isLoading} className="initialize-button">
            {isLoading ? '⚡ INITIALIZING...' : '🚀 INITIALIZE MATRIX'}
          </button>

          <div className={`status-text ${isError ? 'status-error' : ''}`}>
            Status: {getStatusText()}
          </div>

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