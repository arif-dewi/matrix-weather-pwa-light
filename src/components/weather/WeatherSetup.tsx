import { useEffect } from 'react';
import { WeatherSetupPanel } from './WeatherSetupPanel';
import { useWeatherSetupController } from '@/hooks/useWeatherSetupController';

export function WeatherSetup() {
  const {
    formState,
    updateFormState,
    handleFetchWeather,
    handleGetCurrentLocation,
    handleManualLocation,
    isLoading,
    isError,
    getStatusText,
    env,
    location,
    getWeatherFromCache
  } = useWeatherSetupController();

  useEffect(() => {
    if (!formState.showSetup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleFetchWeather();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        updateFormState({ showSetup: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formState.showSetup, handleFetchWeather, updateFormState]);

  const isCacheAvailable = location
    ? Boolean(getWeatherFromCache(location.latitude, location.longitude))
    : false;

  return (
    <>
      <button
        onClick={() => updateFormState({ showSetup: !formState.showSetup })}
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
          showCacheInfo={env.isDevelopment}
          isCacheAvailable={isCacheAvailable}
        />
      )}
    </>
  );
}
