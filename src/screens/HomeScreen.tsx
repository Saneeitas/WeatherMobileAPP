import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WeatherCard } from '@/components/WeatherCard';
import { HourlyForecastItem } from '@/components/HourlyForecastItem';
import { WeatherDetails } from '@/components/WeatherDetails';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SearchBar } from '@/components/SearchBar';
import { useWeather } from '@/hooks/useWeather';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { HourlyForecast, Coordinates } from '@/types/weather';
import { WeatherService } from '@/services/weatherApi';

interface CitySearchResult {
  name: string;
  country: string;
  coordinates: Coordinates;
}

function getTimeOfDayGradient(): readonly [string, string, ...string[]] {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return Colors.gradientClear;
  if (hour >= 12 && hour < 18) return Colors.gradientCool;
  if (hour >= 18 && hour < 21) return Colors.gradientCloudy;
  return Colors.gradientNight;
}

export function HomeScreen() {
  const { state: weatherState, fetchWeather } = useWeather();
  const { state: locationState, selectLocation } = useLocation();
  const { currentWeather, forecast, isLoading, error, lastUpdated } = weatherState;
  const { temperatureUnit } = weatherState;

  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const loadWeather = useCallback(() => {
    const location = locationState.selectedLocation;
    if (location) {
      fetchWeather(location.coordinates.latitude, location.coordinates.longitude);
    } else {
      fetchWeather(Config.location.defaultLatitude, Config.location.defaultLongitude);
    }
  }, [locationState.selectedLocation, fetchWeather]);

  useEffect(() => {
    if (!currentWeather || !lastUpdated || Date.now() - lastUpdated > Config.cache.weatherTTL) {
      loadWeather();
    }
  }, [loadWeather, currentWeather, lastUpdated]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await WeatherService.searchCity(query);
      setSearchResults(
        results.map((r) => ({
          name: r.name,
          country: r.country,
          coordinates: { latitude: r.lat, longitude: r.lon },
        }))
      );
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSelectCity = useCallback(
    (result: CitySearchResult) => {
      selectLocation({
        id: `${Date.now()}`,
        name: result.name,
        country: result.country,
        coordinates: result.coordinates,
        addedAt: Date.now(),
      });
      fetchWeather(result.coordinates.latitude, result.coordinates.longitude);
      setSearchResults([]);
      setShowSearch(false);
    },
    [selectLocation, fetchWeather]
  );

  if (isLoading && !currentWeather) {
    return <LoadingSpinner message="Loading weather data..." />;
  }

  if (error && !currentWeather) {
    return <ErrorMessage message={error.message} onRetry={loadWeather} />;
  }

  if (!currentWeather) {
    return <LoadingSpinner message="Loading..." />;
  }

  const gradient = getTimeOfDayGradient();
  const todayHourly: HourlyForecast[] = forecast?.days[0]?.hourly || [];

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      {/* City selector header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cityButton}
          onPress={() => setShowSearch(!showSearch)}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.cityName}>{currentWeather.name}</Text>
          <Ionicons
            name={showSearch ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Search panel */}
      {showSearch && (
        <View style={styles.searchPanel}>
          <SearchBar onSearch={handleSearch} placeholder="Search for a city..." />
          {isSearching && (
            <View style={styles.searchingWrap}>
              <LoadingSpinner size="small" message="Searching..." />
            </View>
          )}
          {searchResults.length > 0 && (
            <View style={styles.resultsCard}>
              <FlatList
                data={searchResults}
                keyExtractor={(item) =>
                  `${item.name}-${item.coordinates.latitude}-${item.coordinates.longitude}`
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelectCity(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.resultIcon}>
                      <Ionicons name="location-outline" size={16} color={Colors.primary} />
                    </View>
                    <View style={styles.resultText}>
                      <Text style={styles.resultName}>{item.name}</Text>
                      <Text style={styles.resultCountry}>{item.country}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={Colors.mediumGray} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      )}

      {/* Main content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadWeather}
            tintColor={Colors.white}
          />
        }
      >
        <WeatherCard weather={currentWeather} unit={temperatureUnit} />

        {todayHourly.length > 0 && (
          <View style={styles.hourlySection}>
            <Text style={styles.sectionTitle}>Hourly</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyList}
            >
              {todayHourly.map((item) => (
                <HourlyForecastItem key={item.dt.toString()} hourly={item} unit={temperatureUnit} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.detailsSection}>
          <WeatherDetails weather={currentWeather} unit={temperatureUnit} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 4,
    alignItems: 'center',
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cityName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginHorizontal: 8,
  },
  searchPanel: {
    zIndex: 10,
  },
  searchingWrap: {
    height: 50,
  },
  resultsCard: {
    backgroundColor: Colors.cardBackgroundSolid,
    marginHorizontal: 16,
    borderRadius: 16,
    maxHeight: 220,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    marginLeft: 12,
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
  },
  resultCountry: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  hourlySection: {
    marginTop: 24,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  hourlyList: {
    paddingRight: 16,
  },
  detailsSection: {
    marginTop: 24,
    backgroundColor: Colors.offWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 16,
  },
});
