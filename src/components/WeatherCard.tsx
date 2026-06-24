import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherIcon } from './WeatherIcon';
import { TemperatureDisplay } from './TemperatureDisplay';
import { Colors } from '@/constants/colors';
import { WeatherData, TemperatureUnit } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

function getGradientForTemp(temp: number): readonly [string, string, ...string[]] {
  if (temp >= 35) return Colors.gradientWarm;
  if (temp >= 20) return Colors.gradientClear;
  if (temp >= 10) return Colors.gradientCool;
  return Colors.gradientNight;
}

export function WeatherCard({ weather, unit }: WeatherCardProps) {
  const gradient = getGradientForTemp(weather.temperature);

  return (
    <LinearGradient colors={gradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.topRow}>
        <View style={styles.locationInfo}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.condition}>{weather.condition.description}</Text>
        </View>
        <WeatherIcon
          conditionId={weather.condition.id}
          iconCode={weather.condition.icon}
          size={64}
          color={Colors.textPrimary}
        />
      </View>

      <View style={styles.temperatureSection}>
        <TemperatureDisplay temperature={weather.temperature} unit={unit} size="large" />
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>
          Feels like {Math.round(weather.feelsLike)}°
        </Text>
        <Text style={styles.detailText}>
          H:{Math.round(weather.tempMax)}° L:{Math.round(weather.tempMin)}°
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  condition: {
    fontSize: 15,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  temperatureSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
