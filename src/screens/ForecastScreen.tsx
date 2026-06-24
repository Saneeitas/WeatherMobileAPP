import React, { useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import { DailyForecastItem } from '@/components/DailyForecastItem';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useWeather } from '@/hooks/useWeather';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';

export function ForecastScreen() {
  const { state: weatherState, fetchWeather } = useWeather();
  const { state: locationState } = useLocation();
  const { forecast, isLoading, error, temperatureUnit, lastUpdated } = weatherState;

  const loadForecast = useCallback(() => {
    const location = locationState.selectedLocation;
    if (location) {
      fetchWeather(location.coordinates.latitude, location.coordinates.longitude);
    } else {
      fetchWeather(Config.location.defaultLatitude, Config.location.defaultLongitude);
    }
  }, [locationState.selectedLocation, fetchWeather]);

  useEffect(() => {
    if (!forecast || !lastUpdated || Date.now() - lastUpdated > Config.cache.forecastTTL) {
      loadForecast();
    }
  }, [loadForecast, forecast, lastUpdated]);

  if (isLoading && !forecast) {
    return (
      <View style={styles.container}>
        <Header title="Forecast" />
        <LoadingSpinner message="Loading forecast..." />
      </View>
    );
  }

  if (error && !forecast) {
    return (
      <View style={styles.container}>
        <Header title="Forecast" />
        <ErrorMessage message={error.message} onRetry={loadForecast} />
      </View>
    );
  }

  if (!forecast || forecast.days.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Forecast" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No forecast data available</Text>
        </View>
      </View>
    );
  }

  const overallMin = Math.min(...forecast.days.map((d) => d.tempMin));
  const overallMax = Math.max(...forecast.days.map((d) => d.tempMax));

  return (
    <View style={styles.container}>
      <Header title="Forecast" subtitle={forecast.city} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadForecast} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>5-Day Forecast</Text>
          {forecast.days.map((day) => (
            <DailyForecastItem
              key={day.dt}
              day={day}
              unit={temperatureUnit}
              overallMin={overallMin}
              overallMax={overallMax}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    paddingTop: 48,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textDark,
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
});
