import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { Colors } from '@/constants/colors';
import { HourlyForecast, TemperatureUnit } from '@/types/weather';

interface HourlyForecastItemProps {
  hourly: HourlyForecast;
  unit: TemperatureUnit;
}

function formatHour(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}${period}`;
}

export function HourlyForecastItem({ hourly, unit }: HourlyForecastItemProps) {
  const unitSymbol = unit === 'metric' ? '°' : '°';

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatHour(hourly.dt)}</Text>
      <WeatherIcon
        conditionId={hourly.condition.id}
        iconCode={hourly.condition.icon}
        size={28}
        color={Colors.textPrimary}
      />
      <Text style={styles.temp}>{Math.round(hourly.temperature)}{unitSymbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginRight: 10,
    minWidth: 68,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  temp: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 8,
  },
});
