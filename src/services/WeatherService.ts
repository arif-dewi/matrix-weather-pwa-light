import type { WeatherData, LocationData, ApiError } from '@/types/weather';
import { API_VALIDATION } from '@/constants/weather';

class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  async fetchWeatherByCoords(
    lat: number,
    lon: number,
    apiKey: string
  ): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return this.makeRequest(url);
  }

  async fetchWeatherByCity(
    city: string,
    apiKey: string
  ): Promise<WeatherData> {
    const encodedCity = encodeURIComponent(city);
    const url = `${this.baseUrl}/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;
    return this.makeRequest(url);
  }

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let message = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: API_VALIDATION.TIMEOUT_MS,
          maximumAge: API_VALIDATION.MAX_AGE_MS
        }
      );
    });
  }

  private async makeRequest(url: string): Promise<WeatherData> {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        const error = data as ApiError;
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (data.cod && data.cod !== 200) {
        throw new Error(data.message || 'Weather API error');
      }

      return data as WeatherData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey.length >= API_VALIDATION.MIN_KEY_LENGTH &&
      API_VALIDATION.KEY_PATTERN.test(apiKey);
  }
}

export const weatherService = new WeatherService();