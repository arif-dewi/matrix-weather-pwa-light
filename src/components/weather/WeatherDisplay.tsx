import { useWeatherDisplay, useWeatherPreferences, useLastFetchTime } from '@/stores/weatherStore';
import { useWeatherByCoords } from '@/services/WeatherQueryService';
import { WEATHER_VISUAL_SETTINGS } from '@/constants/matrix';
import { WeatherDetailItem } from './WeatherDetailItem';
import { LoadingDisplay } from './LoadingDisplay';
import { RefreshIndicator } from './RefreshIndicator';

export function WeatherDisplay() {
  const { weatherData, matrixEffect, location } = useWeatherDisplay();
  const preferences = useWeatherPreferences();
  const lastFetchTime = useLastFetchTime();

  // Auto-refresh weather data based on preferences
  const {
    isLoading: isRefetching,
    error: refreshError,
  } = useWeatherByCoords(
    location?.latitude || null,
    location?.longitude || null,
    '', // API key will be handled by the store
    {
      enabled: Boolean(weatherData && preferences.autoRefresh),
      staleTime: preferences.refreshInterval * 60 * 1000,
      refetchInterval: preferences.autoRefresh ? preferences.refreshInterval * 60 * 1000 : false,
    }
  );

  const settings = WEATHER_VISUAL_SETTINGS[matrixEffect];


  if (!weatherData && !refreshError) {
    return null; // Setup component will handle initial loading
  }

  if (!weatherData) {
    return <LoadingDisplay />;
  }

  // Calculate additional weather metrics
  const feelsLikeTemp = Math.round(weatherData.main.feels_like);
  const tempDiff = feelsLikeTemp - Math.round(weatherData.main.temp);
  const windDirection = weatherData.wind.deg
    ? Math.round(weatherData.wind.deg)
    : null;
  const visibility = weatherData.visibility
    ? Math.round(weatherData.visibility / 1000) // Convert to km
    : null;

  // Wind direction helper
  const getWindDirection = (degrees: number | null): string => {
    if (degrees === null) return '';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Pressure trend indicator (simplified)
  const getPressureTrend = (pressure: number): string => {
    if (pressure > 1020) return '↗'; // High
    if (pressure < 1000) return '↘'; // Low
    return '→'; // Normal
  };

  return (
    <div className="weather-display">
      <div
        className="weather-card"
        style={{
          color: settings.color,
          borderColor: settings.color,
          boxShadow: `0 0 30px ${settings.color}40`
        }}
      >
        <div
          className="weather-title"
          style={{
            color: settings.color,
            textShadow: `0 0 10px ${settings.color}`
          }}
        >
          WEATHER MATRIX
        </div>

        <div
          className="weather-location"
          style={{ color: settings.color }}
          title={`${weatherData.name}, ${weatherData.sys.country} (${weatherData.coord.lat.toFixed(2)}, ${weatherData.coord.lon.toFixed(2)})`}
        >
          {weatherData.name}, {weatherData.sys.country}
        </div>

        <div
          className="weather-temperature text-4xl sm:text-6xl xs:text-6xl"
          style={{
            color: settings.color,
            textShadow: `0 0 20px ${settings.color}`
          }}
        >
          {Math.round(weatherData.main.temp)}°C

          {tempDiff !== 0 && (
            <div className="text-base sm:text-lg opacity-75 mt-1">
              Feels like {feelsLikeTemp}°C
            </div>
          )}
        </div>

        <div
          className="weather-description"
          style={{ color: settings.color }}
        >
          {weatherData.weather[0].description.toUpperCase()}
        </div>

        <div
          className="weather-details"
          style={{ color: settings.color }}
        >
          <WeatherDetailItem
            icon="💧"
            label="Humidity"
            value={weatherData.main.humidity}
            unit="%"
          />
          <WeatherDetailItem
            icon="💨"
            label="Wind"
            value={`${weatherData.wind.speed} m/s`}
            unit={windDirection ? ` ${getWindDirection(windDirection)}` : ''}
          />
          <WeatherDetailItem
            icon="📊"
            label="Pressure"
            value={`${weatherData.main.pressure} ${getPressureTrend(weatherData.main.pressure)}`}
            unit=" hPa"
          />
          {visibility && (
            <WeatherDetailItem
              icon="👁"
              label="Visibility"
              value={visibility}
              unit=" km"
            />
          )}
          <WeatherDetailItem
            icon="🌡"
            label="Range"
            value={`${Math.round(weatherData.main.temp_min)}° - ${Math.round(weatherData.main.temp_max)}°`}
          />
          <WeatherDetailItem
            icon="⚡"
            label="Effect"
            value={matrixEffect.toUpperCase()}
          />
        </div>

        {/* Refresh indicator */}
        <RefreshIndicator
          isRefetching={isRefetching}
          lastUpdate={lastFetchTime}
        />
      </div>
    </div>
  );
}
