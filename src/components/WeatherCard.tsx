import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { Colors } from '@/constants/colors';
import { WeatherData, TemperatureUnit } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export function WeatherCard({ weather, unit }: WeatherCardProps) {
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.tempSection}>
          <Text style={styles.temperature}>{Math.round(weather.temperature)}°</Text>
          <Text style={styles.unitLabel}>{unitSymbol}</Text>
        </View>
        <WeatherIcon
          conditionId={weather.condition.id}
          iconCode={weather.condition.icon}
          size={72}
          color={Colors.textPrimary}
        />
      </View>

      <Text style={styles.condition}>{weather.condition.description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Feels like</Text>
          <Text style={styles.metaValue}>{Math.round(weather.feelsLike)}°</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>High</Text>
          <Text style={styles.metaValue}>{Math.round(weather.tempMax)}°</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Low</Text>
          <Text style={styles.metaValue}>{Math.round(weather.tempMin)}°</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: 28,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 80,
    fontWeight: '200',
    color: Colors.textPrimary,
    lineHeight: 88,
  },
  unitLabel: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 14,
    marginLeft: 2,
  },
  condition: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
