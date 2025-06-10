/// <reference types="vite/client" />

interface EnvironmentConfig {
  apiKey: string;
  defaultLocation: {
    city: string;
  };
  app: {
    name: string;
    version: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
  baseWeatherUrl: string;
}

function getOptionalEnvVar(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

export const env: EnvironmentConfig = {
  apiKey: getOptionalEnvVar('VITE_OPENWEATHER_API_KEY', ''),
  defaultLocation: {
    city: getOptionalEnvVar('VITE_DEFAULT_CITY', 'Dubai')
  },
  app: {
    name: getOptionalEnvVar('VITE_APP_NAME', 'Matrix Weather'),
    version: getOptionalEnvVar('VITE_APP_VERSION', '1.0.0')
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  baseWeatherUrl: getOptionalEnvVar('VITE_BASE_WEATHER_URL', 'https://api.openweathermap.org/data/2.5')
};

// Validation
if (!env.apiKey) {
  console.warn('⚠️ VITE_OPENWEATHER_API_KEY not found.');
}
