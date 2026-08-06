import { Ionicons } from '@expo/vector-icons';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface WeatherIconMapping {
  icon: IoniconsName;
  color: string;
}

// Maps OpenWeatherMap condition codes to Ionicons names
// See: https://openweathermap.org/weather-conditions
export const weatherIconMap: Record<string, WeatherIconMapping> = {
  // Thunderstorm (2xx)
  '2xx': { icon: 'thunderstorm', color: '#ffd700' },

  // Drizzle (3xx)
  '3xx': { icon: 'rainy-outline', color: '#87ceeb' },

  // Rain (5xx)
  '500': { icon: 'rainy-outline', color: '#4a90d9' },
  '501': { icon: 'rainy', color: '#4a90d9' },
  '502': { icon: 'rainy', color: '#2c6fbb' },
  '503': { icon: 'rainy', color: '#1a4f8b' },
  '504': { icon: 'rainy', color: '#0d3b6e' },
  '511': { icon: 'snow', color: '#b0e0e6' },
  '5xx': { icon: 'rainy', color: '#4a90d9' },

  // Snow (6xx)
  '6xx': { icon: 'snow', color: '#e0e8f0' },

  // Atmosphere (7xx)
  '701': { icon: 'water-outline', color: '#c8d6e5' },
  '711': { icon: 'cloud-outline', color: '#a0a0a0' },
  '721': { icon: 'cloud-outline', color: '#c8d6e5' },
  '741': { icon: 'cloud', color: '#b0b8c0' },
  '7xx': { icon: 'cloud-outline', color: '#c8d6e5' },

  // Clear (800)
  '800d': { icon: 'sunny', color: '#ffa500' },
  '800n': { icon: 'moon', color: '#c4b5fd' },

  // Clouds (80x)
  '801': { icon: 'partly-sunny', color: '#f0c040' },
  '802': { icon: 'cloud-outline', color: '#a0b8d0' },
  '803': { icon: 'cloud', color: '#7a90a8' },
  '804': { icon: 'cloudy', color: '#5a7088' },
} as const;

/**
 * Get the icon mapping for a given weather condition code and icon string.
 * Falls back to a generic cloud icon if the code is not mapped.
 */
export function getWeatherIcon(conditionId: number, iconCode: string): WeatherIconMapping {
  const isNight = iconCode.endsWith('n');

  // Check exact code first
  const exactKey = conditionId.toString();
  if (weatherIconMap[exactKey]) {
    return weatherIconMap[exactKey];
  }

  // Special case for clear sky (day vs night)
  if (conditionId === 800) {
    return isNight ? weatherIconMap['800n'] : weatherIconMap['800d'];
  }

  // Fall back to category (first digit + xx)
  const categoryKey = `${Math.floor(conditionId / 100)}xx`;
  if (weatherIconMap[categoryKey]) {
    return weatherIconMap[categoryKey];
  }

  // Default fallback
  return { icon: 'cloud-outline', color: '#a0b8d0' };
}
