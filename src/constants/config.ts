import { TemperatureUnit } from '@/types/weather';

// API key is loaded from environment variable for security
// Set EXPO_PUBLIC_WEATHER_API_KEY in your .env file
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || '';

export const Config = {
  api: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    geoUrl: 'https://api.openweathermap.org/geo/1.0',
    key: API_KEY,
    timeout: 10000, // 10 seconds
    maxRetries: 3,
  },

  defaults: {
    unit: 'metric' as TemperatureUnit,
    language: 'en',
    forecastDays: 5,
    maxSavedLocations: 10,
    maxSearchResults: 5,
  },

  location: {
    defaultLatitude: 40.7128,
    defaultLongitude: -74.006,
    defaultCity: 'New York',
  },

  cache: {
    weatherTTL: 10 * 60 * 1000, // 10 minutes
    forecastTTL: 30 * 60 * 1000, // 30 minutes
  },

  storage: {
    savedLocationsKey: '@weather_app_saved_locations',
    settingsKey: '@weather_app_settings',
    lastWeatherKey: '@weather_app_last_weather',
  },
} as const;
