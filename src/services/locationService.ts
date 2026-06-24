import * as Location from 'expo-location';
import { Coordinates } from '@/types/weather';
import { Config } from '@/constants/config';

export interface LocationPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

export const LocationService = {
  /**
   * Request location permissions from the user.
   * Returns whether permission was granted and if we can ask again.
   */
  async requestPermissions(): Promise<LocationPermissionResult> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.warn('Failed to request location permissions:', error);
      return { granted: false, canAskAgain: false };
    }
  },

  /**
   * Check if location permissions are already granted.
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Failed to check location permissions:', error);
      return false;
    }
  },

  /**
   * Get the current device location.
   * Falls back to default location if permission is denied or location fails.
   */
  async getCurrentLocation(): Promise<Coordinates> {
    try {
      const hasPermission = await this.checkPermissions();

      if (!hasPermission) {
        const { granted } = await this.requestPermissions();
        if (!granted) {
          return this.getDefaultLocation();
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.warn('Failed to get current location, using default:', error);
      return this.getDefaultLocation();
    }
  },

  /**
   * Returns the default location (New York) when actual location is unavailable.
   */
  getDefaultLocation(): Coordinates {
    return {
      latitude: Config.location.defaultLatitude,
      longitude: Config.location.defaultLongitude,
    };
  },

  /**
   * Search for cities by name using OpenWeatherMap Geocoding API.
   * Returns an array of matching locations.
   */
  async searchCity(query: string): Promise<{ name: string; country: string; coordinates: Coordinates }[]> {
    try {
      const url = `${Config.api.geoUrl}/direct?q=${encodeURIComponent(query)}&limit=${Config.defaults.maxSearchResults}&appid=${Config.api.key}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Config.api.timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Geocoding request failed with status ${response.status}`);
      }

      const data = await response.json();

      return data.map((item: { name: string; country: string; lat: number; lon: number }) => ({
        name: item.name,
        country: item.country,
        coordinates: {
          latitude: item.lat,
          longitude: item.lon,
        },
      }));
    } catch (error) {
      console.warn('City search failed:', error);
      return [];
    }
  },
};
