import { useContext } from 'react';
import { WeatherContext } from '@/context/WeatherContext';

/**
 * Custom hook to access weather context.
 * Must be used within a WeatherProvider.
 */
export function useWeather() {
  const context = useContext(WeatherContext);

  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }

  return context;
}
