import { TemperatureUnit } from '@/types/weather';

/**
 * Format temperature with degree symbol and unit indicator.
 * @param temp - Temperature value
 * @param unit - Temperature unit ('metric' for Celsius, 'imperial' for Fahrenheit)
 * @returns Formatted temperature string (e.g., "23°C" or "73°F")
 */
export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  const rounded = Math.round(temp);
  const symbol = unit === 'metric' ? 'C' : 'F';
  return `${rounded}°${symbol}`;
}

/**
 * Format a Unix timestamp into a readable date string.
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string (e.g., "Mon, Jan 15")
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a Unix timestamp into a readable time string.
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted time string (e.g., "3:45 PM")
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleTimeString('en-US', options);
}

/**
 * Get the current time of day category.
 * @returns Time of day: 'morning', 'afternoon', 'evening', or 'night'
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * Capitalize the first letter of a string.
 * @param str - Input string
 * @returns String with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format wind speed with appropriate unit label.
 * @param speed - Wind speed value
 * @param unit - Temperature unit (metric uses m/s, imperial uses mph)
 * @returns Formatted wind speed string
 */
export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  const rounded = Math.round(speed * 10) / 10;
  const label = unit === 'metric' ? 'm/s' : 'mph';
  return `${rounded} ${label}`;
}

/**
 * Format visibility distance.
 * @param meters - Visibility in meters
 * @returns Formatted visibility string (e.g., "10.0 km" or "5.2 km")
 */
export function formatVisibility(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Get a human-readable day name from a Unix timestamp.
 * Returns "Today" for the current day, "Tomorrow" for the next day,
 * or the weekday name for other days.
 * @param timestamp - Unix timestamp in seconds
 * @returns Day name string
 */
export function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
