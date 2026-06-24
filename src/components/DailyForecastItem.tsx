import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { Colors } from '@/constants/colors';
import { ForecastDay, TemperatureUnit } from '@/types/weather';

interface DailyForecastItemProps {
  day: ForecastDay;
  unit: TemperatureUnit;
  overallMin: number;
  overallMax: number;
}

function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function DailyForecastItem({ day, unit, overallMin, overallMax }: DailyForecastItemProps) {
  const range = overallMax - overallMin;
  const barStart = range > 0 ? ((day.tempMin - overallMin) / range) * 100 : 0;
  const barWidth = range > 0 ? ((day.tempMax - day.tempMin) / range) * 100 : 100;

  return (
    <View style={styles.container}>
      <Text style={styles.dayName}>{getDayName(day.dt)}</Text>

      <WeatherIcon
        conditionId={day.condition.id}
        iconCode={day.condition.icon}
        size={24}
        color={Colors.darkGray}
      />

      <Text style={styles.tempLow}>{Math.round(day.tempMin)}°</Text>

      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                left: `${barStart}%`,
                width: `${Math.max(barWidth, 10)}%`,
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.tempHigh}>{Math.round(day.tempMax)}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightGray,
  },
  dayName: {
    width: 70,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textDark,
  },
  tempLow: {
    width: 36,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'right',
    marginLeft: 8,
  },
  barContainer: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  barBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tempHigh: {
    width: 36,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'left',
  },
});
