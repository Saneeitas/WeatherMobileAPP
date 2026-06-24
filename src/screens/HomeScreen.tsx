import React, { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherCard } from '@/components/WeatherCard';
import { HourlyForecastItem } from '@/components/HourlyForecastItem';
import { WeatherDetails } from '@/components/WeatherDetails';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useWeather } from '@/hooks/useWeather';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { HourlyForecast } from '@/types/weather';

function getTimeOfDayGradient(): readonly [string, string, ...string[]] {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return Colors.gradientClear;
  if (hour >= 12 && hour < 18) return Colors.gradientCool;
  if (hour >= 18 && hour < 21) return Colors.gradientCloudy;
  return Colors.gradientNight;
}

export function HomeScreen() {
  const { state: weatherState, fetchWeather } = useWeather();
  const { state: locationState } = useLocation();
  const { currentWeather, forecast, isLoading, error, lastUpdated } = weatherState;
  const { temperatureUnit } = weatherState;

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

  const renderHourlyItem = ({ item }: { item: HourlyForecast }) => (
    <HourlyForecastItem hourly={item} unit={temperatureUnit} />
  );

  return (
    <LinearGradient colors={gradient} style={styles.container}>
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
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <FlatList
              data={todayHourly}
              renderItem={renderHourlyItem}
              keyExtractor={(item) => item.dt.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyList}
            />
          </View>
        )}

        <View style={styles.detailsSection}>
          <WeatherDetails weather={currentWeather} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  hourlySection: {
    marginTop: 20,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  hourlyList: {
    paddingRight: 16,
  },
  detailsSection: {
    marginTop: 8,
    backgroundColor: Colors.offWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
