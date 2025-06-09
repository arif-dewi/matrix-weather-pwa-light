// components/WeatherDisplay.tsx
import { useWeather } from '@/hooks/useWeather.ts';
import { useWeatherMetrics } from '@/hooks/useWeatherMetrics';
import { WEATHER_VISUAL_SETTINGS } from '@/constants/matrix';
import { WeatherDetailItem } from './WeatherDetailItem';
import { LoadingDisplay } from './LoadingDisplay';
import { RefreshIndicator } from './RefreshIndicator';
import {ErrorFallback} from "@/components/shared/ErrorFallback.tsx";

export function WeatherDisplay() {
  const {
    weatherData,
    matrixEffect,
    isLoading,
    isError,
    lastFetchTime,
    refreshError,
  } = useWeather();

  const settings = WEATHER_VISUAL_SETTINGS[matrixEffect];

  if (isError) return <ErrorFallback error={refreshError} />
  if (isLoading || !weatherData) return <LoadingDisplay />;

  const {
    feelsLikeTemp,
    tempDiff,
    visibility,
    windDirText,
    pressureTrend,
  } = useWeatherMetrics(weatherData);


  return (
    <div className="weather-display">
      <div
        className="weather-card"
        style={{
          color: settings.color,
          borderColor: settings.color,
          boxShadow: `0 0 30px ${settings.color}40`,
        }}
      >
        <div className="weather-title" style={{ color: settings.color, textShadow: `0 0 10px ${settings.color}` }}>
          WEATHER MATRIX
        </div>

        <div className="weather-location" style={{ color: settings.color }}>
          {weatherData.name}, {weatherData.sys.country}
        </div>

        <div className="weather-temperature text-4xl sm:text-6xl xs:text-6xl" style={{ color: settings.color, textShadow: `0 0 20px ${settings.color}` }}>
          {Math.round(weatherData.main.temp)}°C
          {tempDiff !== 0 && (
            <div className="text-base sm:text-lg opacity-75 mt-1">
              Feels like {feelsLikeTemp}°C
            </div>
          )}
        </div>

        <div className="weather-description" style={{ color: settings.color }}>
          {weatherData.weather[0].description.toUpperCase()}
        </div>

        <div className="weather-details" style={{ color: settings.color }}>
          <WeatherDetailItem icon="💧" label="Humidity" value={weatherData.main.humidity} unit="%" />
          <WeatherDetailItem icon="💨" label="Wind" value={`${weatherData.wind.speed} m/s`} unit={windDirText ? ` ${windDirText}` : ''} />
          <WeatherDetailItem icon="📊" label="Pressure" value={`${weatherData.main.pressure} ${pressureTrend}`} unit=" hPa" />
          {visibility && <WeatherDetailItem icon="👁" label="Visibility" value={visibility} unit=" km" />}
          <WeatherDetailItem icon="🌡" label="Range" value={`${Math.round(weatherData.main.temp_min)}° - ${Math.round(weatherData.main.temp_max)}°`} />
          <WeatherDetailItem icon="⚡" label="Effect" value={matrixEffect.toUpperCase()} />
        </div>

        <RefreshIndicator isRefetching={isLoading} lastUpdate={lastFetchTime} />
      </div>
    </div>
  );
}
