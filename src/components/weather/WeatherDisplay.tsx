import { useWeatherStore } from '@/stores/weatherStore';
import { WEATHER_VISUAL_SETTINGS } from '@/constants/matrix';

export function WeatherDisplay() {
  const { weatherData, isLoading, matrixEffect } = useWeatherStore();

  if (!weatherData && !isLoading) {
    return null;
  }

  const settings = WEATHER_VISUAL_SETTINGS[matrixEffect];

  if (isLoading) {
    return (
      <div className="loading-display">
        <div className="loading-card">
          <div className="loading-title">
            WEATHER MATRIX
          </div>
          <div className="loading-text">
            Initializing...
          </div>
          <div className="loading-text">
            LOADING DATA STREAM
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

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
          title={`${weatherData.name}, ${weatherData.sys.country}`}
        >
          {weatherData.name}, {weatherData.sys.country}
        </div>

        <div
          className="weather-temperature"
          style={{
            color: settings.color,
            textShadow: `0 0 20px ${settings.color}`
          }}
        >
          {Math.round(weatherData.main.temp)}°C
        </div>

        <div
          className="weather-description"
          style={{ color: settings.color }}
        >
          {weatherData.weather[0].description}
        </div>

        <div
          className="weather-details"
          style={{ color: settings.color }}
        >
          <div className="weather-detail-item">
            <div className="weather-detail-label">Humidity</div>
            <div>{weatherData.main.humidity}%</div>
          </div>
          <div className="weather-detail-item">
            <div className="weather-detail-label">Wind</div>
            <div>{weatherData.wind.speed} m/s</div>
          </div>
          <div className="weather-detail-item">
            <div className="weather-detail-label">Pressure</div>
            <div>{weatherData.main.pressure} hPa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
