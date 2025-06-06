// hooks/useWeatherMetrics.ts
import { WeatherData } from '@/types/weather';

export const useWeatherMetrics = (weatherData: WeatherData) => {
  const feelsLikeTemp = Math.round(weatherData.main.feels_like);
  const tempDiff = feelsLikeTemp - Math.round(weatherData.main.temp);
  const visibility = weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null;

  const getWindDirection = (deg: number | null): string => {
    if (deg === null) return '';
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  const windDirection = weatherData.wind.deg ? Math.round(weatherData.wind.deg) : null;

  const getPressureTrend = (pressure: number): string => {
    if (pressure > 1020) return '↗';
    if (pressure < 1000) return '↘';
    return '→';
  };

  return {
    feelsLikeTemp,
    tempDiff,
    visibility,
    windDirection,
    windDirText: getWindDirection(windDirection),
    pressureTrend: getPressureTrend(weatherData.main.pressure),
  };
};
