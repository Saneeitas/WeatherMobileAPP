import { Config } from '@/constants/config';
import {
  WeatherData,
  ForecastData,
  ForecastDay,
  HourlyForecast,
  WeatherCondition,
  WeatherError,
  TemperatureUnit,
} from '@/types/weather';

class WeatherApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'WeatherApiError';
  }
}

/**
 * Sanitize user input to prevent injection attacks.
 * Removes any characters that are not alphanumeric, spaces, commas, or hyphens.
 */
function sanitizeQuery(query: string): string {
  return query.replace(/[^a-zA-Z0-9\s,\-.']/g, '').trim().slice(0, 100);
}

/**
 * Perform a fetch request with timeout and error handling.
 */
async function fetchWithTimeout(
  url: string,
  timeout: number = Config.api.timeout
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse API error responses into structured errors.
 */
function handleApiError(status: number, body: unknown): never {
  const message =
    typeof body === 'object' && body !== null && 'message' in body
      ? String((body as { message: string }).message)
      : 'An unknown error occurred';

  switch (status) {
    case 401:
      throw new WeatherApiError('INVALID_API_KEY', 'Invalid API key. Please check your configuration.');
    case 404:
      throw new WeatherApiError('LOCATION_NOT_FOUND', 'Location not found. Please try a different search.');
    case 429:
      throw new WeatherApiError('RATE_LIMIT', 'Too many requests. Please try again later.');
    default:
      throw new WeatherApiError('API_ERROR', message);
  }
}

/**
 * Map raw OpenWeatherMap current weather response to our WeatherData interface.
 */
function mapCurrentWeather(data: Record<string, unknown>): WeatherData {
  const main = data.main as Record<string, number>;
  const wind = data.wind as Record<string, number>;
  const sys = data.sys as Record<string, number>;
  const coord = data.coord as Record<string, number>;
  const weather = (data.weather as Record<string, unknown>[])[0];

  return {
    id: data.id as number,
    name: data.name as string,
    coordinates: {
      latitude: coord.lat,
      longitude: coord.lon,
    },
    temperature: main.temp,
    feelsLike: main.feels_like,
    tempMin: main.temp_min,
    tempMax: main.temp_max,
    humidity: main.humidity,
    pressure: main.pressure,
    windSpeed: wind.speed,
    windDeg: wind.deg || 0,
    visibility: (data.visibility as number) || 10000,
    clouds: ((data.clouds as Record<string, number>)?.all) || 0,
    condition: {
      id: weather.id as number,
      main: weather.main as string,
      description: weather.description as string,
      icon: weather.icon as string,
    },
    sunrise: sys.sunrise,
    sunset: sys.sunset,
    timezone: data.timezone as number,
    dt: data.dt as number,
  };
}

/**
 * Map raw OpenWeatherMap forecast response to our ForecastData interface.
 */
function mapForecastData(data: Record<string, unknown>): ForecastData {
  const city = data.city as Record<string, unknown>;
  const coord = city.coord as Record<string, number>;
  const list = data.list as Record<string, unknown>[];

  // Group forecast items by day
  const dayMap = new Map<string, HourlyForecast[]>();

  for (const item of list) {
    const dt = item.dt as number;
    const date = new Date(dt * 1000).toISOString().split('T')[0];
    const main = item.main as Record<string, number>;
    const weather = (item.weather as Record<string, unknown>[])[0];
    const wind = item.wind as Record<string, number>;

    const hourly: HourlyForecast = {
      dt,
      temperature: main.temp,
      feelsLike: main.feels_like,
      humidity: main.humidity,
      windSpeed: wind.speed,
      condition: {
        id: weather.id as number,
        main: weather.main as string,
        description: weather.description as string,
        icon: weather.icon as string,
      },
      pop: (item.pop as number) || 0,
    };

    if (!dayMap.has(date)) {
      dayMap.set(date, []);
    }
    dayMap.get(date)!.push(hourly);
  }

  // Convert to ForecastDay array
  const days: ForecastDay[] = Array.from(dayMap.entries()).map(([_, hourlyItems]) => {
    const temps = hourlyItems.map((h) => h.temperature);
    const midday = hourlyItems[Math.floor(hourlyItems.length / 2)];

    return {
      dt: hourlyItems[0].dt,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      humidity: midday.humidity,
      windSpeed: midday.windSpeed,
      condition: midday.condition,
      pop: Math.max(...hourlyItems.map((h) => h.pop)),
      hourly: hourlyItems,
    };
  });

  return {
    city: city.name as string,
    coordinates: {
      latitude: coord.lat,
      longitude: coord.lon,
    },
    days: days.slice(0, Config.defaults.forecastDays),
  };
}

export const WeatherService = {
  /**
   * Validate coordinate ranges.
   * Latitude must be between -90 and 90, longitude between -180 and 180.
   */
  validateCoordinates(lat: number, lon: number): void {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
      throw new WeatherApiError('INVALID_COORDINATES', 'Coordinates must be valid numbers.');
    }
    if (lat < -90 || lat > 90) {
      throw new WeatherApiError('INVALID_COORDINATES', 'Latitude must be between -90 and 90.');
    }
    if (lon < -180 || lon > 180) {
      throw new WeatherApiError('INVALID_COORDINATES', 'Longitude must be between -180 and 180.');
    }
  },

  /**
   * Fetch current weather for given coordinates.
   */
  async getCurrentWeather(
    lat: number,
    lon: number,
    unit: TemperatureUnit = Config.defaults.unit
  ): Promise<WeatherData> {
    this.validateCoordinates(lat, lon);

    if (!Config.api.key) {
      throw new WeatherApiError(
        'MISSING_API_KEY',
        'Weather API key is not configured. Set EXPO_PUBLIC_WEATHER_API_KEY in your environment.'
      );
    }

    // Note: API key is passed as a query parameter per OpenWeatherMap's API requirements.
    // For a free-tier mobile app making direct API calls, this is the standard approach.
    // A backend proxy would be recommended for production apps with paid API keys.
    const url = `${Config.api.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${unit}&lang=${Config.defaults.language}&appid=${Config.api.key}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      handleApiError(response.status, body);
    }

    const data = await response.json();
    return mapCurrentWeather(data);
  },

  /**
   * Fetch 5-day forecast for given coordinates.
   */
  async getForecast(
    lat: number,
    lon: number,
    unit: TemperatureUnit = Config.defaults.unit
  ): Promise<ForecastData> {
    this.validateCoordinates(lat, lon);

    if (!Config.api.key) {
      throw new WeatherApiError(
        'MISSING_API_KEY',
        'Weather API key is not configured. Set EXPO_PUBLIC_WEATHER_API_KEY in your environment.'
      );
    }

    const url = `${Config.api.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=${unit}&lang=${Config.defaults.language}&appid=${Config.api.key}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      handleApiError(response.status, body);
    }

    const data = await response.json();
    return mapForecastData(data);
  },

  /**
   * Search for cities by name. Returns coordinates for matched cities.
   */
  async searchCity(
    query: string
  ): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> {
    if (!Config.api.key) {
      throw new WeatherApiError(
        'MISSING_API_KEY',
        'Weather API key is not configured. Set EXPO_PUBLIC_WEATHER_API_KEY in your environment.'
      );
    }

    const sanitized = sanitizeQuery(query);
    if (!sanitized) {
      return [];
    }

    const url = `${Config.api.geoUrl}/direct?q=${encodeURIComponent(sanitized)}&limit=${Config.defaults.maxSearchResults}&appid=${Config.api.key}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      handleApiError(response.status, body);
    }

    const data: Array<{ name: string; country: string; lat: number; lon: number }> =
      await response.json();

    return data.map((item) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  },
};

export { WeatherApiError };
export type { WeatherError };
