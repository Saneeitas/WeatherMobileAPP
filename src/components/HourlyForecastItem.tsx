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

export function HourlyForecastItem({ hourly }: HourlyForecastItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatHour(hourly.dt)}</Text>
      <View style={styles.iconWrap}>
        <WeatherIcon
          conditionId={hourly.condition.id}
          iconCode={hourly.condition.icon}
          size={26}
          color={Colors.textPrimary}
        />
      </View>
      <Text style={styles.temp}>{Math.round(hourly.temperature)}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.glassBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginRight: 10,
    minWidth: 72,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  iconWrap: {
    marginVertical: 4,
  },
  temp: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 10,
  },
});
