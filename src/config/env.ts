/// <reference types="vite/client" />

interface EnvironmentConfig {
  apiKey: string;
  defaultLocation: {
    latitude: number;
    longitude: number;
    city: string;
  };
  app: {
    name: string;
    version: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function getOptionalEnvVar(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

export const env: EnvironmentConfig = {
  apiKey: getOptionalEnvVar('VITE_OPENWEATHER_API_KEY', ''),
  defaultLocation: {
    latitude: Number(getOptionalEnvVar('VITE_DEFAULT_LATITUDE', '25.276987')),
    longitude: Number(getOptionalEnvVar('VITE_DEFAULT_LONGITUDE', '55.296249')),
    city: getOptionalEnvVar('VITE_DEFAULT_CITY', 'Dubai')
  },
  app: {
    name: getOptionalEnvVar('VITE_APP_NAME', 'Matrix Weather'),
    version: getOptionalEnvVar('VITE_APP_VERSION', '1.0.0')
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// Validation
if (!env.apiKey && env.isProduction) {
  console.warn('⚠️ VITE_OPENWEATHER_API_KEY not found. Users will need to provide their own API key.');
}

if (env.isDevelopment && !env.apiKey) {
  console.warn('🔑 Add VITE_OPENWEATHER_API_KEY to .env.local for seamless development experience');
}