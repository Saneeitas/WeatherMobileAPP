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
          {forecast.days.map((day, index) => (
            <View key={day.dt}>
              <DailyForecastItem
                day={day}
                unit={temperatureUnit}
                overallMin={overallMin}
                overallMax={overallMax}
              />
              {index === forecast.days.length - 1 && <View style={styles.lastItemPad} />}
            </View>
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
    paddingTop: 52,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    padding: 20,
    paddingBottom: 4,
    letterSpacing: -0.2,
  },
  lastItemPad: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
