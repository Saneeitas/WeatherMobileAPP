import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import {
  WeatherData,
  ForecastData,
  TemperatureUnit,
  WeatherError,
} from '@/types/weather';
import { WeatherService } from '@/services/weatherApi';
import { Config } from '@/constants/config';

// State shape
interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  temperatureUnit: TemperatureUnit;
  isLoading: boolean;
  error: WeatherError | null;
  lastUpdated: number | null;
}

// Action types
type WeatherAction =
  | { type: 'FETCH_WEATHER_START' }
  | { type: 'FETCH_WEATHER_SUCCESS'; payload: { weather: WeatherData; forecast: ForecastData } }
  | { type: 'FETCH_WEATHER_ERROR'; payload: WeatherError }
  | { type: 'SET_TEMPERATURE_UNIT'; payload: TemperatureUnit }
  | { type: 'CLEAR_ERROR' };

// Context value shape
interface WeatherContextValue {
  state: WeatherState;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  clearError: () => void;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  temperatureUnit: Config.defaults.unit,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'FETCH_WEATHER_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_WEATHER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        currentWeather: action.payload.weather,
        forecast: action.payload.forecast,
        lastUpdated: Date.now(),
        error: null,
      };
    case 'FETCH_WEATHER_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_TEMPERATURE_UNIT':
      return { ...state, temperatureUnit: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeather = useCallback(
    async (lat: number, lon: number) => {
      dispatch({ type: 'FETCH_WEATHER_START' });

      try {
        const [weather, forecast] = await Promise.all([
          WeatherService.getCurrentWeather(lat, lon, state.temperatureUnit),
          WeatherService.getForecast(lat, lon, state.temperatureUnit),
        ]);

        dispatch({
          type: 'FETCH_WEATHER_SUCCESS',
          payload: { weather, forecast },
        });
      } catch (error) {
        const weatherError: WeatherError = {
          code: (error as { code?: string }).code || 'UNKNOWN',
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        };
        dispatch({ type: 'FETCH_WEATHER_ERROR', payload: weatherError });
      }
    },
    [state.temperatureUnit]
  );

  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    dispatch({ type: 'SET_TEMPERATURE_UNIT', payload: unit });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: WeatherContextValue = {
    state,
    fetchWeather,
    setTemperatureUnit,
    clearError,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}
