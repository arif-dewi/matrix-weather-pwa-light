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
      <div className="fixed inset-0 flex items-center justify-center z-40">
        <div className="bg-black/90 border-2 border-matrix-green rounded-xl p-8 text-center backdrop-blur-matrix animate-pulse-matrix">
          <div className="text-2xl font-bold mb-4 text-matrix-green font-matrix tracking-wider">
            WEATHER MATRIX
          </div>
          <div className="text-lg text-matrix-green opacity-80">
            Initializing...
          </div>
          <div className="text-lg text-matrix-green mt-4">
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
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div
        className="bg-black/90 border-2 rounded-xl p-8 text-center backdrop-blur-matrix shadow-2xl min-w-80 animate-glow"
        style={{
          borderColor: settings.color,
          boxShadow: `0 0 30px ${settings.color}40`
        }}
      >
        <div
          className="text-2xl font-bold mb-6 font-matrix tracking-wider drop-shadow-lg"
          style={{
            color: settings.color,
            textShadow: `0 0 10px ${settings.color}`
          }}
        >
          WEATHER MATRIX
        </div>

        <div
          className="text-lg mb-2 opacity-90"
          style={{ color: settings.color }}
        >
          {weatherData.name}, {weatherData.sys.country}
        </div>

        <div
          className="text-5xl font-bold my-6 font-matrix"
          style={{
            color: settings.color,
            textShadow: `0 0 20px ${settings.color}`
          }}
        >
          {Math.round(weatherData.main.temp)}°C
        </div>

        <div
          className="text-lg mb-6 uppercase tracking-wide"
          style={{ color: settings.color }}
        >
          {weatherData.weather[0].description}
        </div>

        <div
          className="grid grid-cols-3 gap-4 text-sm opacity-80"
          style={{ color: settings.color }}
        >
          <div>
            <div className="font-semibold">Humidity</div>
            <div>{weatherData.main.humidity}%</div>
          </div>
          <div>
            <div className="font-semibold">Wind</div>
            <div>{weatherData.wind.speed} m/s</div>
          </div>
          <div>
            <div className="font-semibold">Pressure</div>
            <div>{weatherData.main.pressure} hPa</div>
          </div>
        </div>

        <div className="mt-6 text-xs opacity-60" style={{ color: settings.color }}>
          Effect: {matrixEffect.toUpperCase()}
        </div>
      </div>
    </div>
  );
}