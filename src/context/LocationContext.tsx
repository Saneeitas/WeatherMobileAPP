import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedLocation, Coordinates } from '@/types/weather';
import { Config } from '@/constants/config';

// State shape
interface LocationState {
  savedLocations: SavedLocation[];
  selectedLocation: SavedLocation | null;
  isLoading: boolean;
}

// Action types
type LocationAction =
  | { type: 'SET_SAVED_LOCATIONS'; payload: SavedLocation[] }
  | { type: 'ADD_LOCATION'; payload: SavedLocation }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'SELECT_LOCATION'; payload: SavedLocation | null }
  | { type: 'SET_LOADING'; payload: boolean };

// Context value shape
interface LocationContextValue {
  state: LocationState;
  addLocation: (name: string, country: string, coordinates: Coordinates) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  selectLocation: (location: SavedLocation | null) => void;
  loadSavedLocations: () => Promise<void>;
}

const initialState: LocationState = {
  savedLocations: [],
  selectedLocation: null,
  isLoading: false,
};

function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_SAVED_LOCATIONS':
      return { ...state, savedLocations: action.payload, isLoading: false };
    case 'ADD_LOCATION':
      return {
        ...state,
        savedLocations: [...state.savedLocations, action.payload],
      };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        savedLocations: state.savedLocations.filter((loc) => loc.id !== action.payload),
        selectedLocation:
          state.selectedLocation?.id === action.payload ? null : state.selectedLocation,
      };
    case 'SELECT_LOCATION':
      return { ...state, selectedLocation: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const LocationContext = createContext<LocationContextValue | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  const loadSavedLocations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const stored = await AsyncStorage.getItem(Config.storage.savedLocationsKey);
      if (stored) {
        const locations: SavedLocation[] = JSON.parse(stored);
        dispatch({ type: 'SET_SAVED_LOCATIONS', payload: locations });
      } else {
        dispatch({ type: 'SET_SAVED_LOCATIONS', payload: [] });
      }
    } catch (error) {
      console.warn('Failed to load saved locations:', error);
      dispatch({ type: 'SET_SAVED_LOCATIONS', payload: [] });
    }
  }, []);

  const persistLocations = useCallback(async (locations: SavedLocation[]) => {
    try {
      await AsyncStorage.setItem(
        Config.storage.savedLocationsKey,
        JSON.stringify(locations)
      );
    } catch (error) {
      console.warn('Failed to persist locations:', error);
    }
  }, []);

  const addLocation = useCallback(
    async (name: string, country: string, coordinates: Coordinates) => {
      if (state.savedLocations.length >= Config.defaults.maxSavedLocations) {
        console.warn('Maximum saved locations reached');
        return;
      }

      // Check for duplicate
      const exists = state.savedLocations.some(
        (loc) =>
          loc.coordinates.latitude === coordinates.latitude &&
          loc.coordinates.longitude === coordinates.longitude
      );

      if (exists) {
        return;
      }

      const newLocation: SavedLocation = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        country,
        coordinates,
        addedAt: Date.now(),
      };

      dispatch({ type: 'ADD_LOCATION', payload: newLocation });
      await persistLocations([...state.savedLocations, newLocation]);
    },
    [state.savedLocations, persistLocations]
  );

  const removeLocation = useCallback(
    async (id: string) => {
      dispatch({ type: 'REMOVE_LOCATION', payload: id });
      const updated = state.savedLocations.filter((loc) => loc.id !== id);
      await persistLocations(updated);
    },
    [state.savedLocations, persistLocations]
  );

  const selectLocation = useCallback((location: SavedLocation | null) => {
    dispatch({ type: 'SELECT_LOCATION', payload: location });
  }, []);

  // Load saved locations on mount
  useEffect(() => {
    loadSavedLocations();
  }, [loadSavedLocations]);

  const value: LocationContextValue = {
    state,
    addLocation,
    removeLocation,
    selectLocation,
    loadSavedLocations,
  };

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}
