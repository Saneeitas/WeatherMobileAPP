export type TemperatureUnit = 'metric' | 'imperial';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  id: number;
  name: string;
  coordinates: Coordinates;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  clouds: number;
  condition: WeatherCondition;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
}

export interface HourlyForecast {
  dt: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  pop: number; // probability of precipitation
}

export interface ForecastDay {
  dt: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  pop: number;
  hourly: HourlyForecast[];
}

export interface ForecastData {
  city: string;
  coordinates: Coordinates;
  days: ForecastDay[];
}

export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
  addedAt: number;
}

export interface WeatherError {
  code: string;
  message: string;
}
